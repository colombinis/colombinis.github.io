/* Auditoría de paddings contra el design-style-guide (DESIGN.md + primitivos ui/)
 * Corre contra el sitio buildeado en :3000 (npm run preview).
 * Reporta TODO padding computado que no resuelve a la escala token
 * (4/8/16/24/32/80) ni a los valores documentados de los primitivos.
 * Uso: node padding-audit.cjs  (desde la raíz del repo)
 */
const { chromium } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const SEED = 20261004;
const N_PAGES = 8;

// Escala canónica: DESIGN.md "Layout & Spacing" + global.css :root
const SCALE = [4, 8, 16, 24, 32, 80];

// Paddings documentados de primitivos UI (contrato del design-style-guide),
// normalizados a firma completa t|r|b|l:
// - Button.astro: sm 8/14, md 12/22, lg 14/28
// - Badge.astro: sm 3/8, md 4/10
// - Input.astro / Textarea.astro: 10/14
// - Accordion.astro: header 18/24, body 0/24/20
// - SliderControls.astro: wrap 6px
// (Tabs 8/16, Card 8/16/24/32 y Card media-accent 24/16+24/24 usan solo
//  valores token, por lo que pasan el check de escala automáticamente.)
const PRIM_PADS = new Set([
  '8|14|8|14', '12|22|12|22', '14|28|14|28',
  '3|8|3|8', '4|10|4|10',
  '10|14|10|14',
  '18|24|18|24', '0|24|20|24',
  '6|6|6|6',
]);

const inScale = (v) => SCALE.includes(v);
const key = (s) => s.split('|').map(Number).join('|');
const isPrimPad = (s) => PRIM_PADS.has(key(s));

(async () => {
  const routes = process.argv.slice(2);
  let sample;
  if (routes.length) {
    sample = routes;
  } else {
    // Muestra aleatoria reproducible (mismo seed que la selección bash)
    const resp = await fetch(BASE + '/sitemap-index.xml').catch(() => null);
    sample = ['/']; // fallback
    if (resp && resp.ok) {
      const idx = await resp.text();
      const m = idx.match(/https?:\/\/[^<]*sitemap-0\.xml/);
      if (m) {
        const r2 = await fetch(m[0].replace('sacsi.com.ar', 'localhost:3000').replace('https://', 'http://'));
        const xml = await r2.text();
        sample = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map(x => new URL(x[1]).pathname)
          .filter(p => !p.includes('design-style-guide'));
      }
    }
    const rand = mulberry32(SEED);
    // shuffle parcial estilo sample()
    sample = [...sample];
    for (let i = sample.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [sample[i], sample[j]] = [sample[j], sample[i]];
    }
    sample = sample.slice(0, N_PAGES);
  }

  const browser = await chromium.launch();
  const W = parseInt(process.env.AUDIT_W || '1280', 10);
  const H = parseInt(process.env.AUDIT_H || '900', 10);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  console.log(`\n=== VIEWPORT ${W}x${H} ===`);
  const findings = [];

  for (const route of sample) {
    const url = BASE + route;
    let resp;
    try {
      resp = await page.goto(url, { waitUntil: 'networkidle' });
    } catch (e) {
      findings.push({ route, tag: 'ERROR', detail: 'goto failed: ' + e.message.split('\n')[0] });
      continue;
    }
    if (!resp || resp.status() !== 200) {
      findings.push({ route, tag: 'ERROR', detail: 'HTTP ' + (resp ? resp.status() : 'sin respuesta') });
      continue;
    }

    const data = await page.evaluate(() => {
      // 1) escala real que ve el navegador (tokens computados del :root)
      const cs = getComputedStyle(document.documentElement);
      const tok = {};
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach((k) => {
        tok[k] = cs.getPropertyValue('--spacing-' + k).trim();
      });

      const out = { tokens: tok, pads: [], btnHeights: [] };
      // Tags cuyo padding viene del UA stylesheet (ol/ul 40px, etc.): no es CSS autoreado.
      const UA_TAGS = new Set(['ol', 'ul', 'blockquote', 'figure', 'body', 'html']);
      const all = document.querySelectorAll('body *');
      for (const el of all) {
        if (!(el instanceof HTMLElement)) continue;
        if (UA_TAGS.has(el.tagName.toLowerCase())) continue;
        const s = getComputedStyle(el);
        // padding con contenido real (excluye 0/margins reset)
        const pl = parseFloat(s.paddingLeft) || 0;
        const pt = parseFloat(s.paddingTop) || 0;
        const pb = parseFloat(s.paddingBottom) || 0;
        const pr = parseFloat(s.paddingRight) || 0;
        if (pl === 0 && pt === 0 && pb === 0 && pr === 0) continue;

        const sig = [pt, pr, pb, pl].map((v) => v).join('|');
        const isTokenSig =
          [pt, pr, pb, pl].every((v) => v === 0 || inScaleHost(v));
        function inScaleHost(v) {
          return [4, 8, 16, 24, 32, 80].includes(Math.round(v));
        }
        const tagDesc = el.tagName.toLowerCase() +
          (el.id ? '#' + el.id : '') +
          (el.classList.length ? '.' + [...el.classList].slice(0, 3).join('.') : '');
        out.pads.push({
          tag: tagDesc,
          box: sig,
          pt, pr, pb, pl,
        });
      }
      // 2) alturas de botones (contrato 14/32 -> ~46-50px)
      document.querySelectorAll('.ui-btn, .btn, button, a[class*="btn"]').forEach((b) => {
        const s = getComputedStyle(b);
        if ((parseFloat(s.paddingTop) || 0) > 0) {
          out.btnHeights.push({ tag: b.tagName + '.' + [...b.classList].slice(0, 2).join('.'), h: b.getBoundingClientRect().height });
        }
      });
      return out;
    });

    // 3) Verificación: cada padding debe resolver a token o primitivo documentado
    const tokenVals = Object.values(data.tokens).map((v) => parseFloat(v));
    const page_ = [];
    for (const p of data.pads) {
      const vals = [p.pt, p.pr, p.pb, p.pl].filter((v) => v > 0);
      const allToken = vals.every((v) => tokenVals.includes(Math.round(v)));
      const allPrim = isPrimPad(p.box);
      if (!allToken && !allPrim) {
        page_.push(p);
      }
      p.viaToken = allToken;
      p.viaPrim = allPrim;
    }
    if (page_.length) {
      findings.push({ route, tag: 'OFF-SCALE', pads: page_, tokens: data.tokens });
    }
    console.log(`[audit] ${route} — ${data.pads.length} elementos con padding, ${page_.length} fuera de escala`);
  }

  await browser.close();

  // 4) Reporte
  if (!findings.length) {
    console.log('\nOK: todos los paddings computados resuelven a la escala token (4/8/16/24/32/80) o a un valor documentado del primitivo.');
    process.exit(0);
  }
  console.log('\n=== HALLAZGOS ===');
  for (const f of findings) {
    console.log(`\n--- ${f.route} (${f.tag})`);
    if (f.tag === 'ERROR') { console.log('   ' + f.detail); continue; }
    console.log('   tokens computados:', JSON.stringify(f.tokens));
    const groups = {};
    for (const p of f.pads) {
      const k = `${p.pt}|${p.pr}|${p.pb}|${p.pl}`;
      (groups[k] = groups[k] || []).push(p.tag);
    }
    for (const [k, tags] of Object.entries(groups)) {
      console.log(`   padding(${k})px  ←  ${tags.slice(0, 6).join(', ')}${tags.length > 6 ? ` (+${tags.length - 6})` : ''}`);
    }
  }
  process.exit(1);
})();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

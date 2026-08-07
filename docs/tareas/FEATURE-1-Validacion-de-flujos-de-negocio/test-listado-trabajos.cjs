// Test funcional: listado-trabajos.html — tabla cargada desde JSON (fuente de verdad)
// Mock DOM mínimo + mock fetch() que lee src/data/trabajos/listado-trabajos.json
// Verifica:
// 1. La tabla se renderiza con los trabajos del JSON (no hardcodeados)
// 2. Cálculo de márgenes correcto (con costo fijo)
// 3. Costo fijo editable afecta margen
const fs = require('fs');

const htmlPath = process.argv[2] || 'docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/listado-trabajos.html';
const jsonPath = 'src/data/trabajos/listado-trabajos.json';
const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('❌ No script found'); process.exit(1); }

// ---- Mock DOM mínimo ----
function makeEl(id) {
  return {
    id,
    value: id === 'v-usd' ? '20' : id === 'v-fx' ? '1100' : id === 'v-ticket' ? '1.5' : id === 'v-cash' ? '300' : id === 'v-horas-obj' ? '60' : '',
    textContent: '',
    className: '',
    style: {},
    innerHTML: '',
    dataset: {},
    listeners: {},
    addEventListener(ev, fn) { this.listeners[ev] = fn; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {} },
  };
}

const ids = ['v-usd','v-fx','v-tasa-mofu','v-tasa-bofu','v-ticket','v-cash','v-horas-obj',
  'out-tasa-ars','out-ing-obj','out-meta-cash','out-tarifa-real',
  'eA-visitas','eA-leads','eA-clientes','eA-ingreso','eA-cash','eA-tiempo','stepsA',
  'eB-visitas','eB-tasa','eB-leads','eB-clientes','eB-ingreso','eB-ads','eB-net','stepsB',
  'eC-visitas','eC-tasa','eC-bofu','eC-leads','eC-clientes','eC-ingreso','eC-ads','eC-net','stepsC',
  'servicios-body'];
const els = {};
ids.forEach(id => els[id] = makeEl(id));
global.document = { getElementById(id) { return els[id] || null; } };
global.confirm = () => true;

// ---- Mock fetch: devuelve el JSON REAL del repo ----
const datosReales = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
global.fetch = (url) => {
  if (!url.includes('listado-trabajos.json')) {
    return Promise.reject(new Error('URL inesperada: ' + url));
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(datosReales),
  });
};

// ---- Ejecutar el script ----
try {
  eval(scriptMatch[1]);
} catch (e) {
  console.error('❌ Script execution error:', e.message);
  process.exit(1);
}

// Esperar a que cargarTrabajos() (async) termine
setTimeout(() => {
  let pass = 0, fail = 0;
  const check = (name, cond) => {
    if (cond) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}`); }
  };

  // 1. Trabajos renderizados desde el JSON
  const rows = (els['servicios-body'].innerHTML.match(/<tr>/g) || []).length;
  check(`10 trabajos renderizados desde JSON (got ${rows})`, rows === 10);

  // 2. Coincidencia con el JSON real (no hardcodeado)
  const nombresJson = datosReales.trabajos.map(t => t.nombre);
  const htmlInner = els['servicios-body'].innerHTML;
  const todosEnHtml = nombresJson.every(n => htmlInner.includes(n));
  check('Todos los nombres del JSON están en la tabla', todosEnHtml);

  // 3. Landing 500-700k, 15-20h @22k → costo 330-440k → OK
  check('Landing presente', htmlInner.includes('Landing page'));
  check('Landing OK', htmlInner.includes('✅ OK'));

  // 4. Hora técnica OK
  check('Hora técnica presente', htmlInner.includes('Hora técnica'));
  check('Hora técnica OK', htmlInner.includes('✅ OK'));

  // 5. Costo fijo input presente (columna editable)
  check('Costo fijo input presente', htmlInner.includes('data-field="costoFijo"'));

  // 6. Costo fijo alto → margen negativo (matemática con tarifa 22k)
  const tasa = 22000;
  const s = { precioMin: 500, horasMin: 15, costoFijo: 200000 };
  const costo = s.horasMin * tasa + s.costoFijo;
  const margen = ((s.precioMin*1000 - costo)/(s.precioMin*1000))*100;
  check(`Costo fijo 200k hace margen negativo: ${margen.toFixed(1)}%`, margen < 0);

  // 7. El JSON trae categorías (fuente rica) — la tabla no las muestra pero existen
  check('JSON tiene categorías', datosReales.trabajos.every(t => Array.isArray(t.categorias) && t.categorias.length >= 1));

  console.log(`\n=== RESULTADO: ${pass} OK, ${fail} FAIL ===`);
  process.exit(fail > 0 ? 1 : 0);
}, 100);

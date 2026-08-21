// Test funcional: flujo-operativo-trabajo.html
// Mock DOM + mock fetch que lee los JSON REALES del repo:
//   - listado-trabajos.json (selector de trabajos)
//   - trabajo_<id>.json (pasos del flujo por trabajo)
// Verifica:
// 1. El selector se llena con los trabajos del listado
// 2. Al cargar, se renderizan los pasos del primer trabajo (landing)
// 3. Cambiar de trabajo (ecommerce) recarga los pasos desde su JSON
// 4. Los cálculos de rentabilidad usan los pasos cargados
// 5. Restaurar flujo vuelve a los pasos originales del trabajo
// 6. Add/delete/reset de la tabla de trabajos sigue funcionando
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '../../../docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio');
const htmlPath = `${BASE}/flujo-operativo-trabajo.html`;
const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('❌ No script found'); process.exit(1); }

// ---- Mock DOM mínimo ----
function makeEl(id) {
  const el = {
    id,
    value: id === 'srv-usd' ? '20' : id === 'srv-fx' ? '1100' : id === 'srv-precio' ? '500' : '',
    textContent: '',
    className: '',
    style: { display: '' },
    innerHTML: '',
    dataset: {},
    listeners: {},
    addEventListener(ev, fn) { this.listeners[ev] = fn; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {} },
  };
  return el;
}

const ids = ['trabajo-select','srv-nombre','srv-precio','srv-usd','srv-fx','srv-tasa-ars','srv-costo-hora',
  'steps-body','total-horas','rent-box','rent-horas','rent-costo','rent-precio','rent-margen',
  'rent-pct','rent-estado','btn-add-step','btn-reset','btn-clear',
  'trabajos-body','btn-add-trabajo','btn-reset-trabajos','btn-clear-trabajos'];
const els = {};
ids.forEach(id => els[id] = makeEl(id));

global.document = { getElementById(id) { return els[id] || null; } };
global.confirm = () => true;

// ---- Mock fetch: lee los JSON REALES del repo ----
const listado = JSON.parse(fs.readFileSync('src/data/trabajos/listado-trabajos.json', 'utf8'));
function readTrabajo(id) {
  const p = `src/data/trabajos/detalle/trabajo_${id}.json`;
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}
global.fetch = (url) => {
  if (url.includes('listado-trabajos.json')) {
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(listado) });
  }
  const m = url.match(/trabajo_([\w-]+)\.json/);
  if (m) {
    const data = readTrabajo(m[1]);
    if (!data) return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
  }
  return Promise.reject(new Error('URL inesperada: ' + url));
};

// ---- Ejecutar el script ----
try {
  eval(scriptMatch[1]);
} catch (e) {
  console.error('❌ Script execution error:', e.message);
  process.exit(1);
}

// Esperar a que cargarListado + cargarTrabajo (async) terminen
setTimeout(() => {
  let pass = 0, fail = 0;
  const check = (name, cond) => {
    if (cond) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}`); }
  };

  // 1. Selector llenado con los trabajos del listado
  const opts = els['trabajo-select'].innerHTML;
  const count = (opts.match(/<option value=/g) || []).length;
  check(`Selector con 11 opciones (placeholder + 10) (got ${count})`, count === 11);
  check('Selector incluye Landing', opts.includes('>Landing page</option>'));
  check('Selector incluye E-commerce', opts.includes('>E-commerce</option>'));

  // 2. Pasos del primer trabajo (landing) renderizados — 12 pasos
  const rows = (els['steps-body'].innerHTML.match(/<tr data-id=/g) || []).length;
  check(`12 pasos de Landing renderizados (got ${rows})`, rows === 12);
  check('Paso 1: Briefing', els['steps-body'].innerHTML.includes('Briefing y relevamiento'));
  check('Paso 12: Entrega', els['steps-body'].innerHTML.includes('Entrega y capacitación'));
  check('srvNombre = Landing page', els['srv-nombre'].value === 'Landing page');
  check('srvPrecio = 500', String(els['srv-precio'].value) === '500');

  // 3. Total horas de landing = 29.5h
  check('Total horas 29.5', els['total-horas'].textContent === '29,5');

  // 4. Cambiar de trabajo → cargarTrabajo('ecommerce') → 11 pasos
  (async () => {
    await cargarTrabajo('ecommerce');
    const rowsE = (els['steps-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`11 pasos de E-commerce renderizados (got ${rowsE})`, rowsE === 11);
    check('E-commerce paso: Setup de plataforma', els['steps-body'].innerHTML.includes('Setup de plataforma'));
    check('srvNombre = E-commerce', els['srv-nombre'].value === 'E-commerce');
    check('srvPrecio = 1200', String(els['srv-precio'].value) === '1200');
    const totalE = els['total-horas'].textContent;
    check(`Total horas ecommerce 53 (got ${totalE})`, totalE === '53' || totalE === '53,0');

    // 5. Tabla de trabajos (rentabilidad) sigue funcionando
    const rowsT = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`Tabla trabajos 10 filas (got ${rowsT})`, rowsT === 10);

    // 6. Restaurar flujo → vuelve a pasos del trabajo actual (ecommerce)
    els['btn-reset'].listeners['click']();
    const rowsAfterReset = (els['steps-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`Restaurar → 11 pasos ecommerce (got ${rowsAfterReset})`, rowsAfterReset === 11);

    // 7. Add trabajo en tabla rentabilidad
    els['btn-add-trabajo'].listeners['click']();
    const afterAdd = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`Agregar trabajo → 11 filas (got ${afterAdd})`, afterAdd === 11);

    // 8. Restaurar listado → 10
    els['btn-reset-trabajos'].listeners['click']();
    const afterResetT = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`Restaurar listado → 10 filas (got ${afterResetT})`, afterResetT === 10);

    // 9. Volver a landing y verificar que no quedó contaminado
    await cargarTrabajo('landing');
    const rowsL = (els['steps-body'].innerHTML.match(/<tr data-id=/g) || []).length;
    check(`Volver a Landing → 12 pasos (got ${rowsL})`, rowsL === 12);

    console.log(`\n=== RESULTADO: ${pass} OK, ${fail} FAIL ===`);
    process.exit(fail > 0 ? 1 : 0);
  })();
}, 100);

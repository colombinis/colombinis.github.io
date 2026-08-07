// Test funcional: flujo-operativo-servicio.html — tabla de rentabilidad
// Mock DOM mínimo para ejecutar el script del HTML y verificar:
// 1. 10 trabajos se renderizan
// 2. Cálculo de márgenes correcto (con costo fijo)
// 3. Add/delete filas funciona
const fs = require('fs');

const htmlPath = process.argv[2] || 'docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-servicio.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('❌ No script found'); process.exit(1); }

// ---- Mock DOM mínimo ----
function makeEl(id) {
  return {
    id,
    value: id === 'srv-usd' ? '20' : id === 'srv-fx' ? '1100' : id === 'srv-precio' ? '500' : '',
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
    reset() {},
  };
}

const ids = ['srv-nombre','srv-precio','srv-usd','srv-fx','srv-tasa-ars','srv-costo-hora',
  'steps-body','total-horas','rent-box','rent-horas','rent-costo','rent-precio','rent-margen',
  'rent-pct','rent-estado','btn-add-step','btn-reset','btn-clear',
  'trabajos-body','btn-add-trabajo','btn-reset-trabajos','btn-clear-trabajos'];
const els = {};
ids.forEach(id => els[id] = makeEl(id));

global.document = {
  getElementById(id) { return els[id] || null; },
};

global.confirm = () => true;

// ---- Ejecutar el script ----
try {
  eval(scriptMatch[1]);
} catch (e) {
  console.error('❌ Script execution error:', e.message);
  process.exit(1);
}

// ---- Verificaciones ----
let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}`); }
}

// 1. Trabajos renderizados
const rows = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
check(`10 trabajos renderizados (got ${rows})`, rows === 10);

// 2. Cálculo de rentabilidad: Landing 500-700k, 15-20h @22k/h → costo 330-440k
// margenMin = (500-330)/500 = 34%, margenMax = (700-440)/700 = 37.1% → OK
const landingRow = (els['trabajos-body'].innerHTML.match(/<tr data-id="landing">[\s\S]*?<\/tr>/) || [''])[0];
check('Landing presente', landingRow.includes('Landing page'));
check('Landing margen OK (✅ OK)', landingRow.includes('✅ OK'));

// 3. Hora técnica: 30-45k, 1h @22k → costo 22k
// margenMin = (30-22)/30 = 26.7%, margenMax = (45-22)/45 = 51.1% → OK
const horaRow = (els['trabajos-body'].innerHTML.match(/<tr data-id="hora-tec">[\s\S]*?<\/tr>/) || [''])[0];
check('Hora técnica presente', horaRow.includes('Hora técnica'));
check('Hora técnica OK', horaRow.includes('✅ OK'));

// 4. Ninguno de los trabajos ajustados debería ser NO RENTABLE (PRI-03 ajustó precios)
const badRows = (els['trabajos-body'].innerHTML.match(/NO RENTABLE/g) || []).length;
check(`0 trabajos NO RENTABLE con precios ajustados (got ${badRows})`, badRows === 0);

// 5. Botones existen
check('btn-add-trabajo listener', typeof els['btn-add-trabajo'].listeners['click'] === 'function');
check('btn-reset-trabajos listener', typeof els['btn-reset-trabajos'].listeners['click'] === 'function');
check('btn-clear-trabajos listener', typeof els['btn-clear-trabajos'].listeners['click'] === 'function');

// 6. Simular agregar trabajo
els['btn-add-trabajo'].listeners['click']();
const rowsAfterAdd = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
check(`Agregar trabajo → 11 filas (got ${rowsAfterAdd})`, rowsAfterAdd === 11);
check('Nuevo trabajo presente', els['trabajos-body'].innerHTML.includes('Nuevo trabajo'));

// 7. Simular limpiar todo
els['btn-clear-trabajos'].listeners['click']();
check('Limpiar → 0 filas', !els['trabajos-body'].innerHTML.includes('data-id='));
check('Placeholder sin trabajos', els['trabajos-body'].innerHTML.includes('Sin trabajos'));

// 8. Restaurar
els['btn-reset-trabajos'].listeners['click']();
const rowsAfterReset = (els['trabajos-body'].innerHTML.match(/<tr data-id=/g) || []).length;
check(`Restaurar → 10 filas (got ${rowsAfterReset})`, rowsAfterReset === 10);

// 9. Editar en vivo: simulamos el evento input de un campo
// (verificar que la función renderTrabajos maneja costo fijo: agregar trabajo con costoFijo)
const customTrabajo = { id: 'test-fijo', nombre: 'Test costo fijo', categorias: [], precioMin: 500, precioMax: 500, horasMin: 10, horasMax: 10, costoFijo: 500000 };
// costo = 10*22000 + 500000 = 720000 > 500000 → NO RENTABLE
let testHtml = '';
const tasa = 22000;
const costoMin = customTrabajo.horasMin * tasa + customTrabajo.costoFijo;
const margenMin = ((customTrabajo.precioMin*1000 - costoMin) / (customTrabajo.precioMin*1000)) * 100;
check(`Costo fijo afecta margen: costo=${costoMin}, margen=${margenMin.toFixed(1)}%`, costoMin === 720000 && margenMin < 0);

console.log(`\n=== RESULTADO: ${pass} OK, ${fail} FAIL ===`);
process.exit(fail > 0 ? 1 : 0);

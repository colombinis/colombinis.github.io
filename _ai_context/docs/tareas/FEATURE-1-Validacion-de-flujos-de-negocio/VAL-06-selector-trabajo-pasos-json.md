# VAL-06 — Selector de trabajo + pasos del flujo desde trabajo_<id>.json

## Contexto
`flujo-operativo-trabajo.html` (antes `flujo-operativo-servicio.html`)
simulaba el flujo operativo de **un solo servicio hardcodeado** (Landing,
12 pasos). Se pide que el usuario pueda **seleccionar cualquier trabajo**
del listado y que los pasos del flujo se carguen de un JSON específico por
trabajo: `src/data/trabajos/trabajo_<id>.json`.

## Spec
- Selector `<select>` poblado con los trabajos de `listado-trabajos.json`.
- Al elegir un trabajo → `fetch('trabajo_<id>.json')` → se reemplazan los
  pasos de la tabla "Pasos del flujo" (paso, entradas, salidas, descripción, horas).
- El botón **Restaurar flujo del trabajo** vuelve a los pasos originales
  del JSON (copia `pasosOriginales`).
- Los campos de configuración (nombre, precio cotizado) se autocompletan
  con los datos del trabajo seleccionado.
- La tabla de rentabilidad (VAL-02) sigue funcionando con el listado completo.

## Gherkin
```gherkin
Scenario: Seleccionar un trabajo carga sus pasos
  Given el simulador abierto (HTTP)
  When selecciono "E-commerce" en el selector
  Then la tabla "Pasos del flujo" muestra los pasos de trabajo_ecommerce.json
  And el total de horas se recalcula
  And el nombre y precio se autocompletan

Scenario: Restaurar flujo del trabajo
  Given cargué un trabajo y edité pasos
  When clickeo "Restaurar flujo del trabajo"
  Then los pasos vuelven a los valores originales del JSON

Scenario: Cambio rápido de selector no corrompe la carga
  Given elijo "Software grande" y enseguida "Landing"
  When la carga del segundo termina
  Then se muestran los pasos de Landing (no los de Software grande)
```

## Implementación
1. `trabajoUrl(id)` → `../../../src/data/trabajos/trabajo_${id}.json`
2. `cargarListado()`: fetch listado → llena selector (placeholder + 10 trabajos)
3. `cargarTrabajo(id)`: fetch flujo → `pasos = data.flujo.map(p => ({...p}))`,
   `pasosOriginales` = deep copy; autocompleta nombre/precio; render + recalc.
4. Guard anti-carrera: `cargandoTrabajo` + comparación de id en el await.
5. `btn-reset` restaura `pasosOriginales` (ya no un array fijo).
6. JSONs: `src/data/trabajos/trabajo_<id>.json` (10 archivos, flujos con
   pasos realistas y horas acordes al rango del listado).

## Verify (bash)
```bash
F="_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-trabajo.html"
echo "🧪 VAL-06 — Selector de trabajo + pasos desde JSON"
grep -q 'id="trabajo-select"' "$F" && echo "  ✅ selector presente"
grep -q "cargarTrabajo(" "$F" && echo "  ✅ cargarTrabajo presente"
grep -q "cargarListado()" "$F" && echo "  ✅ cargarListado presente"
ls src/data/trabajos/detalle/trabajo_*.json | wc -l
```

## Estado
DONE — implementado y verificado:
- `test-flujo-operativo-trabajo.cjs`: 19/19 ✅
- E2E Chromium real (HTTP): 14/14 ✅ (selector, cambio a E-commerce, vuelta a Landing, restaurar, 0 errores JS)
- Build Astro: 25 páginas OK (los JSONs no rompen el build)

## Lecciones
- El mock DOM de Node no replica el DOM real: `textContent` no incluye
  `value` de inputs → en E2E real hay que leer `inputValue()`, no `textContent()`.
- `fetch()` exige servir por HTTP; con `file://` da error CORS → mensaje claro.
- Deep copy en `pasos`/`pasosOriginales` evita que editar la tabla contamine
  la "fuente" para Restaurar (misma lección que VAL-02 con trabajos).

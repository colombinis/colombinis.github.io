# VAL-02 — Tabla dinámica de rentabilidad en flujo-operativo-trabajo.html

## Contexto
El dueño quiere validar la rentabilidad de TODOS los trabajos en una tabla
dinámica (agregar/quitar filas), no solo de un servicio aislado. El
`flujo-operativo-trabajo.html` actual solo calcula rentabilidad de UN
servicio (configuración arriba + pasos del flujo).

## Spec (SDD — WHAT)
- En `flujo-operativo-trabajo.html`, agregar la tabla **"Precios y horas
  por servicio"** (estilo de la que ya existe en `listado-trabajos.html`)
- Columnas por fila:
  | Solución/Trabajo | Precio min (ARS k) | Precio max (ARS k) | Horas min | Horas max | Costo fijo (ARS) | Costo min @ARS/h | Costo max @ARS/h | Margen min % | Margen max % | Estado |
- El **costo fijo** es un campo editable (default 0)
- El sistema calcula:
  - `costoMin = horasMin × tarifaARS + costoFijo`
  - `costoMax = horasMax × tarifaARS + costoFijo`
  - `margenMin% = (precioMin×1000 − costoMin) / (precioMin×1000) × 100`
  - `margenMax% = (precioMax×1000 − costoMax) / (precioMax×1000) × 100`
- Estado: `✅ OK` si margenMin ≥ 0 y margenMax ≥ 0, `❌ NO RENTABLE` si no
- La tarifa ARS/h se toma de la configuración del servicio existente
  (`srv-usd` × `srv-fx`)

## Scenarios (BDD)
```gherkin
Scenario: Tabla se renderiza con trabajos precargados
  Given el HTML cargado
  When se inicializa la página
  Then la tabla "Precios y horas por servicio" muestra los trabajos del listado
  And cada fila tiene inputs editables (precio min/max, horas min/max, costo fijo)

Scenario: Agregar fila
  Given la tabla de trabajos visible
  When el dueño clickea "+ Agregar trabajo"
  Then se agrega una fila nueva con valores por defecto (costo fijo 0)
  And el resto de filas se mantiene

Scenario: Quitar fila
  Given una fila en la tabla
  When el dueño clickea el botón 🗑 de esa fila
  Then la fila se elimina y los cálculos se recalculan

Scenario: Cálculo con costo fijo
  Given un trabajo con precio 500k, horas 20, tarifa 22k/h, costo fijo 50.000
  When se recalculan márgenes
  Then costoMin = 20×22.000 + 50.000 = 490.000
  And margenMin = (500.000 − 490.000)/500.000 = 2%
```

## Plan (SDD — HOW)
1. Agregar sección `<section class="card">` con tabla de trabajos
2. Botones: `+ Agregar trabajo`, `Restaurar listado`, `Limpiar todo`
3. JS: función `renderTrabajos()` que recorre `trabajos` (cargado desde
   `listado-trabajos.json` vía fetch, ver VAL-03)
4. Event listeners para editar inputs en vivo (re-render)
5. Botón delete por fila + botón add (nueva fila con defaults)
6. Estado de rentabilidad por fila (tag OK / NO RENTABLE)

## Verification script
```bash
#!/bin/bash
# VAL-02 — tabla dinámica de rentabilidad
F="docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-trabajo.html"
echo "🧪 VAL-02 — Tabla dinámica rentabilidad"
grep -q "Precios y horas por servicio" "$F" && echo "  ✅ tabla precios/horas presente"
grep -q "btn-add-trabajo" "$F" && echo "  ✅ botón agregar trabajo"
grep -q "data-delete-trabajo" "$F" && echo "  ✅ botón eliminar trabajo por fila"
grep -q "costoFijo\|costo-fijo" "$F" && echo "  ✅ campo costo fijo"
grep -q "NO RENTABLE\|OK" "$F" && echo "  ✅ estados OK/NO RENTABLE"
echo "✅ VAL-02 — COMPLETA"
```

## Estado
DONE — tabla implementada y testeada (test-flujo-operativo-trabajo.cjs 19/19 + E2E Chromium 14/14)

## Notas
- Bug detectado en E2E: la copia shallow (`[...trabajos]`) mutaba el array
  base al editar una fila → "Restaurar listado" no volvía al valor original.
  Fix: `trabajosOriginales` con deep copy por objeto (`map(t => ({...t, categorias:[...t.categorias]}))`)
  en init y en reset.
- Reutiliza el estilo visual existente (CSS del HTML)
- La tarifa ARS/h viene de la configuración superior (srv-usd × srv-fx)

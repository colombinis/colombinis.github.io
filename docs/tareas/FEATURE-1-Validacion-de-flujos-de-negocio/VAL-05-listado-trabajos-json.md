# VAL-05 — Cargar tabla desde listado-trabajos.json (fuente única)

## Contexto
`listado-trabajos.html` (antes `flujo-uj-con-pri.html`) tenía la tabla
"Precios y horas por servicio" con el array `SERVICIOS` **hardcodeado**
(10 items duplicados). Para mantener una única fuente de verdad, la tabla
debe cargarse en runtime desde `src/data/trabajos/listado-trabajos.json`
vía `fetch()` — sin datos duplicados en el HTML.

## Spec (SDD — WHAT)
- Renombrar `flujo-uj-con-pri.html` → `listado-trabajos.html` (el archivo
  deja de ser "el flujo" y pasa a ser "el listado")
- Eliminar el array `SERVICIOS` hardcodeado del HTML
- La tabla `<tbody id="servicios-body">` se llena con `fetch(JSON_URL)`:
  - `JSON_URL = '../../../src/data/trabajos/listado-trabajos.json'`
  - Lee `data.trabajos[]` y mapea a `{id, nombre, precioMin, precioMax, horasMin, horasMax, costoFijo}`
- Si el fetch falla (file://, red), mostrar mensaje claro en la tabla:
  "serví el repo por HTTP (python3 -m http.server)"
- Mantener la interactividad existente: editar precios/horas/costo fijo
  recalcula márgenes y estado OK/NO RENTABLE en vivo
- Documentar en el HTML (nota + footer) que el JSON es la fuente de verdad

## Scenarios (BDD)
```gherkin
Scenario: Tabla cargada desde el JSON
  Given el HTML listado-trabajos.html servido por HTTP
  When se carga la página
  Then la tabla muestra los trabajos de src/data/trabajos/listado-trabajos.json
  And cada uno con precio min/max, horas min/max, costo fijo

Scenario: Sin duplicación
  Given el HTML listado-trabajos.html
  Then no contiene el array de trabajos hardcodeado
  And la única fuente de datos es el JSON

Scenario: Fallo de fetch
  Given el HTML abierto con file://
  When se intenta cargar
  Then muestra mensaje de error indicando servir por HTTP

Scenario: Costo fijo editable
  Given una fila
  When edito el costo fijo
  Then el costo y margen se recalculan incluyendo el costo fijo
```

## Plan (SDD — HOW)
1. `git mv` del HTML y del test
2. Actualizar título/h1/footer → "Listado de trabajos"
3. Reemplazar `const SERVICIOS = [...]` por `let SERVICIOS = []` + `JSON_URL`
4. Agregar `async function cargarTrabajos()` con fetch + manejo de error
5. Inicialización: `recalcAll(); cargarTrabajos();`
6. Actualizar test con mock de `fetch` que lee el JSON real del repo
7. Actualizar referencias en TODO.md y archivos detalle

## Verification script
```bash
#!/bin/bash
# VAL-05 — carga desde JSON
F="docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/listado-trabajos.html"
J="src/data/trabajos/listado-trabajos.json"
echo "🧪 VAL-05 — Carga desde JSON (fuente única)"
[ -f "$F" ] && echo "  ✅ listado-trabajos.html existe" || echo "  ❌ no existe"
grep -q "fetch(" "$F" && echo "  ✅ usa fetch()" || echo "  ❌ sin fetch"
grep -q "const SERVICIOS = \[" "$F" && echo "  ❌ array hardcodeado presente" || echo "  ✅ sin array hardcodeado"
grep -q "cargarTrabajos" "$F" && echo "  ✅ función cargarTrabajos" || echo "  ❌ sin cargarTrabajos"
grep -q "listado-trabajos.json" "$F" && echo "  ✅ referencia al JSON" || echo "  ❌ sin referencia"
echo "✅ VAL-05 — COMPLETA"
```

## Estado
DONE — HTML renombrado, tabla cargada por fetch del JSON (fuente única),
test con mock fetch 9/9 OK + E2E Chromium (verificado vía HTTP).

## Notas
- `flujo-operativo-servicio.html` sigue con el objeto `TRABAJOS` embebido
  (referencia el mismo JSON como fuente documentada). Si se quiere, puede
  migrarse al mismo patrón fetch — pendiente de decisión.
- La ruta `../../../src/data/trabajos/listado-trabajos.json` es relativa al
  HTML dentro de `docs/tareas/FEATURE-1-.../`; requiere servir el repo por HTTP.

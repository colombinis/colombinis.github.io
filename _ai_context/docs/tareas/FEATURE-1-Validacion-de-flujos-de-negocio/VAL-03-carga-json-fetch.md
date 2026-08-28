# VAL-03 — Cargar tabla + selector desde JSON por fetch (fuente única)

## Contexto
La feature arrancó embebiendo los datos como **objeto JS dentro del HTML**
(`const TRABAJOS = [...]`), replicando el JSON a mano. Eso generaba dos
fuentes de verdad y riesgo de desincronización.

**Decisión (2026-08-07):** eliminar los objetos embebidos y cargar todo
desde JSON en runtime con `fetch()`. Los HTML son standalone (no pasan por
build Astro) y se sirven por HTTP, así que fetch es viable.

## Spec
- `flujo-operativo-trabajo.html` y `listado-trabajos.html` cargan:
  - `src/data/trabajos/listado-trabajos.json` → selector de trabajos + tabla de rentabilidad
  - `src/data/trabajos/trabajo_<id>.json` → pasos del flujo (solo en el simulador)
- NO debe quedar ningún array de datos hardcodeado en el HTML.
- Si `file://` (CORS), mostrar mensaje claro: "serví el repo por HTTP".

## Gherkin
```gherkin
Scenario: Datos se cargan desde JSON por fetch
  Given el repo servido por HTTP (python3 -m http.server)
  When se abre flujo-operativo-trabajo.html
  Then el selector se llena con los trabajos de listado-trabajos.json
  And los pasos del flujo se cargan de trabajo_<id>.json
  And NO hay objetos TRABAJOS/FLUJO_INICIAL hardcodeados en el HTML

Scenario: file:// no soporta fetch
  Given se abre el HTML con file://
  Then se muestra un mensaje claro indicando servir por HTTP
```

## Implementación
1. `const LISTADO_URL = '../../../src/data/trabajos/listado-trabajos.json'`
2. `const trabajoUrl = (id) => '../../../src/data/trabajos/trabajo_' + id + '.json'`
3. `cargarListado()`: fetch del listado → llena `trabajos`, `trabajosOriginales` y el `<select>`
4. `cargarTrabajo(id)`: fetch del flujo → `pasos`, `pasosOriginales`, configura inputs (nombre, precio), render + recalc
5. Guard anti-carrera: `cargandoTrabajo` evita pisar la carga si el usuario cambia de trabajo rápido

## Verify (bash)
```bash
F="_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-trabajo.html"
echo "🧪 VAL-03 — Carga desde JSON"
grep -q "fetch(LISTADO_URL)" "$F" && echo "  ✅ fetch(LISTADO_URL) presente"
grep -q "fetch(trabajoUrl" "$F" && echo "  ✅ fetch(trabajoUrl) presente"
grep -q "const TRABAJOS" "$F" && echo "  ❌ objeto TRABAJOS hardcodeado" || echo "  ✅ sin objeto TRABAJOS"
grep -q "FLUJO_INICIAL" "$F" && echo "  ❌ FLUJO_INICIAL hardcodeado" || echo "  ✅ sin FLUJO_INICIAL"
```

## Estado
DONE — implementado y testeado (test-flujo-operativo-trabajo.cjs 19/19 + E2E Chromium 14/14).

## Lecciones
- Antes: datos duplicados (JSON + objeto JS) → riesgo de drift.
- Ahora: un solo `fetch()` + JSON = fuente de verdad única.
- `file://` no funciona (CORS) → mensaje de error claro con instrucción.
- Carga concurrente del selector: guard `cargandoTrabajo` con comparación de id.

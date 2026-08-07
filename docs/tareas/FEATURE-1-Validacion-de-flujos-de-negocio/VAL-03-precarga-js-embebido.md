# VAL-03 — Precarga de tabla "Precios y horas" desde objeto JS embebido

## Contexto
Los HTML de la feature son documentos standalone (no pasan por build
Astro), por lo que no pueden `fetch` del JSON en tiempo de ejecución
(solo funcionarían con servidor). La solución es **embeder el listado de
trabajos como objeto JavaScript** dentro del `<script>` de cada HTML.

## Spec (SDD — WHAT)
- En `flujo-operativo-servicio.html`, el array de trabajos se define como
  `const TRABAJOS = [...]` embebido en el script
- Los valores DEBEN reflejar `src/data/trabajos/listado-trabajos.json`
- El objeto embebido tiene la misma estructura que el JSON (`id`,
  `nombre`, `categorias`, `precioMin`, `precioMax`, `horasMin`, `horasMax`,
  `costoFijo`)
- Si se cambia el JSON, el objeto embebido debe actualizarse (regla
  doc/code consistente)

## Scenarios (BDD)
```gherkin
Scenario: Objeto JS embebido presente
  Given el HTML
  When se busca "const TRABAJOS"
  Then existe un array con 10+ trabajos
  And cada trabajo tiene los mismos campos que el JSON

Scenario: Coherencia con JSON
  Given el HTML y el JSON
  When se comparan los ids
  Then todos los ids del HTML existen en el JSON
```

## Plan (SDD — HOW)
1. En el `<script>` del HTML, agregar `const TRABAJOS = [...]` con los
   10 trabajos del JSON (mismos valores)
2. `renderTrabajos()` usa `TRABAJOS` como estado inicial
3. Documentar en comentario que la fuente de verdad es el JSON

## Verification script
```bash
#!/bin/bash
# VAL-03 — objeto JS embebido
F="docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-servicio.html"
echo "🧪 VAL-03 — Objeto JS embebido"
grep -q "const TRABAJOS" "$F" && echo "  ✅ const TRABAJOS presente"
grep -c "'landing'" "$F" | grep -q "^[1-9]" && echo "  ✅ trabajo landing presente"
grep -c "'ret-pro'" "$F" | grep -q "^[1-9]" && echo "  ✅ trabajo ret-pro presente"
echo "✅ VAL-03 — COMPLETA"
```

## Estado
DONE — objeto TRABAJOS embebido, coherente con JSON

## Notas
- Fuente de verdad: `src/data/trabajos/listado-trabajos.json`
- Regla: si cambia el JSON, actualizar el objeto embebido en los HTML

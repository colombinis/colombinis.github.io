# AUD-03 — Actualizar Diseno.md

## Contexto

Originalmente, `_ai_context/docs/wiki/Diseno.md` sección "Tokens y drift pendiente"
(líneas 9-20) listaba 4 tokens con drift entre `global.css` y `DESIGN.md`,
y decía:
> Acción: elegir una única verdad y dejar ambos sincronizados.

Pero H8 en `Progreso.md` marcaba el drift como DONE (T6 DONE —
"tokens reconciliados con DESIGN.md").

**Migración (AUD-04):** la wiki fue eliminada y el documento vive ahora en
`_ai_context/docs/tareas/DISENO.md`. En esa migración la sección ya fue reconciliada:
pasó a llamarse "Tokens y drift (resuelto — T6)" y describe el estado real
sin "Acción" pendiente.

## Spec (SDD — WHAT)

**User story:** Como lector de la documentación, quiero que DISENO.md diga
si el drift fue resuelto o no, para no pensar que hay trabajo pendiente
cuando ya está hecho.

## Scenarios (BDD)

```gherkin
Scenario: DISENO.md refleja resolución del drift
  Given T6 marca "tokens reconciliados con DESIGN.md" como DONE
  When un lector abre _ai_context/docs/tareas/DISENO.md
  Then la sección "Tokens y drift" dice "resuelto" o "✅"
  And los valores listados coinciden con global.css y DESIGN.md
  And no hay una "Acción" pendiente sin tachar
```

## Plan (SDD — HOW)

1. Verificar `_ai_context/docs/tareas/DISENO.md` sección "Tokens y drift (resuelto — T6)":
   - La tabla muestra los valores FINALES (post-T6), todos ✅ sincronizado.
   - Dice "Resuelto en T6: `global.css` alineado a `DESIGN.md`".
   - No queda "Acción: elegir..." pendiente.
2. Comparar los valores listados contra `src/styles/global.css` y
   `DESIGN.md` (raíz):
   - `--tertiary` = `#0A7CFF` (= `tertiary: "#0A7CFF"` en DESIGN.md)
   - `--tertiary-dark` = `#0066CC` (extensión accesible, solo en CSS)
   - `--whatsapp` = `#25D366` (= `whatsapp: "#25D366"`)
   - `--whatsapp-hover` = `#1DA851`
   - `--rounded-xs` = `4px` (= `xs: 4px`)
3. Correr el verification script.

## Verification script

```bash
#!/bin/bash
# Verificación AUD-03 — DISENO.md (migrado desde _ai_context/docs/wiki/Diseno.md)
# Uso: bash _ai_context/docs/tareas/verify-AUD-03.sh

FILE="_ai_context/docs/tareas/DISENO.md"
echo "🧪 AUD-03 — Actualizar Diseno.md"

if grep -q 'drift pendiente' "$FILE"; then
    echo "  ❌ Aún dice 'drift pendiente'"
    exit 1
fi

if grep -q 'Acción: elegir' "$FILE"; then
    echo "  ❌ Aún tiene 'Acción' pendiente"
    exit 1
fi

if grep -q 'resuelto\|Resuelto' "$FILE"; then
    echo "  ✅ Drift marcado como resuelto"
else
    echo "  ❌ No menciona 'resuelto'"
    exit 1
fi

echo "✅ AUD-03 — COMPLETA"
```

## Estado
DONE

## Notas
Verificación completa:
- Sin "drift pendiente" ni "Acción: elegir" en `_ai_context/docs/tareas/DISENO.md`.
- "resuelto" mencionado (sección "Tokens y drift (resuelto — T6)").
- Valores de `global.css` y `DESIGN.md` coinciden con la tabla
  (`--tertiary #0A7CFF`, `--whatsapp #25D366`, `--whatsapp-hover #1DA851`,
  `--rounded-xs 4px`, `--tertiary-dark #0066CC` como extensión accesible).
- El fix se materializó en la migración de la wiki (AUD-04); la tarea solo
  requería verificación sobre el documento migrado.

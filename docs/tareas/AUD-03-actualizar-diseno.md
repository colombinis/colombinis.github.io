# AUD-03 — Actualizar Diseno.md

## Contexto

`docs/wiki/Diseno.md` sección "Tokens y drift pendiente" (líneas 9-20)
lista 4 tokens con drift entre `global.css` y `DESIGN.md`, y dice:
> Acción: elegir una única verdad y dejar ambos sincronizados.

Pero H8 en `Progreso.md` marca el drift como DONE (T6 DONE —
"tokens reconciliados con DESIGN.md"). La sección de Diseno.md
NO se actualizó para reflejar la resolución.

## Spec (SDD — WHAT)

**User story:** Como lector de la wiki, quiero que Diseno.md diga si el
drift fue resuelto o no, para no pensar que hay trabajo pendiente cuando
ya está hecho.

## Scenarios (BDD)

```gherkin
Scenario: Diseno.md refleja resolución del drift
  Given T6 marca "tokens reconciliados con DESIGN.md" como DONE
  When un lector abre docs/wiki/Diseno.md
  Then la sección "Tokens y drift" dice "resuelto" o "✅"
  And los valores listados coinciden con global.css y DESIGN.md
  And no hay una "Acción" pendiente sin tachar
```

## Plan (SDD — HOW)

1. Editar `docs/wiki/Diseno.md` sección "Tokens y drift pendiente":
   - Renombrar a "Tokens y drift (resuelto — T6)"
   - Reescribir la tabla mostrando los valores FINALES (post-T6)
   - Reemplazar "Acción: elegir..." con "Resuelto en T6: global.css
     alineado a DESIGN.md. Ver H8 en Progreso.md."
2. Verificar que los valores listados coincidan con los del `global.css`
   actual (leer global.css y comparar).

## Verification script

```bash
#!/bin/bash
# Verificación AUD-03
FILE="docs/wiki/Diseno.md"
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
TODO

## Notas
Necesita leer `src/styles/global.css` para verificar los valores actuales
de los tokens y confirmar que coinciden con DESIGN.md antes de reescribir
la tabla.

# AUD-01 — Reconciliar Roadmap.md

## Contexto

`docs/wiki/Roadmap.md` tiene una contradicción interna:
- La **tabla de estado** (líneas 14-21) marca F2 ✅, F3 ✅, F4 ✅, F5 ✅
- El **detalle de fases** (líneas 37-57) marca F2 🔄, F3 🔄, F4 ⬜, F5 ⬜

`Progreso.md` confirma que T0-T16 están DONE y las fases cerradas.
El detalle de Roadmap quedó desactualizado respecto a la tabla y a Progreso.md.

## Spec (SDD — WHAT)

**User story:** Como mantenedor del sitio, quiero que Roadmap.md refleje
el estado real de las fases, para que un visitante de la wiki no se
confunda con marcas contradictorias.

## Scenarios (BDD)

```gherkin
Scenario: Roadmap consistente con Progreso.md
  Given el archivo docs/wiki/Progreso.md marca T0-T16 como DONE
  When un lector abre docs/wiki/Roadmap.md
  Then la tabla de estado marca F0-F5 como ✅
  And el detalle de cada fase también marca ✅
  And no hay marcas 🔄 o ⬜ en el detalle de fases
  And los pendientes post-deploy se listan como "post-deploy" no como "⬜ Pendiente"
```

## Plan (SDD — HOW)

1. Editar `docs/wiki/Roadmap.md`:
   - Línea 37: `### F2 — Construcción 🔄` → `### F2 — Construcción ✅`
   - Línea 42: `### F3 — Conversión 🔄` → `### F3 — Conversión ✅`
   - Línea 47: `### F4 — Crecimiento ⬜` → `### F4 — Crecimiento ✅`
   - Línea 54: `### F5 — Cierre ⬜` → `### F5 — Cierre ✅`
2. Reescribir las notas "Pendiente real" como "Post-deploy" en F4 (es un
   seguimiento operativo, no trabajo pendiente de la fase).
3. Verificar que no queden emojis 🔄/⬜ en el detalle de fases.

## Verification script

```bash
#!/bin/bash
# Verificación AUD-01: Roadmap consistente
# Uso: bash docs/tareas/verify-AUD-01.sh

FILE="docs/wiki/Roadmap.md"
PASS=0; FAIL=0

echo "🧪 AUD-01 — Reconciliar Roadmap.md"

# Check: no 🔄 ni ⬜ en detalle de fases
if grep -E '### F[0-5].*🔄|### F[0-5].*⬜' "$FILE" >/dev/null; then
    echo "  ❌ Hay fases marcadas 🔄 o ⬜ en el detalle"
    FAIL=1
else
    echo "  ✅ Todas las fases marcadas ✅ en el detalle"
    PASS=1
fi

# Check: tabla marca todo ✅
if grep -c '✅' "$FILE" | grep -q "$(grep -c 'F[0-5] ' "$FILE")"; then
    echo "  ✅ Tabla de estado consistente"
else
    echo "  ❌ Tabla de estado inconsistente"
    FAIL=1
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
    echo "✅ AUD-01 — COMPLETA"
else
    echo "❌ AUD-01 — INCOMPLETA"
fi
```

## Estado
TODO

## Notas
El "pendiente real: restaurar GTM/GA4" en F4 fue resuelto (T5 DONE, GTM-T7PWJ99 activo).
Reescribir como nota post-deploy: "validar eventos con datos reales tras deploy".

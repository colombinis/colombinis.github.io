# AUD-01 — Reconciliar Roadmap.md

## Contexto

Originalmente, `_ai_context/docs/wiki/Roadmap.md` tenía una contradicción interna:
- La **tabla de estado** marcaba F2 ✅, F3 ✅, F4 ✅, F5 ✅
- El **detalle de fases** marcaba F2 🔄, F3 🔄, F4 ⬜, F5 ⬜

`_ai_context/docs/wiki/Progreso.md` confirmaba que T0-T16 están DONE y las fases cerradas.

**Resolución por migración (AUD-04):** `_ai_context/docs/wiki/` fue eliminada. La información
del rebranding (incluido el estado de fases F0-F5) se migró a
`_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`. Ese archivo ya está reconciliado:
todas las fases F0-F5 están marcadas ✅ y los pendientes post-deploy se listan
en una sección propia ("Pendientes post-deploy"), no como fases pendientes ⬜.

La reconciliación que pedía esta tarea queda verificada sobre el documento
migrado, que es el único lugar donde vive ahora ese contenido.

## Spec (SDD — WHAT)

**User story:** Como mantenedor del sitio, quiero que el historial de fases
del rebranding refleje el estado real (sin marcas contradictorias), para que
un lector de `HISTORIAL-REBRANDING.md` no se confunda.

## Scenarios (BDD)

```gherkin
Scenario: Historial consistente con el cierre del rebranding
  Given _ai_context/docs/tareas/HISTORIAL-REBRANDING.md es el documento histórico del rebranding
  When un lector abre la sección de estado de fases
  Then las fases F0-F5 están marcadas todas como ✅
  And no hay marcas 🔄 o ⬜ en el detalle de fases
  And los pendientes post-deploy se listan en una sección "Pendientes post-deploy", no como "⬜ Pendiente"
```

## Plan (SDD — HOW)

1. Verificar `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`:
   - Sección "Estado final de las fases (F0-F5)": todas ✅ (ya está así).
   - Sin emojis 🔄/⬜ en el detalle de fases.
   - "Pendientes post-deploy" en sección propia (sección 5).
2. Si algún estado quedó desactualizado respecto a la realidad, corregirlo.
3. Correr el verification script.

## Verification script

```bash
#!/bin/bash
# Verificación AUD-01: Roadmap consistente (migrado a HISTORIAL-REBRANDING.md)
# Uso: bash _ai_context/docs/tareas/verify-AUD-01.sh

BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
FILE="$BASE_DIR/HISTORIAL-REBRANDING.md"
PASS=0; FAIL=0

echo "🧪 AUD-01 — Reconciliar Roadmap (HISTORIAL-REBRANDING.md)"

# 1. No hay fases marcadas 🔄 o ⬜ en el detalle
if grep -E 'F[0-5] .*🔄|F[0-5] .*⬜' "$FILE" >/dev/null; then
    echo "  ❌ Hay fases marcadas 🔄 o ⬜"
    FAIL=1
else
    echo "  ✅ Fases F0-F5 todas marcadas ✅"
fi

# 2. Tabla de fases: al menos las 6 filas F0-F5 ✅
DONE_COUNT=$(grep -c '| ✅ |' "$FILE")
if [ "$DONE_COUNT" -ge 6 ]; then
    echo "  ✅ Tabla de fases consistente (6 fases ✅)"
else
    echo "  ❌ Tabla de fases incompleta"
    FAIL=1
fi

# 3. Pendientes post-deploy listados aparte, sin ⬜
if grep -q 'Pendientes post-deploy' "$FILE" && ! grep -q '⬜' "$FILE"; then
    echo "  ✅ Pendientes post-deploy listados aparte (sin ⬜)"
else
    echo "  ❌ Pendientes post-deploy mal clasificados"
    FAIL=1
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
    echo "✅ AUD-01 — COMPLETA"
else
    echo "❌ AUD-01 — INCOMPLETA"
    exit 1
fi
```

## Estado
DONE

## Notas
La tarea se resolvió por la migración de AUD-04: `_ai_context/docs/wiki/Roadmap.md` y
`_ai_context/docs/wiki/Progreso.md` ya no existen; su contenido (incluido el estado de
fases F0-F5) vive en `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`, que ya está
reconciliado. El fix consistió en apuntar la verificación de esta tarea al
documento migrado y confirmar su consistencia.

# AUD-02 — Actualizar AGENTS.md

## Contexto

`AGENTS.md` (líneas 67-74) lista las fases del proyecto con estado desactualizado:
- F2 🔄 In progress (QA pending)
- F3 🔄 In progress
- F4 ⬜ Pending (GTM/GA4 is a placeholder)
- F5 ⬜ Pending

Pero `Progreso.md` marca T5 (GTM) y T6-T11 como DONE. GTM-T7PWJ99 está activo.
AGENTS.md es lo primero que lee cualquier agente AI que trabaje en el repo.

## Spec (SDD — WHAT)

**User story:** Como agente AI que entra al proyecto, quiero que AGENTS.md
refleje el estado real, para no repetir trabajo ya hecho ni asumir que
algo está pendiente cuando ya está resuelto.

## Scenarios (BDD)

```gherkin
Scenario: AGENTS.md refleja estado real
  Given el rebranding tiene T0-T16 DONE en Progreso.md
  When un agente AI lee AGENTS.md
  Then la tabla de fases marca F0-F5 como ✅ Done
  And la nota de F4 no dice "GTM is a placeholder"
  And la nota de F5 no dice "Pending"
```

## Plan (SDD — HOW)

1. Editar `AGENTS.md` tabla de fases:
   - F2 → ✅ Done (migración a Astro completa, QA ejecutada)
   - F3 → ✅ Done (social proof, FAQ, CTAs verificados)
   - F4 → ✅ Done (SEO, GTM-T7PWJ99 activo, sitemap automático)
   - F5 → ✅ Done (legacy elimado, .gitignore, deploy workflow creado)
2. Actualizar nota de F4: "GTM `GTM-T7PWJ99` activo; pendiente: validar
   eventos con datos reales post-deploy (ver _ai_context/docs/tareas/TODO.md)".
3. Actualizar nota de F5: "Deploy workflow creado; pendiente:
   Lighthouse post-deploy + verificación en producción".

## Verification script

```bash
#!/bin/bash
# Verificación AUD-02
FILE="AGENTS.md"
echo "🧪 AUD-02 — Actualizar AGENTS.md"

if grep -E '🔄|⬜ Pending|⬜' "$FILE" | grep -v 'github' >/dev/null 2>&1; then
    echo "  ❌ Aún hay fases marcadas 🔄 o ⬜"
    exit 1
fi

if grep -q 'GTM.*placeholder' "$FILE"; then
    echo "  ❌ Aún dice GTM is a placeholder"
    exit 1
fi

echo "  ✅ AGENTS.md actualizado"
echo "✅ AUD-02 — COMPLETA"
```

## Estado
DONE

## Notas
AGENTS.md es el archivo que guía a agentes AI (Claude, Codex, etc.) que
trabajen en el repo. Debe ser lo más preciso posible.

El fix ya estaba aplicado en AGENTS.md (tabla F0-F5 ✅, notas post-deploy
apuntando a `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md`). Se ejecutó el verification script:
sin 🔄/⬜, sin "GTM placeholder" → tarea completa sin cambios adicionales.


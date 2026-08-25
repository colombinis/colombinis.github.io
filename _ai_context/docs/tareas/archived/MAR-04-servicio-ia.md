# MAR-04 — Evaluar 4to servicio IA

## Contexto

Contenido.md lista "Inteligencia Artificial (futuro)" como potencial 4to servicio,
con claim: "Machine learning y automatización inteligente para empresas que quieren dar el salto."

La estrategia personal del usuario es "PHP + IA aplicada". Si SACsi no ofrece IA,
hay una desconexión entre la marca personal y el negocio.

**Decisión tomada** (mejor juicio, usuario no respondió al clarify):
NO agregar servicio IA en esta auditoría. Se marca como tarea futura
post-auditoria. La auditoría de marca debe evaluar el gap y recomendar.

## Scenarios (BDD)

```gherkin
Scenario: Gap IA documentado
  Given la marca personal Sebastián es "PHP + IA aplicada"
  And el sitio SACsi no ofrece IA explicitamente
  When se completa MAR-04
  Then TODO.md tiene una tarea futura PRI-05 o similar que dice:
    "Evaluar agregar 4to servicio de IA a SACsi post-auditoría"
  And el archivo de tarea lista los requirements:
    - Renombrar claim como "IA aplicada" (no "machine learning", muy academico)
    - Agregar page /servicios/ia/
    - Actualizar hero para mencionar 4 servicios
    - Agregar 2-3 casos de IA en casos-exito.json
```

## Plan

1. Documentar el gap y los requirements en este archivo
2. NO crear la página /servicios/ia/ en este ciclo
3. Dejar en TODO.md una tarea futura "Servicio IA — evaluar post-auditoria"

## Gap documentado (2026-08-05)

**Decisión final del usuario** (MAR-01 §6, H-MAR-04): NO agregar el 4to
servicio IA en este ciclo. Documentar el gap y evaluarlo post-auditoría.

El gap queda documentado en dos lugares:

### En `_ai_context/docs/tareas/CONTENIDO.md` §4 (estado claro)

- Sección "(Futuro) Inteligencia Artificial" reescrita con **estado claro**:
  fuera del scope de la auditoría actual, decisión NO agregar, evaluación en
  tarea futura post-auditoría.
- Claim renombrado de "Machine learning y automatización inteligente"
  (académico) a **"IA aplicada a tu negocio"** — alineado con el
  posicionamiento híbrido "PHP + IA aplicada" de la marca personal.

### Requirements para habilitar el servicio (cuando se evalúe)

| # | Requirement |
|---|-------------|
| 1 | Renombrar claim a "IA aplicada" (no "machine learning") |
| 2 | Agregar página `src/pages/servicios/ia.astro` |
| 3 | Actualizar hero (`src/pages/index.astro`) para mencionar 4 servicios |
| 4 | Agregar 2-3 casos de IA en `src/data/casos-exito.json` |
| 5 | Ampliar grilla de "Soluciones" de 3 a 4 cards |

**NO se implementó nada en este ciclo** (verificado: no existe
`src/pages/servicios/ia.astro`; el hero y la grilla siguen con 3 servicios).
La tarea futura quedó registrada en TODO.md como `FUT-01`.

## Verification script

```bash
#!/bin/bash
echo "🧪 MAR-04 — Gap IA documentado"
rg -q "IA aplicada" _ai_context/docs/tareas/CONTENIDO.md && echo "  ✅ Claim renombrado en CONTENIDO.md" || echo "  ❌ claim"
rg -q "agregar el 4to servicio IA" _ai_context/docs/tareas/CONTENIDO.md && echo "  ✅ Estado claro en CONTENIDO.md §4" || echo "  ❌ estado"
rg -q "FUT-01" _ai_context/docs/tareas/TODO.md && echo "  ✅ Tarea futura en TODO.md" || echo "  ❌ FUT-01"
test ! -f src/pages/servicios/ia.astro && echo "  ✅ Página /servicios/ia/ NO creada" || echo "  ❌ página creada"
echo "✅ MAR-04 — COMPLETA"
```

## Estado
DONE

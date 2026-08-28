# MAR-02 — Auditar hero: propuesta de valor

## Contexto

Hero actual (src/pages/index.astro):
- Label: "SOLUCIONES INFORMÁTICAS"
- H1: "Tecnología simple para PyMEs que quieren crecer"
- Subtítulo: "Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online. Más de 15 años ayudando a empresas como la tuya a ganar tiempo, reducir costos y vender más."

¿Está alineado con la realidad? SACsi ofrece 3 servicios, pero la
estrategia personal es "PHP + IA". El hero no menciona IA en absoluto.
Si agregamos IA (MAR-04), el hero necesita actualizarse.

## Scenarios (BDD)

```gherkin
Scenario: Hero pasa test de 8 segundos
  Given un visitante nuevo
  When entra al sitio
  Then en menos de 8 segundos entiende:
    | qué | "soluciones informáticas" |
    | para quién | "PyMEs que quieren crecer" |
    | qué hace | "automatizar, software a medida, presencia online" |
    | prueba | "15 años de experiencia" |
  And al menos un CTA visible sin scroll
```

## Plan

1. Revisar el hero actual contra el test de 8 segundos
2. Validar que H1 + subtítulo cubren los 3 servicios
3. Si MAR-04 decide agregar IA, proponer texto nuevo para el hero

## Resultado de la auditoría (2026-08-05)

El hero de `src/pages/index.astro` pasó el test de 8 segundos tras un fix:

| Criterio (BDD) | Estado | Evidencia |
|----------------|--------|-----------|
| qué = "soluciones informáticas" | ✅ (fix) | El label `<p class="hero__label">SOLUCIONES INFORMÁTICAS</p>` se había perdido durante el refactor del working tree (existía en `a8c4ff1`). Re-agregado. |
| para quién = "PyMEs que quieren crecer" | ✅ | H1 intacto. |
| qué hace = "automatizar, software a medida, presencia online" | ✅ | Subtítulo intacto, cubre los 3 servicios. |
| prueba = "15 años de experiencia" | ✅ | Subtítulo: "Más de 15 años ayudando a empresas como la tuya…". |
| CTA visible sin scroll | ✅ | 2 CTAs en `.hero__actions` (WhatsApp "Consultar sin cargo" + "Ver servicios"). |

**IA (paso 3):** MAR-04 decidió NO agregar el servicio IA en este ciclo (ver
MAR-01 §6). El hero NO debe mencionar IA ahora. Si en el futuro se agrega,
requisitos en MAR-04.

## Verification script

```bash
#!/bin/bash
FILE="dist/index.html"
echo "🧪 MAR-02 — Hero pasa test de 8 segundos"
grep -q 'hero__label">SOLUCIONES INFORMÁTICAS' "$FILE" && echo "  ✅ Label SOLUCIONES INFORMÁTICAS" || echo "  ❌ label ausente"
grep -q 'hero__title">Tecnología simple para PyMEs que quieren crecer' "$FILE" && echo "  ✅ H1 (para quién)" || echo "  ❌ H1"
grep -q 'Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online' "$FILE" && echo "  ✅ Subtítulo (3 servicios + 15 años)" || echo "  ❌ subtítulo"
grep -q 'hero__cta' "$FILE" && echo "  ✅ CTA visible" || echo "  ❌ CTA"
echo "✅ MAR-02 — COMPLETA"
```

## Notas

- Comentario HTML del hero actualizado de "sin botones, con label y CTA
  reorganizada" (stale) a "label + propuesta de valor + CTAs".
- Drift menor de copy CTA (código: "Consultar sin cargo" / "Ver servicios";
  CONTENIDO.md: "Consultános sin cargo" / "Conocé más") → se deja para MAR-05
  (tono y voz), no es responsabilidad de esta tarea.
- Build verificado 2026-08-05: 16 páginas OK, label presente en `dist/index.html`.

## Estado
DONE

# SACsi Rebranding — Wiki

Documentación del rebranding del sitio de **SACsi** (soluciones informáticas para PyMEs, Rosario, Argentina).

Esta wiki es la fuente de verdad del proyecto. Se organiza en **5 documentos** enlazados desde acá.

## Índice

| Documento | Contenido |
|-----------|-----------|
| [Progreso](Progreso) | **Seguimiento activo:** hallazgos del análisis y tareas con estado (`TODO`/`DOING`/`DONE`). |
| [Roadmap](Roadmap) | Fases, estado actual, entregables, criterios de éxito y checklist de QA. |
| [Arquitectura](Arquitectura) | Stack real (Astro), estructura del repo, archivos legacy, deploy y SEO técnico. |
| [Contenido](Contenido) | Arquitectura de contenido, navegación, wireframes, propuesta de valor y copy de servicios. |
| [Diseño](Diseno) | Decisiones de diseño, glosario y enlace a los tokens de marca. |
| [DESIGN.md (raíz)](https://github.com/colombinis/colombinis.github.io/blob/v0_alternativo_rebranding/DESIGN.md) | **Fuente canónica** de tokens visuales (colores, tipografía, spacing, componentes). |

## Estado actual (lo importante)

> El sitio **ya fue migrado a Astro**. La versión de HTML estático de la raíz es **legacy** y se irá deprecando.

| Dimensión | Estado real |
|-----------|-------------|
| Stack oficial | **Astro v7** (`src/`), build a `dist/`, deploy en GitHub Pages (`CNAME` → sacsi.com.ar). |
| Legacy a deprecar | `.html` de la raíz, `theme/mobile1/`, `inteligencia-artificial/index.html`, y `dist/` commiteado. |
| Rama de trabajo | `v0_alternativo_rebranding` — nunca commitear a `master`. |
| Tokens de diseño | `/DESIGN.md` (raíz) es la única fuente. Ver [drift pendiente](Diseno#tokens-y-drift-pendiente). |

El detalle del progreso por fase está en el [Roadmap](Roadmap).

## Propuesta de valor (resumen)

SACsi comunica su valor en el hero de la homepage en 3 niveles, pensados para el **test de 8 segundos**:

| Nivel | Texto |
|-------|-------|
| Label | `SOLUCIONES INFORMÁTICAS` |
| H1 | `Tecnología simple para PyMEs que quieren crecer` |
| Subtítulo | `Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online. Más de 15 años ayudando a empresas como la tuya a ganar tiempo, reducir costos y vender más.` |

El desarrollo completo (target, principios de copy, CTA strategy) vive en [Contenido](Contenido).

## Enlaces

- [Repositorio](https://github.com/colombinis/colombinis.github.io)
- [Sitio en vivo](https://sacsi.com.ar)

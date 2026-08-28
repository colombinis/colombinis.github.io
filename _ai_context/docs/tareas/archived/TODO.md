# TODO — SACsi.com.ar — Auditoría Producción

> **Maestro de tareas.** Fuente única de verdad del estado de cada tarea.
> Cada tarea tiene su archivo detalle en `_ai_context/docs/tareas/<ID>-<slug>.md`.
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).
>
> **Rama:** `v0_alternativo_rebranding` → objetivo: dejar lista para producción.
> **Fecha inicio:** 2026-08-04
> **Wiki previa:** `_ai_context/docs/wiki/` fue eliminada; info viva migrada a `_ai_context/docs/tareas/`, historial del rebranding en `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`.

## Sub-maestros por fase

Las fases con tareas en estado distinto de `DONE` tienen su propio
`TODO.md` en una subcarpeta `FASE-N-<nombre>/`, que agrupa las tareas
pendientes de esa fase y sus archivos detalle. Este maestro global es la
fuente única de verdad; los sub-maestros son vistas filtradas para
trabajar fase por fase.

| Subcarpeta | Fase | Tareas no-DONE |
|------------|------|----------------|
| `_ai_context/docs/tareas/FASE-1-Auditoria-de-documentacion-y-codigo/` | FASE 1 — Auditoría _ai_context/docs/código | (ninguna — AUD-08, AUD-14 movidas a FASE-8) |
| `_ai_context/docs/tareas/FASE-4-Conversion-y-trafico/` | FASE 4 — Conversión y tráfico | CON-04 (TODO) |
| `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/` | FASE 6 — Validación post-deploy | DEP-01 (BLOCKED) |
| `_ai_context/docs/tareas/FASE-8-Backlog/` | FASE 8 — Backlog (consolidado chatbot) | FUT-01, AUD-08, AUD-14, CHAT-01, CHAT-04, CHAT-05, CHAT-06 (TODO/DONE/BLOCKED) |
| `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/` | FEATURE 1 — Validación flujos de negocio | 5 tareas DONE (VAL-01..05) |

> Las fases 2, 3, 5 y 9 están 100% DONE → no tienen subcarpeta.

---

## Convenciones

### IDs de tarea

```
AUD-NN  — Auditoría de documentación/código (fase 1: limpieza)
MAR-NN  — Auditoría de marca (fase 2)
UJ -NN  — User Journey (fase 3)
CON-NN  — Conversión y tráfico (fase 4)
PRI-NN  — Modelo de precios (fase 5)
DEP-NN  — Validación post-deploy (fase 6 — post-estabilización)
```

### Estados

| Estado    | Significado                                    |
|-----------|------------------------------------------------|
| `TODO`    | Pendiente, sin empezar                         |
| `DOING`   | En progreso                                   |
| `BLOCKED` | Bloqueado (ver nota en el archivo de la tarea) |
| `DONE`    | Terminado y verificado                         |

### Formato de cada tarea (archivo detalle)

Cada `_ai_context/docs/tareas/<ID>-<slug>.md` sigue esta plantilla:

```markdown
# [ID] — Título

## Contexto
Por qué surge esta tarea. Referencia a hallazgos de auditoría.

## Spec (SDD — WHAT)
Qué se define/cambia. User stories si aplica.

## Scenarios (BDD — comportamiento esperado)
Escenarios Gherkin Given/When/Then que describen el comportamiento
verificable. Cada escenario es un acceptance test.

## Plan (SDD — HOW)
Pasos técnicos concretos. Archivos a tocar.

## Verification script
Script bash ejecutable que valida que la tarea está completa.
El usuario lo ejecuta y reporta output.

## Estado
TODO | DOING | BLOCKED | DONE

## Notas
Decisiones, dependencias, bloqueos.
```

---

## FASE 1 — Auditoría de documentación y código (AUD)

Objetivo: eliminar o actualizar toda documentación desactualizada.
La rama debe ser consistente: docs = código = realidad.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| AUD-01  | Reconciliar Roadmap.md: detalle fases              | DONE   | `_ai_context/docs/tareas/AUD-01-reconciliar-roadmap.md` |
| AUD-02  | Actualizar AGENTS.md: fases                        | DONE   | `_ai_context/docs/tareas/AUD-02-actualizar-agents.md` |
| AUD-03  | Actualizar Diseno.md: eliminar drift "pendiente"   | DONE   | `_ai_context/docs/tareas/AUD-03-actualizar-diseno.md` |
| AUD-04  | Eliminar _ai_context/docs/wiki/ (info migrada a _ai_context/docs/tareas/)  | DONE   | `_ai_context/docs/tareas/AUD-04-eliminar-wiki.md` |
| AUD-05  | Verificar build de producción limpio               | DONE   | `_ai_context/docs/tareas/AUD-05-build-produccion.md` |
| AUD-06  | Hero sin CTA primario en página de inicio          | DONE   | `_ai_context/docs/tareas/AUD-06-hero-sin-cta.md` |
| AUD-07  | Falta formulario de contacto funcional (solo mailto)| DONE   | `_ai_context/docs/tareas/AUD-07-formulario-contacto.md` |
| AUD-08  | Chatbot: knowledge.json incompleto y sin validación | **MOVIDA A FASE-8**   | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-08-chatbot-knowledge.md` |
| AUD-09  | CSS duplicado: ServiceCard en global.css y ServiceCard.astro | DONE   | `_ai_context/docs/tareas/AUD-09-css-duplicado.md` |
| AUD-10  | Falta sitemap.xml y robots.txt no referencia sitemap-index.xml correctamente | DONE   | `_ai_context/docs/tareas/AUD-10-sitemap-robots.md` |
| AUD-11  | Carrusel de casos: endpoint /casos.json no existe (404 en producción) | DONE   | `_ai_context/docs/tareas/AUD-11-casos-json-endpoint.md` |
| AUD-12  | Accesibilidad: contraste, focus states, ARIA labels faltantes | DONE   | `_ai_context/docs/tareas/AUD-12-accesibilidad.md` |
| AUD-13  | Meta tags incompletos: falta description única por página, og:image genérico | DONE   | `_ai_context/docs/tareas/AUD-13-meta-tags-seo.md` |
| AUD-14  | Chatbot: slm-chatbot.js carga modelo 0.5B sin control de presupuesto de red | **MOVIDA A FASE-8**   | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-14-chatbot-network-budget.md` |
| AUD-15  | Footer: email de contacto no renderiza (falta en template) | DONE   | `_ai_context/docs/tareas/AUD-15-footer-email.md` |

---

## FASE 2 — Auditoría de marca (MAR)

Objetivo: verificar que el sitio comunica la propuesta de valor correcta,
alineada con el posicionamiento "PHP + IA aplicada" del dueño.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| MAR-01  | Definir pillars de marca SACsi vs marca personal   | DONE   | `_ai_context/docs/tareas/MAR-01-pillars-marca.md` |
| MAR-02  | Auditar hero: propuesta de valor vs posicionamiento | DONE   | `_ai_context/docs/tareas/MAR-02-auditar-hero.md` |
| MAR-03  | Auditar casos de éxito: coherencia narrativa       | DONE   | `_ai_context/docs/tareas/MAR-03-auditar-casos.md` |
| MAR-04  | Evaluar 4to servicio IA: decisión y documentación   | DONE   | `_ai_context/docs/tareas/MAR-04-servicio-ia.md` |
| MAR-05  | Auditar tono y voz: consistencia entre páginas     | DONE   | `_ai_context/docs/tareas/MAR-05-tono-voz.md` |

---

## FASE 3 — User Journey (UJ)

Objetivo: simular flujos de clientes típicos y validar que el sitio
los guía correctamente desde landing hasta conversión.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| UJ-01   | Definir 3 personas/clientes típicos                 | DONE   | `_ai_context/docs/tareas/UJ-01-definir-personas.md` |
| UJ-02   | Mapear journey: PyME sin web → contacto            | DONE   | `_ai_context/docs/tareas/UJ-02-journey-pyme-whatsapp.md` |
| UJ-03   | Mapear journey: PyME con WP roto → rescate         | DONE   | `_ai_context/docs/tareas/UJ-03-journey-wp-roto.md` |
| UJ-04   | Mapear journey: reclutador tech → portfolio        | DONE   | `_ai_context/docs/tareas/UJ-04-journey-reclutador.md` |
| UJ-05   | Validar CTA funnel: cada página tiene CTA claro    | DONE   | `_ai_context/docs/tareas/UJ-05-validar-cta-funnel.md` |

---

## FASE 4 — Conversión y tráfico (CON)

Objetivo: estimar volumen de tráfico necesario y tasas de conversión
para que el modelo de negocio sea rentable.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| CON-01  | Definir funnel: visitas → leads → clientes         | DONE   | `_ai_context/docs/tareas/CON-01-funnel-basico.md` |
| CON-02  | Estimar tasas de conversión por canal              | DONE   | `_ai_context/docs/tareas/CON-02-tasas-conversion.md` |
| CON-03  | Estimar tráfico necesario para break-even          | DONE   | `_ai_context/docs/tareas/CON-03-trafico-breakeven.md` |
| CON-04  | Implementar tracking: GTM/GA4 eventos clave        | TODO   | `_ai_context/docs/tareas/FASE-4-Conversion-y-trafico/CON-04-tracking-gtm-ga4.md` |

---

## FASE 5 — Modelo de precios (PRI)

Objetivo: definir base de precios para los servicios de SACsi que haga
sostenible el modelo de negocio.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| PRI-01  | Definir modelo de precios: paquete vs retainer     | DONE   | `_ai_context/docs/tareas/PRI-01-modelo-precios.md` |
| PRI-02  | Precios por servicio: automatización, software, web | DONE   | `_ai_context/docs/tareas/PRI-02-precios-servicios.md` |
| PRI-03  | Calcular break-even: costo hora vs precio por tier  | DONE   | `_ai_context/docs/tareas/PRI-03-breakeven-costos.md` |
| PRI-04  | Definir tiers: qué se publica vs guía interna       | DONE   | `_ai_context/docs/tareas/PRI-04-tiers-paquetes.md` |

---

## FASE 6 — Validación post-deploy (DEP)

Objetivo: ejecutar las verificaciones que solo tienen sentido una vez que
el contenido y su estructura se estabilizaron (FASE 1-5 completas) y la
rama está mergeada a master.

**Precondición:** FASE 1 a FASE 5 deben estar DONE. Si el contenido sigue
inestable (tareas MAR/UJ/CON/PRI pendientes), esta fase se bloquea — no
tiene sentido validar un deploy cuyo contenido va a cambiar.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| DEP-01  | Pendientes post-deploy → validación en producción  | BLOCKED | `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` |

> DEP-01 es la antigua AUD-06, reubicada. Su Depends-on son TODAS las
> fases anteriores y el merge a master.

---

## FASE 7 — Chatbot FAQ (CHAT) — **CONSOLIDADA EN FASE-8-Backlog**

> **Nota (2026-08-07):** Esta fase se consolidó en `FASE-8-Backlog/chatbot-artifacts/`.
> Todas las tareas relacionadas (AUD-08, AUD-14, CHAT-01, CHAT-04, CHAT-05, CHAT-06) ahora viven en:
> `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/` con su `TODO.md` unificado.
>
> La subcarpeta `FASE-7-Chatbot-FAQ/` y su `TODO.md` pueden eliminarse.

---

## FASE 9 — Páginas detalle subnivel soluciones (SOL) **[PRIORIDAD ALTA — antes lanzamiento]**

Objetivo: Agregar páginas de detalle navegables para los subniveles de soluciones
(sin URL propia) actualmente renderizados como cards estáticos dentro de las
páginas `/servicios/<servicio>/`.

Data source: `src/data/soluciones.json` (ya completo — no modificar). Route
dinámico: `src/pages/servicios/[servicio]/[categoria].astro` (SSG, getStaticPaths).

| ID      | Título                                              | Estado | Archivo |
|---------|-----------------------------------------------------|--------|---------|
| SOL-01  | 9 páginas detalle subnivel + cross-link a casos     | DONE   | `_ai_context/docs/tareas/SOL-01-paginas-detalle-subnivel.md` |

---

## Resumen de estado

| Fase | Total | TODO | DOING | DONE | BLOCKED |
|------|-------|------|-------|------|---------|
| 1 — Auditoría _ai_context/docs/código | 13 | 0 | 0 | 13 | 0 |
| 2 — Auditoría de marca | 5 | 0 | 0 | 5 | 0 |
| 3 — User Journey | 5 | 0 | 0 | 5 | 0 |
| 4 — Conversión y tráfico | 4 | 1 | 0 | 3 | 0 |
| 5 — Modelo de precios | 4 | 0 | 0 | 4 | 0 |
| 6 — Validación post-deploy | 1 | 0 | 0 | 0 | 1 |
| 7 — Chatbot FAQ (CONSOLIDADA EN FASE-8) | 0 | 0 | 0 | 0 | 0 |
|| 8 — Backlog (consolidado chatbot) | 8 | 4 | 0 | 2 | 2 |
| 9 — Detalle subnivel soluciones | 1 | 0 | 0 | 1 | 0 |
| **Total** | **40** | **3** | **0** | **33** | **4** |

> **Progreso real (2026-08-07):** 33/40 DONE (82%). FASE 1 completa (13 DONE, 0 BLOCKED — chatbot movido a FASE-8), FASE 2, 3, 5 y 9 completas. SOL-01 verificado (9 páginas detalle subnivel + cross-link a casos, build OK).
> **Estructura actualizada:** las fases con tareas no-DONE tienen subcarpeta propia con TODO.md + archivos detalle (ver "Sub-maestros por fase" arriba).
> El camino crítico para DESEBLOQUEAR DEP-01 (merge a master + post-deploy) es cerrar CON-04. La FASE 8 (chatbot consolidado) NO bloquea el deploy: es mejora post-deploy.

### Correcciones de drift aplicadas en esta revisión (2026-08-05)

El TODO estaba desactualizado respecto a los archivos detalle. Se
reconciliaron las dos fuentes y este maestro ahora refleja la realidad:

- **MAR-01**: el archivo detalle estaba DONE; la tabla decía TODO → corregido a DONE.
- **UJ-01..UJ-05**: los 5 archivos detalle estaban DONE y verificados contra
  build 2026-08-04; la tabla los mostraba todos como TODO → corregidos a DONE.
  Se actualizaron además los slugs a los vigentes (`UJ-02-journey-pyme-whatsapp`,
  `UJ-03-journey-wp-roto`).
- **CON-04**: la tabla decía DONE, pero el tracking de eventos
  (`whatsapp_click`, `form_submit`) **NO está implementado en `src/`** —
  confirmado con grep: sólo GTM-T7PWJ99 con pageview existe en `Layout.astro`.
  El archivo detalle dice "TODO → se implementa y verifica en esta fase" →
  corregido a TODO.

### Trabajo commiteado (2026-08-07 — reconciliación)

Todo el trabajo del working tree fue commiteado en 8 commits lógicos
sobre `v0_alternativo_rebranding` (pendiente de push a origin + merge a master):

1. `feat: componentes reutilizables + data JSON` — SolucionesSection, FaqSection, SocialProofSection, casos-exito.json, soluciones.json
2. `refactor(home): reescritura del home` — index/Header/Footer/Layout/ServiceCard/global.css
3. `refactor(pages): servicios + casos-exito + sobre-nosotros`
4. `docs(audit): tareas detalle AUD-06..15 + CHAT-04/05 + flujos HTML`
5. `docs: actualizar tareas existentes AUD-01..05 + MAR-01..05 + config`
6. `feat(chatbot): trabajo preliminar SLM on-device + Chrome AI Prompt API`
7. `chore: gitignore tool caches`

Build verificado: 25 páginas, 0 errores. Working tree clean.

### Archivos duplicados en `_ai_context/docs/tareas/` (stubs viejos vs versión final)

Hay 7 IDs con dos archivos cada uno (stub inicial de las 16:04h + versión
final de las 18:5x-19:4xh). Los slugs vigentes (referenciados arriba) son
los más recientes y DONE; los viejos son TODO y deberían eliminarse:

- `CON-03-trafico-break-even.md` → descartar (vigente: `CON-03-trafico-breakeven.md`)
- `CON-04-tracking-eventos.md` → descartar (vigente: `CON-04-tracking-gtm-ga4.md`)
- `PRI-01-estructura-precios.md` → descartar (vigente: `PRI-01-modelo-precios.md`)
- `PRI-03-break-even.md` → descartar (vigente: `PRI-03-breakeven-costos.md`)
- `PRI-04-tiers-precios.md` → descartar (vigente: `PRI-04-tiers-paquetes.md`)
- `UJ-02-journey-pyme-sin-web.md` → descartar (vigente: `UJ-02-journey-pyme-whatsapp.md`)
- `UJ-03-journey-pyme-wp-roto.md` → descartar (vigente: `UJ-03-journey-wp-roto.md`)

> **Acción pendiente:** `rm` los 7 stubs viejos para que quede un solo
> archivo por ID (regla doc/code consistente).

---

## FASE 8 — Backlog (post-auditoría) — FUTURO

Objetivo: registrar decisiones diferidas para que no se pierdan. Se
revisan cuando el sitio está en producción (DEP-01) o cuando el contexto
de negocio lo justifique. NO bloquean el deploy.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| FUT-01  | Evaluar agregar 4to servicio de IA a SACsi post-auditoría | TODO   | `_ai_context/docs/tareas/MAR-04-servicio-ia.md` |

> **FUT-01** (ex "PRI-05" en el BDD de MAR-04): la decisión de NO agregar IA
> en el ciclo actual está tomada (MAR-01 §6 / MAR-04 DONE). Esta tarea evalúa
> el servicio cuando corresponda. Requirements listados en `MAR-04-servicio-ia.md`
> y en `CONTENIDO.md` §4 (claim "IA aplicada", página `/servicios/ia/`,
> hero con 4 servicios, 2-3 casos IA en `casos-exito.json`).
>
> **Nota (2026-08-07):** FUT-01 ahora se referencia desde `FASE-8-Backlog/TODO.md` (backlog consolidado).

---

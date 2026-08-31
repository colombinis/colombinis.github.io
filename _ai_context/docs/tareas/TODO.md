# TODO — Maestro global (fuente única de verdad)

> **Generado automáticamente** por `scripts/generate-todos.py` — no editar a mano. Se deriva escaneando `_ai_context/docs/tareas/**/TODO.md` según el contrato de `SYSTEM_MAP.yaml`.
> Última generación: 2026-08-31 19:33 UTC

## Resumen global

| Total | TODO | DOING | DONE | BLOCKED | % DONE |
|-------|------|-------|------|---------|--------|
| 22 | 6 | 0 | 13 | 3 | 59% |

## Pendientes (no-DONE): 9

| ID | Título | Estado | Carpeta | Archivo |
|----|--------|--------|---------|---------|
| DEP-01 | Pendientes post-deploy → validación en producción | BLOCKED | FASE-6-Validacion-post-deploy | `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` |
| AUD-08 | Chatbot: knowledge.json incompleto y sin validación | BLOCKED | FASE-8-Backlog | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-08-chatbot-knowledge.md` |
| AUD-14 | Chatbot: slm-chatbot.js carga modelo 0.5B sin control de presupuesto de red | BLOCKED | FASE-8-Backlog | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-14-chatbot-network-budget.md` |
| CHAT-01 | Verificar build del chatbot (script) | TODO | FASE-8-Backlog | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-01-verify.sh` |
| FUT-01 | Evaluar agregar 4to servicio de IA a SACsi post-auditoría | TODO | FASE-8-Backlog | `_ai_context/docs/tareas/archived/MAR-04-servicio-ia.md` |
| E2E-01 | E2E journey PyME sin web → contacto | TODO | FEATURE-3-Tests-E2E-UserJourneys | Abrir landing, click CTA WhatsApp, llegar a contacto, 0 errores JS |
| E2E-02 | E2E journey PyME WP roto → rescate | TODO | FEATURE-3-Tests-E2E-UserJourneys | Navegar servicios, encontrar diagnóstico, CTA rescate |
| E2E-03 | E2E journey reclutador → portfolio | TODO | FEATURE-3-Tests-E2E-UserJourneys | Servicios → caso de éxito, CTA contacto |
| E2E-04 | E2E CTA funnel (UJ-05) | TODO | FEATURE-3-Tests-E2E-UserJourneys | Cada página expone CTA visible a conversión |

## Por carpeta

### FASE-6-Validacion-post-deploy (0/1 DONE)

| ID | Título | Estado | Archivo |
|----|--------|--------|---------|
| DEP-01 | Pendientes post-deploy → validación en producción | BLOCKED | `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` |

### FASE-8-Backlog (3/7 DONE)

| ID | Título | Estado | Archivo |
|----|--------|--------|---------|
| AUD-08 | Chatbot: knowledge.json incompleto y sin validación | BLOCKED | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-08-chatbot-knowledge.md` |
| AUD-14 | Chatbot: slm-chatbot.js carga modelo 0.5B sin control de presupuesto de red | BLOCKED | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-14-chatbot-network-budget.md` |
| CHAT-01 | Verificar build del chatbot (script) | TODO | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-01-verify.sh` |
| CHAT-04 | Análisis: Chrome AI Prompt API vs SLM-chatbot | DONE | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-04-analysis-chrome-ai.md` |
| CHAT-05 | Arquitectura del chatbot (detalle técnico) | DONE | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-05-arquitectura-chatbot.md` |
| CHAT-06 | Decisión: implementar ahora o backlog | DONE | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-06-decision-implement.md` |
| FUT-01 | Evaluar agregar 4to servicio de IA a SACsi post-auditoría | TODO | `_ai_context/docs/tareas/archived/MAR-04-servicio-ia.md` |

### FEATURE-1-Validacion-de-flujos-de-negocio (6/6 DONE)

| ID | Título | Estado | Archivo |
|----|--------|--------|---------|
| VAL-01 | Crear listado-soluciones.json con soluciones y categorías | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-01-listado-trabajos-json.md` |
| VAL-02 | Tabla dinámica de rentabilidad en flujo-operativo-trabajo.html | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-02-tabla-dinamica-rentabilidad.md` |
| VAL-03 | Cargar tabla + selector desde JSON por fetch (fuente única) | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-03-carga-json-fetch.md` |
| VAL-04 | Integrar add/remove/editar filas (como Pasos del flujo) | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-04-add-remove-editar-filas.md` |
| VAL-05 | Cargar tabla desde listado-soluciones.json (fuente única) | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-05-listado-trabajos-json.md` |
| VAL-06 | Selector de solución + pasos del flujo desde solucion_<id>.json | DONE | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-06-selector-trabajo-pasos-json.md` |

### FEATURE-2-Catalogo (4/4 DONE)

| ID | Título | Estado | Archivo |
|----|--------|--------|---------|
| CAT-01 | Crear ruta `/catalogo` con datos normalizados (solo opciones con soluciones) | DONE | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-01-ruta-catalogo-datos.md` |
| CAT-02 | Filtros jerárquicos servicio→categoría + búsqueda textual (sin opciones vacías) | DONE | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-02-filtros-jerarquicos-busqueda.md` |
| CAT-03 | Grid de tarjetas de soluciones con link a detalle | DONE | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-03-grid-tarjetas-trabajos.md` |
| CAT-04 | Verificación (build + E2E) + integrar navegación a `/catalogo` | DONE | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-04-verificacion-integrar-navegacion.md` |

### FEATURE-3-Tests-E2E-UserJourneys (0/4 DONE)

| ID | Título | Estado | Archivo |
|----|--------|--------|---------|
| E2E-01 | E2E journey PyME sin web → contacto | TODO | Abrir landing, click CTA WhatsApp, llegar a contacto, 0 errores JS |
| E2E-02 | E2E journey PyME WP roto → rescate | TODO | Navegar servicios, encontrar diagnóstico, CTA rescate |
| E2E-03 | E2E journey reclutador → portfolio | TODO | Servicios → caso de éxito, CTA contacto |
| E2E-04 | E2E CTA funnel (UJ-05) | TODO | Cada página expone CTA visible a conversión |


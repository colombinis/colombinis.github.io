# TODO — SACsi.com.ar — Auditoría Producción

> **Maestro de tareas.** Fuente única de verdad del estado de cada tarea.
> Cada tarea tiene su archivo detalle en `docs/tareas/<ID>-<slug>.md`.
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).
>
> **Rama:** `v0_alternativo_rebranding` → objetivo: dejar lista para producción.
> **Fecha inicio:** 2026-08-04
> **Wiki previa:** `docs/wiki/` fue eliminada; info viva migrada a `docs/tareas/`, historial del rebranding en `docs/tareas/HISTORIAL-REBRANDING.md`.

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

Cada `docs/tareas/<ID>-<slug>.md` sigue esta plantilla:

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
| AUD-01  | Reconciliar Roadmap.md: detalle fases → DONE       | TODO   | `docs/tareas/AUD-01-reconciliar-roadmap.md` |
| AUD-02  | Actualizar AGENTS.md: fases → DONE                  | TODO   | `docs/tareas/AUD-02-actualizar-agents.md` |
| AUD-03  | Actualizar Diseno.md: eliminar drift "pendiente"   | TODO   | `docs/tareas/AUD-03-actualizar-diseno.md` |
| AUD-04  | Eliminar docs/wiki/ (info migrada a docs/tareas/)  | TODO   | `docs/tareas/AUD-04-eliminar-wiki.md` |
| AUD-05  | Verificar build de producción limpio               | TODO   | `docs/tareas/AUD-05-build-produccion.md` |

---

## FASE 2 — Auditoría de marca (MAR)

Objetivo: verificar que el sitio comunica la propuesta de valor correcta,
alineada con el posicionamiento "PHP + IA aplicada" del dueño.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| MAR-01  | Definir pillars de marca SACsi vs marca personal   | TODO   | `docs/tareas/MAR-01-pillars-marca.md` |
| MAR-02  | Auditar hero: propuesta de valor vs posicionamiento | TODO   | `docs/tareas/MAR-02-auditar-hero.md` |
| MAR-03  | Auditar casos de éxito: coherencia narrativa       | TODO   | `docs/tareas/MAR-03-auditar-casos.md` |
| MAR-04  | Evaluar 4to servicio IA: decisión y documentación   | TODO   | `docs/tareas/MAR-04-servicio-ia.md` |
| MAR-05  | Auditar tono y voz: consistencia跨 páginas          | TODO   | `docs/tareas/MAR-05-tono-voz.md` |

---

## FASE 3 — User Journey (UJ)

Objetivo: simular flujos de clientes típicos y validar que el sitio
los guía correctamente desde landing hasta conversión.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| UJ-01   | Definir 3 personas/clientes típicos                 | TODO   | `docs/tareas/UJ-01-definir-personas.md` |
| UJ-02   | Mapear journey: PyME sin web → contacto            | TODO   | `docs/tareas/UJ-02-journey-pyme-sin-web.md` |
| UJ-03   | Mapear journey: PyME con WP roto → rescate         | TODO   | `docs/tareas/UJ-03-journey-pyme-wp-roto.md` |
| UJ-04   | Mapear journey: reclutador tech → portfolio        | TODO   | `docs/tareas/UJ-04-journey-reclutador.md` |
| UJ-05   | Validar CTA funnel: cada página tiene CTA claro    | TODO   | `docs/tareas/UJ-05-validar-cta-funnel.md` |

---

## FASE 4 — Conversión y tráfico (CON)

Objetivo: estimar volumen de tráfico necesario y tasas de conversión
para que el modelo de negocio sea rentable.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| CON-01  | Definir funnel: visitas → leads → clientes         | DONE   | `docs/tareas/CON-01-funnel-basico.md` |
| CON-02  | Estimar tasas de conversión por canal              | DONE   | `docs/tareas/CON-02-tasas-conversion.md` |
| CON-03  | Estimar tráfico necesario para break-even          | DONE   | `docs/tareas/CON-03-trafico-breakeven.md` |
| CON-04  | Implementar tracking: GTM/GA4 eventos clave        | DONE   | `docs/tareas/CON-04-tracking-gtm-ga4.md` |

---

## FASE 5 — Modelo de precios (PRI)

Objetivo: definir base de precios para los servicios de SACsi que haga
sostenible el modelo de negocio.

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| PRI-01  | Definir modelo de precios: paquete vs retainer     | DONE   | `docs/tareas/PRI-01-modelo-precios.md` |
| PRI-02  | Precios por servicio: automatización, software, web | DONE   | `docs/tareas/PRI-02-precios-servicios.md` |
| PRI-03  | Calcular break-even: costo hora vs precio por tier  | DONE   | `docs/tareas/PRI-03-breakeven-costos.md` |
| PRI-04  | Definir tiers: qué se publica vs guía interna       | DONE   | `docs/tareas/PRI-04-tiers-paquetes.md` |

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
| DEP-01  | Pendientes post-deploy → validación en producción  | BLOCKED | `docs/tareas/DEP-01-post-deploy-validacion.md` |

> DEP-01 es la antigua AUD-06, reubicada. Su Depends-on son TODAS las
> fases anteriores y el merge a master.

---

## Resumen de estado

| Fase | Total | TODO | DOING | DONE | BLOCKED |
|------|-------|------|-------|------|---------|
| 1 — Auditoría docs/código | 5 | 5 | 0 | 0 | 0 |
| 2 — Auditoría de marca | 5 | 5 | 0 | 0 | 0 |
| 3 — User Journey | 5 | 5 | 0 | 0 | 0 |
| 4 — Conversión y tráfico | 4 | 4 | 0 | 0 | 0 |
| 5 — Modelo de precios | 4 | 4 | 0 | 0 | 0 |
| 6 — Validación post-deploy | 1 | 0 | 0 | 0 | 1 |
| **Total** | **24** | **23** | **0** | **0** | **1** |

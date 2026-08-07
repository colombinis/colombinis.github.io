# TODO — FASE 6 — Validación post-deploy

> **Sub-maestro de fase.** Tareas de la FASE 6 en estado distinto de DONE.
> Maestro global: `docs/tareas/TODO.md` (fuente única de verdad).
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).

## Estados

| Estado    | Significado                                    |
|-----------|------------------------------------------------|
| `TODO`    | Pendiente, sin empezar                         |
| `DOING`   | En progreso                                   |
| `BLOCKED` | Bloqueado (ver nota en el archivo de la tarea) |
| `DONE`    | Terminado y verificado                         |

## Tareas no-DONE

| ID      | Título                                             | Estado   | Archivo |
|---------|----------------------------------------------------|----------|---------|
| DEP-01  | Pendientes post-deploy → validación en producción  | BLOCKED  | `docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 1     | 0    | 0     | 0    | 1       |

> DEP-01 es la antigua AUD-06, reubicada. Su Depends-on son TODAS las
> fases anteriores y el merge a master. Se desbloquea cuando:
> 1. FASE 1-5 completas (incluida CON-04)
> 2. Merge `v0_alternativo_rebranding` → `master`
> 3. Validación en producción: Lighthouse >80, GA4 eventos, SSL, formulario contacto

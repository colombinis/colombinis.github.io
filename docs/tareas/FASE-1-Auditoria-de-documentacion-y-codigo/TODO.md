# TODO — FASE 1 — Auditoría de documentación y código

> **Sub-maestro de fase.** Tareas de la FASE 1 en estado distinto de DONE.
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
| AUD-08  | Chatbot: knowledge.json incompleto y sin validación | BLOCKED  | `docs/tareas/FASE-1-Auditoria-de-documentacion-y-codigo/AUD-08-chatbot-knowledge.md` |
| AUD-14  | Chatbot: slm-chatbot.js carga modelo 0.5B (~100MB) sin control de presupuesto de red | BLOCKED | `docs/tareas/FASE-1-Auditoria-de-documentacion-y-codigo/AUD-14-chatbot-network-budget.md` |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 2     | 0    | 0     | 0    | 2       |

> Ambas tareas están BLOCKED porque el chatbot (FASE 7) NO bloquea el deploy.
> Se desbloquean cuando se decida implementar el chatbot (CHAT-??).

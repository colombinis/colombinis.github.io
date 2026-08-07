# TODO — FASE 7 — Chatbot FAQ (DESEABLE)

> **Sub-maestro de fase.** Tareas de la FASE 7 en estado distinto de DONE.
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

| ID      | Título                                             | Estado | Archivo |
|---------|----------------------------------------------------|--------|---------|
| CHAT-01 | Verificar build del chatbot (script)                | TODO   | `docs/tareas/FASE-7-Chatbot-FAQ/CHAT-01-verify.sh` |
| CHAT-?? | Decisión: implementar ahora o backlog               | TODO   | (pendiente crear — ver nota) |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 2     | 2    | 0     | 0    | 0       |

> **Naturaleza:** ya existe trabajo preliminar (CHAT-04 DONE, CHAT-05 DONE
> — análisis y arquitectura). Esta fase decide si se implementa de inmediato
> o queda en backlog. NO bloquea el deploy: el sitio funciona sin chatbot.
>
> **Inventario de artefactos existentes:**
> - `src/components/ChatbotFAQ.astro`, `ChatbotSection.astro`
> - `public/chatbot/` (slm-chatbot.js, chrome-ai-chat.js, knowledge.json)
> - `docs/SLM-chatbot/` (README, demo HTML)
> - `src/data/preguntas-frecuentes-solucion.json`
>
> **Dependencias:** AUD-08 y AUD-14 (BLOCKED en FASE 1) se desbloquean al
> implementar el chatbot.

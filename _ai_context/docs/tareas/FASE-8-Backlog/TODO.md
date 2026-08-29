# TODO — FASE 8 — Backlog (consolidado: chatbot + futuros)

> **Sub-maestro consolidado.** Agrupa todas las tareas relacionadas con el chatbot que se implementará a futuro + tareas de backlog preexistentes.
> Incluye: AUD-08, AUD-14 (ex FASE-1), CHAT-01, CHAT-04, CHAT-05, CHAT-06 (ex FASE-7), FUT-01 (ex FASE-8 original).
> Maestro global: `_ai_context/docs/tareas/TODO.md` (fuente única de verdad).
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).

## Estados

| Estado    | Significado                                    |
|-----------|------------------------------------------------|
| `TODO`    | Pendiente, sin empezar                         |
| `DOING`   | En progreso                                   |
| `BLOCKED` | Bloqueado (ver nota en el archivo de la tarea) |
| `DONE`    | Terminado y verificado                         |

## Tareas no-DONE (chatbot + backlog)

| ID      | Título                                                         | Estado   | Archivo |
|---------|----------------------------------------------------------------|----------|---------|
| AUD-08  | Chatbot: knowledge.json incompleto y sin validación            | BLOCKED  | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-08-chatbot-knowledge.md` |
| AUD-14  | Chatbot: slm-chatbot.js carga modelo 0.5B sin control de presupuesto de red | BLOCKED  | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/AUD-14-chatbot-network-budget.md` |
| CHAT-01 | Verificar build del chatbot (script)                           | TODO     | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-01-verify.sh` |
| CHAT-04 | Análisis: Chrome AI Prompt API vs SLM-chatbot                  | DONE     | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-04-analysis-chrome-ai.md` |
| CHAT-05 | Arquitectura del chatbot (detalle técnico)                     | DONE     | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-05-arquitectura-chatbot.md` |
| CHAT-06 | Decisión: implementar ahora o backlog | DONE     | `_ai_context/docs/tareas/FASE-8-Backlog/chatbot-artifacts/CHAT-06-decision-implement.md` |
| FUT-01  | Evaluar agregar 4to servicio de IA a SACsi post-auditoría      | TODO     | `_ai_context/docs/tareas/archived/MAR-04-servicio-ia.md` |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 7     | 2    | 0     | 3    | 2       |

---

> **Contexto consolidado (2026-08-07):**

> El chatbot es una **mejora deseable post-deploy**, NO bloqueante para el lanzamiento del sitio. El sitio funciona completamente sin chatbot.

> **Precondición real:** DEP-01 completo (sitio en producción mergeado a master). El chatbot es la primera mejora post-deploy.

> **Artefactos existentes en working tree (sin commitear):**
> - `src/components/ChatbotFAQ.astro`, `ChatbotSection.astro`, `FaqSection.astro`
> - `public/chatbot/` (slm-chatbot.js, chrome-ai-chat.js, knowledge.json)
> - `_ai_context/docs/SLM-chatbot/` (README, demo HTML)
> - `src/data/preguntas-frecuentes-solucion.json`
> - `src/config/`

> **Dependencias cruzadas:**
> - AUD-08 y AUD-14 (BLOCKED) se desbloquean al decidir implementar el chatbot (CHAT-06)
> - CHAT-04 y CHAT-05 ya completan el análisis y arquitectura (DONE)
> - CHAT-01 es el script de verificación del build actual
> - CHAT-06 (nueva) formaliza la decisión: implementar ahora vs. backlog
> - FUT-01 (backlog original) evalúa 4to servicio IA cuando el sitio esté en producción y el contexto de negocio lo justifique

---

## Inventario de archivos detalle (chatbot-artifacts/)

```
chatbot-artifacts/
├── AUD-08-chatbot-knowledge.md      # Knowledge.json + fallback UI
├── AUD-14-chatbot-network-budget.md # Network budget + lazy-load por interacción
├── CHAT-01-verify.sh                # Script verificación build actual
├── CHAT-04-analysis-chrome-ai.md    # Análisis Chrome AI vs SLM (DONE)
├── CHAT-05-arquitectura-chatbot.md  # Arquitectura dual + opciones (DONE)
└── CHAT-06-decision-implement.md    # [NUEVO] Decisión implementar vs backlog
```
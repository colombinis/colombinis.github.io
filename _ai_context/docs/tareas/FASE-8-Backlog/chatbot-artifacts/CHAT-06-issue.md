# Chatbot FAQ (SLM on-device) — Backlog

> Issue derivada de **CHAT-06** (decisión: Opción B / **BACKLOG**). NO implementar en el ciclo de lanzamiento actual; reactivar según los *triggers* definidos abajo. No commiteada (borrador para que el dueño la apruebe/cree en GitHub).

## Descripción

Chatbot FAQ on-device (SLM + Chrome AI Prompt API) para el sitio SACsi.com.ar. Objetivo: filtrar consultas repetitivas y capturar leads 24/7, liberando tiempo humano de preventa/post-venta.

La decisión formal (CHAT-06) es **dejarlo en BACKLOG**: el sitio base debe validar conversión primero. El análisis (CHAT-04) y la arquitectura (CHAT-05) ya están completos y documentados; los artefactos de implementación viven en working tree (`feature/chatbot-faq`) sin commitear.

## Criterios de aceptación (cuando se retome)

- [ ] `knowledge.json` con ≥ 25 entradas validadas contra consultas **REALES** (post-30-días producción).
- [ ] Lighthouse mobile > 80 (la carga del modelo ~150MB no degrada Core Web Vitals — resuelve AUD-14).
- [ ] Feature-detection `LanguageModel` en `window` → Chrome AI primario; fallback a SLM local funcional.
- [ ] Fallback a WhatsApp funcional si el modelo no está disponible.
- [ ] Tracking `whatsapp_click` desde el chatbot (CHAT-07).
- [ ] Testing cross-browser (Chrome/Edge/Firefox/Safari) sin errores JS (CHAT-08).
- [ ] Build verificado por CHAT-01 (script).
- [ ] Network budget controlado (lazy-load por interacción, AUD-14).

## Dependencias

- **CHAT-04** (Análisis Chrome AI vs SLM) — **DONE** — base de decisión técnica.
- **CHAT-05** (Arquitectura del chatbot) — **DONE** — diseño dual documentado.
- **DEP-01** (sitio en producción, merge a master) — precondición real.
- **AUD-08** (knowledge.json incompleto) — BLOCKED, se desbloquea al reactivar.
- **AUD-14** (network budget) — BLOCKED, se desbloquea al reactivar.
- Artefactos en working tree: `src/components/ChatbotFAQ.astro`, `ChatbotSection.astro`, `FaqSection.astro`, `public/chatbot/` (slm-chatbot.js, chrome-ai-chat.js, knowledge.json), `_ai_context/docs/SLM-chatbot/`, `src/data/preguntas-frecuentes-solucion.json`.

## Triggers de reactivación

1. Volumen de consultas repetitivas > 20/semana (medido vía WhatsApp + formulario) durante 30 días consecutivos.
2. Un cliente PyME pide soporte automatizado / chatbot de FAQ como parte de un contrato o propuesta comercial.
3. Sitio en producción 30+ días con métricas de conversión estables y Chrome 138+ representando > 60% del tráfico (analytics).
4. Caso de portfolio de consultoría IA que justifique demostrar "PHP + IA aplicada" en vivo.

## Referencias

- `CHAT-06-decision-implement.md` (decisión formal, Opción B / BACKLOG)
- `CHAT-04-analysis-chrome-ai.md`
- `CHAT-05-arquitectura-chatbot.md`
- AUD-08, AUD-14

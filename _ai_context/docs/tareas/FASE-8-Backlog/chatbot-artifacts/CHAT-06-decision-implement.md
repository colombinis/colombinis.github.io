# CHAT-06 — Decisión: implementar chatbot ahora o backlog

## Contexto
**prd:** §1.1 — "Recuperar proyectos WP deteriorados" y "Escalar preventa sin sumar heads" (feature F, §3.1). El chatbot es soporte/post-venta que libera tiempo humano.

Este documento formaliza la decisión sobre si implementar el chatbot FAQ (SLM on-device) en el ciclo actual post-deploy o dejarlo en backlog para una iteración futura.

**Hechos establecidos (CHAT-04, CHAT-05 DONE):**
- Existe trabajo preliminar completo: análisis Chrome AI vs SLM (CHAT-04), arquitectura dual (CHAT-05)
- Artefactos en working tree sin commitear: componentes Astro, public/chatbot/, _ai_context/docs/SLM-chatbot/
- El chatbot NO bloquea el deploy: el sitio funciona sin él
- Precondición real: DEP-01 completo (sitio en producción, merge a master)

## Opciones

### Opción A: Implementar ahora (post-deploy inmediato)
**Ventajas:**
- Valor inmediato: filtra consultas repetitivas, captura leads 24/7
- Diferenciador técnico: "PHP + IA aplicada" demostrado en vivo en el sitio
- Feedback real de usuarios para iterar knowledge.json y modelo
- Portfolio piece concreto para consultoría IA

**Desventajas:**
- Riesgo técnico: modelo 150MB afecta Core Web Vitals en mobile (AUD-14)
- Maintenance burden: knowledge.json requiere curación continua
- Complejidad: dual chatbot (SLM + Chrome AI) aumenta surface de bugs
- Desvía foco de validar conversión del sitio base (CON-04, DEP-01)

**Esfuerzo estimado:** 2-3 sprints (knowledge.json completo, network budget, fallback UI, testing cross-browser, integración GA4 tracking)

### Opción B: Backlog (evaluar post-estabilización)
**Ventajas:**
- Foco 100% en validar que el sitio base convierte (CON-04, DEP-01)
- Tiempo para madurar Chrome AI Prompt API (adopción Chrome 138+)
- Knowledge.json puede enriquecerse con preguntas REALES de usuarios (formulario contacto, WhatsApp)
- Menor riesgo técnico en lanzamiento crítico

**Desventajas:**
- Pierde momentum del trabajo ya hecho (CHAT-04/05 DONE, artefactos listos)
- Sin señal de "IA aplicada" en el sitio live
- Knowledge.json se basa en supuestos, no en datos reales

**Trigger de re-evaluación:**
- Sitio en producción 30+ días con métricas de conversión estables
- Chrome 138+ > 60% de tráfico (analytics)
- Volumen de consultas repetitivas > 20/semana (WhatsApp + formulario)

## Decisión recomendada: **Opción B — Backlog**

**Rationale:**
1. **Riesgo/beneficio asimétrico**: el sitio base DEBE convertir primero. Un chatbot roto o lento daña más la percepción que no tenerlo.
2. **Datos > supuestos**: knowledge.json actual (7 entradas genéricas) alucina sin contexto real. 30 días de leads reales = knowledge.json basado en evidencia.
3. **Chrome AI madurando**: en 3-6 meses, Prompt API será viable como primario (streaming, sin download, shared cache). Implementar dual ahora = rehacer pronto.
4. **Portfolio alternativo**: el trabajo de arquitectura (CHAT-05) y análisis (CHAT-04) YA son portfolio pieces válidos para consultoría IA — documentados, con decision matrix, trade-offs claros.

## Plan si Opción B (Backlog)

1. **Commitear trabajo actual** en rama `feature/chatbot-faq` (no merge a master)
   - Preserva CHAT-04, CHAT-05, componentes, scripts
   - Tag: `chatbot-preliminary-2026-08-07`

2. **Crear issue GitHub** "Chatbot FAQ — backlog post-estabilización" con:
   - Link a CHAT-04, CHAT-05, AUD-08, AUD-14
   - Criterios de re-activación (triggers arriba)
   - Estimación actualizada tras 30 días producción

3. **Cerrar AUD-08 y AUD-14 como WONTFIX (backlog)**
   - Nota: "Desbloqueadas al reactivar chatbot (issue #XXX)"

4. **Actualizar TODO.md maestro (FASE 8)** con CHAT-06 = DONE (decisión tomada)

## Plan si Opción A (Implementar ahora) — solo si dueño insiste

1. Renombrar FASE-8-Backlog → FASE-7-Chatbot-FAQ (reactivar fase)
2. Secuenciar tareas: CHAT-01 (verify) → AUD-08 (knowledge) → AUD-14 (network) → CHAT-07 (integración tracking) → CHAT-08 (testing cross-browser) → CHAT-09 (deploy)
3. Asignar 2-3 sprints dedicados post-DEP-01
4. Definir Definition of Done: Lighthouse mobile >80, knowledge.json ≥25 entradas validadas, fallback WhatsApp funcional, tracking whatsapp_click desde chatbot

---

## Estado
**BACKLOG** (decisión tomada 2026-08-28, pendiente aprobación del dueño) — Opción B: no implementar en el ciclo de lanzamiento actual.

## Notas
- Esta decisión NO afecta el camino crítico a producción (FASE 1-6)
- CHAT-04 y CHAT-05 quedan como DONE (artefactos de análisis/arquitectura válidos por sí mismos)
- El branch `feature/chatbot-faq` sirve de base si se reactiva

---

## Decisión

**Estado: BACKLOG** — El chatbot FAQ (SLM on-device) NO se implementa en el ciclo de lanzamiento actual. La decisión queda formalizada como **Opción B (backlog / evaluar post-estabilización)**, pendiente de aprobación del dueño.

**Justificación:**
1. **No bloquea el lanzamiento**: el sitio funciona completamente sin chatbot; el camino crítico a producción (FASE 1-6, DEP-01) es independiente de esta feature.
2. **Gap de tiempo/recursos**: en el sprint de lanzamiento el foco debe estar en validar que el sitio base convierte (CON-04, DEP-01). Destinar 2-3 sprints ahora desvía esfuerzo del objetivo primario.
3. **Arquitectura ya documentada para futura implementación**: CHAT-04 (análisis Chrome AI vs SLM) y CHAT-05 (arquitectura dual + opciones) están DONE. La base técnica (Web Component `<sacsi-chat>`, feature-detection, knowledge.json, scripts de verificación) ya existe en working tree, por lo que retomar la implementación tiene costo de arranque bajo.
4. **Datos > supuestos**: el knowledge.json actual (7 entradas genéricas) se basa en supuestos; post-lanzamiento, las consultas reales (WhatsApp + formulario) alimentarán un knowledge.json basado en evidencia.
5. **Maduración de Chrome AI**: en 3-6 meses la Prompt API (Gemini Nano, streaming, shared cache, sin descarga por sitio) será viable como primario; implementar dual hoy implicaría rehacer pronto.

**Triggers de reactivación (cualquiera de los siguientes):**
- **Post-lanzamiento, si el volumen de consultas repetitivas supera las 20/semana** (medido vía WhatsApp + formulario de contacto) durante 30 días consecutivos.
- **Si un cliente PyME pide soporte automatizado / chatbot de FAQ** como parte de un contrato o propuesta comercial.
- **Sitio en producción 30+ días con métricas de conversión estables** y Chrome 138+ representando > 60% del tráfico (analytics).
- **Si surge un caso de portfolio concreto** de consultoría IA que justifique demostrar "PHP + IA aplicada" en vivo.

**Acciones asociadas (ver CHAT-06-issue.md):**
- Commitear el trabajo preliminar en `feature/chatbot-faq` (tag `chatbot-preliminary-2026-08-07`) sin merge a master.
- Crear issue GitHub "Chatbot FAQ (SLM on-device) — Backlog" con criterios de aceptación y dependencias (CHAT-04/CHAT-05 DONE).
- AUD-08 y AUD-14 quedan BLOCKED hasta reactivar (referenciadas desde la issue).

**Fecha de decisión:** 2026-08-28 (pendiente aprobación del dueño).
# PRD — SACsi (sitio público + backend comercial)

> **Estado:** Propuesta. Pensalo como borrador vivo; actualizalo según tu feedback.
> **Fuentes analizadas:** `DESIGN.md`, `ARQUITECTURA.md`, `CONTENIDO.md`, `HISTORIAL-REBRANDING.md`, `SYSTEM_MAP.yaml`, specs `MAR-*`, `NOR-01`, `AUT-01`, `FEATURE-*`, `FASE-*`, `FASE-8-Backlog`, `archived/UJ-*`.

---

## 1) Negocio: objetivos y problemas

### 1.1 Objetivos del negocio

| Objetivo | Por qué importa | Métrica |
|---|---|---|
| Reducir el tiempo administrativo del cliente | Es el diferenciador más concreto y medible | ≥65% tiempo liberado |
| Convertir visitas en consultas comerciales | El sitio es el primer contacto con PyMEs/emprendedores | Tasa consultas/visita, clicks WhatsApp/email |
| Asegurar trazabilidad del trabajo vendido | Permite validar rentabilidad por servicio y predecir recursos | Márgenes por servicio, tasa de cierre |
| Recuperar proyectos WP deteriorados | Gap explotable (Ana persona) y puente a proyectos nuevos | Tiempo de rescate, retención post-rescate |
| Escalar preventa sin sumar heads | Post-merge, el funnel debe auto-calificar leads | % leads auto-calificados, tiempo a primer contacto |
| Posicionar como proveedor confiable Rosario/Argentina | Necesidad percibida por target | Lighthouse, SEO, señales de confianza |

### 1.2 Problemas a resolver hoy

- **Falta visibilidad única** del estado del proyecto: las tareas están fragmentadas en carpetas y el documento maestro `TODO.md` no existe en el árbol actual.
- **No hay documento de negocio** que explique el “por qué” de cada feature ni cómo se relacionan entre sí.
- **Gaps funcionales abiertos:** catálogo incompleto (CAT-03/04), tracking GTM parcial (CON-04), validación post-deploy bloqueada (DEP-01), backlog chatbot sin decisión (CHAT-06).
- **Forma de pago + entrega no integrada:** el funnel es manual; AUT-01 define la automatización, pero sigue pendiente.
- **Experiencia mixta:** sitio público Astro + herramienta standalone `flujo-operativo-trabajo.html` (datan JSON, no del build).

---

## 2) Usuarios y journeys

### 2.1 Personas

| Persona | Rol | Tech | Canal preferido | Objetivo |
|---|---|---|---|---|
| Carlos | Dueño PyME ferretería, Rosario | Baja | WhatsApp | Tienda online simple, sin fricción |
| Ana | CMO e-commerce WP roto, CABA | Media | Email/WhatsApp | Rescate rápido sin perder SEO/ventas |
| Reclutador tech | Evaluador competencias WP | Alta | LinkedIn/GitHub | Evidencias concretas de stack y resultados |

> Referencia: `archived/UJ-01-definir-personas.md`

### 2.2 Flujos objetivo

```
Carlos: landing → WhatsApp → diagnóstico → propuesta cerrada → pago → entrega
Ana:    landing → caso rescate → email/WhatsApp → propuesta → pago → rescate
Reclutador: GitHub README → sacsi.com.ar → servicios → casos WP → GitHub/LinkedIn
Backoffice: tablero rentabilidad + catálogo trabajos → cierre comercial
```

---

## 3) Features agrupadas

> No se repite el detalle de cada `TODO.md`; es un resumen ejecutivo con criterio.

### A) Núcleo del sitio (F0-F5 completas)

- **Marca/UX:** tokens `DESIGN.md` + `global.css`, mobile-first, identidad alineada.
- **Contenido:** homepage, servicios (3), sobre-nosotros, contacto, casos de éxito (8), FAQ, métricas.
- **SEO/analítica:** sitemap automático, metadatos por página, GTM `GTM-T7PWJ99` instalado.

### B) Catálogo de trabajos (FEATURE-2) — 🟡 Parcial

- Ruta `/catalogo` y filtros jerárquicos: **DONE**.
- Grid de tarjetas + navegación integrada: **TODO** (`CAT-03`, `CAT-04`).
- Permite la experiencia e-commerce estándar que pide la persona Carlos.

### C) Flujos de negocio (FEATURE-1 + FASE 8 Backlog) — 🟢 Base, 🔴 Escala

- **Datos normalizados** (`NOR-01`): servicios → categorías → trabajos, fuentes JSON únicas.
- **Herramienta de rentabilidad** standalone: DONE (10 trabajos, cálculo márgenes).
- **Backlog comercial:** chatbot knowledge/arquitectura documentada, pero **sin decisión** de implementar (`CHAT-06` TODO).
- **Automatización n8n** (`AUT-01`): workflow y DB diseñados; integración con checkout pendiente.

### D) Tracking y conversión (FASE-4 / FASE-6) — 🟢 FASE-4 código / 🟡 DEP-01

- Evento `form_submit`: **DONE** — dispara en envío exitoso del formulario (`contacto.astro`).
- Evento `whatsapp_click`: **DONE (código, verificado en build)** — listener global en `Layout.astro`, presente en las 36 páginas (`CON-04`). Falta confirmar recepción en GA4 real → `DEP-01`.
- Validación post-deploy (`DEP-01`): **BLOCKED** en espera de merge `v0_alternativo_rebranding` → `master` (decisión owner). Dependencias técnicas cumplidas (CON-04 DONE, FASE 1-5 completas). Hallazgo corregido: `deploy.yml` ahora usa Node 22 (Astro v7 exige ≥22.12).

### E) Calidad y pruebas (FEATURE-3) — 🟢 Unit, 🔴 E2E journeys

- Unit tests de flujos: 2/2 DONE (19+9 asserts).
- E2E journeys automatizados: 0/4 (tests por escribir).
- Estructura `tests/` definida, sin código E2E aún.

### F) Backlog diferenciador (FASE-8) — 🟡 Documentado, no ejecutado

- Chatbot dual: análisis y arquitectura terminados; `knowledge.json`, red y presupuesto diagnosticados.
- 4to servicio IA (`FUT-01`): postergado a post-auditoría; no afecta lanzamiento actual.

---

## 4) Métricas de éxito

| Métrica | Target | Cómo medir |
|---|---|---|
| Performance/UX | Lighthouse >80 (performance, a11y, SEO, best practices) | `DEP-01` |
| Conversión | % de visitors que llegan a WhatsApp/email por sesión | GA4 `GTM-T7PWJ99` eventos (`CON-04`) |
| Rentabilidad por servicio | Márgenes OK/NO RENTABLE por trabajo | `FEATURE-1` tablas + JSON |
| Disponibilidad catálogo | `/catalogo` funcional con filtros y tarjetas | `CAT-04` |
| Cobertura funcional | % behaviors cubiertos por specs DONE | `index-system-map.py` |
| Estabilidad | 0 errores JS en journeys principales | E2E `FEATURE-3` |
| Tiempo comercial | Desde consulta a propuesta enviada | Objetivo interno |

---

## 5) Roadmap sugerido (qué terminar antes de escalar)

| Prioridad | Bloque | Depende de | Acción |
|---|---|---|---|
| P0 | Cerrar FASE-4 y FASE-6 | `CON-04`, merge a master | Tracking completo + validación producción |
| P1 | Terminar catálogo | `CAT-03`, `CAT-04` | Experiencia e-commerce lista |
| P2 | Medir antes de automatizar | `CON-04`, `DEP-01` | Datos reales de conversión para definir reglas n8n |
| P3 | Decidir chatbot | `CHAT-06` | Implementar o mantener backlog |
| P4 | E2E journeys | `FEATURE-3` | Bloquear regresiones en futuras features |

> **Estado P0 (2026-08-26):** FASE-4 cerrada a nivel código — `CON-04` DONE (eventos `whatsapp_click` global en `Layout.astro` + `form_submit` en contacto, ambos verificados en build de 36 páginas). `DEP-01` desbloqueada en dependencias pero **BLOCKED por merge `v0_alternativo_rebranding` → `master`** (pendiente autorización owner). CI corregido: `deploy.yml` usa Node 22 (Astro v7 exige ≥22.12). Plan de merge: `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/PLAN-MERGE-v0-a-master.md`.

---

## 6) Alcance NO incluido (para no perder foco)

- No incluye nuevos servicios ni expansión geográfica en este ciclo.
- No incluye login/autenticación de usuarios.
- No incluye backend de pagos end-to-end; se diseña primero el funnel y medición.

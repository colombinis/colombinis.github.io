# PRD — SACsi (sitio público + backend comercial)

> **Estado:** Propuesta. Pensalo como borrador vivo; actualizalo según tu feedback.
> **Fuentes analizadas:** `DESIGN.md`, `ARQUITECTURA.md`, `CONTENIDO.md`, `HISTORIAL-REBRANDING.md`, `SYSTEM_MAP.yaml`, specs `MAR-*`, `NOR-01`, `AUT-01`, `FEATURE-*`, `FASE-*`, `FASE-8-Backlog`, `archived/UJ-*`.

---

## 1) Negocio: objetivos

### 1.1 Objetivos del negocio

| Objetivo | Por qué importa | Métrica |
|---|---|---|
| Reducir el tiempo administrativo del cliente | Es el diferenciador más concreto y medible | ≥65% tiempo liberado |
| Convertir visitas en consultas comerciales | El sitio es el primer contacto con PyMEs/emprendedores | Tasa consultas/visita, clicks formulario/email |
| Asegurar trazabilidad de la solución vendida | Permite validar rentabilidad por servicio y predecir recursos | Márgenes por servicio, tasa de cierre |
| Escalar preventa sin sumar heads | Post-merge, el funnel debe auto-calificar leads | % leads auto-calificados, tiempo a primer contacto |
| Posicionar como proveedor confiable Rosario/Argentina | Necesidad percibida por target | Lighthouse, SEO, señales de confianza |

---

## 2) Usuarios y journeys

### 2.1 Personas

| Persona | Rol | Tech | Canal preferido | Objetivo |
|---|---|---|---|---|
| Carlos | Dueño PyME ferretería, Rosario | Baja | Formulario de contacto | Tienda online simple, sin fricción |
| Ana | CMO e-commerce WP roto, CABA | Media | Email/formulario | Rescate rápido sin perder SEO/ventas |
| Reclutador tech | Evaluador competencias WP | Alta | LinkedIn/GitHub | Evidencias concretas de stack y resultados |

> Referencia: `archived/UJ-01-definir-personas.md`

### 2.2 Flujos objetivo

```
Carlos: landing → formulario contacto → diagnóstico → propuesta cerrada → pago → entrega
Ana:    landing → caso rescate → formulario contacto → propuesta → pago → rescate
Reclutador: GitHub README → sacsi.com.ar → servicios → casos WP → GitHub/LinkedIn
Backoffice: tablero rentabilidad + catálogo soluciones → cierre comercial
```

---

## 3) Features agrupadas

> No se repite el detalle de cada `TODO.md`; es un resumen ejecutivo con criterio.

### A) Núcleo del sitio (F0-F5 completas)
- **Marca/UX:** tokens `DESIGN.md` + `global.css`, mobile-first, identidad alineada.
- **Contenido:** homepage, servicios (3), sobre-nosotros, contacto, casos de éxito (8), FAQ, métricas.
- **SEO/analítica:** sitemap automático, metadatos por página, GTM `GTM-T7PWJ99` instalado.

### B) Catálogo de soluciones (FEATURE-2) — ✅ DONE
- Ruta `/catalogo` y filtros jerárquicos: **DONE**.
- Grid de tarjetas + navegación integrada: **DONE** (`CAT-03` DONE, `CAT-04` DONE — build exit 0).
- Permite la experiencia e-commerce estándar que pide la persona Carlos.

### C) Flujos de negocio (FEATURE-1) — ✅ DONE
- **Datos normalizados** (`NOR-01`): servicios → categorías → soluciones, fuentes JSON únicas.
- **Herramienta de rentabilidad** standalone: DONE (10 soluciones, cálculo márgenes).

### D) Tracking y conversión (FASE-4 / FASE-6) — 🟢 FASE-4 código / 🟡 DEP-01
- Evento `form_submit`: **DONE** — dispara en envío exitoso del formulario (`contacto.astro`).
- Evento `whatsapp_click`: **DONE (código, verificado en build)** — listener global en `Layout.astro`, presente en las 36 páginas (`CON-04`). Falta confirmar recepción en GA4 real → `DEP-01`.
- Validación post-deploy (`DEP-01`): **BLOCKED** en espera de merge `v0_alternativo_rebranding` → `master` (decisión owner). Dependencias técnicas cumplidas (CON-04 DONE, FASE 1-5 completas). Hallazgo corregido: `deploy.yml` ahora usa Node 22 (Astro v7 exige ≥22.12).

### E) Calidad y pruebas (FEATURE-3) — 🟢 Unit, 🔴 E2E journeys
- Unit tests de flujos: 2/2 DONE (19+9 asserts).
- E2E journeys automatizados: 0/4 (tests por escribir).
- Estructura `tests/` definida, sin código E2E aún.

### F) Backlog (post-lanzamiento)
> Funcionalidades documentadas pero priorizables después del deploy inicial. No bloquean el release.

- **Automatización n8n** (`AUT-01`): workflow y DB diseñados; integración con checkout pendiente. Queda para una segunda etapa post-deploy, cuando se tengan datos reales de funnel para calibrar umbrales.
- **Chatbot dual:** análisis y arquitectura terminados; `knowledge.json`, red y presupuesto diagnosticados (`CHAT-06` = backlog formal).
- **4to servicio IA** (`FUT-01`): postergado a post-auditoría; no afecta lanzamiento actual.

---

### 3.1 Matriz feature → objetivo de negocio

> Cada feature agrupada en §3 mapea a uno o más objetivos de §1.1. Esto es el "por qué" de cada feature.

| Feature (§3) | Objetivos de negocio (§1.1) que sirve |
|---|---|
| **A) Núcleo del sitio** | Posicionar como proveedor confiable (Lighthouse/SEO) · Convertir visitas en consultas (contenido, FAQ, contacto) · Reducir tiempo administrativo (base del funnel) |
| **B) Catálogo de soluciones** | Convertir visitas en consultas (experiencia e-commerce estándar que pide la persona Carlos) · Escalar preventa sin sumar heads (catálogo auto-califica el interés) |
| **C) Flujos de negocio** | Asegurar trazabilidad de la solución vendida (herramienta de rentabilidad) |
| **D) Tracking y conversión** | Convertir visitas en consultas (medir tasa consulta/visita, clicks formulario) · Escalar preventa (auto-calificar leads vía eventos GA4) |
| **E) Calidad y pruebas** | Posicionar como proveedor confiable (Lighthouse >80, sin errores JS) · Reducir tiempo administrativo (menos regresiones = menos trabajo manual de soporte) |
| **F) Backlog** | Escalar preventa (automatización n8n, chatbot, 4to servicio IA) |

### 3.2 Interrelaciones entre features

> Cierra el gap "cómo se relacionan entre sí".

- **A es la base de todo**: todas las demás features se montan sobre el núcleo Astro (tokens, `Layout.astro`, `data-utils.ts`, GTM). Sin A, B–F no se despliegan.
- **B depende de C**: el catálogo consume los datos normalizados de `NOR-01` (C) vía `data-utils.ts`; B es la cara pública de esos datos.
- **C alimenta D**: la normalización de datos (C) habilita el tracking de conversión (D) porque cada solución/categoría es identificable y trazable en GA4.
- **D valida A, B y C**: los eventos GA4 (`CON-04`) miden si el núcleo, el catálogo y los flujos efectivamente convierten — cierra el loop de negocio.
- **E protege A–D**: los tests E2E previenen regresiones en el núcleo y el catálogo tras cada cambio.
- **F es opcional y post-lanzamiento**: n8n, chatbot y 4to servicio extienden C y la preventa, pero no bloquean el release.

### 3.3 Convención de trazabilidad (gate `prd:` en specs)

> Para que el PRD sea el documento de negocio canónico, **toda spec nueva o modificada debe citar su objetivo de negocio** con un bloque `prd:` en su `## Contexto`. Hoy solo 1 de ~30 specs (`CON-04`) lo hace.

Formato obligatorio (ejemplo para `CAT-03`):

```markdown
## Contexto
**prd:** §1.1 — "Convertir visitas en consultas comerciales" (feature B, §3.1)
**por qué:** el grid de tarjetas es la vitrina que convierte la visita de la persona Carlos en click a detalle/solución.
```

Backfill acordado (solo specs críticas del roadmap activo, no las 29 de una): `CAT-03`, `CAT-04`, `CHAT-06`, `DEP-01`, `AUT-01`, `E2E-01..04`. El resto se actualiza en mantenimiento ordinario.


## 4) Métricas de éxito

| Métrica | Target | Cómo medir |
|---|---|---|
| Performance/UX | Lighthouse >80 (performance, a11y, SEO, best practices) | `DEP-01` |
| Conversión | % de visitors que llegan a formulario/email por sesión | GA4 `GTM-T7PWJ99` eventos (`CON-04`) |
| Rentabilidad por servicio | Márgenes OK/NO RENTABLE por solución | `/padmin/flujo-operativo/` (Astro, Cloudflare auth) |
| Disponibilidad catálogo | `/catalogo` funcional con filtros y tarjetas | `CAT-04` |
| Cobertura funcional | % behaviors cubiertos por specs DONE | `index-system-map.py` |
| Estabilidad | 0 errores JS en journeys principales | E2E `FEATURE-3` |
| Tiempo comercial | Desde consulta a propuesta enviada | Objetivo interno |

---

## 5) Roadmap sugerido (pendientes para deploy)

| Prioridad | Bloque | Depende de | Acción |
|---|---|---|---|
| P0 | Validación post-deploy | `CON-04`, merge a master | Confirmar recepción GA4 real, Lighthouse >80, SSL, formulario contacto (`DEP-01`) |
| P1 | E2E journeys | `FEATURE-3` | Bloquear regresiones en futuras features |

> **Estado P0 (2026-08-26):** FASE-4 cerrada a nivel código — `CON-04` DONE (eventos `whatsapp_click` global en `Layout.astro` + `form_submit` en contacto, ambos verificados en build de 36 páginas). `DEP-01` desbloqueada en dependencias pero **BLOCKED por merge `v0_alternativo_rebranding` → `master`** (pendiente autorización owner). CI corregido: `deploy.yml` usa Node 22 (Astro v7 exige ≥22.12). Plan de merge: `_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/PLAN-MERGE-v0-a-master.md`.

---

## 6) Alcance NO incluido (para no perder foco)

- No incluye nuevos servicios ni expansión geográfica en este ciclo.
- No incluye login/autenticación de usuarios.
- No incluye backend de pagos end-to-end; se diseña primero el funnel y medición.
- No incluye integración con n8n (queda para segunda etapa post-deploy).

---

## 7) Tareas post-deploy

> **Propósito de esta sección:** recolección viva de todo lo que queda por hacer **después** de pushear `master` a producción (GitHub Pages). Se va poblando durante la sesión y al final se consolidará en el plan de trabajo post-deploy.
>
> Criterio: cada ítem debe ser accionable y, cuando sea posible, tener un verify script o un responsable (owner). Lo que dependa de sesión autenticada del owner (GTM/GA4/Chrome) se marca explícitamente.
>
> **Criterio de release (decisión owner, 2026-08-28):** NO se hará push de `master` a producción (GitHub Pages) hasta que **TODAS** las tareas del PRD estén cerradas. El merge local v0→master (commit `214ca49`) ya está hecho, pero el push dispara el deploy y se reserva para el cierre total. Esto anula la recomendación de los sub-agentes de P3/P4 de pushear pronto.

### 7.1 Consolidado

**Estado global del proyecto (maestro SSOT, `scripts/generate-todos.py`, última generación: 2026-08-29 18:11 UTC):** 22 tareas · TODO=6 · DOING=0 · DONE=13 · BLOCKED=3 · **59% DONE** · 9 pendientes.

### 7.2 Notas / pendientes sueltas

- **Release bloqueado por criterio owner:** NO push a `origin` hasta cerrar TODAS las tareas del PRD (ver criterio en 7.0). El merge local v0→master (commit `214ca49`, `--no-ff`) ya está hecho; queda pendiente el push (non-fast-forward → `--force-with-lease`, elimina el `Jenkinsfile` legacy de `origin/master`). **El push es el último paso, no el primero.**
- DEP-01 (validación producción) queda bloqueada hasta el push real (non-fast-forward → `--force-with-lease`).
- El plan de trabajo post-deploy (DEP-01 automático + manuales owner) vive en `FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` y `PLAN-MERGE-v0-a-master.md`.
- **Cloudflare Basic Auth en `/padmin/*`** (ref: privatizar-backoffice.md, project.md): lo configura el Owner fuera del repo (no es un cambio de código). Mientras tanto, las páginas `/padmin/*` no se linkean desde el sitio público (no están en Header/Footer); queda solo la ruta accesible si alguien conoce la URL.
- **`rentabilidad.ts`** (`src/lib/rentabilidad.ts` + `rentabilidad.test.ts`): módulo extraído con tests. Base reutilizable para las páginas `/padmin/`. Validar que los tests corran (pre-commit / build).
- **Scope interno vs. público:** las páginas `/padmin/*` son para el equipo comercial/SACsi, no para clientes. Si en el futuro se quiere contenido "interno" para clientes (ej: shared client client workspace), eso es una capacidad aparte con su propio scope — decisión de negocio, no técnica.
- **Backend ausente en el release current:** todo el sitio actual es frontend. Para un formulario real de contacto (no mailto), se necesitaría un backend real (Node + cloud escuchando, o SaaS de email, o Copilot en el repo). Scope separado, no parte del release actual.
- **Integración n8n (AUT-01):** workflow y DB diseñados, docker-compose listo. Queda para una segunda etapa post-deploy, cuando se tengan datos reales de funnel (tasa abandono/step, tiempo submit) para calibrar umbrales. No se conecta MP ni se fijan umbrales a ciegas.

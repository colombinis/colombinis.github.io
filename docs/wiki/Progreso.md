# Progreso y Seguimiento

> **Documento de tracking.** Registra los hallazgos del análisis del rebranding y el listado de tareas con estado para monitoreo. Actualizar este archivo cada vez que una tarea cambie de estado.

- **Última actualización:** 2026-08-03
- **Rama de trabajo:** `v0_alternativo_rebranding`
- **Fuente de verdad:** esta wiki (ver [Home](Home))

## Leyenda de estados

| Estado | Significado |
|--------|-------------|
| `estado:TODO` | Pendiente, sin empezar. |
| `estado:DOING` | En progreso. |
| `estado:BLOCKED` | Bloqueado (ver nota). |
| `estado:DONE` | Terminado y verificado. |

---

## 1. Hallazgos del análisis

Descubrimientos de la revisión de `docs/wiki/`, `DESIGN.md`, `AGENTS.md`, `README.md` y el código real (`src/`).

| # | Hallazgo | Severidad | Estado de resolución |
|---|----------|-----------|----------------------|
| H1 | La documentación decía "HTML vanilla, sin frameworks", pero el sitio **ya fue migrado a Astro v7**. | Alta | `estado:DONE` — docs reescritos para declarar Astro como stack oficial. |
| H2 | Rama de trabajo documentada (`rebranding_20260610`) no coincidía con la real (`v0_alternativo_rebranding`). | Media | `estado:DONE` — corregida en `AGENTS.md` y wiki. |
| H3 | `DESIGN.md` estaba duplicado (raíz + `docs/wiki/`), byte-idéntico (mismo md5). Doble fuente de verdad. | Media | `estado:DONE` — eliminado el de la wiki; `/DESIGN.md` raíz es canónico. |
| H4 | `QA-Checklist` marcaba todo ✅, pero validaba el HTML estático, no las páginas `.astro`. | Alta | `estado:TODO` — re-ejecutar QA sobre Astro (ver T1). |
| H5 | Páginas duplicadas: `index.html`/`contacto.html`/`sobre-nosotros.html` (raíz) conviven con sus equivalentes `.astro`. | Media | `estado:TODO` — limpieza de legacy (ver T8). |
| H6 | `dist/` (output de build) está commiteado en git. | Media | `estado:TODO` — quitar de git + `.gitignore` (ver T9). |
| H7 | `inteligencia-artificial/`, `.html` legacy y `theme/mobile1/` sin migrar. | Media | `estado:TODO` — migrar o eliminar (ver T8). |
| H8 | **Token drift:** `global.css` define `--tertiary-dark:#0066CC` y `--whatsapp-dark:#128C7E`, ausentes en `DESIGN.md` (que documenta `#0A7CFF` / `#1DA851` como hover). | Alta | `estado:TODO` — reconciliar tokens (ver T6). |
| H9 | El snippet **GTM/GA4** en `Layout.astro` es un placeholder vacío (sin ID real). | Media | `estado:TODO` — restaurar analytics (ver T5). |
| H10 | No existe GitHub Action para el **deploy de Astro** a GitHub Pages. | Alta | `estado:TODO` — definir pipeline de deploy (ver T10). |

---

## 2. Listado de tareas

Ordenadas por fase del [Roadmap](Roadmap). Cada tarea tiene un `estado:` para seguimiento.

### Documentación (Fase 0-1)

- [x] **T0 — Consolidar y corregir la wiki.** `estado:DONE`
  - Reorganización 8 → 5 docs, corrección de inconsistencias H1-H3, `README.md` y `AGENTS.md` alineados.

### Fase 2 — Construcción

- [ ] **T1 — Re-ejecutar QA sobre las páginas `.astro`.** `estado:TODO` · Ref: H4
  - Validar homepage y páginas de servicio en Astro (no el HTML viejo).
- [ ] **T2 — Verificar componentes y responsive.** `estado:TODO`
  - Revisar `Header`, `Footer`, `ServiceCard` y breakpoints reales en el build de Astro.

### Fase 3 — Conversión

- [ ] **T3 — Validar formulario de contacto end-to-end.** `estado:TODO`
  - Probar `contacto.astro` (envío, validación, feedback).
- [ ] **T4 — Verificar FAQ accesible y CTAs de WhatsApp.** `estado:TODO`
  - Accesibilidad del acordeón FAQ y links de WhatsApp funcionando.

### Fase 4 — Crecimiento (SEO / Analytics)

- [ ] **T5 — Restaurar analytics (GTM/GA4).** `estado:TODO` · Ref: H9
  - Reemplazar el placeholder de `Layout.astro` por el ID real y verificar eventos.
- [ ] **T6 — Reconciliar token drift `global.css` ↔ `DESIGN.md`.** `estado:TODO` · Ref: H8
  - Decidir valores canónicos de `--tertiary-dark`, `--whatsapp-dark`, `--rounded-*` y unificar.
- [ ] **T7 — Metadatos SEO por página.** `estado:TODO`
  - Open Graph, Twitter Card, JSON-LD `LocalBusiness`; alinear `sitemap.xml` a rutas Astro.

### Fase 5 — Cierre (Limpieza / Deploy)

- [ ] **T8 — Limpieza de legacy.** `estado:TODO` · Ref: H5, H7
  - Eliminar `.html` de raíz, `theme/mobile1/`, `inteligencia-artificial/` (o migrarla).
- [ ] **T9 — Sacar `dist/` del control de versiones.** `estado:TODO` · Ref: H6
  - Quitar `dist/` de git y agregar `.gitignore`.
- [ ] **T10 — Definir deploy de Astro a GitHub Pages.** `estado:TODO` · Ref: H10
  - Crear GitHub Action de build + deploy.
- [ ] **T11 — QA final + Lighthouse > 80 + deploy productivo.** `estado:TODO`

---

## 3. Resumen de estado

| Fase | Estado | Tareas abiertas |
|------|--------|-----------------|
| F0 — Fundación | `estado:DONE` | — |
| F1 — Estructura | `estado:DONE` | — |
| F2 — Construcción | `estado:DOING` | T1, T2 |
| F3 — Conversión | `estado:DOING` | T3, T4 |
| F4 — Crecimiento | `estado:TODO` | T5, T6, T7 |
| F5 — Cierre | `estado:TODO` | T8, T9, T10, T11 |

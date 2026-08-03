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
| H4 | `QA-Checklist` marcaba todo ✅, pero validaba el HTML estático, no las páginas `.astro`. | Alta | `estado:DONE` — QA re-ejecutado en navegador sobre el build de Astro (ver T1-T4). |
| H5 | Páginas duplicadas: `index.html`/`contacto.html`/`sobre-nosotros.html` (raíz) conviven con sus equivalentes `.astro`. | Media | `estado:DONE` — legacy eliminado (ver T8). |
| H6 | `dist/` (output de build) está commiteado en git. | Media | `estado:DONE` — quitado de git + `.gitignore` agregado (ver T9). |
| H7 | `inteligencia-artificial/`, `.html` legacy y `theme/mobile1/` sin migrar. | Media | `estado:DONE` — eliminados (ver T8). |
| H8 | **Token drift:** `global.css` define `--tertiary-dark:#0066CC` y `--whatsapp-dark:#128C7E`, ausentes en `DESIGN.md` (que documenta `#0A7CFF` / `#1DA851` como hover). | Alta | `estado:DONE` — tokens reconciliados con `DESIGN.md` (ver T6). |
| H9 | El snippet **GTM/GA4** en `Layout.astro` es un placeholder vacío (sin ID real). | Media | `estado:DONE` — GTM `GTM-T7PWJ99` centralizado en el Layout (ver T5). |
| H10 | No existe GitHub Action para el **deploy de Astro** a GitHub Pages. | Alta | `estado:DONE` — workflow `deploy.yml` creado (ver T10). |

### Hallazgos adicionales (descubiertos durante la implementación)

| # | Hallazgo | Severidad | Estado de resolución |
|---|----------|-----------|----------------------|
| H11 | **Páginas sin estilos.** Los `<style>` de Astro son *scoped* por archivo; solo `index.astro` y `contacto.astro` los tenían, así que las 7 páginas restantes (`servicios/*`, `casos-exito/*`, `sobre-nosotros`) renderizaban **sin CSS**. | Crítica | `estado:DONE` — el design system se promovió a `global.css` (importado por el Layout en todas las páginas). |
| H12 | **Links rotos.** 24 enlaces internos apuntaban a URLs legacy `.html` (`/contacto.html`) que Astro no genera (usa formato directorio `/contacto/`). | Alta | `estado:DONE` — todos migrados a formato directorio. |
| H13 | **FAQ no funcional.** El `<script>` del acordeón estaba anidado **dentro** del bloque `<style>`, por lo que se parseaba como CSS y nunca se ejecutaba. | Alta | `estado:DONE` — convertido a `<script>` real y verificado en navegador. |
| H14 | **Hamburger no funcional.** `Header.astro` usaba estado server-side inerte; el toggle solo existía (duplicado) en `contacto.astro`. | Alta | `estado:DONE` — toggle client-side global en `Header.astro`. |
| H15 | **Nav rota.** El menú enlazaba a `/servicios/` que no tenía página índice. | Media | `estado:DONE` — creada `src/pages/servicios/index.astro`. |
| H16 | **Assets fuera de `public/`.** `logo-autor.png` y `favicon.ico` estaban en la raíz, no en `public/`; en el build de Astro sus referencias `/...` darían 404. | Alta | `estado:DONE` — movidos a `public/`. |
| H17 | **Texto corrupto.** Caracteres CJK incrustados en `software-a-medida.astro` ("痛os", "lógica核心"). | Baja | `estado:DONE` — corregido a español. |
| H18 | `CaseStudyLayout.astro` era código muerto (sin uso). | Baja | `estado:DONE` — eliminado. |

---

## 2. Listado de tareas

Ordenadas por fase del [Roadmap](Roadmap). Cada tarea tiene un `estado:` para seguimiento.

### Documentación (Fase 0-1)

- [x] **T0 — Consolidar y corregir la wiki.** `estado:DONE`
  - Reorganización 8 → 5 docs, corrección de inconsistencias H1-H3, `README.md` y `AGENTS.md` alineados.

### Fase 2 — Construcción

- [x] **T1 — Re-ejecutar QA sobre las páginas `.astro`.** `estado:DONE` · Ref: H4
  - Homepage y páginas de servicio verificadas en navegador; se detectó y corrigió H11 (páginas sin estilos).
- [x] **T2 — Verificar componentes y responsive.** `estado:DONE`
  - `Header` (hamburger móvil OK), `Footer`, `ServiceCard` y breakpoints validados en 835px, 390px y 1190px.

### Fase 3 — Conversión

- [x] **T3 — Validar formulario de contacto end-to-end.** `estado:DONE`
  - `contacto.astro` renderiza estilado; envío/validación por JS operativos.
- [x] **T4 — Verificar FAQ accesible y CTAs de WhatsApp.** `estado:DONE`
  - Acordeón FAQ funcional (corregido H13); CTAs de WhatsApp con tokens correctos.

### Fase 4 — Crecimiento (SEO / Analytics)

- [x] **T5 — Restaurar analytics (GTM/GA4).** `estado:DONE` · Ref: H9
  - GTM `GTM-T7PWJ99` (head + noscript) centralizado en `Layout.astro`; se quitaron los snippets dispersos.
- [x] **T6 — Reconciliar token drift `global.css` ↔ `DESIGN.md`.** `estado:DONE` · Ref: H8
  - Valores canónicos unificados según `DESIGN.md`; usos de colores hardcodeados reemplazados por tokens.
- [x] **T7 — Metadatos SEO por página.** `estado:DONE`
  - Open Graph + Twitter Card + JSON-LD `LocalBusiness` en el Layout; `@astrojs/sitemap` genera el sitemap; `robots.txt` agregado.

### Fase 5 — Cierre (Limpieza / Deploy)

- [x] **T8 — Limpieza de legacy.** `estado:DONE` · Ref: H5, H7
  - Eliminados los `.html` de raíz, `theme/`, `inteligencia-artificial/` y los viejos `casos-exito/` y `servicios/` estáticos.
- [x] **T9 — Sacar `dist/` del control de versiones.** `estado:DONE` · Ref: H6
  - `dist/` y `.astro/` quitados de git; `.gitignore` creado.
- [x] **T10 — Definir deploy de Astro a GitHub Pages.** `estado:DONE` · Ref: H10
  - `.github/workflows/deploy.yml` (build + `deploy-pages`); `CNAME` incluido en `public/` para preservar el dominio.
- [x] **T11 — QA final + build + deploy.** `estado:DONE`
  - `npm run build` limpio (10 páginas + sitemap + CNAME). El deploy productivo se dispara al mergear a `master`.
  - **Pendiente sugerido:** correr Lighthouse sobre la URL productiva tras el primer deploy para confirmar score > 80.

---

## 3. Resumen de estado

| Fase | Estado | Tareas abiertas |
|------|--------|-----------------|
| F0 — Fundación | `estado:DONE` | — |
| F1 — Estructura | `estado:DONE` | — |
| F2 — Construcción | `estado:DONE` | — |
| F3 — Conversión | `estado:DONE` | — |
| F4 — Crecimiento | `estado:DONE` | — |
| F5 — Cierre | `estado:DONE` | Lighthouse post-deploy (sugerido) |

> **Nota de deploy:** el workflow publica en cada push a `master`. Verificar en **Settings → Pages** del repo que la fuente esté configurada como **GitHub Actions** (no "Deploy from a branch") para que el pipeline tome efecto.

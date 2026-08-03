# Roadmap — Rebranding SACsi

> Fusiona el antiguo *Plan de Rebranding* y el *QA Checklist* en un único documento de seguimiento.
> **Rama:** `v0_alternativo_rebranding` · **PR destino:** `master`

## Objetivo

Renovar la identidad digital de SACsi, pasando de un diseño antiguo (`theme/mobile1`) a uno moderno, profesional y mobile-first, sobre un stack mantenible (**Astro v7**) y con `DESIGN.md` como fuente única de tokens.

## Estado por fase

Leyenda: ✅ hecho · 🔄 en curso · ⬜ pendiente

| Fase | Nombre | Estado | Notas |
|------|--------|--------|-------|
| F0 | Fundación | ✅ | DESIGN.md, anonimización, wiki. |
| F1 | Estructura | ✅ | Propuesta de valor, sitemap, service copy, UI/UX responsive. |
| F2 | Construcción | 🔄 | Homepage y páginas migradas a Astro. Falta cerrar QA sobre Astro (no sobre el HTML viejo). |
| F3 | Conversión | 🔄 | Métricas, testimonios, FAQ y CTA existen en Astro; validar formulario y tracking real. |
| F4 | Crecimiento | ⬜ | SEO/meta por página y GA4 a revalidar tras la migración (el snippet GTM quedó como placeholder). |
| F5 | Cierre | ⬜ | QA final sobre Astro + limpieza de legacy + deploy. |

> **Importante:** el checklist original marcaba todo como ✅, pero validaba la versión de **HTML estático**. Tras la migración a Astro, la QA de F2–F5 debe **re-ejecutarse sobre las páginas `.astro`**.

## Detalle de fases

### F0 — Fundación ✅
- `DESIGN.md` con tokens de marca.
- Referencias a la empresa de inspiración original eliminadas (0 ocurrencias).
- Wiki del proyecto documentada.

### F1 — Estructura ✅
- Investigación de marca y propuesta de valor (ver [Contenido](Contenido)).
- Arquitectura de contenido y sitemap.
- Diseño UI/UX responsive basado en `DESIGN.md`.

### F2 — Construcción 🔄
- Homepage (`src/pages/index.astro`): Hero, Soluciones (3 cards), Cómo trabajamos (4 pasos), Métricas, Testimonios, Casos de éxito, FAQ, CTA final.
- Páginas de servicio: `src/pages/servicios/*.astro`.
- Componentes compartidos: `Header.astro`, `Footer.astro`, `ServiceCard.astro`.

### F3 — Conversión 🔄
- Social proof: 4 métricas + 3 testimonios + 3 casos de éxito.
- FAQ con acordeón (JS nativo, `aria-expanded` / `aria-controls`).
- Formulario de contacto (`src/pages/contacto.astro`) y CTA final con WhatsApp + email.

### F4 — Crecimiento ⬜
- Meta tags únicos por página (title, description, canonical) — parcial en `Layout.astro`.
- Open Graph / Twitter Card por página.
- JSON-LD `LocalBusiness`.
- **Pendiente real:** restaurar el snippet de GTM/GA4 (hoy es placeholder en `Layout.astro`) y verificar eventos.
- `sitemap.xml` alineado a las rutas Astro (`/servicios/*`, `/casos-exito/*`).

### F5 — Cierre ⬜
- QA completa sobre Astro (ver checklist abajo).
- Limpieza de legacy: `.html` de raíz, `theme/mobile1/`, `inteligencia-artificial/`, y `dist/` del control de versiones.
- Deploy y verificación en producción.

## Entregables

| Fase | Entregable | Formato |
|------|-----------|---------|
| F0 | DESIGN.md + Wiki | Markdown (raíz + `docs/wiki/`) |
| F1 | Sitemap + wireframes + copy | [Contenido](Contenido) |
| F2–F3 | Páginas y componentes | `src/` (Astro) |
| F4 | SEO + eventos GA4 | Código + notas en este doc |
| F5 | QA + plan de rollback | Este documento |

## Criterios de éxito

- Lighthouse > 80 en las 4 categorías.
- Diseño consistente con `DESIGN.md` (sin token drift — ver [Diseño](Diseno#tokens-y-drift-pendiente)).
- Sin regresión visual respecto de la versión publicada.
- Todos los CTAs funcionales y trackeados.

## Checklist de QA (re-validar sobre Astro)

### Build y servidor
- [ ] `npm run build` compila sin errores.
- [ ] `npm run preview` sirve `dist/` correctamente en el puerto 8000.
- [ ] Todas las rutas resuelven: `/`, `/contacto`, `/sobre-nosotros`, `/servicios/*`, `/casos-exito/*`.
- [ ] Sin errores en consola JS.

### Responsive
- [ ] Breakpoint mobile (≤ 600px): grillas a 1–2 columnas.
- [ ] Menú hamburguesa visible en mobile.
- [ ] CTAs full-width en mobile.
- [ ] Tipografía responsive.

### Accesibilidad
- [ ] `aria-expanded` / `aria-controls` en FAQ.
- [ ] `alt` en todas las imágenes.
- [ ] Jerarquía de headings correcta (un solo `<h1>` por página).

### SEO
- [ ] `title` y `description` únicos por página.
- [ ] Open Graph y canonical presentes.
- [ ] JSON-LD `LocalBusiness`.
- [ ] `sitemap.xml` con las URLs Astro reales.

### Conversión / tracking
- [ ] GTM/GA4 restaurado y emitiendo eventos (`cta_click`, `whatsapp_click`, `form_submit`).
- [ ] Enlaces de WhatsApp funcionan.
- [ ] Formulario de contacto envía correctamente.

## Plan de rollback

Si el despliegue falla:

1. `git checkout master`
2. Re-publicar el estado anterior de GitHub Pages.
3. Esperar 2–5 minutos para propagación.
4. Verificar que https://sacsi.com.ar responde.

## Monitoreo post-lanzamiento

- [ ] Google Analytics recibe eventos.
- [ ] Formulario de contacto envía mails.
- [ ] Enlaces WhatsApp operativos.
- [ ] Monitorear 48 h.
- [ ] SSL vigente.

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
| F2 | Construcción | ✅ | Homepage y páginas en Astro; QA re-ejecutada en navegador (se corrigió el CSS scoped, ver H11). |
| F3 | Conversión | ✅ | Métricas, testimonios, FAQ, formulario y CTAs verificados en Astro. |
| F4 | Crecimiento | ✅ | SEO por página (OG/Twitter/JSON-LD/canonical), sitemap automático y GTM `GTM-T7PWJ99` activos. |
| F5 | Cierre | ✅ | QA final sobre Astro, legacy eliminado, `dist/` fuera de git y workflow de deploy creado. |

> El detalle de tareas (T0–T16) y hallazgos (H1–H18) con su estado está en [Progreso](Progreso). Las fases quedaron cerradas; el trabajo posterior (carrusel, casos WordPress, ajustes de UX) se registra como T12–T16.

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

## Checklist de QA (verificada sobre Astro)

### Build y servidor
- [x] `npm run build` compila sin errores (15 páginas + sitemap + CNAME).
- [x] `npm run preview` sirve `dist/` correctamente.
- [x] Todas las rutas resuelven: `/`, `/contacto/`, `/sobre-nosotros/`, `/servicios/*`, `/casos-exito/*`.
- [x] Sin errores en consola JS.

### Responsive
- [x] Breakpoint mobile: grillas a 1–2 columnas (verificado en 390px).
- [x] Menú hamburguesa funcional en mobile.
- [x] CTAs full-width en mobile.
- [x] Tipografía responsive.

### Accesibilidad
- [x] `aria-expanded` / `aria-controls` en FAQ.
- [x] `alt` en imágenes (el sitio no usa `<img>` de contenido; íconos inline).
- [x] Jerarquía de headings correcta (un solo `<h1>` por página).
- [x] `target="_blank"` con `rel="noopener"` en todos los enlaces externos.

### SEO
- [x] `title` y `description` únicos por página.
- [x] Open Graph, Twitter Card y canonical presentes.
- [x] JSON-LD `LocalBusiness`.
- [x] `sitemap.xml` (automático) con las URLs Astro reales + `robots.txt`.

### Conversión / tracking
- [x] GTM (`GTM-T7PWJ99`) presente (head + noscript). *Falta validar eventos con datos reales tras el deploy.*
- [x] Enlaces de WhatsApp funcionan.
- [x] Formulario de contacto con validación JS operativa.

> **Pendiente post-deploy:** correr Lighthouse sobre la URL productiva (meta > 80) y confirmar que GA4/GTM recibe eventos reales.

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

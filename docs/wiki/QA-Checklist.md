# QA Checklist — Rebranding SACsi

> **Versión:** 2026-06-10
> **Rama:** rebranding_20260610
> **PR destino:** master

---

## Fase 0 — Foundation ✅

- [x] DESIGN.md creado con tokens de marca
- [x] DESIGN.md validado con `npx @google/design.md lint DESIGN.md` (0 errores)
- [x] Referencias a la empresa de inspiracion original eliminadas (0 ocurrencias restantes)
- [x] Documentación en `docs/wiki/` — 7 páginas creadas

## Fase 1 — Estructura ✅

- [x] Hero section comunica propuesta de valor en < 8 segundos
- [x] Sitemap documentado con estructura de contenido
- [x] Service copy redactado con claims medibles
- [x] Diseño responsive mobile-first
- [x] Navegación colapsable en mobile (hamburger menu)
- [x] Grids pasan a 1 columna en < 600px
- [x] CTAs ocupan 100% ancho en mobile
- [x] Tipografía usa tokens DESIGN.md
- [x] Paleta navy #1A1A2E + azul #0A7CFF consistente

## Fase 2 — Construcción ✅

- [x] Homepage completa: Hero, Soluciones (3 cards), Cómo trabajamos (4 pasos), Métricas, Testimonios, FAQ, CTA Final
- [x] Sección Cómo trabajamos con Descubrimiento, Diagnóstico, Prototipo, Producción
- [x] Cada paso explica el entregable del cliente
- [x] step-number: 48px círculo navy
- [x] Pasos en fila desktop, columna mobile

## Fase 3 — Conversión ✅

- [x] Social proof: 4 métricas + 3 testimonios
- [x] Grid 4 columnas desktop, 2 columnas mobile
- [x] FAQ con 6 preguntas, acordeón JS nativo
- [x] FAQ con accesibilidad: aria-expanded, aria-controls
- [x] Formulario de contacto con nombre, email, teléfono, mensaje
- [x] Mensaje de éxito in-page
- [x] CTA final con WhatsApp + email + teléfono

## Fase 4 — Crecimiento ✅

- [x] Meta tags únicos por página (title, description)
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card tags
- [x] Canonical URL por página
- [x] JSON-LD LocalBusiness en index.html
- [x] Google Tag Manager operativo (GTM-T7PWJ99)
- [x] Eventos trackeados: cta_click, whatsapp_click, form_submit, section_view
- [x] Sitemap.xml actualizado con todas las URLs

## Validación Técnica

### Servidor Local
- [x] `python3 -m http.server 8000` funciona
- [x] index.html se sirve correctamente (34074 bytes)
- [x] contacto.html se sirve correctamente (18272 bytes)
- [x] Todas las páginas HTML accesibles
- [x] Etiquetas HTML balanceadas (sin tags rotos)
- [x] Sin errores de consola JS

### Responsive
- [x] Breakpoint mobile (<= 600px): grids a 1-2 columnas
- [x] Hamburguer menu visible en mobile
- [x] CTAs full-width en mobile
- [x] Tipografía responsive (h2: 2rem → 1.6rem)

### Accesibilidad
- [x] aria-expanded en FAQ buttons
- [x] aria-controls vinculado a IDs de respuestas
- [x] Alt text en imágenes
- [x] Jerarquía de headings correcta (h1 → h2 → h3)

### SEO
- [x] Title único por página
- [x] Meta description < 160 chars
- [x] Open Graph tags presentes
- [x] Canonical URL presente
- [x] JSON-LD structured data presente

## Plan de Rollback

Si el despliegue falla:

1. `git checkout master`
2. `git push origin master --force` (solo si es necesario)
3. Esperar 2-5 minutos para propagación GitHub Pages
4. Verificar https://sacsi.com.ar funciona

**Tiempo estimado:** < 10 minutos

## Monitoreo Post-Lanzamiento

- [ ] Verificar Google Analytics recibe eventos
- [ ] Verificar formulario de contacto envía emails
- [ ] Verificar enlaces WhatsApp funcionan
- [ ] Monitorear por 48 horas
- [ ] Confirmar SSL vigente

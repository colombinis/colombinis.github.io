# Arquitectura

> Realidad técnica del proyecto tras la migración. Incluye el SEO técnico que antes vivía en *SITEMAP*.

## Stack oficial: Astro v7

El sitio se construye con **Astro v7** y se despliega como sitio estático en **GitHub Pages**.

| Qué | Cómo |
|-----|------|
| Dev server | `npm run dev` — puerto 8000 |
| Build | `npm run build` — output a `dist/` |
| Preview | `npm run preview` — sirve `dist/` en puerto 8000 |
| Dominio | `sacsi.com.ar` (vía `CNAME`) — no cambiar salvo pedido explícito |
| Fuente de tokens | `/DESIGN.md` (raíz) |

Única dependencia relevante: `@astrojs/sitemap` (genera el sitemap en build). El JavaScript de cliente es **vanilla** (sin jQuery ni frameworks). Sin tests, linter ni formatter; el CI de deploy se define en `.github/workflows/deploy.yml`.

### Estructura Astro

```
src/
├── pages/            # Rutas del sitio
│   ├── index.astro
│   ├── contacto.astro
│   ├── sobre-nosotros.astro
│   ├── casos.json.js        # Endpoint estático: expone los casos para el carrusel
│   ├── servicios/           # index + automatizacion, software-a-medida, presencia-online
│   └── casos-exito/         # 8 casos (3 PyME + 5 orientados a perfil WordPress)
├── layouts/
│   └── Layout.astro         # Shell compartido: Header + Footer + global.css + <head> (SEO/GTM)
├── components/
│   ├── Header.astro         # Nav + hamburguesa (toggle client-side)
│   ├── Footer.astro
│   ├── ServiceCard.astro
│   └── CasosCarousel.astro  # Carrusel con render asíncrono (fetch a /casos.json)
├── data/
│   └── casos.js             # Fuente única de verdad de los 8 casos de éxito
└── styles/
    └── global.css           # Design system: tokens + clases compartidas de todas las páginas
```

`global.css` es donde los tokens de `DESIGN.md` se materializan como CSS custom properties **y** donde viven las clases compartidas del sitio (hero, secciones, cards, carrusel…). Es importado por `Layout.astro`, por lo que aplica a todas las páginas — los `<style>` de Astro son *scoped* por archivo, así que el CSS común **debe** estar aquí, no en páginas individuales (ver H11 en [Progreso](Progreso)).

### Casos de éxito y carrusel

- `src/data/casos.js` es la **fuente única** de los 8 casos. Para agregar/editar un caso se toca este archivo (y su página de detalle en `casos-exito/`).
- `casos.json.js` genera `/casos.json` en el build; `CasosCarousel.astro` lo consume con `fetch` (render asíncrono en cliente) y arma los slides, cada uno enlazando a `/casos-exito/<slug>/`.

## Deploy (GitHub Pages)

- El dominio se sirve vía `CNAME` (`sacsi.com.ar`), incluido en `public/CNAME` para que quede en el build.
- **Workflow:** `.github/workflows/deploy.yml` corre en cada push a `master`: `astro build` → `actions/deploy-pages`.
- `astro.config.mjs`: `site: 'https://sacsi.com.ar'`, `build.format: 'directory'`, `@astrojs/sitemap` integrado, y `vite.server.allowedHosts: true` (para la preview cross-origin).
- **Requisito manual (una vez):** en **Settings → Pages** del repo, fijar *Source* = **GitHub Actions**.
- `.gitignore` excluye `dist/`, `.astro/` y `node_modules/`.

## SEO técnico

### `sitemap.xml` (automático)

Lo genera `@astrojs/sitemap` en cada build a partir de las rutas reales (con `build.format: 'directory'`, URLs con barra final): homepage, `/sobre-nosotros/`, `/contacto/`, `/servicios/` + 3 servicios, y los 8 `/casos-exito/*`. Complementado por `public/robots.txt`.

### Metadatos

- `Layout.astro` centraliza `<title>`, `description`, `canonical`, **Open Graph**, **Twitter Card**, **JSON-LD `LocalBusiness`**, `theme-color` y el snippet de **GTM** (`GTM-T7PWJ99`, head + noscript).

## Convenciones de código

- **Mobile-first**: estilos base para mobile, `@media (min-width: …)` para pantallas grandes.
- **CSS custom properties** desde los tokens de `DESIGN.md`.
- **System font stack** — sin fuentes externas.
- **HTML semántico** — jerarquía de headings correcta, un `<h1>` por página, `alt` en imágenes.
- **Container** centrado de `var(--container)` = 1120px.
- **Commits**: convencionales (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`).

## Decisiones técnicas (histórico)

El sitio nació como HTML/CSS/JS vanilla sin build step, priorizando simplicidad para GitHub Pages. Con el crecimiento del contenido (páginas de servicios y casos de éxito que repetían el mismo header/footer y tokens `:root`), se migró a **Astro** para eliminar esa duplicación mediante layouts y componentes, manteniendo el output 100% estático. El razonamiento de diseño (paleta, tipografía, mobile-first, WhatsApp como CTA) está en [Diseño](Diseno).

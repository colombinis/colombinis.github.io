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

Sin dependencias npm más allá de Astro. El JavaScript de cliente es **vanilla** (sin jQuery ni frameworks). Sin CI, tests, linter ni formatter configurados.

### Estructura Astro

```
src/
├── pages/            # Rutas del sitio
│   ├── index.astro
│   ├── contacto.astro
│   ├── sobre-nosotros.astro
│   ├── servicios/    # automatizacion, software-a-medida, presencia-online
│   └── casos-exito/  # tienda-ropa-usada, consultorio-psicologia, ferreteria-gas-plomeria
├── layouts/
│   ├── Layout.astro         # Shell compartido: Header + Footer + global.css + <head>
│   └── CaseStudyLayout.astro
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   └── ServiceCard.astro
└── styles/
    └── global.css   # Custom properties (--primary, --tertiary, --whatsapp, etc.)
```

`global.css` es donde los tokens de `DESIGN.md` se materializan como CSS custom properties. Toda página consume `var(--primary)`, `var(--tertiary)`, etc.

## Legacy — a deprecar

Estos archivos son de la etapa anterior y **no deben editarse ni tomarse como referencia**. Se eliminarán en F5.

| Ruta | Qué es | Acción |
|------|--------|--------|
| `index.html`, `contacto.html`, `sobre-nosotros.html` (raíz) | Versión HTML estática previa a Astro | Deprecar (duplican las rutas Astro) |
| `servicios/*.html`, `casos-exito/*.html` (raíz) | Ídem, versión estática | Deprecar |
| `automatizacion-procesos.html`, `programacion-sistemas-a-medida.html`, `desarrollo-web-facebook-comercio-electronico.html` | Páginas viejas con `theme/mobile1` | Eliminar |
| `theme/mobile1/` | Tema antiguo (CSS + imágenes) | Eliminar |
| `inteligencia-artificial/index.html` | Página con estilo viejo, sin rebrandear | Migrar a Astro o eliminar |
| `dist/` | Output de build **commiteado por error** | Sacar del control de versiones (agregar `.gitignore`) |

> **Deuda de repo:** no existe `.gitignore`. `dist/`, `node_modules/` y artefactos de build no deberían versionarse.

## Deploy (GitHub Pages)

- El dominio se sirve vía `CNAME` (`sacsi.com.ar`).
- Al ser Astro, el deploy debe publicar el contenido de `dist/` (idealmente vía GitHub Action, hoy inexistente). Definir esto es parte de F5.
- `astro.config.mjs`: `site: 'https://sacsi.com.ar'`, `base: '/'`, `build.format: 'directory'`.

## SEO técnico

### Rutas y `sitemap.xml`

El `sitemap.xml` debe reflejar las **rutas Astro reales** (con `build.format: 'directory'` las URLs son con barra final):

```
https://sacsi.com.ar/                              (prioridad 1.0)
https://sacsi.com.ar/sobre-nosotros/               (0.7)
https://sacsi.com.ar/contacto/                     (0.7)
https://sacsi.com.ar/servicios/automatizacion/     (0.8)
https://sacsi.com.ar/servicios/software-a-medida/  (0.8)
https://sacsi.com.ar/servicios/presencia-online/   (0.8)
https://sacsi.com.ar/casos-exito/...               (0.6)
```

> Las rutas viejas tipo `programacion-sistemas-a-medida.html` quedan obsoletas; conviene un redirect o dejarlas fuera del sitemap.

### Metadatos

- `Layout.astro` centraliza `<title>`, `description` y `canonical`.
- **Pendiente (F4):** Open Graph / Twitter Card por página, JSON-LD `LocalBusiness`, y restaurar el snippet de **GTM/GA4** (hoy es un placeholder vacío en `Layout.astro`).

## Convenciones de código

- **Mobile-first**: estilos base para mobile, `@media (min-width: …)` para pantallas grandes.
- **CSS custom properties** desde los tokens de `DESIGN.md`.
- **System font stack** — sin fuentes externas.
- **HTML semántico** — jerarquía de headings correcta, un `<h1>` por página, `alt` en imágenes.
- **Container** centrado de `var(--container)` = 1120px.
- **Commits**: convencionales (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`).

## Decisiones técnicas (histórico)

El sitio nació como HTML/CSS/JS vanilla sin build step, priorizando simplicidad para GitHub Pages. Con el crecimiento del contenido (páginas de servicios y casos de éxito que repetían el mismo header/footer y tokens `:root`), se migró a **Astro** para eliminar esa duplicación mediante layouts y componentes, manteniendo el output 100% estático. El razonamiento de diseño (paleta, tipografía, mobile-first, WhatsApp como CTA) está en [Diseño](Diseno).

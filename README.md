# SACsi Soluciones Informáticas

Sitio web institucional de SACsi — soluciones informáticas para PyMEs en Rosario, Argentina.

**Stack:** Astro v7 · GitHub Pages · Mobile-first responsive · JavaScript vanilla en cliente

> ⚠️ **Split de repositorios (2026-08-31):** Este repositorio contiene **solo el sitio web desplegable**. La documentación interna, specs, backoffice y datos sensibles están en el repositorio privado `colombinis/sacsi-interno`.

**Servicios:**
- Automatización de procesos
- Desarrollo de software a medida
- Presencia online y comercio electrónico

**Sitio en producción:** [sacsi.com.ar](https://sacsi.com.ar)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:8000
npm run build    # → dist/
npm run preview  # sirve dist/ en :8000
```

## Estructura

```
src/
├── pages/        # Rutas del sitio (index, contacto, servicios/*, casos-exito/*, catalogo, etc.)
├── components/   # Componentes Astro reutilizables
├── layouts/      # Layouts base (Layout.astro, CaseStudyLayout.astro)
├── data/         # Catálogo público (JSON): soluciones, categorías, casos, testimonios
├── lib/          # Utilidades (data-utils.ts)
└── styles/       # CSS global con custom properties
```

## Documentación interna

La documentación de arquitectura, tareas, specs y el backoffice están en el repositorio privado:
- **Repo privado:** `colombinis/sacsi-interno`
- **Contenido:** `_ai_context/`, `src/pages/padmin/`, `src/lib/rentabilidad.*`, scripts, diseño

## Design tokens

Los colores, tipografía y espaciados están definidos en [DESIGN.md](DESIGN.md) como fuente única de verdad.

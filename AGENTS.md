# SACsi — AGENTS.md

Rebranding SACsi (soluciones informáticas, Rosario, Argentina). All user-facing content in Argentine Spanish.

## ⚠️ Split de repositorios (2026-08-31)

Este repositorio (**público**) contiene **solo el sitio web desplegable**. La documentación interna, specs, backoffice y datos sensibles están en el repositorio privado `colombinis/sacsi-interno`.

Las Features, tareas, Issues de planificación y estados del proyecto se gestionan en el repositorio privado. No crear ni reintroducir `_ai_context/` en este repositorio. Si un cambio del sitio necesita una especificación, la spec vive en el privado y aquí solo queda el código público necesario para el build.

| Repositorio | Contenido | Acceso |
|-------------|-----------|--------|
| `colombinis/colombinis.github.io` (este) | Sitio Astro v7, `src/`, `public/`, `CNAME`, CI/CD | Público — GitHub Pages |
| `colombinis/sacsi-interno` | `_ai_context/`, `workers/`, `tests/`, `docs/verificacion-*`, specs, tareas, scripts, PRD | Privado — solo owner |

**Regla:** Este repo público solo contiene código necesario para el build de Astro. Todo lo sensible (backend, secrets, tests internos, documentación de negocio) vive en el repo privado.

## Quick reference

| What | How |
|------|-----|
| Dev server (Astro) | `npm run dev` — serves on port 8000 |
| Build (Astro) | `npm run build` — outputs to `dist/` |
| Preview build | `npm run preview` — serves `dist/` on port 8000 |
| Serve static HTML | `python3 -m http.server 8000` (no build needed) |
| Commit style | Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:` |
| Design source | `DESIGN.md` — single source of truth for all design decisions |

## Architecture — Astro is the official stack

The repo currently holds **two versions**, but they are not equal:

1. **Astro v7** (`src/` directory) — **official stack**. Builds to `dist/`, deployed via GitHub Pages (`CNAME` → sacsi.com.ar). Make all changes here.
2. **Static HTML** (`.html` files at root) — **legacy**, being deprecated. Do not build on it. Will be removed in Fase 5.

> **Nota:** La documentación de arquitectura legacy ahora vive en el repo privado (`_ai_context/docs/tareas/ARQUITECTURA.md`).

### Astro source structure

```
src/
├── pages/           # Routes mirror the HTML site: index, contacto, sobre-nosotros, servicios/*, casos-exito/*
├── layouts/         # Layout.astro (shared shell: Header+Footer+global.css), CaseStudyLayout.astro
├── components/      # Header.astro, Footer.astro, ServiceCard.astro
├── data/            # Catálogo público: soluciones, categorías, casos, testimonios (consumido por Astro)
├── lib/             # data-utils.ts (utilidades compartidas)
└── styles/
    └── global.css   # CSS custom properties (--primary, --tertiary, --whatsapp, etc.)
```

### Static HTML inline CSS

Every HTML page repeats the same `:root` variables. Edits must stay in sync with `DESIGN.md` tokens.

## Environment

- **No CI, no tests, no linter, no formatter, no .gitignore**
- **No external npm deps** beyond Astro itself (pure vanilla JS for client scripts)
- **Domain:** sacsi.com.ar (via `CNAME`) — do not change `CNAME` unless asked
- **Analytics:** GTM + GA4 (`GTM-T7PWJ99` in Layout.astro head; post-deploy: validate events)
- **CI:** `.github/workflows/deploy.yml` (builds Astro and deploys to GitHub Pages on push to `master`)

## Legacy / do-not-touch files

- `automatizacion-procesos.html`, `programacion-sistemas-a-medida.html`, `desarrollo-web-facebook-comercio-electronico.html` — old standalone pages using deprecated `theme/mobile1/` CSS. Do not edit.
- `inteligencia-artificial/index.html` — uses older CSS style (not rebranded). Verify before editing.

## Conventions

- **Mobile-first CSS** — base styles for mobile, `@media (min-width: ...)` for larger
- **CSS custom properties** from `DESIGN.md` tokens (`var(--primary)`, `var(--tertiary)`, etc.)
- **System font stack only** — no external fonts
- **Semantic HTML** — proper heading hierarchy, one `<h1>` per page, `alt` on all images
- **Vanilla JS** — no jQuery, no frameworks, no npm client-side packages
- A **`var(--container)`** max-width of 1120px centered layout
- Astro components may use inline `onClick` (Astro compiles this server-side) — acceptable in `.astro` files but avoid in raw HTML
- Tone: professional but approachable ("cercano")

## Phases

| Phase | Status |
|-------|--------|
| Fase 0 — Foundation (DESIGN.md, docs, wiki) | ✅ Done |
| Fase 1 — Structure (brand research, content arch, UI/UX) | ✅ Done |
| Fase 2 — Build (homepage, service pages, "How we work") | ✅ Done (migrated to Astro; QA re-run on .astro pages) |
| Fase 3 — Conversion (social proof, FAQ, contact CTA) | ✅ Done |
| Fase 4 — Growth (SEO, analytics, meta tags) | ✅ Done (GTM `GTM-T7PWJ99` active; post-deploy: validate events) |
| Fase 5 — Close (QA on Astro, legacy cleanup, deployment) | ✅ Done (deploy workflow created; post-deploy: Lighthouse > 80) |

> **Nota:** El estado completo de tareas y el historial de rebranding ahora viven en el repo privado (`_ai_context/docs/tareas/TODO.md` y `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`).

## Reference

- `DESIGN.md` — colors, typography, spacing, components (canonical tokens) + design rationale + glossary
- `src/data/` — catálogo público de soluciones, categorías, casos de éxito, testimonios (consumido por Astro)
- Repo privado (`colombinis/sacsi-interno`) — documentación interna, specs, tareas, backoffice, scripts

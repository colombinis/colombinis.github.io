# SACsi — AGENTS.md

Rebranding SACsi (soluciones informáticas, Rosario, Argentina). All user-facing content in Argentine Spanish.

## Quick reference

| What | How |
|------|-----|
| Dev server (Astro) | `npm run dev` — serves on port 8000 |
| Build (Astro) | `npm run build` — outputs to `dist/` |
| Preview build | `npm run preview` — serves `dist/` on port 8000 |
| Serve static HTML | `python3 -m http.server 8000` (no build needed) |
| Working branch | `v0_alternativo_rebranding` — never commit to `master` |
| Commit style | Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:` |
| Design source | `DESIGN.md` — single source of truth for all design decisions |

## Architecture — Astro is the official stack

The repo currently holds **two versions**, but they are not equal:

1. **Astro v7** (`src/` directory) — **official stack**. Builds to `dist/`, deployed via GitHub Pages (`CNAME` → sacsi.com.ar). Make all changes here.
2. **Static HTML** (`.html` files at root) — **legacy**, being deprecated. Do not build on it. Will be removed in Fase 5.

See `docs/tareas/ARQUITECTURA.md` for the full legacy inventory and cleanup plan.

### Astro source structure

```
src/
├── pages/           # Routes mirror the HTML site: index, contacto, sobre-nosotros, servicios/*, casos-exito/*
├── layouts/         # Layout.astro (shared shell: Header+Footer+global.css), CaseStudyLayout.astro
├── components/      # Header.astro, Footer.astro, ServiceCard.astro
└── styles/
    └── global.css   # CSS custom properties (--primary, --tertiary, --whatsapp, etc.)
```

### Static HTML inline CSS

Every HTML page repeats the same `:root` variables. Edits must stay in sync with `DESIGN.md` tokens.

## Environment

- **No CI, no tests, no linter, no formatter, no .gitignore**
- **No external npm deps** beyond Astro itself (pure vanilla JS for client scripts)
- **Domain:** sacsi.com.ar (via `CNAME`) — do not change `CNAME` unless asked
- **Analytics:** GTM + GA4 (`GTM-T7PWJ99` in Layout.astro head; post-deploy: validate events — see `docs/tareas/DEP-01`)
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
| Fase 4 — Growth (SEO, analytics, meta tags) | ✅ Done (GTM `GTM-T7PWJ99` active; post-deploy: validate events — see `docs/tareas/DEP-01`) |
| Fase 5 — Close (QA on Astro, legacy cleanup, deployment) | ✅ Done (deploy workflow created; post-deploy: Lighthouse > 80 — see `docs/tareas/DEP-01`) |

Full status: `docs/tareas/TODO.md` (active tasks) and `docs/tareas/HISTORIAL-REBRANDING.md` (closed rebranding phases).

## Reference

- `DESIGN.md` — colors, typography, spacing, components (canonical tokens)
- `docs/tareas/TODO.md` — active task master (source of truth for ongoing work)
- `docs/tareas/ARQUITECTURA.md` — Astro structure, legacy files, deploy, SEO
- `docs/tareas/CONTENIDO.md` — content architecture + service copy
- `docs/tareas/DISENO.md` — design rationale + glossary + token drift

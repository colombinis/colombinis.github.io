# SACsi — AGENTS.md

Rebranding SACsi (soluciones informáticas, Rosario, Argentina). All user-facing content in Argentine Spanish.

## Quick reference

| What | How |
|------|-----|
| Dev server (Astro) | `npm run dev` — serves on port 8000 |
| Build (Astro) | `npm run build` — outputs to `dist/` |
| Preview build | `npm run preview` — serves `dist/` on port 8000 |
| Serve static HTML | `python3 -m http.server 8000` (no build needed) |
| Working branch | `rebranding_20260610` — never commit to `master` |
| Commit style | Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:` |
| Design source | `DESIGN.md` — single source of truth for all design decisions |

## Architecture — dual versions

The repo has **two parallel versions** of the same site:

1. **Static HTML** (`.html` files at root) — deployed via GitHub Pages (`CNAME` → sacsi.com.ar)
2. **Astro v7** (`src/` directory) — builds to `dist/`, may become the primary deploy target

When editing, check which version(s) need the change. Most pages exist in both forms.

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
- **Analytics:** GTM + GA4 (snippet in Layout.astro head, placeholder for now)
- **No GitHub directories** (no `.github/`, no workflows)

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
| Fase 1 — Structure (brand research, content arch, UI/UX) | 🔜 In progress |
| Fase 2 — Build (homepage, service pages, "How we work") | 🔜 In progress |
| Fase 3 — Conversion (social proof, FAQ, contact CTA) | ⬜ Pending |
| Fase 4 — Growth (SEO, analytics, meta tags) | ⬜ Pending |
| Fase 5 — Close (QA, testing, deployment) | ⬜ Pending |

## Reference

- `DESIGN.md` — colors, typography, spacing, components
- `docs/wiki/Plan-de-Rebranding.md` — full rebranding plan
- `docs/wiki/Glosario.md` — project glossary

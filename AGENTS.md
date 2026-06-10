# SACsi Rebranding — AGENTS.md

## Project Overview

Rebranding the SACsi website (soluciones informáticas, Rosario, Argentina) from an old mobile theme to a modern, professional, mobile-first design.

- **Repository:** colombinis/colombinis.github.io
- **Production URL:** https://sacsi.com.ar
- **Owner:** Sebastian (colombinis@gmail.com)
- **Language:** Spanish (Rioplatense) — all user-facing content is in Argentine Spanish
- **Current Phase:** Fase 0-1 (Foundation + Structure)

## Tech Stack

- **Static site:** Pure HTML + CSS + JavaScript (no frameworks)
- **Hosting:** GitHub Pages
- **CI:** Jenkins (see `Jenkinsfile` at root)
- **Domain:** sacsi.com.ar (managed via `CNAME`)

## Design System

The design tokens are defined in `DESIGN.md` — **that is the single source of truth** for all design decisions.

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1A1A2E` (navy) | Headers, primary buttons, main accents |
| Secondary | `#555555` | Body text, secondary elements |
| Tertiary | `#0A7CFF` (blue) | Hover states, links, interactive accents |
| Neutral | `#FAFAFA` | Page backgrounds |
| Surface | `#FFFFFF` | Cards, content areas |
| Muted | `#888888` | Subtle text, metadata |
| WhatsApp | `#25D366` | WhatsApp CTA button |

**Typography:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`)
**Approach:** Mobile-first responsive design

## Project Structure

```
/
├── index.html                                    # Homepage
├── desarrollo-web-facebook-comercio-electronico.html  # Service page
├── programacion-sistemas-a-medida.html                # Service page
├── automatizacion-procesos.html                       # Service page
├── sobre-nosotros.html                                # About page
├── contacto.html                                      # Contact page
├── DESIGN.md                                     # Design tokens & component specs
├── AGENTS.md                                     # This file — agent instructions
├── CNAME                                         # Custom domain
├── Jenkinsfile                                   # CI pipeline
├── sitemap.xml                                   # SEO sitemap
├── favicon.ico                                   # Favicon
├── logo-autor.png                                # Logo asset
├── inteligencia-artificial/                      # AI section pages
├── theme/                                        # Theme assets (old theme)
├── wiki/                                         # Local wiki pages
├── docs/
│   └── wiki/
│       ├── Home.md                               # Wiki home
│       ├── Glosario.md                           # Project glossary
│       └── Plan-de-Rebranding.md                 # Rebranding plan & phases
```

## Rebranding Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **Fase 0** | Foundation — DESIGN.md, docs, wiki | ✅ Done |
| **Fase 1** | Structure — brand research, content architecture, UI/UX responsive | 🔜 In progress |
| **Fase 2** | Build — homepage, service pages, "How we work" | ⬜ Pending |
| **Fase 3** | Conversion — social proof, FAQ, contact CTA | ⬜ Pending |
| **Fase 4** | Growth — SEO, analytics, meta tags | ⬜ Pending |
| **Fase 5** | Close — QA, testing, deployment | ⬜ Pending |

## Coding Conventions

1. **Mobile-first** — design and test for mobile widths first, then scale up
2. **Semantic HTML** — use `<header>`, `<main>`, `<section>`, `<footer>`, etc.
3. **CSS custom properties** — reference design tokens from DESIGN.md where possible
4. **Spanish content** — all text on the site is in Argentine Spanish (rioplatense)
5. **No external dependencies** — no npm, no build tools, no CDN frameworks
6. **Accessibility** — use semantic elements, proper heading hierarchy, alt text on images

## Git Workflow

1. Branch from `master` using naming convention: `feat/description`, `fix/description`, `docs/description`
2. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`
3. Push branch and create PR to `master`
4. CI runs via Jenkins (`Jenkinsfile`)
5. Squash-merge to `master` when approved

## Quick Start

```bash
# Clone
git clone https://github.com/colombinis/colombinis.github.io.git
cd colombinis.github.io

# No build step needed — open index.html in a browser
# Or serve locally:
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Agent Guidelines

- When making visual changes, always reference `DESIGN.md` for colors, typography, spacing, and component specs
- Do NOT add frameworks, npm packages, or build tools — this is a pure static site
- Do NOT change the CNAME file unless explicitly asked
- All new pages should match the mobile-first responsive layout
- When in doubt about content tone: professional but approachable (cercano)

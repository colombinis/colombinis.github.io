# SACsi Rebranding — AGENTS.md

## Project Overview

Rebranding the SACsi website (soluciones informáticas, Rosario, Argentina) from an old mobile theme to a modern, professional, mobile-first design.

- **Repository:** colombinis/colombinis.github.io
- **Production URL:** https://sacsi.com.ar
- **Owner:** Sebastian (colombinis@gmail.com)
- **Language:** Spanish (Rioplatense) — all user-facing content is in Argentine Spanish
- **Current Phase:** Fase 1 (Structure)
- **Default Branch:** master
- **Working Branch:** rebranding_20260610

## Tech Stack

- **Static site:** Pure HTML + CSS + JavaScript (no frameworks)
- **Hosting:** GitHub Pages
- **CI:** Jenkins (see `Jenkinsfile` at root)
- **Domain:** sacsi.com.ar (managed via `CNAME`)
- **Analytics:** Google Tag Manager + GA4

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
**Rounded corners:** xs=4px, sm=8px, md=16px, full=100px
**Spacing:** xs=4px → xxl=80px, container=1120px

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

### HTML
- **Semantic HTML** — use `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`
- Proper heading hierarchy: one `<h1>` per page, sequential `h1`→`h2`→`h3`
- All images MUST have descriptive `alt` attributes
- Forms must have labeled inputs (`<label>` or `aria-label`)

### CSS
- **Mobile-first responsive design** — write base styles for mobile, use `@media (min-width:)` for larger screens
- Use CSS custom properties (reference DESIGN.md tokens: `var(--primary)`, `var(--tertiary)`, etc.)
- Class naming: BEM-like convention or descriptive kebab-case
- Avoid `!important` — use specificity instead
- No CSS frameworks allowed (no Bootstrap, Tailwind, etc.)

### JavaScript
- Vanilla JS only — no frameworks, no jQuery, no npm packages
- Use `defer` or place scripts before `</body>`
- No inline event handlers (`onclick`, etc.) — use `addEventListener` in JS files
- Always handle errors in async operations (fetch, timeouts)

### General
- **No external dependencies** — no npm, no build tools, no CDN frameworks
- All user-facing content in **Argentine Spanish (rioplatense)** — not neutral Spanish
- Tone: professional but approachable ("cercano")
- Performance: Lighthouse > 80 in all 4 categories
- Must be accessible: semantic HTML, proper heading hierarchy, alt text

## Git Workflow

1. Always work on branch `rebranding_20260610` (never commit directly to master)
2. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`
3. Include a description body for non-trivial commits
4. CI runs via Jenkins (`Jenkinsfile`) — verify the build passes
5. All changes land via squash-merge PR to `master`

## Best Practices for Coding Agents

### Before Implementing
- **Explore first, then plan, then code** — read relevant files before making changes
- Reference `DESIGN.md` for colors, typography, spacing, and component specs
- Read existing files to understand current patterns before adding new ones
- For multi-file changes, consider the dependency order

### During Implementation
- **Give yourself a way to verify your work** — run tests, build, or take screenshots
- Make focused, single-purpose changes per commit
- Do NOT change CNAME unless explicitly asked
- Do NOT modify files unrelated to the task
- Do NOT leave commented-out code, debug logs, or console.log statements

### Security (MANDATORY — auto-fail if violated)
- No hardcoded secrets, API keys, tokens, or credentials in code
- No `eval()`, `exec()`, or `document.write()` with user input
- No `innerHTML` with unsanitized user data (use `textContent` instead)
- No inline event handlers (`onclick="..."`) in HTML
- External links must use `rel="noopener noreferrer"`

### Code Quality
- Write meaningful comments for non-obvious logic (but prefer self-documenting code)
- Keep functions small and single-purpose
- Use descriptive variable and function names in Spanish or English (consistent)
- Avoid deep nesting — early return where possible
- Ensure no regressions: check that existing pages still work after changes

### After Implementing
- Run the verification check (build, Lighthouse, visual comparison)
- Request a code review before marking as complete
- Verify on mobile widths first, then tablet, then desktop

## Quick Start

```bash
# Clone
git clone https://github.com/colombinis/colombinis.github.io.git
cd colombinis.github.io

# Checkout working branch
git checkout rebranding_20260610

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
- All user-facing content is in Argentine Spanish

## Reference Documentation

- Plan de Rebranding: `docs/wiki/Plan-de-Rebranding.md`
- Design tokens: `DESIGN.md`
- Glosario: `docs/wiki/Glosario.md`
- Wiki home: `docs/wiki/Home.md`

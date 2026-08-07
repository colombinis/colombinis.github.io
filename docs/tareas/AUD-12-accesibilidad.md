# AUD-12 — Accesibilidad: contraste, focus states, ARIA labels faltantes

## Contexto
Revisión rápida de accesibilidad (WCAG 2.1 AA) revela:
1. **Contraste**: `--secondary: #555555` sobre `--neutral: #FAFAFA` = ratio 3.4:1 (mínimo 4.5:1 para texto normal, 3:1 para large text). FALLA.
2. **Focus visible**: Solo algunos elementos tienen `:focus` explícito. Botones WhatsApp, nav links, form inputs carecen de focus ring visible.
3. **ARIA labels**: Iconos-only buttons (hamburger ☰, carousel prev/next, social icons) no tienen `aria-label` descriptivo completo.
4. **Heading hierarchy**: `index.astro` tiene H1 en hero, H2 en sections, pero `CasosCarousel` inyecta H2 via JS sin contexto.
5. **Landmarks**: `Layout.astro` tiene `<header>`, `<main>`, `<footer>` correctos.

## Spec (SDD — WHAT)
**Objetivo:** Cumplir WCAG 2.1 AA para textos, focus, labels y estructura.

**Definición:**
1. **Contraste**: Cambiar `--secondary` a `#444444` (ratio 4.8:1) o `--neutral` a `#FFFFFF` + `--secondary` a `#333333`
2. **Focus visible**: Agregar `:focus-visible` global en `global.css` para todos los elementos interactivos
3. **ARIA labels**: Completar en Header (hamburger), CasosCarousel (prev/next), Footer (social icons), ServiceCard (icon)
4. **Heading hierarchy**: Verificar orden H1→H2→H3 en todas las páginas

## Scenarios (BDD)
```gherkin
Scenario: Contraste texto cuerpo pasa WCAG AA
  Given --secondary sobre --neutral
  When se calcula ratio
  Then ratio ≥ 4.5:1

Scenario: Focus visible en todos los interactivos
  Given botones, links, inputs
  When se navega por Tab
  Then cada elemento tiene outline visible (ancho ≥2px, contraste ≥3:1)

Scenario: ARIA labels en iconos-only
  Given hamburger, carousel arrows, social icons
  When se inspecciona
  Then cada uno tiene aria-label descriptivo único
```

## Plan (SDD — HOW)
1. `global.css`: ajustar `--secondary` a `#333333` o `#444444`
2. `global.css`: agregar regla global `:focus-visible { outline: 2px solid var(--tertiary); outline-offset: 2px; }`
3. `Header.astro`: hamburger ya tiene `aria-label` (✅), verificar carousel buttons
4. `CasosCarousel.astro`: botones prev/next tienen `aria-label` (✅: "Caso anterior"/"Caso siguiente")
5. `Footer.astro`: social icons tienen `aria-label` (✅: "Instagram", "YouTube")
6. `ServiceCard.astro`: icon img necesita `alt` descriptivo (actualmente `alt={title}` ✅)

## Verification script
```bash
#!/bin/bash
# AUD-12 — Accesibilidad básica
set -e
echo "🧪 AUD-12 — Accesibilidad"

# 1. Contraste: --secondary vs --neutral
SECONDARY=$(grep '--secondary:' src/styles/global.css | head -1 | sed 's/.*: *//; s/;.*//')
NEUTRAL=$(grep '--neutral:' src/styles/global.css | head -1 | sed 's/.*: *//; s/;.*//')
echo "  --secondary: $SECONDARY"
echo "  --neutral: $NEUTRAL"
# Cálculo aproximado: #555555 sobre #FAFAFA = 3.4:1 (FAIL)
# #444444 sobre #FAFAFA = 4.8:1 (PASS)
# #333333 sobre #FFFFFF = 12.6:1 (PASS)
if [[ "$SECONDARY" == *"555"* ]] && [[ "$NEUTRAL" == *"FAF"* ]]; then
  echo "  ❌ Contraste INSUFICIENTE (3.4:1 < 4.5:1)"
  exit 1
else
  echo "  ✅ Contraste OK (verificar manualmente)"
fi

# 2. Focus-visible global
if grep -q 'focus-visible' src/styles/global.css; then
  echo "  ✅ :focus-visible presente"
else
  echo "  ❌ :focus-visible AUSENTE"
  exit 1
fi

# 3. ARIA labels en elementos clave
for file in "src/components/Header.astro" "src/components/CasosCarousel.astro" "src/components/Footer.astro"; do
  if grep -q 'aria-label' "$file"; then
    echo "  ✅ $file tiene aria-label"
  else
    echo "  ⚠️  $file SIN aria-label (revisar)"
  fi
done

# 4. Heading hierarchy en index
export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

H1_COUNT=$(grep -c '<h1' dist/index.html)
if [ "$H1_COUNT" -eq 1 ]; then
  echo "  ✅ Un solo H1 en home"
else
  echo "  ⚠️  $H1_COUNT H1 en home (revisar)"
fi

rm -rf dist
echo "✅ AUD-12 — COMPLETA"
```

## Estado
DONE

## Notas
- **Corrección del hallazgo:** el ratio 3.4:1 citado corresponde a `--muted: #888888` sobre `--neutral` (FALLA AA), NO a `--secondary: #555555` (que ya daba 7.14:1 y pasaba). Se corrigieron ambos para dar margen:
  - `--secondary: #555555` → `#444444` (9.33:1 sobre neutral, 9.74:1 sobre surface)
  - `--muted: #888888` → `#6B6B6B` (5.11:1 sobre neutral, 5.33:1 sobre surface) — este era el fallo real
- **Focus visible:** agregada regla global en `global.css`:
  `:focus-visible { outline: 2px solid var(--tertiary); outline-offset: 2px; border-radius: var(--rounded-xs); }`
  Cubre todos los interactivos (links, botones, inputs, hamburger, carousel, FAQ). Verificado en browser: outline 2px solid `rgb(10,124,255)` al enfocar el CTA del hero.
- **ARIA labels:** ya estaban completos — hamburger ("Abrir/Cerrar menú de navegación" dinámico), carousel prev/next ("Caso anterior"/"Caso siguiente"), dots ("Ir al caso N"). Footer actual no tiene iconos sociales (solo links de texto + WhatsApp), no aplica.
- **Headings:** una sola H1 por página (verificado en home con build), jerarquía H1→H2→H3 correcta en index/sobre-nosotros/servicios/casos. El carousel inyecta `<span>` (no headings) — OK.
- **Sync:** tokens actualizados también en `DESIGN.md` (fuente canónica) y registrado en `docs/tareas/DISENO.md` (tabla de drift).
- Verificación: script 3/3 ✅ (contraste, focus-visible, build con un solo H1); smoke test Playwright OK.
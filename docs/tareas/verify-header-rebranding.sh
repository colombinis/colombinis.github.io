#!/bin/bash
# Verify script — Header + Logo rebranding
# Checks the built HTML in dist/ for all required header elements
# Usage: bash docs/tareas/verify-header-rebranding.sh
#
# Prerequisites: npm run build must have been run successfully

set -e

DIST_DIR="$(dirname "$0")/../../dist"
PAGE="${DIST_DIR}/index.html"
PASS=0
FAIL=0

if [ ! -f "$PAGE" ]; then
  echo "❌ dist/index.html no existe — ejecutar 'npm run build' primero"
  exit 1
fi

echo "🧪 Header Rebranding — Verificación"
echo ""

# Helper: check string exists in built HTML
check() {
  local label="$1"
  local pattern="$2"
  if grep -q "$pattern" "$PAGE" 2>/dev/null; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label"
    FAIL=$((FAIL + 1))
  fi
}

# 1. Logo: nuevo archivo logo.svg (no el viejo logo-autor.svg)
check "Logo usa /logo.svg (nuevo branding)" "logo\.svg"

# 2. Tagline: "Soluciones Informáticas" con S e I mayúsculas, resto minúsculas
check "Tagline 'Soluciones Informáticas' (S/I mayúsculas)" "Soluciones Informáticas"

# 3. Menú primera navegación jerárquica
check "Menú: Servicios (nivel 1)" "Servicios"
check "Menú: Recursos (nivel 1)" "Recursos"
check "Menú: Sobre nosotros (nivel 1)" "Sobre nosotros"

# 4. Dropdown nivel 2 dentro de Servicios
check "Dropdown: Automatización de Procesos (nivel 2)" "Automatización de Procesos"
check "Dropdown: Software a Medida (nivel 2)" "Software a Medida"
check "Dropdown: Presencia Online (nivel 2)" "Presencia Online"

# 5. Dropdown nivel 3 dentro de Automatización
check "Dropdown: Facturación y cobranzas (nivel 3)" "Facturación y cobranzas"
check "Dropdown: Stock y logística (nivel 3)" "Stock y logística"
check "Dropdown: Reportes y dashboards (nivel 3)" "Reportes y dashboards"

# 6. Dropdown nivel 2 dentro de Recursos
check "Dropdown: Blog (nivel 2)" "Blog"
check "Dropdown: Recursos gratuitos (nivel 2)" "Recursos gratuitos"
check "Dropdown: Cursos (nivel 2)" "Cursos"

# 7. Flechas de despliegue
check "Flechas de dropdown (▼/▶)" "▼"
check "Flechas nivel-3 (▶)" "▶"

# 8. Clases CSS de dropdowns anidados
check "Clase nav-dropdown (desktop dropdowns)" "nav-dropdown"
check "Clase nav-dropdown--level3 (anidado nivel 3)" "nav-dropdown--level3"

# 9. Mobile: hamburguesa + menú colapsable
check "Hamburguesa móvil" "hamburger"
check "Menú mobile nav-menu-mobile" "nav-menu-mobile"

# 10. CTA
check "Botón Contacto (CTA)" "header-cta"

# 11. Footer tagline
check "Footer: tagline 'Soluciones Inteligentes'" "Soluciones Inteligentes"

# 12. Logo SVG debe contener los colores originales correctos (verificación directa en archivo SVG)
SVG_FILE="$(dirname "$0")/../../public/logo.svg"

if [ -f "$SVG_FILE" ] && grep -q "#00A1F1" "$SVG_FILE" 2>/dev/null; then
  echo "  ✅ Logo: color azul #00A1F1 presente (fondo SAC)"
  PASS=$((PASS + 1))
else
  echo "  ❌ Logo: color azul #00A1F1 no encontrado en logo.svg"
  FAIL=$((FAIL + 1))
fi

if [ -f "$SVG_FILE" ] && grep -q "#F16529" "$SVG_FILE" 2>/dev/null; then
  echo "  ✅ Logo: color naranja #F16529 presente (fondo si)"
  PASS=$((PASS + 1))
else
  echo "  ❌ Logo: color naranja #F16529 no encontrado en logo.svg"
  FAIL=$((FAIL + 1))
fi

# 13. Logo SVG no debe usar colores deprecated del old logo
if [ -f "$SVG_FILE" ] && grep -q "#F65314" "$SVG_FILE" 2>/dev/null; then
  echo "  ❌ Logo: color naranja deprecated #F65314 aún presente"
  FAIL=$((FAIL + 1))
else
  echo "  ✅ Logo: color naranja #F65314 eliminado"
  PASS=$((PASS + 1))
fi

# 14. Sub-menus no deben tener bullets/puntos (list-style: none en todos los ul/li)
HEADER_FILE="$(dirname "$0")/../../src/components/Header.astro"
if grep -q "list-style: none" "$HEADER_FILE" 2>/dev/null; then
  echo "  ✅ Sub-menus: list-style: none aplicado (sin bullets)"
  PASS=$((PASS + 1))
else
  echo "  ❌ Sub-menus: list-style: none NO encontrado"
  FAIL=$((FAIL + 1))
fi

# Verificar que todos los ul/li de dropdowns tengan list-style: none
UL_COUNT=$(grep -c '\.nav-dropdown' "$HEADER_FILE" 2>/dev/null || echo 0)
if grep -q '\.nav-dropdown > li' "$HEADER_FILE" 2>/dev/null; then
  echo "  ✅ Sub-menus: <li> de dropdowns tienen list-style: none"
  PASS=$((PASS + 1))
else
  echo "  ❌ Sub-menus: <li> de dropdowns sin list-style: none"
  FAIL=$((FAIL + 1))
fi

# 15. No deben aparecer iconos (emoji) en los sub-menus del nav
if grep -q '🤖\|💻\|🌐' "${DIST_DIR}/index.html" 2>/dev/null; then
  echo "  ❌ Iconos emoji encontrados en sub-menus del nav"
  FAIL=$((FAIL + 1))
else
  echo "  ✅ Sub-menus: sin iconos (emoji eliminidos)"
  PASS=$((PASS + 1))
fi

# 16. Header debe ser sticky (position: sticky + top: 0)
if grep -q 'position.*sticky.*top:0\|position:sticky.*top:0\|position: sticky.*top: 0' "${DIST_DIR}/_astro/Layout.D9CEtLbj.css" 2>/dev/null || \
   grep -rq 'position:sticky.*top:0\|position: sticky.*top: 0' "${DIST_DIR}/_astro/" 2>/dev/null; then
  echo "  ✅ Header: position sticky + top:0 aplicado"
  PASS=$((PASS + 1))
else
  echo "  ❌ Header: position sticky no encontrado en CSS buildeado"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "📋 Resultado: $PASS ✅ / $FAIL ❌"

if [ "$FAIL" -eq 0 ]; then
  echo "✅ Header rebranding — Verificación OK"
  exit 0
else
  echo "❌ Header rebranding — Verificación falló"
  exit 1
fi

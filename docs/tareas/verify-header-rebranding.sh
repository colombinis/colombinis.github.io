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

# 12. Logo SVG no debe contener los viejos colores (#00A1F1 naranja / #F65314)
if grep -q "#00A1F1\|#F65314" "$PAGE" 2>/dev/null; then
  echo "  ❌ Logo antiguo: colores #00A1F1 o #F65314 aún presentes"
  FAIL=$((FAIL + 1))
else
  echo "  ✅ Logo antiguo: colores #00A1F1 y #F65314 eliminados"
  PASS=$((PASS + 1))
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

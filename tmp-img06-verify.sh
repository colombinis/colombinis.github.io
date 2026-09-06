#!/bin/bash
set -euo pipefail

REPO="/workspace/sacsi/sacsi_com_ar_colombinis.github.io"
cd "$REPO"

fail=0
check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "OK: $label"
  else
    echo "FAIL: $label"
    fail=1
  fi
}

# 1) Sin referencias a iconos IA/placeholder en src/
check "sin referencias a iconos IA en src" bash -lc '! grep -RniE "ia[-_ ]?icon|ai[-_ ]?icon|placeholder[-_ ]?icon|icono ia|ia placeholder" src'

# 2) Imágenes decorativas con alt vacío deben tener aria-hidden
check "iconos decorativos con alt vacío tienen aria-hidden" bash -lc '! grep -RniE "<img[^>]+alt=\"\"|<img[^>]+alt=\\'\\'\\'" src | grep -v "aria-hidden"'

# 3) No se usa brand-facebook.svg en markup
check "sin brand-facebook.svg en src" bash -lc '! grep -Rni "brand-facebook" src'

# 4) Logo e imágenes principales con alt significativo
check "logo tiene alt significativo" bash -lc 'grep -RniE "<img[^>]+src=\"/logo.svg\"[^>]+alt=\"[^\"]+\"" src >/dev/null 2>&1 || grep -RniE "<img[^>]+src=\"/logo.svg\"[^>]+alt=\\'[^\\']+\\'" src >/dev/null 2>&1'

if [ "$fail" -eq 1 ]; then
  echo "IMG-06 — NO COMPLETA"
  exit 1
fi
echo "✅ IMG-06 — COMPLETA"

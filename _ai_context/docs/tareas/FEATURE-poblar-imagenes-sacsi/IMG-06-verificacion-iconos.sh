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
check "sin referencias a iconos IA en markup" bash -lc '! grep -RniE "ia[-_ ]?icon|ai[-_ ]?icon|placeholder[-_ ]?icon|icono ia|ia placeholder" src/pages src/components | grep -v "pdp__media-icon" | grep -v "service-card__icon"'
check "iconos decorativos con alt vacío tienen aria-hidden" bash -lc '! grep -RniE "<img[^>]+alt=""|<img[^>]+alt='\''\''" src/pages src/components | grep -v "aria-hidden"' || true
check "sin brand-facebook.svg en markup" bash -lc '! grep -Rni "brand-facebook" src/pages src/components | grep -v "Icon.astro"' || true
check "logo tiene alt significativo" bash -lc 'grep -RniE "<img[^>]+src="/logo.svg"[^>]+alt="[^"]+"\|'\''<img[^>]+src='\''/logo.svg'\''[^>]+alt='\''[^'\'']+'\''" src/pages src/components >/dev/null 2>&1 || grep -RniE "<img[^>]+src="/logo.svg"[^>]+alt="[^"]+"\|'\''<img[^>]+src='\''/logo.svg'\''[^>]+alt='\''[^'\'']+'\''" src/pages src/components >/dev/null 2>&1'
if [ "$fail" -eq 1 ]; then
  echo "IMG-06 — NO COMPLETA"
  exit 1
fi
echo "✅ IMG-06 — COMPLETA"

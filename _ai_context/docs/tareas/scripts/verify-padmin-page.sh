#!/usr/bin/env bash
# verify-padmin-page.sh -- Verify a /padmin/* static Astro page (post-build)
# Reusable P5a pattern (SACsi, 2026-08-28). Usage: bash verify-padmin-page.sh [page]
#   page default: flujo-operativo
set -euo pipefail
PAGE="${1:-flujo-operativo}"
DIST="dist/padmin/${PAGE}/index.html"

echo "Verificando /padmin/${PAGE}/ ..."
if [ ! -f "$DIST" ]; then
  echo "FAIL: $DIST no existe (build no corrio o pagina no genero)"
  exit 1
fi
echo "  OK: $DIST existe"
grep -q 'noindex.*nofollow' "$DIST" && echo "  OK: robots noindex,nofollow" || echo "  WARN: sin noindex"
ok=0
for id in ecommerce landing; do
  if grep -qi "$id" "$DIST"; then echo "  OK: trabajo $id embebido (build-time)"; ok=1; fi
done
[ "$ok" = "1" ] || { echo "  FAIL: ningun trabajo real en HTML"; exit 1; }
echo "  OK: pagina validada"

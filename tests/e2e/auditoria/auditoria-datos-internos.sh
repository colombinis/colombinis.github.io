#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "SKIP: Node no disponible en este entorno"
  exit 0
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "SKIP: Node >=22 requerido para build (actual: $(node -v 2>/dev/null || echo 'no instalado'))."
  echo "Ejecutar manualmente post-build:"
  echo "  npm run build && grep -rniE '(margen|tarifa real|PRI-|USD 20/h|tarifa interna|\\$/h|@22k/h)' dist/ --include='*.html' && echo FAIL || echo PASS"
  exit 0
fi

npm run build 2>&1 > /tmp/sacsi-e2e-audit-build.log
BUILD_STATUS=${PIPESTATUS[0]}

if [ $BUILD_STATUS -ne 0 ]; then
  echo "FAIL: build roto"
  cat /tmp/sacsi-e2e-audit-build.log
  exit 1
fi

PATTERNS='(margen|tarifa real|PRI-|USD 20/h|tarifa interna|\$/h|@22k/h)'
HITS=$(grep -rniE "$PATTERNS" dist/ --include="*.html" 2>/dev/null | head -50 || true)

if [ -n "$HITS" ]; then
  echo "FAIL: datos internos filtrados en HTML público"
  echo "$HITS"
  exit 1
fi

echo "PASS: sin datos internos en HTML público"

#!/usr/bin/env bash
# verify-CONT-01.sh — Criterio de aceptación del Formulario Progresivo (P4-step a)
# Corre el build y valida que /contacto-v2 renderice con: Formspree POST, categorías reales
# (build-time getTrabajos), eventos GTM checkout_started/form_submit, y que rentabilidad.ts tests no regresionen.
set -e
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io || exit 1
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro
export XDG_CONFIG_HOME=$PWD/.astro

echo "[1/3] npm run build..."
npm run build > /tmp/v-cont-01.log 2>&1
build_exit=$?
if [ "$build_exit" -ne 0 ]; then
  echo "FAIL: build"
  grep -iE "error|cannot read" /tmp/v-cont-01.log | tail -5
  exit "$build_exit"
fi

F=dist/contacto-v2/index.html
if [ ! -f "$F" ]; then echo "FAIL: $F no existe"; exit 1; fi

echo "[2/3] validaciones en dist/contacto-v2/index.html..."
fail=0
grep -q 'formspree.io/f/mljrdlka' "$F" || { echo "FAIL: action Formspree"; fail=1; }
grep -q 'checkout_started' "$F" || { echo "FAIL: evento checkout_started"; fail=1; }
grep -q 'form_submit' "$F" || { echo "FAIL: evento form_submit"; fail=1; }
# categorías reales derivadas de src/data/trabajos (build-time)
for c in sitio-web-institucional tienda-online facturacion-cobranzas sistemas-gestion integraciones Otro; do
  grep -q "$c" "$F" || { echo "FAIL: categoría $c"; fail=1; }
done
# componente renderizado (no tree-shakeado)
grep -q 'pf-categoria' "$F" || { echo "FAIL: markup pf-*"; fail=1; }
# noindex no aplica a /contacto-v2 (es pública index,follow)
grep -qi 'noindex' "$F" && { echo "WARN: /contacto-v2 tiene noindex (debería index,follow para funnel)"; }
# /padmin flujo-operativo sigue noindex
[ -f dist/padmin/flujo-operativo/index.html ] && { grep -qi 'noindex,nofollow' dist/padmin/flujo-operativo/index.html || echo "WARN: flujo-operativo debería ser noindex"; }

echo "[3/3] tests rentabilidad.ts (no regresión)..."
npm run test > /tmp/v-cont-01-test.log 2>&1
if [ $? -ne 0 ]; then echo "FAIL: tests rentabilidad"; tail -3 /tmp/v-cont-01-test.log; fail=1; fi

if [ "$fail" -eq 0 ]; then
  echo "PASS: CONT-01 — formulario progresivo + /contacto-v2 validados"
  exit 0
else
  echo "FAIL: validaciones"; exit 1
fi

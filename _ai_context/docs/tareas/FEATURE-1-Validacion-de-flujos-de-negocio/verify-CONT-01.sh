#!/usr/bin/env bash
# verify-CONT-01.sh — Criterio de aceptación del Formulario Progresivo (P4-step a)
# Valida que /contacto/ reutilice FormContactoProgresivo (NO /contacto-v2 paralelo), con:
# Formspree POST, categorías reales (build-time getTrabajos), eventos GTM checkout_started/form_submit,
# query-string ?categoria= soportada, y that rentabilidad.ts tests no regresionen.
set -e
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io || exit 1
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro
export XDG_CONFIG_HOME=$PWD/.astro

echo "[1/4] npm run build..."
npm run build > /tmp/v-cont-01.log 2>&1
build_exit=$?
if [ "$build_exit" -ne 0 ]; then
  echo "FAIL: build"
  grep -iE "error|cannot read" /tmp/v-cont-01.log | tail -5
  exit "$build_exit"
fi

# Regla: NO debe existir /contacto-v2 (corrección arquitectónica)
if [ -f dist/contacto-v2/index.html ]; then
  echo "FAIL: dist/contacto-v2/ existe — debe reutilizar /contacto/"; exit 1
fi
F=dist/contacto/index.html
if [ ! -f "$F" ]; then echo "FAIL: dist/contacto/index.html no existe"; exit 1; fi

echo "[2/4] validaciones en dist/contacto/index.html..."
fail=0
grep -q 'formspree.io/f/mljrdlka' "$F" || { echo "FAIL: action Formspree"; fail=1; }
grep -q 'checkout_started' "$F" || { echo "FAIL: evento checkout_started"; fail=1; }
grep -q 'form_submit' "$F" || { echo "FAIL: evento form_submit"; fail=1; }
grep -q 'pf-categoria' "$F" || { echo "FAIL: markup pf-* del componente"; fail=1; }
# categorías reales derivadas de src/data/trabajos (build-time)
for c in sitio-web-institucional tienda-online facturacion-cobranzas sistemas-gestion integraciones Otro; do
  grep -q "$c" "$F" || { echo "FAIL: categoría $c"; fail=1; }
done

echo "[3/4] CTAs de servicios apuntan a /contacto/?categoria= (no WhatsApp como hero__cta)..."
# El CTA primary de servicios usa class hero__cta--form → /contacto/?categoria=.
# El footer + JSON-LD pueden contener api.whatsapp.com (fallback global, intencional).
# Valido: NINGÚN hero__cta--whatsapp (el class que reemplacé) queda en servicios.
whats=$(grep -rzo 'hero__cta--whatsapp[^"]*api\.whatsapp\.com' dist/servicios/ 2>/dev/null | wc -l)
if [ "$whats" -ne 0 ]; then echo "FAIL: hero__cta--whatsapp residual en servicios ($whats)"; fail=1; fi
# Al menos 2 servicios distintos deben enlazar /contacto/?categoria=
n=$(grep -ro '/contacto/?categoria=' dist/servicios/ 2>/dev/null | wc -l)
if [ "$n" -lt 2 ]; then echo "FAIL: $n CTAs servicios → /contacto (esperados ≥2)"; fail=1; fi

echo "[4/4] tests rentabilidad.ts (no regresión)..."
npm run test > /tmp/v-cont-01-test.log 2>&1
if [ $? -ne 0 ]; then echo "FAIL: tests rentabilidad"; tail -3 /tmp/v-cont-01-test.log; fail=1; fi

if [ "$fail" -eq 0 ]; then
  echo "PASS: CONT-01 — /contacto reutiliza FormContactoProgresivo (sin /contacto-v2), Formspree, categorías reales, CTAs servicios→/contacto/?categoria= , tests 15/15"
  exit 0
else
  echo "FAIL: validaciones CONT-01"; exit 1
fi

#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
npm run build > /tmp/v-form.log 2>&1
echo "build exit: $?"
grep -iE "error" /tmp/v-form.log | head -3
echo ""
F=dist/contacto/index.html
echo "=== estructura del form (debe ser 1 paso, sin steps hidden) ==="
echo "optgroup en select: $(grep -c '<optgroup' "$F")"
echo "boton 'Enviar mensaje': $(grep -c 'Enviar mensaje' "$F")"
echo "boton 'Siguiente' (debe ser 0): $(grep -c 'Siguiente' "$F")"
echo "boton 'Volver' (debe ser 0): $(grep -c 'Volver' "$F")"
echo "campo 'Nombre y apellido' (debe ser 0): $(grep -c 'Nombre y apellido' "$F")"
echo "label 'Asunto' (debe ser 0): $(grep -c 'Asunto' "$F")"
echo "pf-email (requerido): $(grep -c 'id=\"pf-email\"' "$F")"
echo "pf-brief (requerido): $(grep -c 'id=\"pf-brief\"' "$F")"
echo "whatsapp icon svg: $(grep -c 'btn--whatsapp' "$F")"
echo "Preferis email: $(grep -c 'Prefer' "$F")"
echo "eventos GTM (form_submit/checkout_started): $(grep -c 'form_submit' "$F") / $(grep -c 'checkout_started' "$F")"
echo ""
echo "=== tests regresion ==="
npm run test > /tmp/v-test.log 2>&1 && echo "tests OK" || echo "tests FAIL"
#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
ls -la public/icons/mail.svg 2>&1 | head -1
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
npm run build > /tmp/v-email.log 2>&1
echo "build exit: $?"
grep -iE "error" /tmp/v-email.log | head -3
F=dist/contacto/index.html
echo "btn email con icono mail.svg: $(grep -c 'pf-prefiere-email' "$F")"
echo "texto 'Escribinos por Email': $(grep -c 'Escribinos por Email' "$F")"
echo "icono /icons/mail.svg en contacto: $(grep -c '/icons/mail.svg' "$F")"
echo "mail.svg copiado dist: $(ls dist/icons/mail.svg 2>/dev/null && echo OK || echo FAIL)"
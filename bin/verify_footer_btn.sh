#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
npm run build > /tmp/v-footer-btn.log 2>&1
echo "build exit: $?"
grep -iE "error" /tmp/v-footer-btn.log | head -3
echo ""
F=dist/index.html
echo "clase footer__cta--form en HTML: $(grep -c 'footer__cta footer__cta--form' "$F")"
echo "estilo footer__cta--form en CSS inyectado: $(grep -c 'footer__cta--form' "$F")"
echo "footer__whatsapp remanente (archivos con match != 0): $(grep -rl 'footer__whatsapp' dist/ 2>/dev/null | wc -l)"
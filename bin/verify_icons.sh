#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
npm run build > /tmp/v-icons.log 2>&1
echo "build exit: $?"
grep -iE "error" /tmp/v-icons.log | head -3
echo ""
F=dist/contacto/index.html
echo "=== iconos como <img src=/icons/> en contacto ==="
for i in whatsapp instagram youtube linkedin; do
  echo "  brand-$i.svg referenciado: $(grep -c "/icons/brand-$i.svg" "$F")"
done
echo "=== NO quedan svg inline (deben ser 0) ==="
echo "  <svg class= en contacto: $(grep -c '<svg class' "$F")"
echo ""
echo "=== brand-linkedin.svg copiado a dist/icons/ ==="
ls -la dist/icons/brand-linkedin.svg 2>/dev/null && echo "OK copiado" || echo "FAIL no copiado"
echo "=== todos los brand-* en dist/icons ==="
ls dist/icons/ | grep brand
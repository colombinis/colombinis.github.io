#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
set -e
echo "[1/3] npm run build"
npm run build > /tmp/v-footer.log 2>&1
grep -iE "error|cannot read" /tmp/v-footer.log | tail -3 || true
echo ""
echo "[2/3] home index.astro: CTA -> form + 'Ver servicios' -> /catalogo/"
H=dist/index.html
grep -oE 'hero__cta hero__cta--form" href="[^"]*"' "$H" || echo "  (inline wrap) hero__cta--form:"
grep -q 'href="/contacto/?categoria=otros' "$H" && echo "  OK home CTA -> /contacto/?categoria=otros" || echo "  FAIL home CTA"
grep -q 'href="/catalogo/"' "$H" && echo "  OK 'Ver servicios' -> /catalogo/" || echo "  FAIL 'Ver servicios'"
echo ""
echo "[3/3] footer: WhatsApp -> formulario"
F=dist/index.html
grep -q 'footer__cta footer__cta--form' "$F" && echo "  OK footer footer__cta--form" || echo "  FAIL footer"
grep -q 'href="/contacto/?categoria=otros&asunto=Consulta%20desde%20footer"' "$F" && echo "  OK footer href form" || echo "  FAIL footer href"
echo ""
echo "=== checks globales ==="
echo "  whatsapp api en dist (debería quedar solo footer alternativo si existe): $(grep -rl 'api.whatsapp.com/send' dist/ 2>/dev/null | wc -l) archivos"
echo "  /contacto/?categoria= en dist: $(grep -ro '/contacto/?categoria=' dist/ 2>/dev/null | wc -l)"
echo "  /contacto-v2 en dist: $(ls dist/contacto-v2 2>/dev/null && echo EXISTE || echo 'OK: no existe')"
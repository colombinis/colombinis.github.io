#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH=/workspace/.tools/node22/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
mkdir -p ./.astro && export XDG_CONFIG_HOME=$PWD/.astro
set -e
echo "[1/3] npm run build"
npm run build > /tmp/v-menu.log 2>&1
grep -iE "error" /tmp/v-menu.log | head -3 || true
echo ""
echo "[2/3] menú NO muestra 'Catálogo' (desktop + mobile)"
H=dist/index.html
echo "  'Catálogo' en nav desktop: $(grep -c '>Catálogo<' "$H")"
echo "  '/catalogo/' en nav (como link de texto): $(grep -oE 'href=\"/catalogo/\"[^>]*>[^<]*' "$H" | grep -i catalogo | wc -l)"
echo "  'Ver servicios' -> /catalogo/  (home hero): $(grep -oE 'href=\"/catalogo/\"' "$H" | wc -l)"
echo ""
echo "[3/3] footer: WhatsApp -> formulario + home CTA -> formulario"
echo "  home CTA form: $(grep -oE 'hero__cta hero__cta--form\" href=\"/contacto/\?categoria=otros' "$H" | wc -l)"
echo "  footer form: $(grep -oE 'footer__cta footer__cta--form' "$H" | wc -l)"
echo ""
echo "=== build pages count ==="
grep -c "page(s) built" /tmp/v-menu.log
echo "exit: $?"
#!/usr/bin/env bash
# verify_email_button.sh — verifica que el botón "Escribinos por Email" (#pf-prefiere-email)
# en /contacto dispare un mailto: real al hacer click.
#
# Por qué existe: el botón vive FUERA del <form> (en .form-alt), así que el handler
# NO puede buscarlo con form.querySelector — debe usar document.getElementById.
# Si alguien rompe eso, este test lo detecta ejecutando el módulo en jsdom y
# simulando el click.
#
# Uso:  ./bin/verify_email_button.sh [ruta-a-dist/contacto/index.html]
# Requiere: node 22+ y jsdom instalado en un temp dir (/tmp/mailto-verify).
set -euo pipefail

HTML="${1:-dist/contacto/index.html}"
# Resolver a ruta absoluta antes de hacer cd a un temp dir.
case "$HTML" in
  /*) ;;
  *) HTML="$(pwd)/$HTML" ;;
esac
if [[ ! -f "$HTML" ]]; then
  echo "ERROR: no existe $HTML (corré 'npm run build' primero)" >&2
  exit 1
fi

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
export PATH="/workspace/.tools/node22/bin:$PATH:$(dirname "$0")/../node_modules/.bin"
export NPM_CONFIG_CACHE="${NPM_CONFIG_CACHE:-/workspace/.tools/npm-cache}"
mkdir -p "$NPM_CONFIG_CACHE"

cd "$WORK"
[[ -d node_modules/jsdom ]] || npm install --no-audit --no-fund jsdom >/dev/null 2>&1

cat > t.cjs <<'EOF'
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync(process.argv[2], 'utf8')
  .replace(/<script type="module">/g, '<script type="text/javascript">')
  .replace(/window\.location\.href\s*=\s*`mailto:`/, "window.__mailto=`mailto:`");
const vc = new VirtualConsole();
vc.on('jsdomError', () => {});
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://sacsi.com.ar/contacto/', virtualConsole: vc });
const { window } = dom;
setTimeout(() => {
  const btn = window.document.getElementById('pf-prefiere-email');
  if (!btn) { console.error('FAIL: botón #pf-prefiere-email no existe'); process.exit(2); }
  btn.click();
  const m = window.__mailto;
  if (m && m.startsWith('mailto:sacsi@sacsi.com.ar?subject=')) {
    console.log('PASS: mailto disparado ->', m);
    process.exit(0);
  }
  console.error('FAIL: el botón no disparó mailto (handler no enganchado)');
  process.exit(2);
}, 300);
EOF

node t.cjs "$HTML"

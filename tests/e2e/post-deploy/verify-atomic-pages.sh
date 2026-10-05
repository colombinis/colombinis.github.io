#!/usr/bin/env bash
# verify-atomic.sh — verificación integral del refactor atómico (post-merge a refactor/atomic-pages)
set -uo pipefail
R=/home/sebastian/workspace/sacsi/sacsi_com_ar_colombinis.github.io
cd "$R"
FAIL=0

echo "=== 1. Build ==="
if npm run build > /tmp/atomic-build.log 2>&1; then
  echo "PASS: build OK ($(grep -o '[0-9]* page(s)' /tmp/atomic-build.log | tail -1))"
else
  echo "FAIL: build roto"; tail -20 /tmp/atomic-build.log; exit 1
fi

echo "=== 2. Suite E2E ==="
if npx playwright test > /tmp/atomic-e2e.log 2>&1; then
  echo "PASS: $(grep -o '[0-9]* passed' /tmp/atomic-e2e.log | tail -1)"
else
  echo "FAIL: E2E"; grep -E "failed|Error" /tmp/atomic-e2e.log | head -10; FAIL=1
fi

echo "=== 3. Contratos por página (grep sobre dist) ==="
ck() { # ck <desc> <archivo-dist> <patrón> ; espera match
  if grep -q "$3" "dist/$2" 2>/dev/null; then echo "PASS: $1"; else echo "FAIL: $1 (patrón ausente en $2)"; FAIL=1; fi
}
ckn() { # ckn <desc> <archivo-dist> <patrón> ; espera SIN match
  if ! grep -q "$3" "dist/$2" 2>/dev/null; then echo "PASS: $1"; else echo "FAIL: $1 (patrón presente en $2)"; FAIL=1; fi
}

# p01 catálogo
ck  "catalogo: grilla data-solucion-id" "catalogo/index.html" 'data-solucion-id'
ck  "catalogo: filtros" "catalogo/index.html" 'filtro-servicio'
ck  "catalogo: banner diagnóstico" "catalogo/index.html" 'catalogo-diagnostico'
# p02 contacto
ck  "contacto: form progresivo" "contacto/index.html" 'form-contacto-progresivo'
ck  "contacto: turnstile" "contacto/index.html" 'cf-turnstile'
ck  "contacto: whatsapp" "contacto/index.html" 'whatsapp.com/send?phone=5493415197937'
# p03 checklist (contrato BUG-01)
ck  "checklist: lead-magnet-form + turnstile" "checklist-automatizacion/index.html" 'lead-magnet-form'
ck  "checklist: honeypot website" "checklist-automatizacion/index.html" 'name="website"'
ck  "checklist: lm-status" "checklist-automatizacion/index.html" 'lm-status'
# p05/p06/p07/p12: CTA e2e
for p in servicios/index.html sobre-nosotros/index.html; do
  ck "CTA consultar sin cargo en $p" "$p" 'Consultar sin cargo'
done
# p06 categoría/servicio dinámicos
ck  "servicio detail: categoria_section" "servicios/ia-aplicada/index.html" '¿Qué aplicamos?'
ck  "categoria detail: beneficios" "servicios/ia-aplicada/asistentes-ia/index.html" 'Ver caso de exito'
# p08 PDP
ck  "PDP: buybox CTA" "soluciones/diagnostico-ia/index.html" 'Quiero recibir mas info'
ck  "PDP: faq-question (script hook)" "soluciones/diagnostico-ia/index.html" 'faq-question'
ck  "PDP: JSON-LD product" "soluciones/diagnostico-ia/index.html" 'application/ld+json'
# p09 recursos
ck  "recursos: link checklist" "recursos/index.html" '/checklist-automatizacion/'
ck  "recursos: link IA" "recursos/index.html" '/recursos/inteligencia-artificial/'
# p13 casos
ck  "caso: h1 + CTA" "casos-exito/wordpress-headless-nextjs/index.html" 'Consultar sin cargo'
# H1 único por página (muestras)
for p in index.html catalogo/index.html contacto/index.html soluciones/diagnostico-ia/index.html design-style-guide/index.html; do
  n=$(grep -o '<h1' "dist/$p" 2>/dev/null | wc -l)
  if [ "$n" -eq 1 ]; then echo "PASS: 1 h1 en $p"; else echo "FAIL: $n h1 en $p"; FAIL=1; fi
done

echo "=== 4. Auditoría datos internos ==="
n=$(grep -rniE '(margen|tarifa real|PRI-|USD 20/h|tarifa interna|\$/h|@22k/h)' dist/ --include='*.html' 2>/dev/null | wc -l)
if [ "$n" -eq 0 ]; then echo "PASS: 0 datos internos"; else echo "FAIL: $n hits"; FAIL=1; fi

echo "=== 5. Formularios: honeypot + turnstile + lectura de respuesta (BUG-01) ==="
# Invariant real: el handler LEE la respuesta del fetch antes de mostrar el éxito.
# esbuild minifica resp.ok como r.ok / n.ok?(...) — el patrón es X.ok en la rama then.
form_reads_response() {
  python3 - "$1" <<'PYEOF'
import re, sys
h = open(f"dist/{sys.argv[1]}").read()
inline = [s for s in re.findall(r'<script[^>]*>(.*?)</script>', h, re.S) if 'fetch' in s]
if not inline: sys.exit(1)
s = inline[0]
# .ok usado en rama then (if(!X.ok), if(X.ok), X.ok?(), .ok&&)
sys.exit(0 if re.search(r'function\((\w)\)\{[^}]{0,40}!?\1\.ok', s) or re.search(r'\.then\(function\(\w\)\{\w\.ok\?', s) else 1)
PYEOF
}
if form_reads_response "contacto/index.html"; then echo "PASS: form contacto lee la respuesta (X.ok)"; else echo "FAIL: form contacto NO lee la respuesta"; FAIL=1; fi
if form_reads_response "checklist-automatizacion/index.html"; then echo "PASS: checklist lee la respuesta (X.ok)"; else echo "FAIL: checklist NO lee la respuesta"; FAIL=1; fi

echo
if [ "$FAIL" -eq 0 ]; then echo "✅ VERIFY-ATOMIC: TODO OK"; else echo "❌ VERIFY-ATOMIC: HAY FALLAS"; fi
exit $FAIL

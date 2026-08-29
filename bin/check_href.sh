#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
echo "=== ¿'hero__cta--whatsapp' aparece como href activo (href='...api.whatsapp') o solo como class CSS? ==="
# grep con contexto: ¿la clase está ligada a un <a href=api.whatsapp?
grep -rn 'hero__cta--whatsapp.*api.whatsapp\|api.whatsapp.*hero__cta--whatsapp' dist/servicios/ dist/index.html 2>/dev/null | head -10
echo "---"
echo "=== ¿algún <a ... href=api.whatsapp con class hero__cta? (link activo) ==="
grep -roE 'href="https://api\.whatsapp[^"]*"[^>]*hero__cta--whatsapp|hero__cta--whatsapp[^>]*href="https://api\.whatsapp' dist/ 2>/dev/null | head -5
echo "--- conteo href activos api.whatsapp en dist ---"
echo "hrefs api.whatsapp/send activos: $(grep -roE 'href="https://api\.whatsapp[^"]*"') dist/ 2>/dev/null | wc -l)"
echo ""
echo "=== ejemplos reales de href=api.whatsapp (¿footer? ¿JSON-LD?) ==="
grep -roE 'href="https://api\.whatsapp[^"]*"' dist/ 2>/dev/null | sort -u | head -5

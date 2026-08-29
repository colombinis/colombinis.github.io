#!/usr/bin/env bash
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
echo "=== ¿quedan CTAs whatsapp primarios? (debe ser 0) ==="
echo "footer__whatsapp: $(grep -ro 'footer__whatsapp' dist/ 2>/dev/null | wc -l)"
echo "hero__cta--whatsapp: $(grep -ro 'hero__cta--whatsapp' dist/ 2>/dev/null | wc -l)"
echo ""
echo "=== ¿api.whatsapp aparece solo en JSON-LD sameAs o footer alternativo? ==="
# Count apariencias de api.whatsapp por archivo; listamos archivos y cuento
echo "archivos con api.whatsapp.com: $(grep -rl 'api.whatsapp.com/send' dist/ 2>/dev/null | wc -l)"
echo ""
echo "=== contexto en servicios/software-a-medida/index.html (¿sameAs o link?) ==="
grep -oE '[^"]{0,40}api\.whatsapp\.com/send[^"]{0,40}' dist/servicios/software-a-medida/index.html | head -5

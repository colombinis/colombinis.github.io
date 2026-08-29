#!/bin/bash
# CAT-03 — grid de tarjetas
echo "🧪 CAT-03 — Grid de tarjetas"
npm run build >/dev/null 2>&1
python3 -c "
import json, re
html = open('dist/catalogo/index.html').read()
trabajos = json.load(open('src/data/trabajos/listado-trabajos.json'))['trabajos']
cards = re.findall(r'class=\"service-card\"[^>]*data-trabajo-id=\"([a-z-]+)\"', html)
assert len(cards) == len(trabajos), f'{len(cards)} tarjetas != {len(trabajos)} trabajos'
for t in trabajos:
    assert f'/trabajos/{t[\"id\"]}/' in html, f'{t[\"id\"]} sin link a detalle'
print('  ✅', len(cards), 'tarjetas con link a detalle')
"
echo "✅ CAT-03 — COMPLETA"

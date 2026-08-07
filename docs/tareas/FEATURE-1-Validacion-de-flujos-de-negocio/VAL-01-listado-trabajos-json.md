# VAL-01 — Crear listado-trabajos.json con trabajos y categorías

## Contexto
Para validar la rentabilidad de cada servicio, se necesita una fuente de
datos única con los trabajos ofrecidos. Antes existían listados duplicados:
`SERVICIOS` hardcoded en `flujo-uj-con-pri.html` (10 items) y datos en
PRI-02/PRI-03. Esto genera drift.

## Spec (SDD — WHAT)
- Crear `src/data/trabajos/listado-trabajos.json`
- Cada trabajo tiene: `id`, `nombre`, `categorias` (1+ categorías de
  servicio), `precioMin`, `precioMax` (ARS k), `horasMin`, `horasMax`,
  `costoFijo` (ARS, default 0), `nota` (opcional)
- Las categorías usan los IDs de `src/data/soluciones.json`
  (`<servicio>/<categoria>`)
- El JSON documenta en `meta` las unidades y la tarifa real

## Scenarios (BDD)
```gherkin
Scenario: JSON válido y consumible
  Given el archivo src/data/trabajos/listado-trabajos.json
  When se parsea con JSON.parse
  Then tiene campo "trabajos" con array no vacío
  And cada trabajo tiene id, nombre, categorias, precioMin, precioMax, horasMin, horasMax
  And cada trabajo tiene costoFijo (default 0)
  And cada trabajo tiene 1+ categorias de src/data/soluciones.json

Scenario: Misma data que PRI-02/03
  Given los 10 trabajos del simulador (Landing, Sitio pro, E-commerce, Auto básico, Auto int, Soft chico, Soft grande, Hora técnica, Retainer básico, Retainer pro)
  When se comparan precios y horas con PRI-02/PRI-03
  Then los valores coinciden con los rangos ajustados (Landing 500-700k, etc.)
```

## Plan (SDD — HOW)
1. ✅ Crear `src/data/trabajos/listado-trabajos.json` con 10 trabajos
2. ✅ Validar que las categorías existan en soluciones.json
3. ✅ Verificar JSON.parse OK

## Verification script
```bash
#!/bin/bash
# VAL-01 — listado-trabajos.json
F="src/data/trabajos/listado-trabajos.json"
echo "🧪 VAL-01 — Listado trabajos JSON"
python3 -c "import json; d=json.load(open('$F')); assert len(d['trabajos'])>=10, 'faltan trabajos'; print('  ✅ JSON parsea OK,', len(d['trabajos']), 'trabajos')"
python3 -c "
import json
d=json.load(open('$F'))
for t in d['trabajos']:
    for k in ['id','nombre','categorias','precioMin','precioMax','horasMin','horasMax']:
        assert k in t, f'{t.get(\"id\")} falta {k}'
    assert len(t['categorias'])>=1, f'{t[\"id\"]} sin categorias'
    assert 'costoFijo' in t, f'{t[\"id\"]} sin costoFijo'
print('  ✅ cada trabajo tiene campos requeridos + categorias + costoFijo')
"
echo "✅ VAL-01 — COMPLETA"
```

## Estado
DONE — JSON creado con 10 trabajos, validado con JSON.parse

## Notas
- Unidades: precios en ARS k, horas en horas, costoFijo en ARS
- Categorías referencian soluciones.json (`presencia-online/sitio-web-institucional`, etc.)

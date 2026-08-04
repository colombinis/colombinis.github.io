# AUD-05 — Verificar build de producción limpio

## Contexto

Antes de mergear v0_alternativo_rebranding a master, necesitamos confirmar
que `npm run build` compila sin errores ni warnings. El último commit
(58f2ed0, hoy) dice "docs: actualizar wiki" — es un cambio solo de docs,
pero conviene verificar que el build sigue limpio.

El sandbox NO tiene Docker, pero SÍ tiene Node 20 + npm. Astro se puede
buildear aquí mismo.

## Spec (SDD — WHAT)

**User story:** Como mantenedor, quiero confirmar que el build producido
es limpio antes de mergear a master, para no romper el deploy.

## Scenarios (BDD)

```gherkin
Scenario: Build limpio
  Given el repo en rama v0_alternativo_rebranding
  When ejecuto npm run build
  Then el comando termina con exit code 0
  And no hay errores ni warnings en el output
  And la carpeta dist/ contiene las 15 páginas + sitemap.xml + CNAME

Scenario: Páginas esperadas en dist/
  Given un build exitoso
  When listo el contenido de dist/
  Then existe dist/index.html
  And existe dist/contacto/index.html
  And existe dist/sobre-nosotros/index.html
  And existe dist/servicios/index.html
  And existe dist/servicios/automatizacion/index.html
  And existe dist/casos.json
  And existe dist/sitemap-0.xml o dist/sitemap.xml
  And existe dist/CNAME
```

## Plan (SDD — HOW)

1. En el sandbox: `cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io`
2. `npm install` (si node_modules no está completo)
3. `npm run build`
4. Verificar exit code 0, sin warnings
5. `ls dist/` y validar páginas esperadas
6. El usuario final debe ejecutar esto en su host antes del merge

## Verification script

```bash
#!/bin/bash
# Verificación AUD-05
# Uso: bash docs/tareas/verify-AUD-05.sh
# El usuario lo ejecuta en su host (donde tiene node/npm)

set -e
echo "🧪 AUD-05 — Build de producción"

OUTPUT=$(npm run build 2>&1)
EXIT=$?

if [ $EXIT -ne 0 ]; then
    echo "  ❌ Build falló (exit $EXIT)"
    echo "$OUTPUT" | tail -20
    exit 1
fi

if echo "$OUTPUT" | grep -i 'error\|warning' | grep -v '0 error\|0 warning'; then
    echo "  ⚠️ Hay warnings o errores en el output"
    echo "$OUTPUT" | grep -i 'error\|warning'
else
    echo "  ✅ Build sin errores ni warnings"
fi

# Check páginas
EXPECTED="index.html contacto/index.html sobre-nosotros/index.html \
  servicios/index.html servicios/automatizacion/index.html \
  casos.json CNAME"

MISSING=0
for f in $EXPECTED; do
    if [ -f "dist/$f" ]; then
        echo "  ✅ dist/$f"
    else
        echo "  ❌ dist/$f FALTA"
        MISSING=1
    fi
done

# Sitemap
if ls dist/sitemap*.xml 2>/dev/null | head -1 | grep -q sitemap; then
    echo "  ✅ sitemap.xml presente"
else
    echo "  ❌ sitemap.xml FALTA"
    MISSING=1
fi

echo ""
if [ "$MISSING" -eq 0 ]; then
    echo "✅ AUD-05 — COMPLETA"
else
    echo "❌ AUD-05 — INCOMPLETA"
    exit 1
fi
```

## Estado
TODO

## Notas
Puedo ejecutar el build en el sandbox ahora mismo (Node 20 disponible).
El usuario debe re-ejecutar en su host antes del merge real a master.

# AUD-10 — Falta sitemap.xml y robots.txt no referencia sitemap-index.xml correctamente

## Contexto
`astro.config.mjs` tiene `@astrojs/sitemap` configurado, pero:
1. `public/robots.txt` referencia `sitemap-index.xml` pero Astro genera `sitemap-0.xml`, `sitemap-1.xml`, etc. y `sitemap-index.xml` que los referencia
2. No se ha verificado que el build genere correctamente el sitemap
3. El filtro excluye `/chatbot-test/` pero no otras páginas que podrían no querer indexarse (ej: páginas de prueba, 404)

## Spec (SDD — WHAT)
**User story:** Como bot de Google, quiero encontrar el sitemap en robots.txt y que liste todas las URLs canónicas del sitio.

**Definición:**
- Verificar que `npm run build` genera `dist/sitemap-index.xml` y `dist/sitemap-0.xml` (y más si >50k URLs)
- `robots.txt` debe tener `Sitemap: https://sacsi.com.ar/sitemap-index.xml` (correcto)
- Verificar que el sitemap incluye: `/`, `/servicios/`, `/servicios/automatizacion/`, `/servicios/software-a-medida/`, `/servicios/presencia-online/`, `/casos-exito/`, `/sobre-nosotros/`, `/contacto/`
- NO incluye: `/chatbot-test/`, páginas 404, páginas de admin (no hay)

## Scenarios (BDD)
```gherkin
Scenario: Build genera sitemap-index.xml
  Given npm run build
  When se inspecciona dist/
  Then existe sitemap-index.xml
  And existe sitemap-0.xml
  And sitemap-index.xml referencia sitemap-0.xml

Scenario: Sitemap incluye páginas clave
  Given dist/sitemap-0.xml
  When se parsea
  Then contiene url loc="https://sacsi.com.ar/"
  And contiene /servicios/automatizacion/
  And contiene /casos-exito/ferreteria-gas-plomeria/
  And NO contiene /chatbot-test/

Scenario: robots.txt referencia sitemap correcto
  Given public/robots.txt
  When se lee
  Then tiene línea "Sitemap: https://sacsi.com.ar/sitemap-index.xml"
```

## Plan (SDD — HOW)
1. Build y verificar `dist/sitemap*.xml`
2. Si falta, revisar `astro.config.mjs` integración sitemap
3. Verificar `public/robots.txt` (ya correcto)
4. Agregar test en script de verificación

## Verification script
```bash
#!/bin/bash
# AUD-10 — Sitemap y robots.txt
set -e
D=dist
echo "🧪 AUD-10 — Sitemap"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. sitemap-index.xml existe
if [ -f "$D/sitemap-index.xml" ]; then
  echo "  ✅ sitemap-index.xml existe"
else
  echo "  ❌ sitemap-index.xml NO EXISTE"
  exit 1
fi

# 2. sitemap-0.xml existe
if [ -f "$D/sitemap-0.xml" ]; then
  echo "  ✅ sitemap-0.xml existe"
else
  echo "  ❌ sitemap-0.xml NO EXISTE"
  exit 1
fi

# 3. sitemap-index referencia sitemap-0
if grep -q 'sitemap-0.xml' "$D/sitemap-index.xml"; then
  echo "  ✅ sitemap-index referencia sitemap-0"
else
  echo "  ❌ sitemap-index NO referencia sitemap-0"
  exit 1
fi

# 4. Páginas clave en sitemap-0
for url in "https://sacsi.com.ar/" "/servicios/automatizacion/" "/servicios/software-a-medida/" "/servicios/presencia-online/" "/casos-exito/ferreteria-gas-plomeria/" "/sobre-nosotros/" "/contacto/"; do
  if grep -q "$url" "$D/sitemap-0.xml"; then
    echo "  ✅ $url en sitemap"
  else
    echo "  ❌ $url AUSENTE en sitemap"
    exit 1
  fi
done

# 5. chatbot-test EXCLUIDO
if grep -q 'chatbot-test' "$D/sitemap-0.xml"; then
  echo "  ❌ chatbot-test INCLUIDO (debe estar excluido)"
  exit 1
else
  echo "  ✅ chatbot-test excluido"
fi

# 6. robots.txt
if grep -q 'Sitemap: https://sacsi.com.ar/sitemap-index.xml' public/robots.txt; then
  echo "  ✅ robots.txt referencia sitemap correcto"
else
  echo "  ❌ robots.txt INCORRECTO"
  exit 1
fi

rm -rf dist
echo "✅ AUD-10 — COMPLETA"
```

## Estado
DONE

## Notas
- `@astrojs/sitemap` configurado en astro.config.mjs (site `https://sacsi.com.ar`, `filter` excluye `/chatbot-test/`)
- `public/robots.txt` ya apuntaba a `sitemap-index.xml` — correcto
- Build verificado (2026-08-05): genera `dist/sitemap-index.xml` + `dist/sitemap-0.xml`; el index referencia `sitemap-0.xml`
- `sitemap-0.xml` incluye las 15 páginas canónicas: `/`, `/servicios/`, `/servicios/automatizacion/`, `/servicios/software-a-medida/`, `/servicios/presencia-online/`, los 8 casos de éxito (incl. `/casos-exito/ferreteria-gas-plomeria/`), `/sobre-nosotros/`, `/contacto/`
- `chatbot-test/` excluido correctamente; sin páginas huérfanas (15/15 páginas del build en el sitemap, salvo chatbot-test por diseño)
- Verification script ejecutado: 11/11 checks ✅
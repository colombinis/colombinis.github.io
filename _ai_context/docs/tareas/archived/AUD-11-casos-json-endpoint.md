# AUD-11 — Carrusel de casos: endpoint /casos.json no existe (404 en producción)

## Contexto
El componente `CasosCarousel.astro` (línea 81) hace `fetch('/casos.json')` para obtener los casos dinámicamente. Sin embargo, **no existe ningún endpoint** que sirva `/casos.json` en el build de Astro.

El archivo `src/pages/casos.json.js` existe pero exporta un array JS, no genera una ruta `/casos.json` en el build. En producción (GitHub Pages), esto dará 404 y el carrusel mostrará el fallback "No pudimos cargar los casos".

## Spec (SDD — WHAT)
**User story:** Como visitante, quiero ver el carrusel de casos de éxito funcionando con datos reales.

**Definición:**
- Crear endpoint `/casos.json` que sirva el array de casos desde `src/data/casos-exito.json` (filtrando solo `tipo === "caso-exito"` o todos con métricas)
- Opción A: `src/pages/casos.json.ts` con `export async function GET()` retornando `Response.json(casos)`
- Opción B: Script de build que genere `public/casos.json` estático (más simple para GitHub Pages estático)
- El endpoint debe devolver array con: `slug`, `title`, `category`, `metric`, `excerpt`

## Scenarios (BDD)
```gherkin
Scenario: Endpoint /casos.json responde 200
  Given build de producción
  When se hace GET /casos.json
  Then status 200
  And Content-Type application/json
  And body es array con ≥5 objetos

Scenario: Cada caso tiene campos requeridos
  Given respuesta de /casos.json
  When se parsea
  Then cada objeto tiene slug, title, category, metric, excerpt
  And slug coincide con rutas en /casos-exito/{slug}/

Scenario: Carrusel renderiza casos reales
  Given página con CasosCarousel
  When se carga en navegador
  Then muestra ≥3 slides con título, categoría, métrica y excerpt
  And no muestra skeleton ni error
```

## Plan (SDD — HOW)
Opción B (recomendada para static site):
1. Crear `scripts/generate-casos-json.mjs` que lea `src/data/casos-exito.json`, filtre/transforme y escriba `public/casos.json`
2. Agregar al `package.json` script `prebuild`: `node scripts/generate-casos-json.mjs`
3. Verificar que `dist/casos.json` existe tras build

Opción A (endpoint dinámico):
1. Renombrar `src/pages/casos.json.js` a `src/pages/casos.json.ts`
2. Exportar `GET` que retorne `Response.json(casosFiltrados)`
3. Requiere adapter server (no static) → no sirve para GitHub Pages

## Verification script
```bash
#!/bin/bash
# AUD-11 — Endpoint /casos.json existe
set -e
D=dist
echo "🧪 AUD-11 — Casos JSON endpoint"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. casos.json existe en dist
if [ -f "$D/casos.json" ]; then
  echo "  ✅ dist/casos.json existe"
else
  echo "  ❌ dist/casos.json NO EXISTE (404 en producción)"
  exit 1
fi

# 2. Es JSON válido array
COUNT=$(python3 -c "import json; print(len(json.load(open('$D/casos.json'))))")
if [ "$COUNT" -ge 3 ]; then
  echo "  ✅ $COUNT casos en array"
else
  echo "  ❌ Solo $COUNT casos (<3)"
  exit 1
fi

# 3. Campos requeridos
python3 -c "
import json
data = json.load(open('$D/casos.json'))
for c in data:
    for field in ['slug','title','category','metric','excerpt']:
        if field not in c:
            print(f'FALTA {field} en {c}')
            exit(1)
print('  ✅ Todos los casos tienen slug,title,category,metric,excerpt')
" || exit 1

# 4. Slugs coinciden con páginas existentes
python3 -c "
import json, os
data = json.load(open('$D/casos.json'))
for c in data:
    path = f'$D/casos-exito/{c[\"slug\"]}/index.html'
    if not os.path.exists(path):
        print(f'Slug {c[\"slug\"]} no tiene página en {path}')
        exit(1)
print('  ✅ Todos los slugs tienen página correspondiente')
" || exit 1

rm -rf dist
echo "✅ AUD-11 — COMPLETA"
```

## Estado
DONE

## Notas
- Resuelto con **Opción A** (endpoint estático de Astro, no server adapter): `src/pages/casos.json.js` exporta `GET()` que responde `Response.json(casos)` desde `src/data/casos-exito.json`. Astro lo compila a `dist/casos.json` como página estática — compatible con GitHub Pages, sin servidor.
- El archivo ya existía con el `GET()` correcto; esta tarea confirmó que el build genera la ruta y que el contenido cumple la spec.
- Build verificado (2026-08-05): `dist/casos.json` existe, es un array JSON válido con 8 casos, todos con `slug, title, category, metric, excerpt`, y los 8 slugs tienen su página en `dist/casos-exito/{slug}/`.
- Smoke test (Playwright): el carrusel en `index.astro` renderiza los 8 slides reales (título del primer caso correcto), sin skeleton ni mensaje de error.
- Verification script: 4/4 checks ✅.
- Nota: `src/data/casos-exito.json` incluye los 8 casos; el endpoint sirve todos (no filtra por `tipo`), lo cual es correcto porque el carrusel los muestra todos con métricas.
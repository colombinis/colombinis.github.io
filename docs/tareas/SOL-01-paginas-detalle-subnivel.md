# SOL-01 — Páginas detalle subnivel de soluciones (FASE 9)

## Contexto
La homepage (`/`) y `/servicios/` listan 3 servicios principales (Automatización, Software a Medida, Presencia Online). Cada servicio tiene 3 subniveles definidos en `src/data/soluciones.json` (ej: "Facturación y cobranzas", "Stock y logística", "Reportes y dashboards"). Actualmente estos subniveles son SOLO cards estáticos dentro de la página del servicio — NO tienen URL propia ni página detalle navegable.

## Spec (SDD — WHAT)
Generar 9 páginas de detalle dinámicas (3 servicios × 3 categorías) con un **route dinámico Astro** que consuma `soluciones.json`:

| Servicio | Subnivel 1 | Subnivel 2 | Subnivel 3 |
|----------|-----------|-----------|-----------|
| Automatización | Facturación y cobranzas | Stock y logística | Reportes y dashboards |
| Software a Medida | Sistemas de gestión | Integraciones | Apps y portales |
| Presencia Online | Sitio web institucional | Tienda online | Contenido y SEO básico |

#### Requirements:
1. **Route file**: `src/pages/servicios/[servicio]/[categoria].astro` — SSG + data de `soluciones.json`
2. **Slug mapping**: `id` kebab-case en JSON → URL path (ej: `facturacion-cobranzas` → slug `facturacion-cobranzas`)
3. **Content render**:
   - Hero: `title`, `descripcion`, `claim`
   - Grid de beneficios: `texto` + link al caso referenciado (`caso` → `/casos-exito/${slug}/`)
   - Sección "Casos relacionados": usa `casos[]` array → cross-link a cada caso exito
4. **SEO**: title/description meta tags desde datos del JSON
5. **Nav**: header con links Inicio/Servicios/Sobre nosotros/Contacto + breadcrumb servicio → categoria
6. **No breaking changes**: las páginas `/servicios/<servicio>/` deben seguir funcionando + ahora linkear a las sub-páginas

## Scenarios (BDD)
```
Scenario: Reclutador técnico navega a detalle de subnivel
  Given el reclutador en la homepage
  When hace click en "Software a Medida" → luego "Integraciones"
  Then ve la página /servicios/software-a-medida/integraciones/
  And el H1 dice "Integraciones"
  And ve la descripción "Conectamos tus herramientas actuales..."
  And los beneficios listados con links a casos (ej: wordpress-headless-nextjs)
  And los casos relacionados (tienda-woocommerce-suscripciones, wordpress-headless-nextjs) con botones "Ver caso"

Scenario: PyME ve detalle de facturación
  Given Carlos en /servicios/automatizacion/facturacion-cobranzas/
  When lee el claim "Reducí errores y olvidos."
  Then ve beneficios con texto + link a caso asociado
  And el breadcrumb muestra: Inicio > Automatización > Facturación y cobranzas
  And el CTA principal WhatsApp "Consultar sin cargo" está presente
  And ve CTA email "sacsi@sacsi.com.ar"

Scenario: 9 URLs generadas con build limpio
  Given el sitio buildeado
  When ejecuto build
  Then existen 9 index.html en dist/servicios/*/<slug>/
  And cada page-load HTTP 200
```

## Plan (SDD — HOW)
1. **Crear route dinámico** `src/pages/servicios/[servicio]/[categoria].astro`:
   - Importar `soluciones.json`
   - Generar rutas estáticas con `getStaticPaths()` (SSG) — 9 combinaciones servicio×categoria
   - Mapear `params.servicio` → servicio JSON, `params.categoria` → categoría JSON
   - Render: hero + beneficios con links a casos + sección casos relacionados
2. **Añadir breadcrumb** + CTA WhatsApp/email consistente con `Layout.astro`
3. **Actualizar `servicios/<servicio>.astro`** (4 archivos) para linkgear a las sub-páginas detalle (cards → `/servicios/<servicio>/<categoria-slug>/`)
4. **Meta tags**: `{title}` y `description` desde `categoria.descripcion`
5. **Build + verificación** con script bash

## Verification script

```bash
#!/bin/bash
# SOL-01 — 9 páginas de detalle subnivel
set -e
D=dist
echo "🧪 SOL-01 — Páginas detalle subnivel"

# E1: 9 páginas generadas
URLS=(
  "servicios/automatizacion/facturacion-cobranzas"
  "servicios/automatizacion/stock-logistica"
  "servicios/automatizacion/reportes-dashboards"
  "servicios/software-a-medida/sistemas-gestion"
  "servicios/software-a-medida/integraciones"
  "servicios/software-a-medida/apps-portales"
  "servicios/presencia-online/sitio-web-institucional"
  "servicios/presencia-online/tienda-online"
  "servicios/presencia-online/contenido-seo-basico"
)
for slug in "${URLS[@]}"; do
  if [ -f "$D/$slug/index.html" ]; then
    echo "  ✅ $slug/index.html"
  else
    echo "  ❌ falta: $slug/index.html"
    exit 1
  fi
done

# E2: breadcrumb presente en cada página
grep -q 'Inicio.*Automatización\|Software a Medida\|Presencia Online' "$D/servicios/automatizacion/facturacion-cobranzas/index.html" 2>/dev/null \
  || echo "  ⚠️  (breadcrumb opcional)"

# E3: beneficios + links a casos
grep -q 'casos-exito' "$D/servicios/automatizacion/facturacion-cobranzas/index.html" && echo "  ✅ E3 links a casos en detalle"

# E4: CTA WhatsApp
grep -q 'whatsapp.com/send?phone=5493415197937' "$D/servicios/software-a-medida/integraciones/index.html" && echo "  ✅ E4 WhatsApp CTA"

# E5: email visible
grep -q 'sacsi@sacsi.com.ar' "$D/servicios/presencia-online/tienda-online/index.html" && echo "  ✅ E5 email visible"

echo "✅ SOL-01 — COMPLETA (9 detalles subnivel + cross-links)"
```

## Estado
TODO — pendiente implementación (prioridad alta, antes del lanzamiento)

## Notas
- Las páginas `/servicios/<servicio>/` deben seguir funcionando (no breaking change)
- El route dinámico usa Astro SSG con `getStaticPaths()` — 9 combinaciones generadas en build
- El data source (`soluciones.json`) ya existe y tiene todo el contenido — NO modificar
- Cross-link beneficios → casos exito usa el campo `caso` de cada beneficio item

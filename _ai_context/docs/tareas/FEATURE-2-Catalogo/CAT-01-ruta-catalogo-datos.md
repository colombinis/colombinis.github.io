# CAT-01 — Crear ruta `/catalogo` con datos normalizados de soluciones

## Contexto
No existe una vista global que liste todas las soluciones contratables. Para
soportar la US-01 (CA-01/CA-02/CA-04) hace falta una ruta `/catalogo` que
servicio → categoría → **soluciones** usando los datos ya
normalizados en `src/lib/data-utils.ts`, de forma que solo se muestren
servicios y categorías que tengan trabajos para listar.

## Spec (SDD — WHAT)
- Crear `src/pages/catalogo.astro` que renderice en SSG la ruta `/catalogo/`
- Usar `Layout.astro` + `global.css` (breadcrumb, `h1` único, `hero`)
- Exponer al front (desde `data-utils.ts`, sin hardcodear IDs):
  - **servicios**: solo los que tienen ≥1 categoría con ≥1 trabajo
  - **categorías**: solo las que tienen ≥1 trabajo, agrupadas por servicio
    (`id`, `title`, `icon`)
  - **trabajos**: listado completo con `id`, `nombre`, `categorias`,
    `precioMin/Max`, `horasMin/Max`
- La pertenencia trabajo→categoría sale de `getTrabajosByCategoria()`
  (lee el campo `categorias` de `trabajo_<id>.json`)
- Todo el filtrado del lado del servidor para el render inicial; los filtros
  interactivos se resuelven en CAT-02 (client-side, vanilla JS)

## Scenarios (BDD)
```gherkin
Scenario: La ruta /catalogo existe y renderiza
  Given el sitio con la feature desplegada
  When un usuario invitado accede a GET /catalogo
  Then responde 200 y renderiza el HTML del catálogo
  And tiene exactamente un <h1> con el título del catálogo
  And enlaza a la página de detalle de cada trabajo (/trabajos/<id>/)

Scenario: Solo se ofrecen filtros con trabajos disponibles (CA-02)
  Given la jerarquía servicio→categoría→trabajos
  When se arma el listado de filtros
  Then un servicio solo aparece si tiene ≥1 categoría con ≥1 trabajo
  And una categoría solo aparece si tiene ≥1 trabajo para listar
```

## Plan (SDD — HOW)
1. Crear `src/pages/catalogo.astro` con layout y estructura base
2. En `data-utils.ts` (o dentro de la página) resolver:
   - `serviciosConTrabajos` = servicios con ≥1 categoría que tenga trabajos
   - `categoriasConTrabajos` = categorías con ≥1 trabajo (con su `servicio_id`)
3. Renderizar hero + contenedor de filtros (CAT-02) + grilla de tarjetas (CAT-03)
4. `npm run build` y validar que genere `dist/catalogo/index.html`

## Verification script
```bash
#!/bin/bash
# CAT-01 — ruta /catalogo
echo "🧪 CAT-01 — Ruta /catalogo"
npm run build >/dev/null 2>&1
test -f dist/catalogo/index.html && echo "  ✅ dist/catalogo/index.html existe"
python3 -c "
import re
html = open('dist/catalogo/index.html').read()
h1 = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.S)
assert len(h1) == 1, f'se esperaba 1 h1, hay {len(h1)}: {h1}'
print('  ✅ un solo <h1>:', h1[0].strip())
links = set(re.findall(r'/trabajos/[a-z-]+/', html))
assert links, 'no hay links a /trabajos/<id>/'
print('  ✅ links a detalle de trabajos:', len(links))
"
echo "✅ CAT-01 — COMPLETA"
```

## Progreso

- 2026-08-13 — CAT-01 desarrollada y verificada:
  - `src/lib/data-utils.ts`: se agregaron `getCategoriasConTrabajos()` y
    `getServiciosConTrabajos()` (CA-02, data-driven sobre `getTrabajosByCategoria()`).
  - `src/pages/catalogo.astro` creado (ruta `/catalogo/`): breadcrumb, hero con un
    solo `<h1>` ("Catálogo de trabajos"), contenedor de filtros (selects de
    servicio/categoría agrupados por servicio, búsqueda y botón reset) con solo
    opciones con trabajos, y grilla con las 10 tarjetas enlazando a `/trabajos/<id>/`.
  - Tarjetas con `data-trabajo-id`, `data-servicio`, `data-categoria`, `data-nombre`
    (la jerarquía trabajo→categoría sale del detalle `trabajo_<id>.json`), listas
    para el filtrado client-side de CAT-02.
  - `npm run build` OK → `dist/catalogo/index.html` (37 páginas) + sitemap incluye
    `/catalogo/`. Script de verificación CAT-01 pasa (1 `<h1>`, 10 links a detalle).
  - Pendiente: interactividad de filtros (CAT-02) y pulido de tarjetas + estado
    sin resultados (CAT-03).

## Estado
DONE — verificada (build + script de verificación CAT-01 + smoke test HTTP 200)

## Notas
- No hardcodear servicios/categorías: derivarlos de los datos para que la
  página no se rompa cuando se agreguen/quiten trabajos (CA-02).
- La ruta es `/catalogo` → archivo `src/pages/catalogo.astro` (Astro genera
  `/catalogo/index.html`).

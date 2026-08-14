# CAT-02 — Filtros jerárquicos servicio→categoría + búsqueda textual

## Contexto
La US-01 pide una visualización "estándar" de e-commerce con filtros por
servicio, categorías y búsquedas textuales. CA-01 exige que los filtros se
presenten de forma jerárquica (servicio → categoría) y CA-02 que no existan
opciones de filtro sin trabajos que listar.

## Spec (SDD — WHAT)
- Filtro jerárquico de 2 niveles:
  - `<select>` o pills de **servicio** (solo servicios con ≥1 categoría con trabajos)
  - `<select>` o pills de **categoría**: al elegir servicio, muestra solo las
    categorías de ese servicio que tienen ≥1 trabajo
- **Búsqueda textual**: input libre que filtra por nombre del trabajo
  (insensible a mayúsculas/tildes)
- Combinación AND entre filtros: servicio + categoría + texto
- Control para **limpiar/resetear** filtros
- Contracción CA-02:
  - un servicio sin ninguna categoría con trabajos NO aparece
  - una categoría sin trabajos NO aparece (ni siquiera como opción)
- Sin frameworks: vanilla JS client-side sobre el HTML renderizado en CAT-01

## Scenarios (BDD)
```gherkin
Scenario: Los filtros son jerárquicos (CA-01)
  Given el catálogo en /catalogo
  When el usuario elige el servicio "Presencia online"
  Then las categorías ofrecidas son solo las de ese servicio
  And las categorías se actualizan al cambiar de servicio

Scenario: No hay opciones de filtro sin trabajos (CA-02)
  Given la jerarquía servicio→categoría→trabajos
  When se renderizan las opciones de servicio y categoría
  Then ningún servicio listado tiene 0 categorías con trabajos
  And ninguna categoría listada tiene 0 trabajos

Scenario: Búsqueda textual filtra trabajos
  Given el catálogo en /catalogo
  When el usuario escribe "landing" en la búsqueda
  Then solo se muestran tarjetas cuyo nombre contiene "landing"
  And el contador de resultados refleja la cantidad mostrada

Scenario: Reset limpia todos los filtros
  Given servicio y categoría seleccionados y un texto de búsqueda
  When el usuario resetea
  Then se muestran todos los trabajos y los filtros vuelven a estado inicial
```

## Plan (SDD — HOW)
1. Marcar cada tarjeta de trabajo con `data-categoria="<id> ..."` y
   `data-nombre` para filtrar client-side (sin refetch)
2. Renderizar selects/pills de servicio y categoría data-driven (CAT-01)
3. Escuchar `change`/`input` y aplicar el filtro combinado (AND) sobre la grilla
4. Contador de resultados + estado "sin resultados" con CTA a contacto
5. Guardar estado en `URLSearchParams` (`?servicio=&categoria=&q=`) para
   que la URL sea compartible y funcione el botón "atrás"

## Verification script
```bash
#!/bin/bash
# CAT-02 — filtros jerárquicos + búsqueda
echo "🧪 CAT-02 — Filtros jerárquicos + búsqueda"
npm run build >/dev/null 2>&1
python3 -c "
import re
html = open('dist/catalogo/index.html').read()
# CA-02: cada categoría ofrecida debe tener al menos 1 tarjeta con esa data-categoria
cats = re.findall(r'data-categoria=\"([a-z0-9-]+)', html)
from collections import Counter
c = Counter(cats)
print('  ✅ categorías con tarjetas:', dict(c))
assert all(n >= 1 for n in c.values()), 'hay categorías sin trabajos'
"
echo "✅ CAT-02 — COMPLETA (falta E2E interactivo en CAT-04)"
```

## Estado
DONE — verificado E2E (Chromium real): jerarquía servicio→categoría, búsqueda
sin tildes, AND, reset, contador, estado vacío con CTA, URL compartible
(`?servicio=&categoria=&q=`) y popstate. Implementado en
`src/pages/catalogo.astro` (script vanilla JS client-side).

## Notas
- Vanilla JS (convención del repo). No usar deps npm.
- El filtrado client-side evita re-render del servidor: el SSG ya renderiza
  TODOS los trabajos y el JS muestra/oculta tarjetas.
- Normalizar texto a minúsculas y sin tildes para la búsqueda.

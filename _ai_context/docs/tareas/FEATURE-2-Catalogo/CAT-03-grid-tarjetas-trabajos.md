# CAT-03 — Grid de tarjetas de soluciones con link a detalle

## Contexto
**prd:** §1.1 — "Convertir visitas en consultas comerciales" (feature B, §3.1). El grid de tarjetas es la vitrina que convierte la visita de la persona Carlos en click a detalle/trabajo.

CA-03 pide que las soluciones se muestren en forma de tarjeta y que elegir "más
detalle" lleve a la página de detalle del trabajo (`/trabajos/<id>/`, ya
existente). Las tarjetas son el elemento central del catálogo y deben seguir
el estilo del sitio (mobile-first, tokens de `DESIGN.md`).

## Spec (SDD — WHAT)
- Grid de tarjetas (`cards-grid` de `global.css`, 1 col en mobile → más en desktop)
- Cada tarjeta (reutilizar patrón `service-card`):
  - `nombre` del trabajo como título enlazado a `/trabajos/<id>/`
  - precio (`precioMin`–`precioMax` ARS k) y horas estimadas (`horasMin`–`horasMax`)
  - etiqueta de categoría principal o del servicio
  - CTA **"Ver detalle del trabajo"** → `/trabajos/<id>/`
- Datos de `getTrabajos()` (listado maestro); el render inicial muestra TODOS
  los trabajos y los filtros (CAT-02) ocultan/muestran tarjetas
- Atributos de datos para el filtrado client-side:
  `data-trabajo-id`, `data-servicio`, `data-categoria`, `data-nombre`
- Sin resultados → mensaje amigable + CTA a `/contacto/`

## Scenarios (BDD)
```gherkin
Scenario: Los trabajos se muestran como tarjetas (CA-03)
  Given el catálogo en /catalogo sin filtros
  When se renderiza la grilla
  Then hay una tarjeta por cada trabajo del listado maestro (10)
  And cada tarjeta tiene nombre, precio y horas
  And cada tarjeta enlaza a /trabajos/<id>/

Scenario: El detalle se abre desde la tarjeta
  Given una tarjeta de trabajo
  When el usuario hace click en el título o en "Ver detalle del trabajo"
  Then se navega a la página de detalle /trabajos/<id>/

Scenario: Sin resultados
  Given una búsqueda o filtros sin coincidencias
  When se aplica el filtro
  Then se muestra mensaje de "sin resultados" con CTA a contacto
```

## Plan (SDD — HOW)
1. Renderizar la grilla en `catalogo.astro` iterando `getTrabajos()`
2. Reutilizar estilos `cards-grid`/`service-card` de `global.css`; ajustar
   solo si hace falta una variante `.catalogo-card`
3. Incluir los `data-*` necesarios para CAT-02
4. Verificar que cada tarjeta enlace a `/trabajos/<id>/`

## Verification script
```bash
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
```

## Estado
DONE — verificado (grid + link a detalle)

## Notas
- El CTA de cada tarjeta usa el patrón visual `service-card__cta` ya existente.
- Mantener un solo `<h1>` en la página: el título de las tarjetas va en `<h3>`.

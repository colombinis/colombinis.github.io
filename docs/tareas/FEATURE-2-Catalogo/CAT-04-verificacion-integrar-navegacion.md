# CAT-04 — Verificación (build + E2E) + integrar navegación a `/catalogo`

## Contexto
CAT-01..CAT-03 construyen la página. Esta tarea cierra la feature: verifica
que el catálogo funcione de punta a punta y lo hace descubrible desde la
navegación del sitio (header/footer), siguiendo la convención de verificación
de otras features (build + E2E con Chromium real + 0 errores JS).

## Spec (SDD — WHAT)
- `npm run build` sin errores → `dist/catalogo/index.html` + sitemap actualizado
- E2E con Chromium real (HTTP, `python3 -m http.server` sobre `dist/`):
  - carga `/catalogo` (200, 1 `<h1>`, 10 tarjetas)
  - filtro por servicio → actualiza categorías (jerárquico)
  - filtro por categoría → filtra grilla
  - búsqueda textual → filtra por nombre
  - click en tarjeta → navega a `/trabajos/<id>/`
  - 0 errores en consola JS
- Integrar navegación a `/catalogo`:
  - `config/site.json` → `nav.links`: nuevo item (propuesto: "Catálogo"
    entre "Servicios" y "Recursos"; **confirmar con dueño**)
  - `Footer.astro` → columna "Trabajos": link "Ver todos" a `/catalogo/`

## Scenarios (BDD)
```gherkin
Scenario: El catálogo es descubrible desde la navegación
  Given el sitio en producción
  When el usuario abre el header o el footer
  Then existe un link visible a /catalogo/

Scenario: El flujo completo funciona en navegador real
  Given un navegador Chromium real contra el build
  When el usuario navega a /catalogo, filtra y busca
  Then la grilla reacciona sin errores de consola
  And hacer click en una tarjeta abre la página de detalle
```

## Plan (SDD — HOW)
1. `npm run build` y validar artefactos (sitemap incluye `/catalogo/`)
2. Levantar `python3 -m http.server 8000` sobre `dist/` y correr E2E
   (Playwright/Chromium) con los casos arriba
3. Agregar link a `/catalogo` en header (`config/site.json` nav.links,
   renderizado dinámico por `Header.astro`) y footer (columna Trabajos)
4. Rebuild + re-E2E final
5. Registrar estados DONE en `docs/tareas/FEATURE-2-Catalogo/TODO.md`

## Verification script
```bash
#!/bin/bash
# CAT-04 — build + E2E + navegación
echo "🧪 CAT-04 — Verificación final catálogo"
npm run build 2>&1 | grep -E "catalogo|Completed" | head -5
python3 -c "
import json, re
c = json.load(open('src/config/site.json'))
hrefs = [l.get('href','') for l in c['nav']['links']] + [s.get('href','') for l in c['nav']['links'] for s in l.get('submenu',[])]
assert any(h == '/catalogo/' for h in hrefs), 'falta /catalogo/ en nav'
print('  ✅ /catalogo/ en navegación')
"
# E2E manual con Chromium real (pendiente de ejecutar)
echo "  ⏳ E2E Chromium real: pendiente de ejecutar"
echo "✅ CAT-04 — COMPLETA"
```

## Estado
TODO — sin empezar

## Notas
- La posición del link "Catálogo" en el header es una decisión de negocio
  (propuesta: entre "Servicios" y "Recursos"); confirmar antes de merge.
- El footer puede sumar "Ver todos los trabajos" → `/catalogo/` sin tocar la
  lista existente.
- Verificación post-deploy: validar eventos de analytics (GTM `GTM-T7PWJ99`)
  para clics en tarjetas del catálogo (ver `docs/tareas/DEP-01`).

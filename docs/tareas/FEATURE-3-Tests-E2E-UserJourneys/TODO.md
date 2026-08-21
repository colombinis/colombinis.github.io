# TODO — FEATURE 3 — Tests E2E de User Journeys

> **Feature maestro.** Inventario y categorización de TODOS los tests de
> validación (existentes + nuevos) del proyecto SACsi, agrupados por
> categoría lógica. NO contiene código de tests — solo el listado, qué
> cubre cada test y dónde vive.
> Maestro global: `docs/tareas/TODO.md`.
> Metodología: SDD + BDD.

## Contexto

El proyecto no tenía una carpeta `tests/` a nivel raíz. Los pocos tests
existentes vivían sueltos en carpetas de tareas (`docs/tareas/FEATURE-1/...`)
o como intenciones dentro de specs (UJ-*, CAT-04, DEP-01). Esta feature
consolida el **inventario** y define la **estructura estándar de industria**
`tests/` donde los tests vivirán.

Estructura propuesta (estándar de industria):
```
tests/
├── unit/                 # tests de lógica de negocio (sin navegador)
│   └── flujos/           # herramienta de flujos de trabajo
├── e2e/                  # tests end-to-end en navegador real (Chromium)
│   ├── journeys/         # recorridos de usuario (UJ-02/03/04 + CTA funnel)
│   ├── catalogo/         # catálogo (CAT-04)
│   └── post-deploy/      # validación producción (DEP-01)
```

## Estados

| Estado    | Significado |
|-----------|-------------|
| `TODO`    | Por escribir (test no existe como artefacto) |
| `DONE`    | Test existe y pasa |
| `BLOCKED` | Bloqueado por dependencia externa |

## Inventario de tests por categoría

### A. User Journeys — mapeo (diseño, no automatización)

| ID | Título | Estado | Qué cubre | Dónde |
|----|--------|--------|-----------|-------|
| UJ-01 | Definir 3 personas/clientes típicos | DONE (archived) | PyME sin web, PyME con WP roto, reclutador tech | `docs/tareas/UJ-01-definir-personas.md` |
| UJ-02 | Journey: PyME sin web → contacto | DONE (archived) | Recorrido landing → WhatsApp/contacto | `docs/tareas/UJ-02-journey-pyme-whatsapp.md` |
| UJ-03 | Journey: PyME con WP roto → rescate | DONE (archived) | Recorrido diagnóstico → propuesta rescate | `docs/tareas/UJ-03-journey-wp-roto.md` |
| UJ-04 | Journey: reclutador tech → portfolio | DONE (archived) | Recorrido servicios → caso de éxito | `docs/tareas/UJ-04-journey-reclutador.md` |
| UJ-05 | Validar CTA funnel | DONE (archived) | Cada página tiene CTA claro a conversión | `docs/tareas/UJ-05-validar-cta-funnel.md` |

> Estos son **mapeos documentados**, no tests automatizados. La categoría
> B los vuelve E2E reales.

### B. Journey E2E automatizado (a crear en `tests/e2e/journeys/`)

| ID | Título | Estado | Qué debe cubrir |
|----|--------|--------|----------------|
| E2E-01 | E2E journey PyME sin web → contacto | TODO | Abrir landing, click CTA WhatsApp, llegar a contacto, 0 errores JS |
| E2E-02 | E2E journey PyME WP roto → rescate | TODO | Navegar servicios, encontrar diagnóstico, CTA rescate |
| E2E-03 | E2E journey reclutador → portfolio | TODO | Servicios → caso de éxito, CTA contacto |
| E2E-04 | E2E CTA funnel (UJ-05) | TODO | Cada página expone CTA visible a conversión |

### C. Catálogo E2E (a crear en `tests/e2e/catalogo/`)

| ID | Título | Estado | Qué cubre | Dónde (spec) |
|----|--------|--------|-----------|--------------|
| CAT-04 | Verificación build + E2E + navegación | TODO | `/catalogo` 200, 1 h1, 10 tarjetas, filtros jerárquicos, búsqueda, click → detalle, 0 errores JS, nav link | `docs/tareas/FEATURE-2-Catalogo/CAT-04-verificacion-integrar-navegacion.md` |

### D. Herramienta flujos — tests unitarios (YA EXISTEN, movidos a `tests/unit/flujos/`)

| ID | Archivo | Estado | Qué hace |
|----|---------|--------|----------|
| UNIT-01 | `tests/unit/flujos/test-listado-trabajos.cjs` | DONE (9/9) | Test funcional de la tabla de listado. Mock DOM + mock fetch sobre `listado-trabajos.json` REAL. Verifica: tabla renderiza 10 trabajos desde JSON (no hardcodeado), coincidencia con datos reales, estados OK/NO RENTABLE, input de costo fijo editable afecta margen, costo fijo alto → margen negativo. |
| UNIT-02 | `tests/unit/flujos/test-flujo-operativo-trabajo.cjs` | DONE (19/19) | Test funcional de la herramienta de flujos. Mock DOM + mock fetch sobre JSONs reales de `src/data/trabajos/detalle/`. Verifica: selector se llena con 10 trabajos, carga 12 pasos de Landing, cambiar a E-commerce recarga 11 pasos, cálculo de rentabilidad (29.5h Landing / 53h E-commerce), add/delete/reset de tabla, restaurar flujo no contamina. |

> Ambos son **tests de lógica de negocio con mock DOM** (Node.js), NO E2E
> de navegador. Estándar: viven en `tests/unit/`.

### E. Post-deploy / analytics (a crear en `tests/e2e/post-deploy/`)

| ID | Título | Estado | Qué cubre | Dónde (spec) |
|----|--------|--------|-----------|--------------|
| DEP-01 | Validación post-deploy (Lighthouse/GA4/form/SSL) | BLOCKED | Lighthouse >80, eventos GTM `GTM-T7PWJ99` (pageview/whatsapp_click/form_submit), formulario contacto, SSL | `docs/tareas/FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md` |

## Resumen

| Categoría | Total | DONE | TODO | BLOCKED |
|-----------|-------|------|------|---------|
| A. Journey mapeo | 5 | 5 | 0 | 0 |
| B. Journey E2E | 4 | 0 | 4 | 0 |
| C. Catálogo E2E | 1 | 0 | 1 | 0 |
| D. Unit flujos | 2 | 2 | 0 | 0 |
| E. Post-deploy | 1 | 0 | 0 | 1 |
| **Total** | **13** | **7** | **5** | **1** |

## Notas

- Los tests D (UNIT-01/02) ya existían sueltos en FEATURE-1; se movieron a
  `tests/unit/flujos/` siguiendo estándar de industria. Sus rutas relativas
  se ajustaron a `__dirname` + `detalle/` (los JSON de trabajo cambiaron de
  `src/data/trabajos/trabajo_<id>.json` a `src/data/trabajos/detalle/`).
- Las categorías B/C/E son **nuevos tests a escribir** (no hay código hoy).
- Esta feature NO escribe código de tests; define el inventario y la
  estructura. La implementación de B/C/E es trabajo posterior por spec.

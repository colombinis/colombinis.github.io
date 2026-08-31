# TODO — FEATURE 2 — Sección catálogo de soluciones

> **Feature maestro.** Tareas de la feature "Catálogo de soluciones".
> Maestro global: `_ai_context/docs/tareas/TODO.md` (fuente única de verdad de auditoría).
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).
> **Objetivo:** dar a los visitantes una vista estándar tipo e-commerce de TODAS las soluciones contratables, con filtros jerárquicos (servicio → categoría) y búsqueda textual, para elegir qué solución contratar.

## Contexto

El sitio ofrece soluciones contratables (`src/data/soluciones/listado-soluciones.json` +
  detalle `src/data/soluciones/detalle/solucion_<id>.json`) agrupadas por
**servicio → categoría**. Hoy se llega a ellos por:

- Navegación **Servicios** → categoría (páginas `/servicios/<servicio>/<categoria>/`)
- **Footer** → columna "Trabajos" (lista plana de links)

No existe una vista global tipo catálogo que permita explorar TODOS los
soluciones disponibles y filtrarlas por servicio, categoría y texto.

**Fuente de datos (ya normalizada en FASE NOR-01):**
- `src/lib/data-utils.ts` → `getServicios()`, `getCategoriasByServicio()`,
  `getTrabajos()`, `getTrabajoDetalle()`, `getTrabajosByCategoria(categoriaId)`
- La asociación solución→categoría se lee del campo `categorias` de cada
  `solucion_<id>.json` (fuente de verdad, alineada con los arrays `soluciones`
  de las categorías en el ciclo anterior)
- `src/data/categorias/categoria_*.json` → `id`, `title`, `icon`
- Página de detalle existente: `/soluciones/<id>/` (`src/pages/soluciones/[solucion].astro`)

## User stories (BDD)

> **US-01** — Como **usuario invitado al sitio web**, quiero **tener una forma de
> visualización "estándar" típica de los e-commerce, con filtros por servicio,
> categorías y búsquedas textuales**, para **poder listar las soluciones que quiero
> elegir contratar usando las buenas prácticas conocidas en e-commerce**.

## Criterios de aceptación

| ID  | Criterio |
|-----|----------|
| CA-01 | Los filtros se presentan de forma jerárquica (servicio → categoría). |
| CA-02 | No se deben presentar opciones de filtro (servicios o categorías) de las que no se tengan "soluciones" relacionadas para listar. |
| CA-03 | Las soluciones se muestran en forma de tarjeta; al elegir "más detalle" se presenta la página de detalle de la solución (`/soluciones/<id>/`). |
| CA-04 | La URL que se accede para visualizar es `/catalogo`. |

## Estados

| Estado    | Significado                                    |
|-----------|------------------------------------------------|
| `TODO`    | Pendiente, sin empezar                         |
| `DOING`   | En progreso                                   |
| `BLOCKED` | Bloqueado (ver nota en el archivo de la tarea) |
| `DONE`    | Terminado y verificado                         |

## Tareas

| ID     | Título                                                               | Estado | Archivo |
|--------|----------------------------------------------------------------------|--------|---------|
| CAT-01 | Crear ruta `/catalogo` con datos normalizados (solo opciones con soluciones) | DONE   | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-01-ruta-catalogo-datos.md` |
| CAT-02 | Filtros jerárquicos servicio→categoría + búsqueda textual (sin opciones vacías) | DONE   | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-02-filtros-jerarquicos-busqueda.md` |
| CAT-03 | Grid de tarjetas de soluciones con link a detalle                    | DONE   | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-03-grid-tarjetas-trabajos.md` |
| CAT-04 | Verificación (build + E2E) + integrar navegación a `/catalogo`        | DONE   | `_ai_context/docs/tareas/FEATURE-2-Catalogo/CAT-04-verificacion-integrar-navegacion.md` |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 4     | 0    | 0     | 4    | 0       |

## Verificación

- `npm run build` → genera `dist/catalogo/index.html` (ruta `/catalogo/`)
- E2E con Chromium real (HTTP): filtros jerárquicos, búsqueda, tarjetas con
  link a detalle, 0 errores JS (pendiente hasta implementación — CAT-04)

## Notas

- **Vanilla JS** para filtros y búsqueda client-side (convención del repo:
  sin frameworks, sin deps npm).
- El catálogo reutiliza los estilos globales (`container`, `cards-grid`,
  `service-card`, tokens de `DESIGN.md`); móvil-first.
- `getTrabajosByCategoria()` ya existe en `data-utils.ts` y es la vía
  recomendada para resolver CA-02 de forma data-driven (no hardcodear
  servicios ni categorías en la página).
- La categoría de una solución sale del detalle `solucion_<id>.json`
  (no del listado): mantener esa convención (ver FEATURE 1 / NOR-01).

# TODO — FEATURE 1 — Validación de flujos de negocio (rentabilidad)

> **Feature maestro.** Tareas de la feature "Validación de flujos de negocio".
> Maestro global: `_ai_context/docs/tareas/TODO.md` (fuente única de verdad de auditoría).
> Metodología: SDD (Spec-Driven Development) + BDD (Behavior-Driven Development).
> **Objetivo:** poder validar cada servicio/desarrollo para confirmar **si son rentables** o no.

## Contexto

El dueño quiere validar que cada servicio ofrecido es rentable, verificando
en una tabla dinámica que permita agregar o quitar filas. Cada fila muestra:

- Nombre de la solución/trabajo
- Rango de precios (min/max)
- Rango de costo de horas (min/max) que lleva ese servicio
- Costo fijo en pesos ARS (0 por defecto)
- El sistema calcula los márgenes de ganancia (min/max)
- Mensaje "OK" si el trabajo es rentable o no

**Fuente de datos:** el listado de trabajos se carga de
`src/data/trabajos/listado-trabajos.json` (selector + tabla de rentabilidad).
Cada trabajo tiene un JSON propio `src/data/trabajos/trabajo_<id>.json` con
sus **pasos del flujo** (fuente de verdad del simulador).

**Referencias en esta feature:**
- `flujo-operativo-trabajo.html` (simulador: selector de trabajo + pasos del flujo + rentabilidad)
- `listado-trabajos.html` (tabla de trabajos cargada desde JSON — fuente de verdad única)

## Estados

| Estado    | Significado                                    |
|-----------|------------------------------------------------|
| `TODO`    | Pendiente, sin empezar                         |
| `DOING`   | En progreso                                   |
| `BLOCKED` | Bloqueado (ver nota en el archivo de la tarea) |
| `DONE`    | Terminado y verificado                         |

## Tareas

| ID      | Título                                                          | Estado | Archivo |
|---------|-----------------------------------------------------------------|--------|---------|
| VAL-01  | Crear listado-trabajos.json con trabajos y categorías           | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-01-listado-trabajos-json.md` |
| VAL-02  | Tabla dinámica de rentabilidad en flujo-operativo-trabajo.html  | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-02-tabla-dinamica-rentabilidad.md` |
| VAL-03  | Cargar tabla + selector desde JSON por fetch (fuente única)     | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-03-carga-json-fetch.md` |
| VAL-04  | Integrar add/remove/editar filas (como Pasos del flujo)         | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-04-add-remove-editar-filas.md` |
| VAL-05  | Cargar tabla desde listado-trabajos.json (fuente única)       | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-05-listado-trabajos-json.md` |
| VAL-06  | Selector de trabajo + pasos del flujo desde trabajo_<id>.json   | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-06-selector-trabajo-pasos-json.md` |
| CONT-01 | Formulario progresivo multi-step + página /contacto-v2 (P4-step a) | DONE   | `_ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/CONT-01-formulario-progresivo.md` | verify-CONT-01.sh |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 7     | 0    | 0     | 7    | 0       |

## Verificación

- `test-flujo-operativo-trabajo.cjs`: 19/19 ✅ (selector 10 trabajos, pasos Landing 12 / E-commerce 11, cambio de trabajo, add/delete/reset, restaurar flujo)
- `test-listado-trabajos.cjs`: 9/9 ✅ (tabla desde JSON)
- E2E Chromium real (HTTP): `flujo-operativo-trabajo.html` 14/14 ✅ (selector, cambio de trabajo, pasos, rentabilidad, 0 errores JS)
- Sintaxis JS validada con `node --check` en ambos HTML
| JSONs parsean OK (listado 10 trabajos + 10 `trabajo_<id>.json` con flujos)
- `verify-CONT-01.sh`: PASS ✅ — formulario progresivo (`/contacto-v2/`) con Formspree POST, categorías reales (build-time), eventos GTM `checkout_started`/`form_submit`, tests rentabilidad.ts 15/15.

## Notas

- Los HTML son documentos standalone (no pasan por build Astro) → cargan
  datos en runtime con `fetch()` sobre el repo servido por HTTP
  (`python3 -m http.server`). **No funcionan con `file://`** (CORS).
- Los JSON en `src/data/trabajos/` son la fuente de verdad única: el
  listado (`listado-trabajos.json`) alimenta el selector y la tabla de
  rentabilidad; cada `trabajo_<id>.json` alimenta los pasos del flujo.
- Tarifa real: USD 20/h ≈ ARS 22.000/h (a 1.100). Objetivo margen ≥ 14%.

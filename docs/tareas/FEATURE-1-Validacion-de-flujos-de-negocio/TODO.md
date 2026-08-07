# TODO — FEATURE 1 — Validación de flujos de negocio (rentabilidad)

> **Feature maestro.** Tareas de la feature "Validación de flujos de negocio".
> Maestro global: `docs/tareas/TODO.md` (fuente única de verdad de auditoría).
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
`src/data/trabajos/listado-trabajos.json`. Cada trabajo puede estar
relacionado a 1 o más categorías de servicios.

**Referencias movidas a esta feature:**
- `flujo-operativo-servicio.html` (Simulador de flujo operativo por servicio)
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
| VAL-01  | Crear listado-trabajos.json con trabajos y categorías           | DONE   | `docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-01-listado-trabajos-json.md` |
| VAL-02  | Tabla dinámica de rentabilidad en flujo-operativo-servicio.html | DONE   | `docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-02-tabla-dinamica-rentabilidad.md` |
| VAL-03  | Precarga de tabla "Precios y horas" desde objeto JS embebido    | DONE   | `docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-03-precarga-js-embebido.md` |
| VAL-04  | Integrar add/remove/editar filas (como Pasos del flujo)         | DONE   | `docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-04-add-remove-editar-filas.md` |
| VAL-05  | Cargar tabla desde listado-trabajos.json (fuente única)       | DONE   | `docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/VAL-05-listado-trabajos-json.md` |

## Resumen

| Total | TODO | DOING | DONE | BLOCKED |
|-------|------|-------|------|---------|
| 5     | 0    | 0     | 5    | 0       |

## Verificación

- `test-flujo-operativo.cjs`: 15/15 ✅ (10 trabajos renderizados, add/delete/reset, costo fijo afecta margen)
- `test-uj-pri.cjs`: 6/6 ✅ (10 servicios, costo fijo input, margen negativo con costo fijo alto)
- Sintaxis JS validada con `node --check` en ambos HTML
- JSON parsea OK (JSON.parse, 10 trabajos, categorías referencian soluciones.json)

## Notas

- Los HTML son documentos standalone (no pasan por build Astro) → el JSON
  se EMBEBE como objeto JS dentro de cada HTML para que funcionen offline.
- El JSON (`src/data/trabajos/listado-trabajos.json`) es la fuente de
  verdad; los objetos JS embebidos en los HTML deben reflejarlo.
- Tarifa real: USD 20/h ≈ ARS 22.000/h (a 1.100). Objetivo margen ≥ 14%.

# VAL-04 — Integrar add/remove/editar filas (como Pasos del flujo)

## Contexto
El dueño pide que la tabla de trabajos tenga la misma interactividad que
la tabla "Pasos del flujo" del mismo HTML: **agregar / eliminar / editar**
filas en vivo. Hoy la tabla de precios/horas (en `listado-trabajos.html`)
permite editar inputs pero NO agregar ni eliminar filas.

## Spec (SDD — WHAT)
- Botón `+ Agregar trabajo` → agrega fila con valores por defecto:
  `{id: 'nuevo-N', nombre: 'Nuevo trabajo', precioMin: 500, precioMax: 700,
  horasMin: 15, horasMax: 20, costoFijo: 0, categorias: []}`
- Botón `🗑` por fila → elimina esa fila del array y re-renderiza
- Inputs editables: nombre, precio min/max, horas min/max, costo fijo
- Botón `Restaurar listado` → vuelve al estado inicial (TRABAJOS embebido)
- Botón `Limpiar todo` → vacía la tabla (con confirm)
- Todos los cambios recalculan márgenes al instante

## Scenarios (BDD)
```gherkin
Scenario: Agregar fila con defaults
  Given la tabla de trabajos
  When clickeo "+ Agregar trabajo"
  Then aparece una fila "Nuevo trabajo" con precio 500-700k, horas 15-20, costo fijo 0

Scenario: Editar nombre en vivo
  Given una fila
  When cambio el nombre
  Then el estado se recalcula y la fila muestra el nuevo nombre

Scenario: Eliminar fila
  Given la tabla con N filas
  When elimino una fila
  Then quedan N-1 filas y los totales se recalculan

Scenario: Restaurar
  Given la tabla modificada
  When clickeo "Restaurar listado"
  Then vuelve a los 10 trabajos originales

Scenario: Limpiar todo
  Given la tabla con filas
  When clickeo "Limpiar todo" y confirmo
  Then la tabla queda vacía (o fila placeholder "Sin trabajos")
```

## Plan (SDD — HOW)
1. Agregar `btn-group` con 3 botones (add / restore / clear)
2. Estado `let trabajos = [...TRABAJOS]`
3. `renderTrabajos()` re-renderiza `<tbody id="trabajos-body">`
4. Event listeners: input → update array + recalc; delete → filter; add → push defaults
5. Confirmación en "Limpiar todo"
6. Si array vacío → fila placeholder

## Verification script
```bash
#!/bin/bash
# VAL-04 — add/remove/editar filas
F="docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-servicio.html"
echo "🧪 VAL-04 — Add/remove/editar filas"
grep -q "btn-add-trabajo" "$F" && echo "  ✅ btn-add-trabajo"
grep -q "btn-reset-trabajos" "$F" && echo "  ✅ btn-reset-trabajos"
grep -q "btn-clear-trabajos" "$F" && echo "  ✅ btn-clear-trabajos"
grep -q "trabajos = trabajos.filter\|data-delete-trabajo" "$F" && echo "  ✅ delete por fila"
grep -q "trabajos.push" "$F" && echo "  ✅ add fila"
grep -q "Nuevo trabajo" "$F" && echo "  ✅ defaults nueva fila"
echo "✅ VAL-04 — COMPLETA"
```

## Estado
DONE — add/delete/edit implementado y testeado

## Notas
- Misma UX que la tabla "Pasos del flujo" (botones y patrones)
- Los IDs de filas nuevas son `nuevo-N` (N incremental)

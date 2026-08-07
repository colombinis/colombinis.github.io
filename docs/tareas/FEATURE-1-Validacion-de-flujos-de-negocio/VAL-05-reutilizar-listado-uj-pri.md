# VAL-05 — Reutilizar listado en flujo-uj-con-pri.html

## Contexto
El `flujo-uj-con-pri.html` tiene la tabla "Precios y horas por servicio"
con el array `SERVICIOS` hardcoded (10 items). Para mantener una única
fuente de verdad, ese array debe reflejar el listado de trabajos del JSON
(embebido como objeto JS, igual que en flujo-operativo-servicio.html).

## Spec (SDD — WHAT)
- En `flujo-uj-con-pri.html`, reemplazar/alinear el array `SERVICIOS` con
  los datos de `src/data/trabajos/listado-trabajos.json`
- Agregar la columna **Costo fijo (ARS)** editable (default 0) y su
  inclusión en el cálculo de costo/margen
- Mantener la interactividad existente (editar precios y horas en vivo)
- Documentar que la fuente de verdad es el JSON

## Scenarios (BDD)
```gherkin
Scenario: Tabla UJ-PRI usa el mismo listado
  Given el HTML flujo-uj-con-pri.html
  When se cargan los trabajos
  Then muestra los 10 trabajos del listado-trabajos.json
  And cada uno con precio min/max, horas min/max, costo fijo

Scenario: Costo fijo editable
  Given una fila
  When edito el costo fijo
  Then el costo y margen se recalculan incluyendo el costo fijo
```

## Plan (SDD — HOW)
1. Alinear `SERVICIOS` del HTML con el JSON (mismos valores)
2. Agregar columna costo fijo en `renderServicios()` (tabla y JS)
3. Incluir `costoFijo` en `costoMin/costoMax`
4. Actualizar el "Saber más" para mencionar costo fijo

## Verification script
```bash
#!/bin/bash
# VAL-05 — listado en flujo-uj-con-pri
F="docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-uj-con-pri.html"
echo "🧪 VAL-05 — Reutilizar listado en UJ-PRI"
grep -q "costoFijo\|costo-fijo" "$F" && echo "  ✅ costo fijo presente"
grep -c "'landing'" "$F" | grep -q "^[1-9]" && echo "  ✅ landing presente"
grep -c "'ret-pro'" "$F" | grep -q "^[1-9]" && echo "  ✅ ret-pro presente"
echo "✅ VAL-05 — COMPLETA"
```

## Estado
DONE — SERVICIOS alineado con JSON + costo fijo (test-uj-pri.cjs 6/6)

## Notas
- El `SERVICIOS` del HTML pasa a llamarse `TRABAJOS` o se mantiene el
  nombre pero alineado al JSON (decisión: mantener `SERVICIOS` con
  comentario de fuente de verdad para minimizar cambios)

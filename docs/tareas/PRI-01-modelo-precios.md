# PRI-01 — Modelo de precios: hora vs paquete vs retainer

## Contexto

Para un estudio de servicios PyME (SACsi) el modelo de precios define
cómo se cobra. Las 3 opciones clásicas:

| Modelo | Cómo se cobra | Pros | Contras |
|--------|---------------|------|---------|
| **Hora** | Se factura tiempo real trabajado | Justo, simple de calcular | Cliente no sabe cuánto va a pagar; penaliza eficiencia; foco en horas no en valor |
| **Paquete / alcance fijo** | Precio cerrado por entregable | Cliente sabe cuánto paga; foco en valor; es lo que espera una PyME | Riesgo de scope creep; requiere buen relevamiento previo |
| **Retainer / suscripción** | Cuota mensual por mantenimiento/soporte | Ingreso recurrente predecible; relación larga | Requiere base instalada de clientes; se asocia a "gasto fijo" |

## Decisión (unifica "Descubrimiento/Día")

> **Decisión de marca del usuario (registrada en FASE 2, MAR-01):**
> unificar el proceso en 4 pasos — **Descubrimiento, Diagnóstico,
> Prototipo, Producción** — y que el **Descubrimiento sea SIN CARGO**.
> NO se cobra por "día de trabajo" (modelo legacy que confundía a las
> PyMEs); se cobra por **paquete de alcance fijo**.

**Modelo adoptado por SACsi:**

1. **Paquete de alcance fijo** = modelo PRINCIPAL para proyectos
   (sitios, automatizaciones, software a medida).
   - Se cotiza cerrado después del Descubrimiento (diagnóstico claro).
   - Payment terms: 50% adelanto / 50% contra entrega (o 30/40/30 por
     milestones en proyectos > ARS 3M).
2. **Retainer mensual** = modelo COMPLEMENTARIO para mantenimiento y
   soporte post-entrega (opcional, se ofrece al cerrar cada proyecto).
3. **Hora técnica** = SOLO para consultoría/cambios menores fuera de
   alcance (no se publica como modelo principal; se usa internamente
   para cotizar el paquete).

**Por qué este mix encaja con SACsi:**
- El cliente PyME quiere saber "cuánto me sale" antes de arrancar →
  paquete cerrado.
- La FAQ ya publica: "Los proyectos chicos arrancan desde los $150.000
  ARS... te damos un presupuesto claro y sin compromiso" → coherente
  con paquete cerrado.
- "Conversación sin cargo" = Descubrimiento sin cargo → coherente con
  los 4 pasos del sitio.
- El retainer genera recurrencia y suaviza los picos (decisión H-MAR-01:
  subcontratar en picos) → el retainer es el ingreso base.

## Scenarios (BDD)

```gherkin
Scenario: Modelo de precios definido y coherente
  When completo PRI-01
  Then el modelo principal es paquete de alcance fijo
  And el Descubrimiento es sin cargo (paso 1 de los 4)
  And NO se cobra por dia de trabajo
  And existe retainer mensual opcional post-entrega
  And la hora tecnica existe solo como unidad interna de cotizacion
```

## Verification (bash ejecutable)

```bash
#!/bin/bash
# PRI-01 — modelo de precios
FILE="docs/tareas/PRI-01-modelo-precios.md"
echo "🧪 PRI-01 — Modelo de precios"
grep -q 'paquete de alcance fijo' "$FILE" && echo "  ✅ modelo principal paquete fijo"
grep -q 'Descubrimiento.*sin cargo\|sin cargo' "$FILE" && echo "  ✅ Descubrimiento sin cargo"
grep -q 'Retainer' "$FILE" && echo "  ✅ retainer mensual"
grep -q 'hora tecnica' "$FILE" && echo "  ✅ hora solo interna"
if grep -q 'NO se cobra por dia' "$FILE"; then
  echo "  ✅ no se cobra por dia (decision unificada)"
else
  echo "  ❌ falta la decision 'no dia'"
  exit 1
fi
echo "✅ PRI-01 — COMPLETA"
```

## Estado
DONE — modelo paquete + retainer adoptado; Descubrimiento sin cargo

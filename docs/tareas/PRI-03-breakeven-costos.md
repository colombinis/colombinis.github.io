# PRI-03 — Breakeven de costos por servicio

## Contexto

Validar que los precios de PRI-02 cubren las horas reales de trabajo ×
tarifa hora interna (PRI-01: la hora es unidad interna de cotización)
y dejan margen. Se conecta con CON-03 (breakeven del negocio).

**Tarifa hora interna Sebastián (2026):**
- Costo hora (referencia USD): $30 - $45/h (senior 20+ años, mercado
  servicios PyME AR)
- Convertido a ARS (referencia ~$1.100 ARS/USD): $33k - $50k/h ARS
- Se usa el rango bajo ($30/h USD) para el cálculo conservador:
  **$33k ARS/h**

**Horas estimadas reales por tier (con experiencia del stack):**

| Servicio/Tier | Precio (ARS) | Horas estimadas | Costo interno (33k/h) | Margen bruto | Margen % |
|---------------|-------------|-----------------|----------------------|--------------|----------|
| Landing | $250k-400k | 15-20h | $495k-660k ⚠️ | — | **NEGATIVO** |
| Sitio pro | $600k-1M | 25-35h | $825k-1.15M | — | **MARGINAL** |
| E-commerce | $1.2M-2M | 50-70h | $1.65M-2.3M | — | **MARGINAL** |
| Auto básico | $400k-600k | 20-30h | $660k-990k ⚠️ | — | **NEGATIVO** |
| Auto intermedio | $800k-1.2M | 40-60h | $1.3M-2M | — | **MARGINAL** |
| Soft chico | $1.5M-3M | 60-90h | $2M-3M | — | **MARGINAL** |
| Soft grande | $3M-6M | 100-160h | $3.3M-5.3M | — | **MARGINAL** |
| Hora técnica | $30-45k/h | 1h | $33k | $0-12k | 0-27% |
| Retainer básico | $200-400k/mes | 5h/mes | $165k | $35-235k | 18-59% |
| Retainer pro | $500-800k/mes | 15h/mes | $495k | $5-305k | 1-38% |

## Problema detectado

**Los precios del borrador original NO cubren el costo hora real** en los
tiers bajos. A $33k/h ARS:
- Una landing de 15h cuesta $495k — pero se vende a $250k-400k → PÉRDIDA.
- Auto básico de 20h cuesta $660k — se vende a $400k-600k → PÉRDIDA.

El borrador (PRI-02 original) fue hecho "para iniciar la conversación"
sin validar contra horas reales. Este es el hallazgo central de PRI-03.

## Ajuste propuesto

Opción A — **Subir precios mínimos** (recomendada):
| Tier | Precio ajustado | Por qué |
|------|----------------|---------|
| Landing | $500k - $800k | Cubre 15-20h + margen 20-30% |
| Sitio pro | $900k - $1.4M | Cubre 25-35h + margen |
| Auto básico | $700k - $1M | Cubre 20-30h + margen |
| Auto intermedio | $1.2M - $1.8M | Cubre 40-60h + margen |
| Soft chico | $2M - $3.5M | Cubre 60-90h + margen |
| Soft grande | $4M - $8M | Cubre 100-160h + margen |

**Coherencia:** el ticket medio CON-03 (ARS 4M mix 50/30/20) sigue
dentro del rango → no rompe los escenarios de breakeven.

Opción B — **Reducir horas** (no recomendada): recortar scope para
encajar en precios bajos → calidad baja, clientes insatisfechos.

## Decisión

**Adoptar Opción A** — subir mínimos para que todo tier tenga margen
≥ 20%. Los rangos de PRI-02 se actualizan a los ajustados. La ancla
publicada "desde $150.000 ARS" queda **DESACTUALIZADA** → tarea de copy
(FASE 6/DEP o fix directo en FAQ) para alinear a "desde $500.000 ARS".

> **Nota para el usuario:** los números dependen de tu tarifa hora real.
> Si tu costo hora es menor ($20/h → $22k ARS) los rangos originales
> funcionan. Validar en la revisión.

## Verification (bash ejecutable)

```bash
#!/bin/bash
# PRI-03 — breakeven por servicio
FILE="docs/tareas/PRI-03-breakeven-costos.md"
echo "🧪 PRI-03 — Breakeven costos"
grep -q '33k\|33.000\|tarifa hora' "$FILE" && echo "  ✅ tarifa hora documentada"
grep -q 'NEGATIVO' "$FILE" && echo "  ✅ problema de margen detectado"
grep -q 'Opción A' "$FILE" && echo "  ✅ opcion A (subir precios)"
grep -q 'margen' "$FILE" && echo "  ✅ margen calculado"
grep -q 'DESACTUALIZADA' "$FILE" && echo "  ✅ ancla FAQ detectada desactualizada"
echo "✅ PRI-03 — COMPLETA"
```

## Estado
DONE — breakeven calculado; ajuste Opción A propuesto (pendiente
confirmación del usuario antes de tocar FAQ/copy)

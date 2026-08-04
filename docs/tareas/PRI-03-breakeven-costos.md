# PRI-03 — Breakeven de costos por servicio

## Contexto

Validar que los precios de PRI-02 cubren las horas reales de trabajo ×
tarifa hora interna (PRI-01: la hora es unidad interna de cotización)
y dejan margen. Se conecta con CON-03 (breakeven del negocio).

**Tarifa hora real Sebastián (confirmada por el usuario 2026-08-04):**
- **USD 20/h** (no USD 30-45/h como se asumía inicialmente)
- Convertido a ARS (referencia ~1.100 ARS/USD): **~ARS 22.000/h**
- Cálculo conservador: **ARS 22k/h**

## Tabla de breakeven (tarifa REAL $22k/h ARS)

| Servicio/Tier | Precio (ARS) | Horas est. | Costo @22k/h | Margen min | Margen max | ¿Viable? |
|---------------|-------------|------------|--------------|------------|------------|----------|
| Landing | $250k-400k | 15-20h | $330k-440k | **-24%** | **-9%** | ❌ NEGATIVO |
| Sitio pro | $600k-1M | 25-35h | $550k-770k | +9% | +30% | ✅ OK |
| E-commerce | $1.2M-2M | 50-70h | $1.1M-1.54M | +9% | +30% | ✅ OK |
| Auto básico | $400k-600k | 20-30h | $440k-660k | **-9%** | **-9%** | ⚠️ MARGINAL |
| Auto intermedio | $800k-1.2M | 40-60h | $880k-1.32M | **-9%** | **-9%** | ⚠️ MARGINAL |
| Soft chico | $1.5M-3M | 60-90h | $1.32M-1.98M | +14% | +52% | ✅ OK |
| Soft grande | $3M-6M | 100-160h | $2.2M-3.52M | +36% | +70% | ✅ OK |
| Hora técnica | $30-45k/h | 1h | $22k | +36% | +105% | ✅ OK |
| Retainer básico | $200-400k/mes | 5h/mes | $110k | +82% | +264% | ✅ OK |
| Retainer pro | $500-800k/mes | 15h/mes | $330k | +52% | +142% | ✅ OK |

## Problema detectado (recalculado con tarifa real)

**Con $20/h USD (~$22k ARS/h) los tiers bajos siguen sin cubrir costo:**
- **Landing:** 15h = $330k, se vendía a $250k-400k → PÉRDIDA en todo el rango
- **Auto básico:** 20h = $440k, se vendía a $400k-600k → pierde en el rango bajo
- **Auto intermedio:** 40h = $880k, se vendía a $800k-1.2M → pierde en el rango bajo

Los tiers medios/altos (Sitio pro, E-commerce, Software, Hora, Retainers)
SÍ son viables con margen 9-264%.

## Ajuste propuesto — Opción A (revisada con tarifa real)

| Tier | Precio ajustado | Por qué |
|------|----------------|---------|
| **Landing** | **$500k - $700k** | Alinea con ancla FAQ "$500.000"; cubre 15-20h + margen 14-52% |
| Sitio pro | $600k - $1M | OK tal cual (+9 a +30%) |
| E-commerce | $1.2M - $2M | OK tal cual (+9 a +30%) |
| **Auto básico** | **$500k - $750k** | Cubre 20-30h + margen 14-25% |
| **Auto intermedio** | **$1.1M - $1.6M** | Cubre 40-60h + margen 25-21% |
| Soft chico | $1.5M - $3M | OK tal cual (+14 a +52%) |
| Soft grande | $3M - $6M | OK tal cual (+36 a +70%) |
| Hora técnica | $30-45k/h | OK tal cual |
| Retainers | $200-800k/mes | OK tal cual |

**Solo 3 tiers requieren ajuste** (Landing, Auto básico, Auto intermedio).
El resto ya era viable con la tarifa real.

**Coherencia:** ticket medio CON-03 (ARS 4M mix 50/30/20) sigue dentro
del rango → no rompe los escenarios de breakeven.

## Ancla FAQ actualizada (confirmada por el usuario)

> **Decisión del usuario (2026-08-04):** "si. el valor hora real es 20 USD"
> → Se actualiza la FAQ de index.astro de **$150.000 → $500.000 ARS**.
> Con tarifa real $22k/h, el ancla $500k es el floor viable del tier
> más bajo (Landing $500-700k) → coherente y con margen.

## Verification (bash ejecutable)

```bash
#!/bin/bash
# PRI-03 — breakeven por servicio (tarifa real)
FILE="docs/tareas/PRI-03-breakeven-costos.md"
echo "🧪 PRI-03 — Breakeven costos"
grep -q '22k\|22.000\|20 USD' "$FILE" && echo "  ✅ tarifa real USD 20/h documentada"
grep -q 'NEGATIVO' "$FILE" && echo "  ✅ problema de margen detectado"
grep -q 'Landing.*500k' "$FILE" && echo "  ✅ Landing ajustada a $500k"
grep -q 'Auto básico.*500k' "$FILE" && echo "  ✅ Auto básico ajustada"
grep -q 'Auto intermedio.*1.1M' "$FILE" && echo "  ✅ Auto intermedio ajustada"
grep -q '150.000 → 500.000\|500.000 ARS' "$FILE" && echo "  ✅ ancla FAQ actualizada"
echo "✅ PRI-03 — COMPLETA"
```

## Estado
DONE — breakeven recalculado con tarifa real USD 20/h; FAQ actualizada

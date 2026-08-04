# PRI-01 — Estructura de precios: hourly vs paquete

## Contexto

SACsi ofrece servicios profesionales. Tres modelos comunes:
1. **Hourly**: $X/hora — transparente, escalable, pero limita ingreso
2. **Paquete fijo**: precio cerrado por scope — más fácil de vender, incentiva efficiency
3. **Retainer**: monto mensual recurrente — ingresos predecibles

Para un servicio PyME Argentina con 15 años de experiencia, los tres modelos
tienen pros/contras distintos.

## Scenarios (BDD)

```gherkin
Scenario: Estructura recomendada
  When completo PRI-01
  Then existe una recomendación con pros/contras por modelo:
    | modelo | pros | contras | cuando usar |
    | hourly | transparente | escala mal | mantto, ad-hoc |
    | paquete | venta facil | riesgo scope | automatizacion, sitio web |
    | retainer | ingreso predecible | requiere trust | mantto WP, soporte |
  And se define un modelo mixto recomendado para SACsi:
    -ierto por tipo de servicio
```

## Plan

1. Definir los 3 modelos con pros/contras
2. Recomendar modelo preferido por servicio:
   - Automatización: paquete (scope definido)
   - Software a medida: hourly + cap (abrir abanico)
   - Presencia online: paquete (tier básico/estándar/premium)
   - Mantenimiento WP (nuevo): retainer mensual
3. Justificar en base a experiencia SACsi previa

## Estado
TODO

## Notas
Recomendación inicial: paquete presencia online (3 tiers),
hourly para software a medida con cap, mix para automatización.
Usuario debe validar con su experiencia real.

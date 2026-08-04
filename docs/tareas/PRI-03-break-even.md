# PRI-03 — Break-even: costo operativo vs ingresos

## Contexto

Definir el costo mensual de SACsi:
- Hosting GitHub Pages: gratis
- Dominio sacsi.com.ar: ~$10 USD/año (~$1k ARS/mes)
- Herramientas (GA4, GTM): gratis
- Tiempo Sebastián: cost de oportunidad (¿cuánto cobraría como freelance?)
- Impuestos Argentina: monotributo o IVA + Ganancias según facturación
- Soft costs: marketing, capacitación continua, infraestructura dev

Supuesto: Sebastián busca que SACsi sea su ingreso principal en mediano plazo.

## Scenarios (BDD)

```gherkin
Scenario: Break-even calculado
  When completo PRI-03
  Then existe una tabla costo mensual:

| item | ARS/mes | USD/mes |
| dominio | $1k | $1 |
| tiempo Sebastián (80h) | costo-op * h | * h |
| impuestos estimados | 20% ingresos brutos | 20% |
| soft costs | $50k | $50 |
| TOTAL | TBD ARS | TBD USD |

  And existe la formula break-even:
    ingresos_mensuales >= costos_mensuales
  And existe el calculo de clientes necesarios:
    clientes_necesarios = ceil(costos / ticket_promedio)
```

## Plan

1. Listar todos los costos (fijos + variables)
2. Estimar cost de oportunidad Sebastián (¿USD/hora freelance?)
3. Calcular break-even en tres escenarios (conservador, realista, agresivo)
4. Validar contra tasas de conversión (CON-02) y precios (PRI-02)

## Estado
TODO

## Notas
Lo más sensible del modelo. Requiere input del usuario sobre:
- Cuánto cobra su hora freelance
- Cuánto factura hoy mes
- Costo real impuestos Argentina

# CON-03 — Estimar tráfico necesario para break-even

## Contexto

Break-even: ingresos ≥ costos operativos mensuales.
Para estimar el tráfico necesario:
- Costos mensuales SACsi: estimar (hosting $0 GitHub Pages, dominio $10/mes
  AR, tiempo Sebastián = cost de oportunidad)
- Ticket promedio: definir PRI-02
- Tasa cierre: CON-02
- Funnel inverso: necesito X clientes → Y leads → Z visitas

Ejemplo:
- Costo mensual objetivo: $1.500.000 ARS (ejemplo, ajustar)
- Ticket promedio: $500.000 ARS
-Clientes necesarios: 3/mes
- Conversion lead→client: 25%
- Leads necesarios: 12/mes
- Conversion visit→lead: 2%
- Visitas necesarias: 600/mes

## Scenarios (BDD)

```gherkin
Scenario: Break-even calculado
  When completo CON-03
  Then existe una tabla "escenarios de break-even":
    | escenario | costo/mes | ticket | clientes | leads | visitas |
    | básico | $1M ARS | $500k ARS | 2 | 8 | 400 |
    | realista | $1.5M ARS | $500k ARS | 3 | 12 | 600 |
    | agresivo | $2.5M ARS | $800k ARS | 3 | 12 | 800 |
  And se indica fuente de cada número
```

## Plan

1. Estimar costos SACsi (hosting, dominio, tiempo Sebastián)
2. Definir 3 escenarios: básico / realista / agresivo
3. Calcular funnel inverso para cada uno
4. Documentar supuestos (moneda, supuestos tiempo, etc.)

## Estado
TODO

## Notas
Depende de CON-02 (tasas) y PRI-02 (tickets promedio).

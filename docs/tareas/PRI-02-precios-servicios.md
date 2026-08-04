# PRI-02 — Precios por servicio

## Contexto

Definir rangos de precios para cada servicio de SACsi:
- Automatización de procesos
- Software a medida
- Presencia online y e-commerce
- (Futuro) Mantenimiento WP — detectado en UJ-03
- (Futuro) IA aplicada — detectado en MAR-04

Necesitamos precios en ARS (Argentina) y referencia USD para Contratación
internacional (objetivo mediano plazo Sebastián).

## Scenarios (BDD)

```gherkin
Scenario: Rangos de precios definidos por servicio
  When completo PRI-02
  Then existe una tabla con:

| servicio | tier | ARS | USD |
| automatizacion | basico | $400k-600k | $400-600 |
| automatizacion | intermedio | $800k-1.2M | $800-1200 |
| software-medida | hourly | $30k-45k/h | $30-45/h |
| software-medida | paquete | $1.5M-3M | $1500-3000 |
| presencia-online | landing | $250k-400k | $250-400 |
| presencia-online | sitio-pro | $600k-1M | $600-1000 |
| presencia-online | ecommerce | $1.2M-2M | $1200-2000 |

  And cada precio tiene:
    - scope included (qué incluye)
    - scope excluded (qué no incluye)
    - duration estimada (semanas)
    - payment terms (50/50, milestones, etc.)
```

## Plan

1. Definir scope de cada servicio/tier
2. Estimar horas de trabajo reales (no precio theorico)
3. Calcular precio basado en costo hora Sebastián + margen
4. Agregar comparación contra mercado Argentina (SiP, Costo Smart, otros)
5. Validar que precios se sostienen contra break-even (CON-03)

## Estado
TODO

## Notas
Requiere input real del usuario. Los rangos arriba son estimates para
iniciar la conversación, no precios definitivos.

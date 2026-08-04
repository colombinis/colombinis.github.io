# PRI-04 — Tiers: entrada / estándar / premium

## Contexto

Estrategia de tiers "bueno/mejor/mejor" (good/better/best):
- Incentiva upselling natural (cliente ve opción premium)
- Crea punto de anclaje (premium hace "estándar" ver más barato)
- Reduce fricción decisional (3 opciones vs custom)

Aplicable a SACsi: 3 niveles por servicio con scope incremental.

## Scenarios (BDD)

```gherkin
Scenario: Tiers definidos para cada servicio
  When completo PRI-04
  Then existe una tabla con 3 tiers por cada servicio:

| servicio | tier entrada | tier estándar | tier premium |
| presencia-online | Landing básica | Sitio institucional | E-commerce |
| automatizacion | 1 proceso simple | 2-3 procesos | Automatización completa |
| software-medida | MVP 1 feature | Versión 1.0 | Producto escalable |

  And cada tier tiene:
    - descripcion clara (que incluye)
    - horas estimadas
    - precio ARS + USD
    - duration (semanas)
    - payment terms
    - scope diferenca claro entre niveles
```

## Plan

1. Para cada uno de los 3 servicios, definir 3 tiers
2. Para cada tier: scope, horas, precio, duration
3. Validar coherencia: premium > estándar > entrada (incremento razonable)
4. Validar que entrada ≥ break-even por hora
5. Validar que premium no sea "barato demais" (protege margen)

## Estado
TODO

## Notas
Estrategia recomendada: no publicar precios en el sitio todavía (sacsi.com.ar
vende por consulta), pero tener la estructura lista para:
- responder rápido a consultas por WhatsApp
- eventualmente publicar precios si el modelo lo amerita

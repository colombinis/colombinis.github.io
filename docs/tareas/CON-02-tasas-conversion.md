# CON-02 — Estimar tasas de conversión por canal

## Contexto

Necesitamos benchmarks razonables para un sitio B2B de servicios
PyME en Argentina:
- CTR orgánico (Google → click en resultado)
- Visit → lead conversion (WhatsApp o form submit)
- Lead → client conversion (cierre comercial)

Fuentes de datos: SINIA (Argentina), Smart Insights benchmarks,
experiencia PyME B2B (1-3% visita→lead, 20-40% lead→client).

## Scenarios (BDD)

```gherkin
Scenario: Tasas definidas y justificadas
  When completo CON-02
  Then existe una tabla con:
    | transition | tasas (min/median/max) | fuente |
    | Google → visit | 2-5% CTR organico | Search console (post-deploy) |
    | Visit → lead | 1-3% median, 5% alto | Smart Insights, B2B Argentina |
    | Lead → client | 20-40% | SACsi histórico (estimar primero) |
  And los rangos son realistas para la audiencia PyME Argentina
  And se definen supuestos clave (geografia, canal preferido)
```

## Plan

1. Buscar benchmarks B2B servicios PyME Argentina
2. Definir tasas de referencia (min/median/max)
3. Calcular funnel:¿con 100 visitas/mes cuántos leads esperamos?
4. Documentar supuestos

## Estado
TODO

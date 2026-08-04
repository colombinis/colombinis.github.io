# CON-01 — Definir funnel: visitas → leads → clientes

## Contexto

Sin un funnel definido no podemos estimar tráfico necesario ni precios.
El funnel de SACsi es:
- TOFU (top): Visitas al sitio (orgánico, referral, social)
- MOFU (middle): Contactos vía WhatsApp o formulario (leads)
- BOFU (bottom): Clientes que contratan (cierre)

Necesitamos cuantificar cada etapa. El sitio tiene Google Analytics (GTM-T7PWJ99)
pero todavía no tiene eventos personalizados más alla del pageview.

## Scenarios (BDD)

```gherkin
Scenario: Funnel documentado y medible
  When completo CON-01
  Then existe un documento con la definicion del funnel:
    | etapa | métrica | herramienta |
    | TOFU | Visitas mensuales | GA4 pageview |
    | MOFU | WhatsApp clicks + form submits | GTM events (pending CON-04) |
    | BOFU | Clientes cerrados | CRM manual |
  And cada etapa tiene un objetivo mensual estimado
  And las tasas de conversion entre etapas estan definidas (CON-02)
```

## Plan

1. Definir el funnel visualmente (TOFU/MOFU/BOFU)
2. Mapear cada etapa a eventos medibles en el sitio (GTM/GA4)
3. Definir objetivos mensuales (ej: 200 visitas, 5 leads, 1 cliente)
4. Documentar en este archivo

## Estado
TODO

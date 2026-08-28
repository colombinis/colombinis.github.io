# CON-01 — Definir funnel: visitas → leads → clientes

## Contexto

Sin un funnel definido no podemos estimar tráfico necesario ni precios.
El funnel de SACsi es el clásico TOFU/MOFU/BOFU de servicios B2B PyME:

```
TOFU  →  Visitas al sitio (orgánico Google, directo, referral, social)
          ↓
MOFU  →  Leads: click WhatsApp (api.whatsapp.com/send) + form submits
          ↓
BOFU  →  Clientes cerrados (WhatsApp conversación → propuesta → contrato)
```

**Estado del tracking (verificado 2026-08-04):**
- GTM-T7PWJ99 activo en `src/layouts/Layout.astro` (snippet + noscript).
- **Solo pageview automático** (GA4 lo cuenta por defecto vía GTM).
- **NO hay eventos personalizados** — cero `dataLayer.push` en `src/`.
- El form de contacto usa `mailto:` via JS (`contacto.astro:256-276`):
  abre el cliente de mail del visitante; no hay backend.
- Los clicks a WhatsApp son `<a href="https://api.whatsapp.com/send?...">`
  — sin tracking.

## Scenarios (BDD)

```gherkin
Scenario: Funnel documentado y medible
  When completo CON-01
  Then existe un documento con la definicion del funnel:
    | etapa | métrica                 | herramienta                     |
    | TOFU  | Visitas mensuales       | GA4 pageview (ya activo)        |
    | MOFU  | WhatsApp clicks         | GTM event (pendiente CON-04)    |
    | MOFU  | Form submits            | GTM event (pendiente CON-04)    |
    | BOFU  | Clientes cerrados       | CRM manual / hoja de seguimiento|
  And cada etapa tiene un objetivo mensual estimado
  And las tasas de conversion entre etapas estan definidas (CON-02)
```

## Plan

1. Definir el funnel visualmente (TOFU/MOFU/BOFU) ✓ (arriba)
2. Mapear cada etapa a eventos medibles en el sitio (GTM/GA4)
3. Definir objetivos mensuales (abajo)
4. Documentar en este archivo ✓

## Objetivos mensuales (hipótesis inicial, recalc en CON-03)

> Hipótesis de arranque para un sitio nuevo post-deploy. Se recalibran
> con datos reales de GA4 a los 90 días (ver DEP-01).

| Métrica | Objetivo mes 1-3 | Objetivo mes 4-6 | Nota |
|---------|-----------------|------------------|------|
| Visitas (TOFU) | 150-300 | 500-800 | Orgánico local + referral |
| Leads WhatsApp (MOFU) | 3-8 | 10-20 | Al 2-3% de visitas (CON-02) |
| Form submits (MOFU) | 1-3 | 3-8 | Canal B2B/email |
| Leads totales (MOFU) | 4-11 | 13-28 | Suma WhatsApp + form |
| Clientes (BOFU) | 1-2 | 2-5 | Al 20-30% de leads (CON-02) |

## Decisión de medición (importante)

**MOFU se mide por el click al WhatsApp, NO por la conversación completa.**
El click a `api.whatsapp.com` es el evento proxy de lead (barato de medir,
ya existe como link). La conversación real y el cierre (BOFU) se registran
manualmente en una hoja de seguimiento de ventas (CRM-lite).

## Estado
DONE — funnel definido y mapeado a eventos (falta implementar eventos, CON-04)

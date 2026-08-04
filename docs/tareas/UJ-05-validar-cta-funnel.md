# UJ-05 — Validar CTA funnel: cada página tiene CTA claro

## Contexto

Contenido.md: "Conversión en 3 clics: landing → servicio → CTA → contacto."
Para que el funnel sea efectivo, cada página del sitio debe tener al menos
un CTA. Hagamos el checklist de los 15 pages.

## Scenarios (BDD)

```gherkin
Scenario: Cada página tiene CTA visible
  Given el sitio tiene 15 páginas (index + 4 institucionales + 3 servicios + 8 casos)
  When reviso cada página
  Then cada una tiene al menos 1 CTA:
    - index.html → "Consultános sin cargo" (WhatsApp) + "Conocé más"
    - /contacto/ → formulario + WhatsApp
    - /sobre-nosotros/ → WhatsApp + email
    - /servicios/* (3) → CTA WhatsApp específico del servicio
    - /casos-exito/* (8) → CTA WhatsApp o email al final del caso
  And no hay páginas dead-end (sin salida a conversión)

Scenario: CTA coherente con sección
  Given un visitante en /servicios/automatizacion/
  When ve el CTA
  Then el CTA dice "Consultá por este servicio" (no genérico)
  And el mensaje WhatsApp esta pre-cargado con contexto de automatización
```

## Plan

1. Listar las 15 páginas (1 index + 4 info + 3 servicio + 8 casos - 1 casos.json)
2. Verificar presencia de CTA en cada una
3. Validar coherencia del mensaje WhatsApp (no generic "hola quiero saber mas")

## Estado
TODO

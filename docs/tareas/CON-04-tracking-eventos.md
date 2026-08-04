# CON-04 — Validar tracking: GTM/GA4 eventos clave

## Contexto

El sitio tiene GTM-T7PWJ99 con pageview tracking. Para medir el funnel
necesitamos eventos personalizados en GTM/GA4:
- click_whatsapp (cualquier botón WhatsApp)
- submit_contact_form (envio formulario /contacto/)
- click_caseStudy (carrusel o grilla)
- click_service_card (cualquier ServiceCard)

Estos eventos son los que disparan el seguimiento del funnel en GA4.

## Scenarios (BDD)

```gherkin
Scenario: Eventos GTM principales disparados
  Given GTM-T7PWJ99 cargado
  When un visitante clickea "Consultános sin cargo"
  Then el dataLayer recibe el evento 'click_whatsapp'
  And el evento tiene un parámetro 'location' (hero, servicio, caso)

  When un visitante envía el formulario /contacto/
  Then el dataLayer recibe 'submit_contact_form'

  When un visitante clickea un caso en el carrusel
  Then el dataLayer recibe 'click_case_study' con 'slug'
```

## Plan

1. Definir los 4 eventos clave que necesitamos trackear
2. Para cada evento, definir:
   - Trigger: qué elemento HTML lo dispara (clase, ID)
   - Tag: qué GA4 event manda
   - Parámetros adicionales (location, slug, etc.)
3. Implementar en Layout.astro + CasosCarousel.astro + otros
4. Documentar la configuration GTM container que el usuario debe setear

## Estado
TODO

## Notas
Implementación técnica — requiere tocar código Astro. El usuario debe
configurar el container en GTM con esos eventos.

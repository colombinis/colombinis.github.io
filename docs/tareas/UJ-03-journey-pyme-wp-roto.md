# UJ-03 — Journey: PyME con WP roto → rescate

## Contexto

Persona: Ana, 38, CMO de tienda online. El WordPress de la empresa está
lento y sufrió un hackeo. Necesita urgente un rescate. Tech-aware.

## Scenarios (BDD)

```gherkin
Scenario: Ana busca rescate WP
  Given Ana busca en Google "rescate wordpress lento hackeado Rosario"
  When aterriza en sacsi.com.ar
  Then debería ver un caso de rescate WP visible en home

  When hace scroll al carrusel
  Then ve el caso "Rescate de un e-commerce WordPress lento y hackeado"
  And el metric "De 8s a 1.5s" le impacto

  When clickea el caso
  Then aterriza en /casos-exito/rescate-rendimiento-seguridad-wordpress/
  And lee el detalle: stack, métrica, proceso de rescate
  And encuentra CTA WhatsApp o email

Alternative scenario: Ana entra directo a /servicios/
  When Ana entra a /servicios/
  Then ve "Software a Medida" como servicio cercano
  But NO ve un servicio de "Rescate / Mantenimiento WP" explicito
  → GAP: ¿necesitamos un servicio de mantenimiento WP?
```

## Plan

1. Recorrer el flow caso-rescate
2. Evaluar gap: sitio no tiene servicio explicito de "rescate WP" o "mantenimiento"
3. Recomendar: ¿agregar como sub-servicio dentro de "Software a Medida"?
   ¿Crear nuevo servicio /servicios/rescate-wordpress/?

## Estado
TODO

## Notas
Este journey potencialmente revela la necesidad de un 4to servicio (mantenimiento WP),
distinto del "servicio IA" de MAR-04.

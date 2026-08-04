# UJ-02 — Journey: PyME sin web → contacto

## Contexto

Persona: Carlos, 52, dueño de ferretería. Tiene Instagram pero no web.
Quiere vender online. No sabe nada de tecnología. Canal: WhatsApp mobile.

## Scenarios (BDD)

```gherkin
Scenario: Carlos completa el journey
  Given Carlos entra a sacsi.com.ar desde mobile (Google "hacer tienda online Rosario")
  When aterriza en el hero
  Then ve H1 "Tecnología simple para PyMEs que quieren crecer"
  And ve CTA "Consultános sin cargo" (WhatsApp) visible sin scroll

  When hace scroll al carrusel de casos
  Then ve el caso "Ferretería familiar sin tiempo para la tienda online"
  And el metric "Tienda online sin fricción" le resuena

  When clickea el caso
  Then aterriza en /casos-exito/ferreteria-gas-plomeria/
  And lee el deseo del cliente (parecido al suyo)
  And encuentra CTA WhatsApp al final

  When clickea el WhatsApp
  Then abre chat con SACsi con mensaje pre-cargado sobre "presencia online"

Funnel: Landing → Carrusel → Caso ferretería → WhatsApp
Steps: 4 (objetivo: max 5)
```

## Plan

1. Recorrer manualmente este flow en el sitio
2. Validar CTA visible en cada step
3. Validar mensaje WhatsApp pre-cargado contextualizado
4. Medir:¿el metric del ferre terminology resuena con "sin fricción"?

## Estado
TODO

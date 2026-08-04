# MAR-01 — Pillars de marca: SACsi vs personal

## Contexto

El usuario tiene DOS niveles de marca:
1. **SACsi** (negocio): soluciones para PyMEs Rosario — tono "profesional pero cercano", sin jerga
2. **Marca personal** (Sebastián): "PHP + IA aplicada" —筹码 hacia reclutadores tech

El sitio actual comunica SACsi pero los 5 casos WordPress agregados en T12
fueron pensados para que un reclutador los evalúe. ¿Estos dos objetivos
conviven bien o se contraponen?

## Scenarios (BDD)

```gherkin
Scenario: PyME dueña visita el sitio
  Given un dueño de ferretería que no sabe de tecnología
  When entra a sacsi.com.ar
  Then entiende qué ofrece SACsi en 8 segundos
  And no se asusta con jerga técnica (WPGraphQL, Gutenberg, Next.js)
  And encuentra un CTA de WhatsApp fácil

Scenario: Reclutador tech visita el sitio
  Given un reclutador que evalúa competencia WordPress
  When entra a /casos-exito/tema-wordpress-a-medida-gutenberg/
  Then ve stack técnico claro (chips con tecnologias)
  And ve métricas concretas (75% más rápido, LCP 1.1s)
  And puede evaluar competencias profesionales
```

## Plan

1. Revisar los 8 casos de éxito: ¿las descripciones técnicas asustan PyMEs?
2. Evaluar si el tono de las páginas de servicio (Home, automatizacion, etc.)
   sigue siendo no-técnico para PyMEs
3. Recomendar ajustes si hay choque de audiencias

## Estado
TODO

## Notas
Esta es la tarea más estratégica de la auditoría de marca. Define si
sacsi.com.ar sirve para los dos públicos o si necesitamos separar audiencias.

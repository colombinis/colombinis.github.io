# UJ-04 — Journey: Reclutador tech → portfolio

## Contexto

Persona: Reclutador tech de agencia internacional. Quiere evaluar a
Sebastián Colombini para un contrato WordPress. Busca en GitHub
colombinis/colombinis.github.io, aterriza en sacsi.com.ar.

## Scenarios (BDD)

```gherkin
Scenario: Reclutador evalúa competencias
  Given el reclutador aterriza en sacsi.com.ar
  When ve los casos de éxito
  Then debería ver 5 casos WordPress que cubren:
    | competencia | caso |
    | Tema a medida Gutenberg/ACF | tema-wordpress-a-medida-gutenberg |
    | WooCommerce subscriptions | tienda-woocommerce-suscripciones |
    | Headless Next.js + WPGraphQL | wordpress-headless-nextjs |
    | Performance + security | rescate-rendimiento-seguridad-wordpress |
    | LMS + memberships | plataforma-cursos-lms-membresias |

  When clickea un caso
  Then ve stack técnico (chips con WordPress, Gutenberg, ACF, Next.js)
  And ve métricas concretas (PageSpeed 95, LCP 1.1s)

  When busca info del developer
  Then debería haber /sobre-nosotros/ con perfil del developer
  And ese perfil enlaza a GitHub colombinis y LinkedIn
  And hay un CTA "Contacto profesional" (no "WhatsApp para PyME")
  → GAP: el sitio NO tiene CTA distinto para reclutadores (solo WhatsApp)
```

## Plan

1. Recorrer el flow reclutador → casos → sobre-nosotros
2. Evaluar gaps:
   - ¿/sobre-nosotros/ enlaza a GitHub/LinkedIn?
   - ¿Hay CTAs distintos según audiencia?
3. Recomendar:¿CTA "Trabajemos juntos" / email profesional para reclutadores?

## Estado
TODO

## Notas
Este journey ultrapuesto con estrategia marca personal "PHP + IA".

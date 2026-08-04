# MAR-02 — Auditar hero: propuesta de valor

## Contexto

Hero actual (src/pages/index.astro):
- Label: "SOLUCIONES INFORMÁTICAS"
- H1: "Tecnología simple para PyMEs que quieren crecer"
- Subtítulo: "Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online. Más de 15 años ayudando a empresas como la tuya a ganar tiempo, reducir costos y vender más."

¿Está alineado con la realidad? SACsi ofrece 3 servicios, pero la
estrategia personal es "PHP + IA". El hero no menciona IA en absoluto.
Si agregamos IA (MAR-04), el hero necesita actualizarse.

## Scenarios (BDD)

```gherkin
Scenario: Hero pasa test de 8 segundos
  Given un visitante nuevo
  When entra al sitio
  Then en menos de 8 segundos entiende:
    | qué | "soluciones informáticas" |
    | para quién | "PyMEs que quieren crecer" |
    | qué hace | "automatizar, software a medida, presencia online" |
    | prueba | "15 años de experiencia" |
  And al menos un CTA visible sin scroll
```

## Plan

1. Revisar el hero actual contra el test de 8 segundos
2. Validar que H1 + subtítulo cubren los 3 servicios
3. Si MAR-04 decide agregar IA, proponer texto nuevo para el hero

## Estado
TODO

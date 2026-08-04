# MAR-05 — Auditar tono y voz: consistencia entre páginas

## Contexto

Contenido.md dice: "Tono: profesional pero cercano. Idioma: español rioplatense (voseo). Sin jerga técnica."

¿Todas las páginas siguen este tono? Las páginas de servicio (automatizacion.astro,
software-a-medida.astro, presencia-online.astro) fueron escritas en el rebranding
pero quizás no se revisaron vs el nuevo contenido T12 (casos WordPress).

## Scenarios (BDD)

```gherkin
Scenario: Tono consistente跨 páginas
  Given el tono definido en Contenido.md
  When reviso las 11 páginas (index, contacto, sobre-nosotros, 3 servicios, 8 casos)
  Then todas usan voseo ("podés", "necesitás", "tu negocio")
  And ninguna usa jerga técnica sin explicar (WPGraphQL, ACF, Gutenberg aparecen sin glosa)
  And el tono es "profesional pero cercano" — ni formal seco ni informal chill
```

## Plan

1. Listar las 11 páginas y revisar tone en cada una
2. Identificar dónde aparece jerga técnica y recomendar glosa o simplificación
3. Verificar voseo consistente (no mezclar "tú" con "vos")

## Estado
TODO

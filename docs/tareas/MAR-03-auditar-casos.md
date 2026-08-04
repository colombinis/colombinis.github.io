# MAR-03 — Auditar casos de éxito: coherencia narrativa

## Contexto

Los 8 casos en `src/data/casos.js` mezclan dos audiencias:
- PyMEs reales (ropa usada, psicologia, ferreteria)
- Casos WordPress orientados a reclutador (Gutenberg, Woo suscripciones, headless Next.js)

La nota en Contenido.md dice: "las descripciones están redactadas para
'lucir reales' y sirven de plantilla. A futuro se mapean a proyectos concretos."

¿Es ético/elegante tener casos inventados mezclados con posibles casos reales?

## Scenarios (BDD)

```gherkin
Scenario: Casos claramente identificados
  Given un visitante en /casos-exito/
  When lee los 8 casos
  Then puede distinguir cuáles son "casos tipo" (instructivos) de reales
  And no hay engaño sobre clientes concretos que no existen

Scenario: Coherencia narrativa
  Given cada caso tiene slug, title, category, metric, excerpt
  When el visitante lee la página de detalle del caso
  Then el título coincide con el del carrusel
  And el stack técnico de chips coincide con el category
  And la métrica en el excerpt coincide con el metric
```

## Plan

1. Revisar los 8 casos: marcar cuáles son "caso tipo" (plantilla) y cuáles reales
2. Para los Caso tipo: ¿aggiornarlos o eliminarlos? Recomendación: marcarlos
   como "Ejemplo de proyecto tipo" en lugar de "Caso de éxito"
3. Validar consistencia carrusel ↔ página de detalle (8 pares)

## Estado
TODO

## Notas
Esta es una decisión de honestidad de marketing. El usuario debe decidir.

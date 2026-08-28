# MAR-05 — Auditar tono y voz: consistencia entre páginas

## Contexto

Contenido.md dice: "Tono: profesional pero cercano. Idioma: español rioplatense (voseo). Sin jerga técnica."

¿Todas las páginas siguen este tono? Las páginas de servicio (automatizacion.astro,
software-a-medida.astro, presencia-online.astro) fueron escritas en el rebranding
pero quizás no se revisaron vs el nuevo contenido T12 (casos WordPress).

## Scenarios (BDD)

```gherkin
Scenario: Tono consistente entre páginas
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
DONE

## Resultado del audit (14 páginas Astro)

Voseo verificado consistente en todas las páginas (sin tuteo ni "usted"); tono "profesional pero cercano".

### Correcciones aplicadas — jerga técnica en prosa

| Archivo | Antes | Después |
|---------|-------|---------|
| servicios/software-a-medida.astro | "CRM, ERP" | "sistemas de gestión" |
| servicios/software-a-medida.astro | "entregas por sprint" | "entregas por etapas" |
| servicios/software-a-medida.astro | "Deploy, capacitación" | "Puesta en marcha, capacitación" |
| servicios/automatizacion.astro | "Reportes y dashboards" | "Reportes y tableros de control" |
| servicios/presencia-online.astro | "móvil-first" | "pensado para el celular" |
| servicios/presencia-online.astro | "Contenido y SEO básico" / "metadatos" | "Contenido para aparecer en Google" |
| contacto.astro | "a traves de" (typo) | "a través de" |
| tema-wordpress-a-medida-gutenberg.astro | "Elementor", "page builder", "plugins", "template hierarchy" | "editor visual", "complementos", "estructura de plantillas"; ACF glosado como "campos personalizados (ACF)"; Gutenberg glosado |
| plataforma-cursos-lms-membresias.astro | "LearnDash", "(drip)" | "plataforma de aprendizaje online (LearnDash)" |
| wordpress-headless-nextjs.astro | "backend de contenidos", "vía WPGraphQL", "(ISR)", "Despliegue en la CDN", "plugins" | "motor de contenidos por detrás", "canal que entrega el contenido", "renderizado incremental", "red global de distribución (CDN)", "complementos" |
| rescate-rendimiento-seguridad-wordpress.astro | "WAF", "backups", "queries", "Hardening" (prosa), "plugins" | "Filtro de tráfico malicioso (WAF)", "copias de seguridad", "consultas lentas", "consultas"; "plugins" → "complementos" |
| tienda-woocommerce-suscripciones.astro | "Productos WooCommerce", "WooCommerce Subscriptions", "sobre WooCommerce" | "Catálogo de productos", "módulo de cobros recurrentes", CTA sin marca en prosa |

### Intencionalmente se mantuvieron técnicos

- **Chips de stack (`tech-tag`)** y **encabezados de sección** ("Hardening de seguridad", "WordPress como CMS headless"): nombres propios de la solución, se respetan.
- **Meta descriptions** (SEO, no visible al usuario): conservan términos técnicos para el posicionamiento.
- **Etiquetas de métricas** ("LCP en mobile", "PageSpeed mobile"): son datos del reporte, no prosa.

## Verificación

```bash
npm run build   # ✓ 16 páginas, sin errores
rg -ni 'sprint|deploy|hardening|\bdrip\b|page builder|\bplugins\b|\bdashboards\b|\bbackend\b|\bISR\b|mobile-first' src/pages src/components
#   → solo tech-tags, meta descriptions y encabezados (intencional)
rg -ni 'tienes|puedes|quieres|necesitas|usted\b|\btú\b' src/pages src/components
#   → sin tuteo ni usted (voseo consistente)
```

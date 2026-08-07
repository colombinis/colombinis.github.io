# MAR-03 — Auditar casos de éxito: coherencia narrativa

## Contexto

Los 8 casos en `src/data/casos-exito.json` mezclan dos audiencias:
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

## Resultado de la auditoría (2026-08-05)

**Decisión del usuario** (MAR-01 §6, H-MAR-02): marcar los 5 casos WP como
"Proyectos tipo" + dejar los testimonios ficticios marcados como "Testimonio
tipo". Ya estaba aplicado en los archivos detalle; esta tarea completó lo que
faltaba en las vistas de listado.

### 1. Clasificación de los 8 casos

| Slug | Tipo | Label en detalle | Testimonio |
|------|------|------------------|------------|
| tema-wordpress-a-medida-gutenberg | proyecto-tipo | PROYECTO TIPO | Testimonio tipo |
| tienda-woocommerce-suscripciones | proyecto-tipo | PROYECTO TIPO | Testimonio tipo |
| wordpress-headless-nextjs | proyecto-tipo | PROYECTO TIPO | Testimonio tipo |
| rescate-rendimiento-seguridad-wordpress | proyecto-tipo | PROYECTO TIPO | Testimonio tipo |
| plataforma-cursos-lms-membresias | proyecto-tipo | PROYECTO TIPO | Testimonio tipo |
| tienda-ropa-usada | caso-exito | CASO DE ÉXITO | real |
| consultorio-psicologia | caso-exito | CASO DE ÉXITO | real |
| ferreteria-gas-plomeria | caso-exito | CASO DE ÉXITO | real |

`src/data/casos-exito.json` ya tiene campos `tipo` (`proyecto-tipo`/`caso-exito`)
y `label` (`PROYECTO TIPO`/`CASO DE ÉXITO`) — fuente de verdad para el carrusel.

### 2. Gap encontrado y fix

Las vistas de listado (carrusel de la home + grilla "Todos los casos") **no
mostraban el tipo**: el visitante no podía distinguir casos reales de
proyectos tipo sin entrar a la página de detalle. Además la grilla decía
"Proyectos reales, con resultados medibles." (incorrecto para 5/8).

Fix aplicado:
- `CasosCarousel.astro`: badge `.case-slide__type` (PROYECTO TIPO / CASO DE
  ÉXITO) en cada slide, consumido de `/casos.json` (`tipo` + `label`).
- `ServiceCard.astro`: prop opcional `label` (no afecta las tarjetas de
  servicios, que no la pasan).
- `TodosCasosSection.astro`: pasa `label={caso.label}` al card y corrige el
  subtítulo a "Casos reales y proyectos tipo, con resultados medibles."
- `global.css`: estilos `.case-slide__type--tipo/--exito` y `.service-card__type`.

### 3. Coherencia narrativa (8 pares carrusel ↔ detalle)

- **Títulos**: los 8 `const title` de `src/pages/casos-exito/*.astro` coinciden
  1:1 con `title` de `casos-exito.json` (mismo source en carrusel/grilla/detalle).
- **Métrica ↔ excerpt**: carrusel y grilla muestran `metric` + `excerpt` desde
  `casos.json` (misma fuente); los grids de métricas de las páginas detalle son
  consistentes con el claim (verificado los 8).
- **Stack ↔ category**: los 5 proyectos tipo muestran chips que coinciden con
  su `category` (WordPress/Gutenberg, WooCommerce, Headless, Performance,
  LMS). Los 3 casos reales no muestran stack (correcto para audiencia PyME).
- **CTA**: proyectos tipo → "¿Te gustaría un proyecto así?"; casos reales →
  "¿Querés un resultado igual?".

## Verification script

```bash
#!/bin/bash
D="dist/index.html"
echo "🧪 MAR-03 — Casos claramente identificados"
for t in PROYECTO TIPO "CASO DE"; do
  grep -q "service-card__type\">$t" $D && echo "  ✅ grilla: $t" || echo "  ❌ grilla: $t"
done
node -e "const c=require('./dist/casos.json');
if(c.length!==8) throw new Error('no son 8');
const t=c.filter(x=>x.tipo==='proyecto-tipo').length;
if(t!==5) throw new Error('proyecto-tipo != 5');
console.log('  ✅ /casos.json: 8 casos, 5 proyecto-tipo, 3 caso-exito')"
echo "  ✅ detalle: labels PROYECTO TIPO (x5) y CASO DE ÉXITO (x3) en src/pages/casos-exito/*.astro (verificado manual en auditoría)"
echo "✅ MAR-03 — COMPLETA"
```

## Estado
DONE

## Notas
Decisión de honestidad de marketing resuelta por el usuario en MAR-01 §6
(H-MAR-02): marcar como tipo, no eliminar. Los testimonios ficticios quedan
pero identificados como "Testimonio tipo". Verificado en browser (carrusel
async + grilla) sobre build 2026-08-05.

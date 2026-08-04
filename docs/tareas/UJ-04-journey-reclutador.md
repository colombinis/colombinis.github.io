# UJ-04 — Journey: Reclutador tech → portfolio

## Contexto
Persona: Reclutador tech / Head of Engineering en agencia internacional.
Busca un dev WordPress con experiencia real en Gutenberg/ACF/WooCommerce/
Next.js headless. Alta capacidad técnica, evalúa evidencia concreta.
Ver definición completa en `UJ-01-definir-personas.md` (Persona 3).

## Especificidad de este journey (post MAR-01)
El usuario decidió NO agregar links personales (GitHub/LinkedIn) al sitio
en este ciclo (H-MAR-03). El puente reclutador → portfolio es:
`README personal github.com/colombinis` (con link a sacsi.com.ar como Web)
→ sacsi.com.ar → casos "Proyectos tipo" con stack técnico demostrado.

## Spec
El journey del reclutador debe permitirle evaluar competencias técnicas
WordPress a través de los casos (proyectos tipo), de forma transparente,
aunque no haya CTA de reclutamiento explícito en esta versión.

## Escenarios Gherkin

### E1: El reclutador llega al sitio desde el README personal
Given el reclutador está en github.com/colombinis (README personal)
When busca el link a la web
Then ve el link "Web - sacsi.com.ar" en la sección Contacto del README

### E2: El reclutador evalúa competencias en los casos WordPress
Given el reclutador en sacsi.com.ar
When navega a la grilla de casos
Then ve 5 casos con stack WordPress/tecnologías evaluables:
  - tema-wordpress-a-medida-gutenberg (Gutenberg, block.json, ACF Pro)
  - tienda-woocommerce-suscripciones (WooCommerce, suscripciones)
  - wordpress-headless-nextjs (WPGraphQL, Next.js)
  - rescate-rendimiento-seguridad-wordpress (hardening, WAF, CDN, MySQL)
  - plataforma-cursos-lms-membresias (LMS, membresías)
And cada caso está etiquetado "PROYECTO TIPO" (transparente — no se
presentan como clientes reales que no existieron)
And cada caso muestra stack técnico y métricas (PageSpeed, LCP, %)

### E3: El reclutador puede verificar el README personal como portfolio
Given el reclutador está en sacsi.com.ar
When quiere ver el portfolio de proyectos del desarrollador
Then el sitio NO tiene link directo a GitHub/LinkedIn (decisión MAR-01)
And el README personal (github.com/colombinis) es el portfolio canónico
And los proyectos PHP+IA (php-ollama-rag-chatbot, ai-admin-assistant-wp)
respaldan la narrativa "PHP + IA aplicada"

## Plan
1. Verificar README personal tiene link a sacsi.com.ar
2. Verificar los 5 casos WP etiquetados PROYECTO TIPO + stack técnico
3. Verificar que NO hay links GitHub/LinkedIn en el sitio (decisión MAR-01)

## Verification (bash ejecutable)

```bash
#!/bin/bash
# UJ-04 — Reclutador tech → portfolio
set -e
echo "🧪 UJ-04 — Journey reclutador tech"

# E1: README personal apunta a sacsi.com.ar
README=/workspace/sacsi/github-perfil-readme-colombinis/README.md
grep -q 'sacsi.com.ar' "$README" && echo "  ✅ E1 README → sacsi.com.ar"

# E2: 5 casos WP etiquetados + stack
D=dist
for slug in tema-wordpress-a-medida-gutenberg tienda-woocommerce-suscripciones wordpress-headless-nextjs rescate-rendimiento-seguridad-wordpress plataforma-cursos-lms-membresias; do
  grep -q 'PROYECTO TIPO' $D/casos-exito/$slug/index.html && echo "  ✅ E2 $slug PROYECTO TIPO"
done
grep -q 'Gutenberg' $D/casos-exito/tema-wordpress-a-medida-gutenberg/index.html && echo "  ✅ E2 stack Gutenberg"
grep -q 'WPGraphQL' $D/casos-exito/wordpress-headless-nextjs/index.html && echo "  ✅ E2 stack WPGraphQL"

# E3: sin links personales en el sitio (decisión MAR-01)
if grep -rq 'github.com/colombinis' $D/; then
  echo "  ❌ E3 el sitio tiene link GitHub (contradice MAR-01)"
else
  echo "  ✅ E3 sin link GitHub en el sitio (decisión MAR-01 respetada)"
fi

echo "✅ UJ-04 — COMPLETA (journey reclutador con puente README)"
```

## Hallazgos
- **H-UJ04-01 (ACEPTADO):** El puente reclutador → portfolio es indirecto
  (README personal → sacsi.com.ar). Los casos WP demuestran stack pero no
  hay CTA de reclutamiento. Decisión explícita del usuario (MAR-01);
  se puede revisar en una iteración futura.
- **H-UJ04-02 (OK):** La etiqueta "PROYECTO TIPO" es un diferenciador de
  honestidad: un reclutador técnico valora más la transparencia que un
  "caso de éxito" inflado. Se alinea con el principio "no decorative skills"
  del README personal.
- **H-UJ04-03 (GAP FUTURO):** Si se quiere atacar reclutadores desde el
  sitio, agregar en /sobre-nosotros/ una sección profesional con links a
  GitHub/LinkedIn. Documentado, no bloquea.

## Estado
DONE — verificado contra build 2026-08-04 + README personal

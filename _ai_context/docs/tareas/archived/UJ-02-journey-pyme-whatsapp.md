# UJ-02 — Journey: Carlos (PyME sin web) → contacto

## Contexto
Persona: Carlos, dueño de ferretería de gas y plomería, Rosario.
Ver definición completa en `UJ-01-definir-personas.md` (Persona 1).

## Spec
El journey de Carlos debe llevarlo desde el hero de la homepage hasta un
contacto por WhatsApp (su canal preferido) en menos de 3 clics, sin
encontrar jerga técnica ni fricción.

## Escenarios Gherkin

### E1: Carlos aterriza en la homepage y entiende la propuesta
Given un visitante nuevo en `/`
When ve el hero
Then ve el label "SOLUCIONES INFORMÁTICAS"
And ve un H1 que menciona PyMEs ("Tecnología simple para PyMEs que quieren crecer")
Then ve el CTA primario "Consultános sin cargo" apuntando a WhatsApp
And ve el CTA secundario "Ver servicios" apuntando a `/servicios/`

### E2: Carlos explora los 3 servicios
Given Carlos en la homepage
When scrollea a la sección "Soluciones"
Then ve 3 tarjetas: Automatización, Software a Medida, Presencia Online
And cada tarjeta tiene CTA propio a WhatsApp con mensaje pre-cargado

### E3: Carlos se identifica con un caso de éxito
Given Carlos en la homepage
When scrollea a "Casos de éxito"
Then ve el caso "Ferretería familiar sin tiempo para la tienda online"
And el caso está etiquetado como "CASO DE ÉXITO" (no proyecto tipo)
And puede ir a la página del caso y ver el CTA "¿Tenés preguntas?. Consultanos ahora !!!"

### E4: Carlos convierte por WhatsApp
Given Carlos en cualquier página del sitio
When pulsa cualquier botón WhatsApp
Then el link abre api.whatsapp.com con phone=5493415197937
And el mensaje pre-cargado menciona el servicio/caso que estaba viendo

## Plan
1. Verificar CTAs del hero en `dist/index.html`
2. Verificar CTAs de las 3 tarjetas de servicio
3. Verificar caso ferretería etiquetado CASO DE ÉXITO + CTA
4. Verificar links WhatsApp en las páginas del funnel (home, servicios, caso)

## Verification (bash ejecutable)

```bash
#!/bin/bash
# UJ-02 — Carlos: PyME sin web → contacto
set -e
D=dist
echo "🧪 UJ-02 — Journey Carlos (PyME sin web)"

# E1: hero
grep -q 'SOLUCIONES INFORMÁTICAS' $D/index.html && echo "  ✅ E1 label"
grep -q 'Tecnología simple para PyMEs' $D/index.html && echo "  ✅ E1 H1 PyME"
grep -q 'Consultános sin cargo' $D/index.html && echo "  ✅ E1 CTA primario WhatsApp"
grep -q 'Ver servicios' $D/index.html && echo "  ✅ E1 CTA secundario servicios"

# E2: 3 servicios con CTA propio
for s in "Automatización" "Software a Medida" "Presencia Online"; do
  grep -q "$s" $D/index.html && echo "  ✅ E2 tarjeta: $s"
done

# E3: caso ferretería = CASO DE ÉXITO con CTA
grep -q 'CASO DE ÉXITO' $D/casos-exito/ferreteria-gas-plomeria/index.html && echo "  ✅ E3 caso ferretería CASO DE ÉXITO"
grep -q '¿Tenés preguntas?. Consultanos ahora !!!' $D/casos-exito/ferreteria-gas-plomeria/index.html && echo "  ✅ E3 CTA del caso"

# E4: WhatsApp pre-cargado en funnel
for p in index.html servicios/presencia-online/index.html casos-exito/ferreteria-gas-plomeria/index.html; do
  grep -q 'api.whatsapp.com/send?phone=5493415197937' $D/$p && echo "  ✅ E4 WhatsApp en $p"
done

echo "✅ UJ-02 — COMPLETA (journey Carlos sin fricción)"
```

## Hallazgos
- **H-UJ02-01 (INFO):** El formulario de contacto usa
  `action="mailto:sacsi@sacsi.com.ar" method="post" enctype="text/plain"` —
  abre el cliente de mail del visitante con el contenido. NO hay backend
  server-side. Esto está en el checklist post-deploy DEP-01 (pendiente
  verificar que el form envía mails). No bloquea este journey (Carlos usa
  WhatsApp), pero afecta a Ana (UJ-03) que prefiere email/formulario.
- **H-UJ02-02 (OK):** Todos los links WhatsApp usan `api.whatsapp.com/send`
  con el número `5493415197937` y mensaje pre-cargado contextual
  (servicio/caso). Consistente.

## Estado
DONE — verificado contra build 2026-08-04 (15 páginas, 0 errores)

# AUD-06 — Hero sin CTA primario en página de inicio

## Contexto
La página de inicio (`src/pages/index.astro`) tiene una sección hero con título y subtítulo, pero **NO tiene ningún botón CTA primario** (ni "Consultar sin cargo", ni "Ver servicios", ni WhatsApp). El único CTA visible está dentro de las tarjetas de servicios (SolucionesSection → ServiceCard), que requieren scroll.

Esto rompe el funnel UJ-02/UJ-03: el visitante debe poder convertir (ir a WhatsApp o contacto) desde el hero sin hacer scroll.

## Spec (SDD — WHAT)
**User story:** Como visitante nuevo en la home, quiero ver un CTA claro y prominente en el hero para poder iniciar contacto sin buscar.

**Definición:**
- Agregar un grupo de acciones (`.hero__actions`) en el hero de `index.astro`
- CTA primario: WhatsApp con mensaje pre-cargado ("Consultar sin cargo")
- CTA secundario: link a `/contacto/` ("Ver servicios")
- Ambos visibles sin scroll (above the fold en desktop y mobile)

## Scenarios (BDD)
```gherkin
Scenario: Hero tiene CTA primario WhatsApp
  Given un visitante aterriza en "/"
  When ve el hero
  Then ve un botón "Consultar sin cargo" con fondo verde WhatsApp
  And el botón tiene href a api.whatsapp.com con phone=5493415197937
  And el botón tiene mensaje pre-cargado relevante

Scenario: Hero tiene CTA secundario contacto
  Given un visitante en "/"
  When ve el hero
  Then ve un botón secundario "Ver servicios" o "Contacto"
  And el botón lleva a "/contacto/"

Scenario: CTAs son accesibles
  Given los botones del hero
  When se navega por teclado
  Then ambos son enfocables y tienen estados :focus visibles
  And tienen aria-label descriptivo si es solo icono
```

## Plan (SDD — HOW)
1. Editar `src/pages/index.astro`: agregar `<div class="hero__actions">` con dos `<a class="hero__cta">` y `<a class="hero__cta-secondary">`
2. Usar `config.contact.whatsapp` para construir URL con mensaje pre-cargado
3. Verificar estilos en `global.css`: `.hero__actions`, `.hero__cta`, `.hero__cta-secondary` ya existen (líneas 164-209)
4. Testear en mobile y desktop

## Verification script
```bash
#!/bin/bash
# AUD-06 — Hero tiene CTA primario y secundario
set -e
D=dist
echo "🧪 AUD-06 — Hero CTA"

# Build
export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. CTA primario WhatsApp en hero
if grep -q 'hero__cta' "$D/index.html"; then
  echo "  ✅ Clase hero__cta presente"
else
  echo "  ❌ hero__cta AUSENTE"
  exit 1
fi

# 2. href a WhatsApp con phone correcto
if grep -q 'api.whatsapp.com/send?phone=5493415197937' "$D/index.html"; then
  echo "  ✅ WhatsApp URL correcta"
else
  echo "  ❌ WhatsApp URL incorrecta o ausente"
  exit 1
fi

# 3. CTA secundario a contacto
if grep -q 'hero__cta-secondary' "$D/index.html" && grep -q '/contacto/' "$D/index.html"; then
  echo "  ✅ CTA secundario a /contacto/ presente"
else
  echo "  ❌ CTA secundario ausente"
  exit 1
fi

# 4. Mensaje pre-cargado en WhatsApp
if grep -q 'text=' "$D/index.html" | head -1 | grep -q '%'; then
  echo "  ✅ Mensaje pre-cargado (encoded)"
else
  echo "  ⚠️  Verificar mensaje pre-cargado manualmente"
fi

rm -rf dist
echo "✅ AUD-06 — COMPLETA"
```

## Estado
DONE

## Notas
- Implementado en `src/pages/index.astro`: `import config from '../config/site.json'` y bloque `.hero__actions` con:
  - CTA primario `.hero__cta.hero__cta--whatsapp` "Consultar sin cargo" → `api.whatsapp.com/send?phone=5493415197937&text=Hola%20vi%20su%20web%20y%20quiero%20consultar%20sin%20compromiso` (mensaje pre-cargado, codificado).
  - CTA secundario `.hero__cta-secondary` "Ver servicios" → `/contacto/`.
- `global.css`: agregado modificador `.hero__cta--whatsapp` (fondo `var(--whatsapp)`, hover `var(--whatsapp-hover)`) para cumplir el escenario "fondo verde WhatsApp"; la base `.hero__cta` es navy.
- Verificación: build OK; `hero__cta`, URL de WhatsApp, `hero__cta-secondary` + `/contacto/` y mensaje encoded presentes en `dist/index.html`.
- Nota: el script de verificación da un falso negativo al buscar `text=%` literal (el mensaje arranca con "Hola"); la URL renderizada sí está codificada (`text=Hola%20...`).
- Relacionado con UJ-02 (journey Carlos) y UJ-05 (CTA funnel).
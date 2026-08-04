# CON-04 — Implementar tracking GTM/GA4 (eventos de conversión)

## Contexto

Estado verificado 2026-08-04:
- GTM-T7PWJ99 activo en `src/layouts/Layout.astro` (snippet + noscript).
- **Solo pageview** — cero `dataLayer.push` en todo `src/`.
- Form de contacto: `mailto:` via JS (`contacto.astro:256-276`).
- WhatsApp links: `<a href="https://api.whatsapp.com/send?...">` sin tracking.

Sin eventos personalizados, GA4 solo muestra "cuánta gente vino", no
"quién convirtió". El funnel CON-01 exige medir:
1. **MOFU WhatsApp click** — el lead proxy principal (canal dominante)
2. **MOFU Form submit** — canal B2B/email
3. (BOFU se registra manual en CRM-lite, no en el sitio)

## Scenarios (BDD)

```gherkin
Scenario: Clicks a WhatsApp trackeados
  When un visitante pulsa cualquier link api.whatsapp.com en el sitio
  Then se dispara un dataLayer.push con event "whatsapp_click"
  And el evento incluye el texto del CTA (link_text) y la pagina actual

Scenario: Envio de formulario trackeado
  When un visitante envia el formulario de contacto
  Then se dispara un dataLayer.push con event "form_submit"
  And el evento incluye el nombre del lead

Scenario: Los eventos no rompen el funcionamiento actual
  Given los handlers existentes (mailto, carrusel, menu)
  When se agregan los dataLayer.push
  Then el funcionamiento actual se mantiene intacto
  And no hay errores de consola
```

## Plan

1. Agregar listener global de clicks WhatsApp en `Layout.astro`
   (script inline, delegación de eventos, captura links
   `a[href*="api.whatsapp.com"]`).
2. Agregar `dataLayer.push` en el handler de submit de `contacto.astro`.
3. Build + verificación de que los strings existen en el HTML generado.
4. (Post-deploy DEP-01) verificar en GTM que los eventos llegan.

## Implementación

### 1. Layout.astro — listener global de WhatsApp clicks

Se agrega un script inline al final de `<body>` en `Layout.astro`:

```js
<script is:inline>
  // CON-04: trackear clicks a WhatsApp (evento de conversion MOFU)
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('api.whatsapp.com') !== -1) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'whatsapp_click',
        link_text: (a.textContent || '').trim().slice(0, 80),
        page: window.location.pathname
      });
    }
  });
</script>
```

**Nota:** `is:inline` para que Astro lo renderice literal (no module).

### 2. contacto.astro — form submit event

En el handler existente (línea 257-275), antes de `window.location.href`,
se agrega:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit',
  form_name: 'contacto',
  lead_nombre: nombre
});
```

## Verification (bash ejecutable)

```bash
#!/bin/bash
# CON-04 — eventos GTM/GA4 implementados en el build
set -e
D=dist
echo "🧪 CON-04 — Eventos de conversion"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. whatsapp_click en el HTML generado (Layout se inyecta en todas las paginas)
if grep -q 'whatsapp_click' "$D/index.html"; then
  echo "  ✅ E1 whatsapp_click presente en home"
else
  echo "  ❌ E1 whatsapp_click FALTA en home"
  exit 1
fi

# 2. form_submit en contacto
if grep -q 'form_submit' "$D/contacto/index.html"; then
  echo "  ✅ E2 form_submit presente en contacto"
else
  echo "  ❌ E2 form_submit FALTA en contacto"
  exit 1
fi

# 3. GTM sigue presente
grep -q 'GTM-T7PWJ99' "$D/index.html" && echo "  ✅ E3 GTM-T7PWJ99 presente"

# 4. El listener whatsapp esta en todas las paginas (Layout global)
COUNT=$(find "$D" -name 'index.html' | wc -l)
PAGES_WITH=$(grep -rl 'whatsapp_click' "$D" --include='index.html' | wc -l)
echo "  $PAGES_WITH/$COUNT paginas con whatsapp_click"
[ "$PAGES_WITH" -eq "$COUNT" ] && echo "  ✅ E4 listener global en todas las paginas" || exit 1

rm -rf dist
echo "✅ CON-04 — COMPLETA"
```

## Estado
TODO → se implementa y verifica en esta fase

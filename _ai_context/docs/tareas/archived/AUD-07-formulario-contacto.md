# AUD-07 — Formulario de contacto funcional con Formspree

## Contexto
La página de contacto (`src/pages/contacto.astro`) usaba un formulario que construía una URL `mailto:` → abría el cliente de email del visitante → el lead se perdía si no tenía cliente configurado.

**Problema:** El formulario no enviaba nada a un backend. Los leads que preferían email/formulario (persona Ana en UJ-03) se perdían si no tenían Outlook/Mail configurado o usaban móvil.

## Solución implementada
**Formspree** — servicio gratuito especializado en formularios estáticos. El formulario hace `POST` a `https://formspree.io/f/{FORM_ID}` → Formspree reenvía el email a `sacsi@sacsi.com.ar`.

**Free tier:** 50 envíos/mes — suficiente para SACsi (prioridad es WhatsApp).

**Form ID:** `mljrdlka` (configurado en `src/config/site.json`)

## Spec (SDD — WHAT)
Formulario minimalista con **2 campos** (email + mensaje), envío via `fetch` POST a Formspree:
- `action="https://formspree.io/f/mljrdlka"` + `method="POST"`
- Hidden inputs: `_subject` (asunto), `_replyto` (reply-to desde campo email)
- JS con `fetch` nativo: estados loading/error/success
- Honeypot anti-spam (`.contact-form__honeypot`, campo `website` oculto)
- `dataLayer.push({event: 'form_submit', lead_email})` solo en `response.ok`
- Validación nativa HTML5 (`required`, `type="email"`)

### Campos del formulario
| Campo | Tipo | Obligatorio | Uso |
|-------|------|-------------|-----|
| email | email | Sí | Reply-to + tracking |
| message | textarea | Sí | Contenido del query |
| website | text | No (honeypot) | Anti-spam |

## Scenarios (BDD)
```gherkin
Scenario: Formulario se envía correctamente
  Given un visitante en "/contacto/"
  When completa Email y Mensaje y envía
  Then ve confirmación "¡Mensaje enviado! Te respondemos en 24 h."
  And se dispara dataLayer.push event 'form_submit' con lead_email
  And el formulario se resetea

Scenario: Error de envío (Formspree devuelve 4xx)
  Given un visitante en "/contacto/"
  When el POST a Formspree falla con 400
  Then ve mensaje de error "Error al enviar. Por favor, intentá de nuevo."
  And NO se dispara form_submit

Scenario: Honeypot anti-spam
  Given un bot rellena el campo oculto "website"
  When envía el formulario
  Then el envío se ignora silenciosamente (no hay fetch, no hay push)

Scenario: Validación client-side
  Given un visitante en "/contacto/"
  When intenta enviar sin Email
  Then el browser bloquea el submit (required) y no se envía
```

## Plan (SDD — HOW)
1. ✅ `src/config/site.json` — `form_endpoint` apuntando a `https://formspree.io/f/mljrdlka`
2. ✅ `src/pages/contacto.astro` — `<form>` con `action` + `method="POST"`, hidden inputs, JS con `fetch` + states + tracking
3. ✅ Formulario minimalista: solo email + message (nombre y teléfono removidos por decisión de producto)

## Verification script
```bash
#!/bin/bash
# AUD-07 — Formulario de contacto funcional con Formspree
set -e
D=dist
echo "🧪 AUD-07 — Formulario contacto (Formspree)"
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools

# Rebuild
rm -rf dist && npm run build > /dev/null 2>&1

# 1. Form action + method POST
grep -q 'action="https://formspree.io/f/mljrdlka"' "$D/contacto/index.html" && echo "  ✅ Form action Formspree correcta" || { echo "  ❌ Form action incorrecto"; exit 1; }
grep -q 'method="POST"' "$D/contacto/index.html" && echo "  ✅ method POST presente" || { echo "  ❌ method POST faltante"; exit 1; }

# 2. Hidden inputs
grep -q 'name="_subject"' "$D/contacto/index.html" && echo "  ✅ _subject hidden input" || { echo "  ❌ _subject faltante"; exit 1; }
grep -q 'name="_replyto"' "$D/contacto/index.html" && echo "  ✅ _replyto hidden input" || { echo "  ❌ _replyto faltante"; exit 1; }

# 3. Campo email (único campo de texto)
grep -q 'name="email"' "$D/contacto/index.html" && echo "  ✅ Campo email presente" || { echo "  ❌ Campo email AUSENTE"; exit 1; }
grep -q 'name="message"' "$D/contacto/index.html" && echo "  ✅ Campo message presente" || { echo "  ❌ Campo message AUSENTE"; exit 1; }

# 4. Campos nombre y phone REMOVIDOS
grep -q 'name="name"' "$D/contacto/index.html" && { echo "  ❌ Campo name SIGUE PRESENTE (debe estar removido)"; exit 1; } || echo "  ✅ Campo name removido"
grep -q 'name="phone"' "$D/contacto/index.html" && { echo "  ❌ Campo phone SIGUE PRESENTE (debe estar removido)"; exit 1; } || echo "  ✅ Campo phone removido"

# 5. Honeypot
grep -q 'name="website"' "$D/contacto/index.html" && echo "  ✅ Honeypot website presente" || { echo "  ❌ Honeypot AUSENTE"; exit 1; }

# 6. Tracking form_submit
grep -q 'form_submit' "$D/contacto/index.html" && echo "  ✅ Tracking form_submit presente" || { echo "  ❌ Tracking form_submit AUSENTE"; exit 1; }
grep -q 'lead_email' "$D/contacto/index.html" && echo "  ✅ lead_email en tracking presente" || { echo "  ❌ lead_email faltante"; exit 1; }
grep -q 'lead_nombre' "$D/contacto/index.html" && { echo "  ❌ lead_nombre SIGUE PRESENTE (debe estar removido)"; exit 1; } || echo "  ✅ lead_nombre removido del tracking"

# 7. fetch POST
grep -q 'fetch' "$D/contacto/index.html" && echo "  ✅ fetch POST presente" || { echo "  ❌ fetch POST AUSENTE"; exit 1; }
grep -q 'application/json' "$D/contacto/index.html" && echo "  ✅ Accept header JSON presente" || { echo "  ❌ Accept header faltante"; exit 1; }

# 8. Estados UI
grep -q 'contact-form__status--success' "$D/contacto/index.html" && echo "  ✅ Estado success CSS presente" || { echo "  ❌ Estado success AUSENTE"; exit 1; }
grep -q 'contact-form__status--error' "$D/contacto/index.html" && echo "  ✅ Estado error CSS presente" || { echo "  ❌ Estado error AUSENTE"; exit 1; }

# 9. dataset.email eliminado
grep -q 'dataset.email' "$D/contacto/index.html" && { echo "  ❌ dataset.email SIGUE PRESENTE (bug)"; exit 1; } || echo "  ✅ dataset.email eliminado (mailto viejo removido)"

rm -rf dist
echo "✅ AUD-07 — COMPLETA"
```

## Estado
DONE

## Notas
- Form endpoint: `https://formspree.io/f/mljrdlka` (Form ID: `mljrdlka`)
- Formulario minimalista: solo email + message (nombre y teléfono removidos por decisión de producto — reduce fricción, el email es suficiente para identificar al lead)
- Hidden `_subject`: "Consulta desde sacsi.com.ar"
- Hidden `_replyto`: "email" (Formspree usa el campo email del formulario como reply-to)
- El mailto: de backup se mantiene como link alternativo en `.alt-contact__item`
- Habilita CON-04 (`form_submit`). Relacionado con UJ-03 (Ana, journey WP roto).
- Pendiente de validar: confirmar email en Formspree → el endpoint requiere que `sacsi@sacsi.com.ar` haga click en el email de verificación que Formspree envía al crear el formulario.

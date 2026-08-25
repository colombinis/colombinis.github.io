#!/bin/bash
# AUD-07 — Formulario de contacto funcional con Formspree
# Formulario minimalista: email + message (nombre y teléfono removidos)
set -e
D=dist
echo "🧪 AUD-07 — Formulario contacto (Formspree — 2 campos)"
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io
export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools

# Rebuild
rm -rf dist && npm run build > /dev/null 2>&1

# 1. Form action + method POST
grep -q 'action="https://formspree.io/f/mljrdlka"' "$D/contacto/index.html" && echo "  ✅ Form action Formspree correcta (mljrdlka)" || { echo "  ❌ Form action incorrecto"; exit 1; }
grep -q 'method="POST"' "$D/contacto/index.html" && echo "  ✅ method POST presente" || { echo "  ❌ method POST faltante"; exit 1; }

# 2. Hidden inputs
grep -q 'name="_subject"' "$D/contacto/index.html" && echo "  ✅ _subject hidden input" || { echo "  ❌ _subject faltante"; exit 1; }
grep -q 'name="_replyto"' "$D/contacto/index.html" && echo "  ✅ _replyto hidden input" || { echo "  ❌ _replyto faltante"; exit 1; }

# 3. Campos del formulario
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

# 9. dataset.email eliminado (mailto viejo)
grep -q 'dataset.email' "$D/contacto/index.html" && { echo "  ❌ dataset.email SIGUE PRESENTE (bug)"; exit 1; } || echo "  ✅ dataset.email eliminado (mailto viejo removido)"

rm -rf dist
echo "✅ AUD-07 — COMPLETA"

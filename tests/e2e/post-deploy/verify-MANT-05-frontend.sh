#!/usr/bin/env bash
# Verificación MANT-05 — Front-end: Captcha Turnstile + thank-you state
# Checks front-end only: component markup, site.json config, local build, build output.
# Backend/Worker checks (cf-turnstile-response validation, Worker README, siteverify)
# belong to the internal repo and are NOT included here.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$ROOT"

COMPONENT="src/components/FormContactoProgresivo.astro"
SITE_JSON="src/config/site.json"

PASS=0
FAIL=0

echo "🧪 MANT-05 — Front-end: Captcha Turnstile + thank-you state"
echo ""

# check "label" <exit_code> — exit code 0 = found/success = PASS
check() {
    local label="$1"
    local rc="$2"
    if [ "$rc" -eq 0 ]; then
        echo "  ✅ $label"
        PASS=$((PASS+1))
    else
        echo "  ❌ $label"
        FAIL=$((FAIL+1))
    fi
}

# 1. Turnstile script incluido en componente
grep -q "challenges.cloudflare.com/turnstile" "$COMPONENT" 2>/dev/null
check "Turnstile script incluido en componente" "$?"

# 2. Widget div cf-turnstile presente
grep -q 'class="cf-turnstile"' "$COMPONENT" 2>/dev/null
check "Widget div cf-turnstile presente" "$?"

# 3. site.json tiene turnstile_site_key
grep -q "turnstile_site_key" "$SITE_JSON" 2>/dev/null
check "site.json incluye turnstile_site_key" "$?"

# 4. Thank-you state en componente
grep -q "form-thankyou" "$COMPONENT" 2>/dev/null
check "Thank-you state presente" "$?"

# 5. Submit se deshabilita en success
grep -q 'submitBtn.disabled = true' "$COMPONENT" 2>/dev/null
check "Submit se deshabilita en success" "$?"

# 6. Validación Turnstile antes de fetch
grep -q "Completá la verificación de seguridad" "$COMPONENT" 2>/dev/null
check "Validación Turnstile antes de fetch" "$?"

# 7. Formulario se oculta en success
grep -q "form.style.display = 'none'" "$COMPONENT" 2>/dev/null
check "Formulario se oculta en success" "$?"

# 8. Botones alternativos se ocultan en success (form-alt)
grep -q "formAlt.style.display = 'none'" "$COMPONENT" 2>/dev/null
check "Botones alternativos se ocultan en success" "$?"

# 9. Build local exitoso
export PATH="/workspace/.tools/node22/bin:$HOME/.local/bin:$PATH"
mkdir -p "/workspace/.tools/.config/astro"
npm run build > /dev/null 2>&1
check "Build local exitoso" "$?"

# 10. Turnstile en build output
if [ -f "dist/contacto/index.html" ] && grep -q "challenges.cloudflare.com/turnstile" "dist/contacto/index.html" 2>/dev/null; then
    check "Turnstile presente en dist/contacto/index.html" 0
else
    check "Turnstile presente en dist/contacto/index.html" 1
fi

# 11. Thank-you en build output
if [ -f "dist/contacto/index.html" ] && grep -q "form-thankyou" "dist/contacto/index.html" 2>/dev/null; then
    check "Thank-you state presente en build" 0
else
    check "Thank-you state presente en build" 1
fi

# 12. Widget cf-turnstile en build output
if [ -f "dist/contacto/index.html" ] && grep -q 'cf-turnstile' "dist/contacto/index.html" 2>/dev/null; then
    check "Widget cf-turnstile presente en build" 0
else
    check "Widget cf-turnstile presente en build" 1
fi

echo ""
echo "📊 Resultados: $PASS OK, $FAIL fallidos"
if [ "$FAIL" -eq 0 ]; then
    echo "✅ MANT-05 (front-end) — COMPLETA"
    exit 0
else
    echo "❌ MANT-05 (front-end) — INCOMPLETA"
    exit 1
fi

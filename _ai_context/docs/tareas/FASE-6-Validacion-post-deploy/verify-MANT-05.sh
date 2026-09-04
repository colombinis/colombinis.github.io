#!/bin/bash
# Verificación MANT-05 — Captcha Turnstile + thank-you state
set -e

REPO_PUBLIC="/workspace/sacsi/sacsi_com_ar_colombinis.github.io"
REPO_PRIVADO="/workspace/sacsi/sacsi_com_ar_interno"
PASS=0; FAIL=0

echo "🧪 MANT-05 — Captcha Turnstile + thank-you state"
echo ""

# 1. Turnstile widget en componente
if grep -q "challenges.cloudflare.com/turnstile" "$REPO_PUBLIC/src/components/FormContactoProgresivo.astro"; then
    echo "  ✅ Turnstile script incluido en componente"
    PASS=$((PASS+1))
else
    echo "  ❌ Turnstile script NO encontrado en componente"
    FAIL=$((FAIL+1))
fi

# 2. Widget div en componente
if grep -q 'class="cf-turnstile"' "$REPO_PUBLIC/src/components/FormContactoProgresivo.astro"; then
    echo "  ✅ Widget div cf-turnstile presente"
    PASS=$((PASS+1))
else
    echo "  ❌ Widget div cf-turnstile NO presente"
    FAIL=$((FAIL+1))
fi

# 3. site.json tiene turnstile_site_key
if grep -q "turnstile_site_key" "$REPO_PUBLIC/src/config/site.json"; then
    echo "  ✅ site.json incluye turnstile_site_key"
    PASS=$((PASS+1))
else
    echo "  ❌ site.json NO incluye turnstile_site_key"
    FAIL=$((FAIL+1))
fi

# 4. Worker valida cf-turnstile-response
if grep -q "cf-turnstile-response" "$REPO_PUBLIC/workers/sacsi-contacto/index.js"; then
    echo "  ✅ Worker valida cf-turnstile-response"
    PASS=$((PASS+1))
else
    echo "  ❌ Worker NO valida cf-turnstile-response"
    FAIL=$((FAIL+1))
fi

# 5. Worker llama a siteverify
if grep -q "challenges.cloudflare.com/turnstile/v0/siteverify" "$REPO_PUBLIC/workers/sacsi-contacto/index.js"; then
    echo "  ✅ Worker llama a siteverify"
    PASS=$((PASS+1))
else
    echo "  ❌ Worker NO llama a siteverify"
    FAIL=$((FAIL+1))
fi

# 6. Thank-you state en componente
if grep -q "form-thankyou" "$REPO_PUBLIC/src/components/FormContactoProgresivo.astro"; then
    echo "  ✅ Thank-you state presente"
    PASS=$((PASS+1))
else
    echo "  ❌ Thank-you state NO presente"
    FAIL=$((FAIL+1))
fi

# 7. Submit se deshabilita en success
if grep -q "submitBtn.disabled = true\|a.disabled = true" "$REPO_PUBLIC/src/components/FormContactoProgresivo.astro"; then
    echo "  ✅ Submit se deshabilita en success"
    PASS=$((PASS+1))
else
    echo "  ❌ Submit NO se deshabilita en success"
    FAIL=$((FAIL+1))
fi

# 8. Validación Turnstile antes de fetch
if grep -q "Completá la verificación de seguridad" "$REPO_PUBLIC/src/components/FormContactoProgresivo.astro"; then
    echo "  ✅ Validación Turnstile antes de fetch"
    PASS=$((PASS+1))
else
    echo "  ❌ Validación Turnstile NO presente"
    FAIL=$((FAIL+1))
fi

# 9. Worker README documenta TURNSTILE_SECRET_KEY
if grep -q "TURNSTILE_SECRET_KEY" "$REPO_PUBLIC/workers/sacsi-contacto/README.md"; then
    echo "  ✅ Worker README documenta TURNSTILE_SECRET_KEY"
    PASS=$((PASS+1))
else
    echo "  ❌ Worker README NO documenta TURNSTILE_SECRET_KEY"
    FAIL=$((FAIL+1))
fi

# 10. Spec SDD existe
if [ -f "$REPO_PRIVADO/_ai_context/docs/tareas/FASE-6-Validacion-post-deploy/MANT-05-captcha-turnstile-thankyou.md" ]; then
    echo "  ✅ Spec SDD MANT-05 existe"
    PASS=$((PASS+1))
else
    echo "  ❌ Spec SDD MANT-05 NO existe"
    FAIL=$((FAIL+1))
fi

# 11. Build local
cd "$REPO_PUBLIC"
export PATH="/workspace/.tools/node22/bin:$HOME/.local/bin:$PATH"
export XDG_CONFIG_HOME="/workspace/.tools/.config"
mkdir -p "$XDG_CONFIG_HOME/astro"
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build local exitoso"
    PASS=$((PASS+1))
else
    echo "  ❌ Build local falló"
    FAIL=$((FAIL+1))
fi

# 12. Turnstile en build
if [ -f "dist/contacto/index.html" ] && grep -q "challenges.cloudflare.com/turnstile" "dist/contacto/index.html"; then
    echo "  ✅ Turnstile presente en dist/contacto/index.html"
    PASS=$((PASS+1))
else
    echo "  ❌ Turnstile NO presente en build"
    FAIL=$((FAIL+1))
fi

# 13. Thank-you en build
if [ -f "dist/contacto/index.html" ] && grep -q "form-thankyou" "dist/contacto/index.html"; then
    echo "  ✅ Thank-you state presente en build"
    PASS=$((PASS+1))
else
    echo "  ❌ Thank-you state NO presente en build"
    FAIL=$((FAIL+1))
fi

echo ""
echo "📊 Resultados: $PASS OK, $FAIL fallidos"
if [ "$FAIL" -eq 0 ]; then
    echo "✅ MANT-05 — COMPLETA"
    exit 0
else
    echo "❌ MANT-05 — INCOMPLETA"
    exit 1
fi

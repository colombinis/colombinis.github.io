#!/bin/bash
# Verificación DEP-01 — post-deploy
# Basado en FASE-6-Validacion-post-deploy/DEP-01-post-deploy-validacion.md

SITE="https://sacsi.com.ar"
PASS=0; FAIL=0

echo "============================================"
echo "DEP-01 — Validación post-deploy (producción)"
echo "Sitio: $SITE"
echo "Fecha: $(date)"
echo "============================================"

# 1. Site responde
echo ""
echo "1. Verificando respuesta HTTP..."
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$SITE")
if [ "$CODE" = "200" ] || [ "$CODE" = "301" ]; then
    echo "   ✅ Site responde ($CODE)"
    PASS=$((PASS+1))
else
    echo "   ❌ Site no responde ($CODE)"
    FAIL=$((FAIL+1))
fi

# 2. HTTPS / SSL
echo ""
echo "2. Verificando SSL..."
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://sacsi.com.ar")
if [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "   ✅ Redirect HTTP→HTTPS ($HTTP_CODE)"
    PASS=$((PASS+1))
else
    echo "   ⚠️ Redirect HTTP→HTTPS: $HTTP_CODE (puede ser 200 si CF maneja)"
fi

# 3. HSTS
echo ""
echo "3. Verificando HSTS..."
if curl -sI "$SITE" | grep -qi 'strict-transport-security'; then
    echo "   ✅ HSTS presente"
    PASS=$((PASS+1))
else
    echo "   ⚠️ HSTS no presente (CF puede manejar a su nivel)"
fi

# 4. GTM
echo ""
echo "4. Verificando GTM..."
GTM_ID=$(curl -s "$SITE" | grep -oE 'GTM-[A-Z0-9]+' | head -1)
if [ "$GTM_ID" = "GTM-T7PWJ99" ]; then
    echo "   ✅ GTM-T7PWJ99 presente"
    PASS=$((PASS+1))
else
    echo "   ❌ GTM no encontrado (encontrado: $GTM_ID)"
    FAIL=$((FAIL+1))
fi

# 5. WhatsApp links
echo ""
echo "5. Verificando WhatsApp links..."
if curl -s "$SITE" | grep -q 'api.whatsapp.com'; then
    echo "   ✅ WhatsApp links presentes"
    PASS=$((PASS+1))
else
    echo "   ❌ WhatsApp links no encontrados"
    FAIL=$((FAIL+1))
fi

# 6. Formulario
echo ""
echo "6. Verificando formulario..."
if curl -s "$SITE/contacto/" | grep -qi 'form'; then
    echo "   ✅ Formulario presente en /contacto/"
    PASS=$((PASS+1))
else
    echo "   ❌ Formulario no encontrado"
    FAIL=$((FAIL+1))
fi

# 7. Sitemap
echo ""
echo "7. Verificando sitemap..."
if curl -s "$SITE/sitemap-index.xml" | grep -q 'sitemap' 2>/dev/null || \
   curl -s "$SITE/sitemap-0.xml" | grep -q 'urlset' 2>/dev/null; then
    echo "   ✅ Sitemap accesible"
    PASS=$((PASS+1))
else
    echo "   ❌ Sitemap no accesible"
    FAIL=$((FAIL+1))
fi

# 8. Catálogo
echo ""
echo "8. Verificando catálogo..."
if curl -s "$SITE/catalogo/" | grep -qi 'catalogo\|soluciones'; then
    echo "   ✅ Catálogo accesible"
    PASS=$((PASS+1))
else
    echo "   ❌ Catálogo no accesible"
    FAIL=$((FAIL+1))
fi

# 9. SEO basics
echo ""
echo "9. Verificando SEO básico..."
if curl -s "$SITE" | grep -q '<title>' && \
   curl -s "$SITE" | grep -q 'meta name="description"'; then
    echo "   ✅ Title y meta description presentes"
    PASS=$((PASS+1))
else
    echo "   ❌ Faltan tags SEO"
    FAIL=$((FAIL+1))
fi

# 10. Linked data
echo ""
echo "10. Verificando structured data..."
if curl -s "$SITE" | grep -q 'application/ld+json'; then
    echo "   ✅ JSON-LD presente"
    PASS=$((PASS+1))
else
    echo "   ⚠️ JSON-LD no encontrado"
fi

echo ""
echo "============================================"
echo "RESULTADO: $PASS checks OK, $FAIL fallidos"
echo "============================================"

if [ "$FAIL" -eq 0 ]; then
    echo "✅ DEP-01 — Validación post-deploy EXITOSA"
    exit 0
else
    echo "❌ DEP-01 — Validación con fallas"
    exit 1
fi

# AUD-06 — Pendientes post-deploy → tareas concretas

## Contexto
**prd:** §1.1 — "Posicionar como proveedor confiable" y "Convertir visitas en consultas" (features A/D, §3.1). La validación en producción cierra la trazabilidad del funnel.


`Roadmap.md` sección "Monitoreo post-lanzamiento" (líneas 118-124) lista
6 items unchecked:
- [ ] Google Analytics recibe eventos
- [ ] Formulario de contacto envía mails
- [ ] Enlaces WhatsApp operativos
- [ ] Monitorear 48 h
- [ ] SSL vigente

Estos NO son tareas de desarrollo — son verificaciones post-deploy que
requieren que el sitio esté en producción (merge a master + GitHub Actions
deploy + propagación DNS).

También hay un "Pendiente sugerido" en T11: Lighthouse > 80 URL productiva.

## Scenarios (BDD)

```gherkin
Scenario: Verificación SSL
  Given el sitio deployed en https://sacsi.com.ar
  When ejecuto curl -I https://sacsi.com.ar
  Then el response code es 200 o 301
  And el header Strict-Transport-Security está presente
  And el certificado no está expirado

Scenario: Verificación GA4 eventos
  Given GTM-T7PWJ99 cargado en Layout.astro
  When abro https://sacsi.com.ar con GA4 Debugger
  Then el pageview event se dispara
  And el GTM container ID coincide

Scenario: Formulario contacto
  Given el sitio deployed
  When completo el formulario en /contacto/ y envío
  Then el mail llega a sacsi@sacsi.com.ar
  And el response del form indica éxito

Scenario: Lighthouse > 80
  Given el sitio deployed en sacsi.com.ar
  When ejecuto lighthouse https://sacsi.com.ar
  Then Performance >= 80
  And Accessibility >= 80
  And SEO >= 80
  And Best Practices >= 80
```

## Plan (SDD — HOW)

Estas son tareas que el usuario ejecuta en su host post-deploy. No quedan
en el repo como código — se documentan aquí y se checkean cuando el sitio
esté en vivo.

1. Mergear v0_alternativo_rebranding → master (vía PR o fast-forward)
2. Esperar que GitHub Actions deploy.yml corra (2-3 min)
3. Verificar https://sacsi.com.ar responde
4. Ejecutar verificaciones de arriba en orden
5. Marcar cada una en TODO.md cuando pase

## Verification script

```bash
#!/bin/bash
# Verificación AUD-06 — post-deploy
# USAR DESPUÉS de mergear a master y que deploy.yml corra
# Uso: bash _ai_context/docs/tareas/verify-AUD-06.sh

SITE="https://sacsi.com.ar"
PASS=0; FAIL=0

echo "🧪 AUD-06 — Post-deploy"

# 1. Site responde
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$SITE")
if [ "$CODE" = "200" ] || [ "$CODE" = "301" ]; then
    echo "  ✅ Site responde ($CODE)"
else
    echo "  ❌ Site no responde ($CODE)"
    FAIL=1
fi

# 2. SSL
if curl -sI "$SITE" | grep -qi 'strict-transport-security'; then
    echo "  ✅ HSTS presente"
else
    echo "  ⚠️ HSTS no presente (verificar en producción)"
fi

# 3. WhatsApp links
if curl -s "$SITE" | grep -q 'api.whatsapp.com'; then
    echo "  ✅ WhatsApp links presentes"
else
    echo "  ❌ WhatsApp links no encontrados"
    FAIL=1
fi

# 4. GTM
if curl -s "$SITE" | grep -q 'GTM-T7PWJ99'; then
    echo "  ✅ GTM-T7PWJ99 presente"
else
    echo "  ❌ GTM-T7PWJ99 no encontrado"
    FAIL=1
fi

# 5. Formulario
if curl -s "$SITE/contacto/" | grep -qi 'form'; then
    echo "  ✅ Formulario presente en /contacto/"
else
    echo "  ❌ Formulario no encontrado"
    FAIL=1
fi

# 6. Sitemap
if curl -s "$SITE/sitemap-index.xml" | grep -q 'sitemap' 2>/dev/null || \
   curl -s "$SITE/sitemap-0.xml" | grep -q 'urlset' 2>/dev/null; then
    echo "  ✅ Sitemap accesible"
else
    echo "  ❌ Sitemap no accesible"
    FAIL=1
fi

echo ""
echo "📌 Lighthouse y GA4 eventos requieren verificación manual con tools"
echo "   Lighthouse: chrome --lighthouse https://sacsi.com.ar"
echo "   GA4: Tag Assistant extension en Chrome"

echo ""
if [ "$FAIL" -eq 0 ]; then
    echo "✅ AUD-06 — Verificaciones automáticas OK"
else
    echo "❌ AUD-06 — Verificaciones fallaron"
    exit 1
fi
```

## Estado
BLOCKED — ver nota en el archivo

## Notas
Esta tarea NO se puede completar hasta que la rama esté mergeada a master
y el deploy.yml corra. Es la última verificación antes de "producción lista".

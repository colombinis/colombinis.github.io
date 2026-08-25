---
id: MAR-02
title: CTA WhatsApp (link pre-configurado + override opcional)
affects:
  pages: []
  components: [footer]
  behaviors: [cta-whatsapp]
---

# MAR-02 — CTA WhatsApp (link pre-configurado + override opcional)

## Contexto
El behavior `cta-whatsapp` (link a WhatsApp con mensaje pre-cargado) estaba 🔴 UNCOVERED en SYSTEM_MAP: existe en el código (footer, contacto, y ~13 páginas más) pero **ninguna spec lo define**. Además, al auditar el código real se descubrió **drift de implementación**: el link NO es un componente compartido, está duplicado inline en múltiples archivos, y los textos pre-cargados **ya difieren** entre sí (Footer dice "Hola quiero saber más sobre sus soluciones **informáticas**"; contacto dice "Hola quiero saber más sobre sus soluciones"). El SYSTEM_MAP (CHECK R) confirmó que `cta-whatsapp` es behavior de **componente**, no de página.

Regla de negocio acordada con el usuario:
- **Por defecto** todas las instancias usan el link y texto **pre-configurados** en `src/config/site.json` (`contact.whatsapp.base_url`, `phone`, y `text` por defecto).
- **Pueden** usar un link/texto distinto por instancia, **pero debe ser un override explícito y documentado**, no una copia hardcoded a ciegas.

## Spec (SDD — WHAT)
**User story:** Como visitante del sitio, quiero un botón/link de WhatsApp siempre disponible y coherente, para contactar a SACsi sin fricción.

**Definición técnica:**
- Toda instancia de link WhatsApp debe derivar de `config.contact.whatsapp` (site.json), no hardcodear el número/URL.
- Texto pre-cargado por defecto = el de site.json; un override por instancia es permitido **solo si** se documenta en la spec o el componente que lo usa.
- El `href` debe ser `https://api.whatsapp.com/...` (o `wa.me`) con `phone` y `text` URL-encoded correctamente (acentos/espacios no se rompan).
- Atributos de seguridad: `target="_blank"` + `rel="noopener noreferrer"`.

## Scenarios (BDD)
```gherkin
Scenario: El link usa la config pre-configurada (default)
  Given el sitio con site.json definiendo whatsapp.phone y base_url
  When se renderiza cualquier instancia de cta-whatsapp
  Then el href contiene el phone de site.json (no hardcodeado en el archivo)
  And usa base_url de site.json

Scenario: El texto pre-cargado respeta encoding
  Given una instancia con text "Hola quiero saber más sobre sus soluciones"
  When se inspecciona el href en el build (dist/)
  Then el text aparece URL-encoded (espacios=%20, acentos=%C3%A1) sin cortarse

Scenario: Override explícito es permitido y rastreable
  Given una instancia que usa texto distinto al default (ej. footer añade "informáticas")
  When se audita esa instancia
  Then el override está en el componente/página de forma explícita (no copia accidental)
  And no hay N copias idénticas hardcoded sin fuente común

Scenario: Atributos de seguridad presentes
  Given cualquier instancia cta-whatsapp en el build
  When se inspecciona el <a>
  Then tiene target="_blank" y rel="noopener noreferrer"
```

## Plan (SDD — HOW)
1. Confirmar que `src/config/site.json` tiene `contact.whatsapp.{base_url, phone, text_default}`.
2. Auditar todas las instancias inline (`grep -rn "api.whatsapp.com\|wa.me" src/`) y listarlas.
3. Para cada instancia: verificar que deriva de `config.contact.whatsapp`; si hardcodea, reemplazar por referencia a site.json.
4. Unificar el texto default; los overrides (ej. footer) deben ser explícitos y justificados.
5. Extraer a un componente `WhatsAppCTA.astro` compartido (refactor opcional, recomendado para matar el drift) con prop `textOverride`.
6. Correr el verify y `npm run build`.

## Verification script
```bash
#!/bin/bash
# Verificación MAR-02 — CTA WhatsApp coherente
set -e
echo "🧪 MAR-02 — CTA WhatsApp"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. site.json expone la config
if grep -q "whatsapp" src/config/site.json; then
  echo "  ✅ site.json tiene config whatsapp"
else
  echo "  ❌ site.json sin config whatsapp"; exit 1
fi

# 2. toda instancia en el build apunta a api.whatsapp.com o wa.me
COUNT=$(grep -rhoE "api\.whatsapp\.com|wa\.me" dist --include='*.html' | wc -l)
if [ "$COUNT" -gt 0 ]; then
  echo "  ✅ $COUNT instancia(s) de cta-whatsapp en build"
else
  echo "  ❌ ninguna instancia de whatsapp en build"; exit 1
fi

# 3. encoding correcto: acentos como %C3 (no como char crudo roto)
if grep -rqE "api\.whatsapp\.com[^\"]*soluciones" dist --include='*.html'; then
  echo "  ⚠️  texto con acento posiblemente sin encode (revisar URL)"
fi

# 4. atributos de seguridad en los <a> whatsapp
BAD=$(grep -rhoE "<a[^>]*api\.whatsapp\.com[^>]*>" dist --include='*.html' | grep -vc 'rel="noopener noreferrer"')
if [ "$BAD" -eq 0 ]; then
  echo "  ✅ todos los <a> whatsapp tienen rel=noopener noreferrer"
else
  echo "  ❌ $BAD <a> whatsapp sin rel=noopener noreferrer"; exit 1
fi

rm -rf dist
echo "✅ MAR-02 — COMPLETA"
```

## Estado
TODO

## Notas
- Cierra el último 🔴 UNCOVERED de SYSTEM_MAP.
- Descubrió drift real: footer y contacto ya usan textos distintos. La spec lo permite como override explícito, no como copia accidental.
- Depende de `site-config` (src/config/site.json).
- Refactor sugerido: componente `WhatsAppCTA.astro` para centralizar (mata el drift de 15 archivos).

# AUD-15 — Footer: email de contacto no renderiza (falta en template)

## Contexto
En `Footer.astro` (líneas 193-206), la sección "¿Empezamos?" tiene solo el botón WhatsApp. El email `config.contact.email` (`sacsi@sacsi.com.ar`) está definido en `site.json` y se usa en `contacto.astro` y `Layout.astro` (JSON-LD), pero **NO aparece en el Footer**.

El diseño del footer (líneas 93-133) define `.footer__contact-row` y `.footer__email` pero el template (líneas 198-205) solo renderiza el WhatsApp. Falta la fila de email.

## Spec (SDD — WHAT)
**User story:** Como visitante en el footer, quiero ver el email de contacto para poder escribir sin usar WhatsApp.

**Definición:**
- Agregar en `Footer.astro` sección `.footer__actions` la fila `.footer__contact-row` con email
- Usar `config.contact.email` y `mailto:` link
- Estilos ya existen en global.css (líneas 118-133)

## Scenarios (BDD)
```gherkin
Scenario: Footer muestra email de contacto
  Given página con Footer
  When se renderiza
  Then ve "sacsi@sacsi.com.ar" en columna "¿Empezamos?"
  And el email es link mailto: clickeable
  And tiene clase .footer__email con estilos correctos
```

## Plan (SDD — HOW)
1. Editar `src/components/Footer.astro`: en `.footer__actions` (líneas 198-205), agregar después del WhatsApp:
   ```astro
   <div class="footer__contact-row">
     <span>✉</span>
     <a class="footer__email" href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
   </div>
   ```
2. Verificar estilos en global.css (ya existen: líneas 118-133)
3. Testear en mobile (columna) y desktop (fila)

## Verification script
```bash
#!/bin/bash
# AUD-15 — Footer email
set -e
D=dist
echo "🧪 AUD-15 — Footer email"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. Email en footer
if grep -q 'sacsi@sacsi.com.ar' "$D/index.html"; then
  echo "  ✅ Email presente en HTML"
else
  echo "  ❌ Email AUSENTE en HTML"
  exit 1
fi

# 2. Link mailto
if grep -q 'mailto:sacsi@sacsi.com.ar' "$D/index.html"; then
  echo "  ✅ mailto: link presente"
else
  echo "  ❌ mailto: AUSENTE"
  exit 1
fi

# 3. Clase footer__email
if grep -q 'footer__email' "$D/index.html"; then
  echo "  ✅ Clase footer__email presente"
else
  echo "  ❌ footer__email AUSENTE"
  exit 1
fi

# 4. En TODAS las páginas (footer es global)
for page in index.html servicios/automatizacion/index.html casos-exito/ferreteria-gas-plomeria/index.html sobre-nosotros/index.html contacto/index.html; do
  if [ -f "$D/$page" ]; then
    if grep -q 'mailto:sacsi@sacsi.com.ar' "$D/$page"; then
      echo "  ✅ $page: email en footer"
    else
      echo "  ❌ $page: email AUSENTE en footer"
      exit 1
    fi
  fi
done

rm -rf dist
echo "✅ AUD-15 — COMPLETA"
```

## Estado
DONE

## Notas
- Fix aplicado en `src/components/Footer.astro`: en `.footer__actions` (col 3 "¿Empezamos?"), después del botón WhatsApp se agregó la fila `.footer__contact-row` con `<span aria-hidden="true">&#9993;</span>` y el link `.footer__email` (`mailto:{config.contact.email}` → `sacsi@sacsi.com.ar`).
- Los estilos `.footer__contact-row` y `.footer__email` ya existían en el `<style>` de `Footer.astro` (líneas 118-133) — no requirieron cambios.
- Email tomado de `config.contact.email` (`src/config/site.json`), misma fuente que `contacto.astro` y el JSON-LD de `Layout.astro` — consistencia de una sola fuente.
- Verificado en build (2026-08-05): email + `mailto:` + clase `footer__email` presentes en las 5 páginas sample (index, servicios/automatizacion, casos-exito/ferreteria-gas-plomeria, sobre-nosotros, contacto). Footer es global (via Layout), aplica a las 16 páginas.
- Smoke test (Playwright): desktop (≥601px) `footer__actions` en fila con email azul tertiary; mobile (375px) en columna con email visible. No rompe layout.
- Verification script: 8/8 checks ✅.
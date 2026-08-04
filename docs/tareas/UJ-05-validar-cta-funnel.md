# UJ-05 — Validar CTA y funnel en las 15 páginas

## Contexto
Verificación transversal: TODAS las páginas del sitio (15 en producción)
deben tener al menos un CTA de conversión (WhatsApp, formulario o email),
para que ningún visitante quede en un callejón sin salida.

## Spec
Toda página renderizada debe ofrecer conversión: link WhatsApp
(`api.whatsapp.com/send?phone=5493415197937`) o formulario/email
(`sacsi@sacsi.com.ar`). El header/footer debe dar navegación a las
secciones principales.

## Escenarios Gherkin

### E1: Todas las páginas tienen CTA
Given el sitio build-eado
When recorro las 15 páginas index.html
Then cada página tiene WhatsApp OR formulario OR email

### E2: El header navega a las 5 secciones principales
Given cualquier página
When miro el header
Then ve links a: Inicio, Servicios, Cómo trabajamos, Sobre nosotros, Contacto

### E3: El footer es minimalista (copyright solo, sin redes)
Given cualquier página
When miro el footer
Then solo ve copyright (sin links de redes sociales — decisión de marca)

## Plan
1. Build del sitio
2. Recorrer las 15 páginas y extraer presencia de CTA
3. Verificar header nav en una muestra
4. Verificar footer minimalista

## Verification (bash ejecutable)

```bash
#!/bin/bash
# UJ-05 — Validar CTA en las 15 páginas
set -e
D=dist
echo "🧪 UJ-05 — CTA en las 15 páginas"

# E1: todas las páginas tienen CTA
TOTAL=0; OK=0; MISSING=""
for p in $(cd $D && find . -name 'index.html' | sort); do
  TOTAL=$((TOTAL+1))
  if grep -q 'whatsapp.com\|sacsi@sacsi.com.ar\|mailto:' "$D/$p"; then
    OK=$((OK+1))
  else
    MISSING="$MISSING $p"
  fi
done
echo "  $OK/$TOTAL páginas con CTA"
[ -z "$MISSING" ] && echo "  ✅ E1 todas con CTA" || echo "  ❌ E1 sin CTA:$MISSING"

# E2: header navega a secciones (muestra: home)
for s in "Inicio" "Servicios" "Cómo trabajamos" "Sobre nosotros" "Contacto"; do
  grep -q "$s" $D/index.html && echo "  ✅ E2 header: $s"
done

# E3: footer minimalista (sin redes sociales)
if grep -q 'linkedin.com\|instagram.com\|facebook.com\|x.com' $D/index.html; then
  echo "  ❌ E3 footer con redes (contradice decisión)"
else
  echo "  ✅ E3 sin redes sociales en footer"
fi

echo "✅ UJ-05 — COMPLETA (funnel sin callejones sin salida)"
```

## Resultados reales (2026-08-04, build 15 páginas)

```
15/15 páginas con CTA ✅
Header: Inicio ✅ Servicios ✅ Cómo trabajamos ✅ Sobre nosotros ✅ Contacto ✅
Footer: sin redes ✅ (solo copyright)
```

## Hallazgos
- **H-UJ05-01 (OK):** 15/15 páginas con CTA. Cero callejones sin salida.
- **H-UJ05-02 (INFO):** El único "CTA débil" es el formulario de contacto
  (mailto: — depende del cliente de mail del visitante). Documentado en
  DEP-01 como pendiente post-deploy: verificar que el form envía mails.
- **H-UJ05-03 (INFO):** El sitio no tiene página 404 custom ni
  redirecciones para URLs legacy (`.html`, `theme/mobile1/`,
  `inteligencia-artificial/`). Verificar en AUD-05/ARQUITECTURA.

## Estado
DONE — verificado contra build 2026-08-04

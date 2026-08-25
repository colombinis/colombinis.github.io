---
id: MAR-01
title: Estilo alineado a la identidad SACsi (tokens DESIGN.md)
affects:
  pages: [home, contacto, catalogo, servicios, sobre-nosotros, casos-exito, trabajos]
  components: [header, footer, service-card, soluciones-section, social-proof-section, casos-carousel, todos-casos-section]
  behaviors: [estilo-alineado]
---

# MAR-01 — Estilo alineado a la identidad SACsi

## Contexto
El usuario final reporta que el estilo en ciertas pantallas "no está alineado a los estilos de las otras páginas" (ej. `/contacto`). Hoy **no existe una spec** que defina el behavior `estilo-alineado` como entidad rastreable: el SYSTEM_MAP lo marcaba 🔴 UNCOVERED. Sin esta spec, un reporte de desalineación no se puede trazar a una fuente de verdad.

La identidad ya está centralizada en `DESIGN.md` (tokens: `primary #1A1A2E`, `tertiary #0A7CFF`, `whatsapp #25D366`, tipografía system stack, jerarquía h1→h3) y se propaga vía `src/styles/global.css` importado en `src/layouts/Layout.astro` (heredado por todas las páginas). El riesgo real es la **deriva CSS inline/local** que no usa las variables canónicas.

## Spec (SDD — WHAT)
**User story:** Como visitante del sitio, quiero que todas las páginas y componentes respeten la misma identidad visual (color, tipografía, espaciado), para percibir coherencia profesional sin "pantallas descabezadas".

**Definición técnica:**
- Todo color/espaciado/tipografía en páginas y componentes debe derivar de los tokens de `DESIGN.md` vía variables CSS en `global.css` (`--primary`, `--tertiary`, `--whatsapp`, `--neutral`, etc.).
- Queda prohibido hardcodear valores de color/tipografía que ya existan como token (ej. usar `#1A1A2E` literal en vez de `var(--primary)`).
- El `<h1>` único por página y la jerarquía tipográfica (h1 2.8rem / h2 2rem / h3 1.15rem / body 1rem) se respetan en todas las vistas.

## Scenarios (BDD)
```gherkin
Scenario: Los colores usan tokens canónicos (no hardcode)
  Given el sitio construido (dist/)
  When se inspeccionan los estilos de home, contacto y catalogo
  Then no aparecen valores de color literales que duplican un token de DESIGN.md
  And todos los bloques usan var(--primary) / var(--tertiary) / var(--whatsapp)

Scenario: Una página nueva respeta la jerarquía tipográfica
  Given una página que usa Layout.astro
  When se renderiza /contacto
  Then tiene exactamente un <h1> con fontSize 2.8rem (token h1)
  And los subtítulos usan h2 (2rem) o h3 (1.15rem) según nivel

Scenario: Reporte de desalineación es trazable a esta spec
  Given un usuario reporta "el estilo de /contacto no está alineado"
  When se consulta SYSTEM_MAP.yaml por behavior 'estilo-alineado'
  Then resuelve a source_specs: [MAR-01] y a pages: [contacto]
  And el desarrollador sabe revisar header/footer de esa página contra global.css
```

## Plan (SDD — HOW)
1. Confirmar que `src/styles/global.css` define `:root { --primary, --tertiary, --whatsapp, --neutral, --surface, --muted, --whatsapp }` (debe coincidir con `DESIGN.md`).
2. Auditar `src/pages/*.astro` y `src/components/*.astro` buscando colores hardcodeados que dupliquen tokens (grep de `#1A1A2E|#0A7CFF|#25D366`).
3. Para cada hallazgo, reemplazar el literal por `var(--token)` correspondiente.
4. Verificar que `Layout.astro` importa `global.css` (ya lo hace) y que ninguna página lo sobrescribe con estilos locales conflictivos.
5. Correr `npm run build` y el script de verificación.

## Verification script
```bash
#!/bin/bash
# Verificación MAR-01 — estilo alineado a tokens DESIGN.md
set -e
echo "🧪 MAR-01 — Estilo alineado a identidad SACsi"

export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

# 1. global.css debe exponer los tokens canónicos
for tok in "--primary" "--tertiary" "--whatsapp" "--neutral"; do
  if grep -q "$tok" src/styles/global.css; then
    echo "  ✅ $tok definido en global.css"
  else
    echo "  ❌ $tok AUSENTE en global.css"; exit 1
  fi
done

# 2. No debe haber duplicados literales de tokens en pages/components
DUP=$(grep -rEn "#1A1A2E|#0A7CFF|#25D366" src/pages src/components 2>/dev/null | grep -v "var(" | wc -l)
if [ "$DUP" -eq 0 ]; then
  echo "  ✅ sin colores hardcodeados que dupliquen tokens"
else
  echo "  ❌ $DUP color(es) literal(es) que duplican token (usar var())"
  grep -rEn "#1A1A2E|#0A7CFF|#25D366" src/pages src/components | grep -v "var(" | head
  exit 1
fi

# 3. behavioral traceability: SYSTEM_MAP cite a MAR-01 en estilo-alineado
if grep -q "estilo-alineado" _ai_context/docs/tareas/SYSTEM_MAP.yaml && grep -q "MAR-01" _ai_context/docs/tareas/SYSTEM_MAP.yaml; then
  echo "  ✅ SYSTEM_MAP: behavior 'estilo-alineado' → source_specs incluye MAR-01"
else
  echo "  ❌ SYSTEM_MAP no vincula estilo-alineado ↔ MAR-01"; exit 1
fi

rm -rf dist
echo "✅ MAR-01 — COMPLETA"
```

## Estado
TODO

## Notas
- Esta spec cierra el gap 🔴 UNCOVERED de `estilo-alineado` detectado por `index-system-map.py`.
- Depende de `design-tokens` (DESIGN.md + global.css).
- No requiere nueva carpeta de fase; va en `FEATURE-marca/` por coherencia con FEATURE-1/FEATURE-2.
- Para subir a 🟢 en el coverage, esta spec debe marcarse DONE y el verify debe pasar en CI.

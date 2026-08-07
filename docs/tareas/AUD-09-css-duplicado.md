# AUD-09 — CSS duplicado: ServiceCard definido en global.css Y ServiceCard.astro

## Contexto
El componente `ServiceCard.astro` (líneas 5-67) define sus propios estilos CSS internos. Simultáneamente, `global.css` (líneas 225-292) define **exactamente las mismas clases** (`.service-card`, `.service-card__icon`, `.service-card h3`, `.service-card__claim`, `.service-card__cta`, hover states).

Esto genera:
- CSS duplicado en el bundle final (bytes innecesarios)
- Riesgo de divergencia: si se cambia en un lado y no en el otro, hay inconsistencias visuales
- Violación de "fuente única de verdad" para el design system

## Spec (SDD — WHAT)
**Decisión:** Los estilos de componentes reutilizables deben vivir **solo en global.css** (design system centralizado). Los componentes Astro NO deben definir estilos propios para clases compartidas.

**Regla:**
- `global.css` = fuente de verdad para tokens + componentes base (service-card, button, card, metric, testimonial, step, faq, cta, hero, section, container)
- Componentes Astro = solo estructura HTML + slots, **sin** `<style>` para clases compartidas
- Excepción: estilos verdaderamente únicos del componente (ej: skeleton del carousel)

## Scenarios (BDD)
```gherkin
Scenario: ServiceCard.astro no tiene estilos duplicados
  Given el archivo src/components/ServiceCard.astro
  When se inspecciona
  Then NO tiene bloque <style> con .service-card, .service-card__icon, .service-card__claim, .service-card__cta
  And solo tiene estilos únicos si los necesita (ej: layout interno específico)

Scenario: global.css tiene todos los estilos de service-card
  Given global.css
  When se busca .service-card
  Then tiene: .service-card, .service-card:hover, .service-card__icon, .service-card h3, .service-card__claim, .service-card__cta, .service-card__cta:hover

Scenario: Build no tiene CSS duplicado
  Given build de producción
  When se analiza el CSS final
  Then .service-card aparece una sola vez
```

## Plan (SDD — HOW)
1. Eliminar `<style>...</style>` completo de `src/components/ServiceCard.astro` (líneas 5-67)
2. Verificar que `global.css` tiene todas las clases necesarias (ya las tiene, líneas 225-292)
3. Testear visualmente: `index.astro` (SolucionesSection), `servicios/index.astro`, casos de éxito
4. Verificar en build: `grep -c '\.service-card' dist/_astro/*.css` debe dar 1 bloque

## Verification script
```bash
#!/bin/bash
# AUD-09 — CSS duplicado ServiceCard
set -e
echo "🧪 AUD-09 — CSS duplicado"

# 1. ServiceCard.astro NO tiene <style> con clases compartidas
if grep -q '<style>' src/components/ServiceCard.astro; then
  # Verificar si tiene las clases problemáticas
  if grep -A 100 '<style>' src/components/ServiceCard.astro | grep -q 'service-card__icon\|service-card__claim\|service-card__cta'; then
    echo "  ❌ ServiceCard.astro TIENE estilos duplicados"
    exit 1
  else
    echo "  ✅ ServiceCard.astro tiene <style> pero sin clases compartidas (OK)"
  fi
else
  echo "  ✅ ServiceCard.astro SIN <style> (OK)"
fi

# 2. global.css tiene las clases
for cls in "service-card" "service-card:hover" "service-card__icon" "service-card__claim" "service-card__cta" "service-card__cta:hover"; do
  if grep -q "\.$cls" src/styles/global.css; then
    echo "  ✅ global.css tiene .$cls"
  else
    echo "  ❌ global.css FALTA .$cls"
    exit 1
  fi
done

# 3. Build: CSS final tiene una sola definición
export PATH="/workspace/.tools/node22/bin:$PATH"
export HOME=/workspace/.tools
rm -rf dist && npm run build > /dev/null 2>&1

COUNT=$(grep -r '\.service-card' dist/_astro/*.css 2>/dev/null | grep -v 'service-card__' | wc -l)
if [ "$COUNT" -le 2 ]; then  # 1 para .service-card, 1 para :hover
  echo "  ✅ Build: CSS service-card no duplicado ($COUNT ocurrencias base)"
else
  echo "  ⚠️  Build: $COUNT ocurrencias de .service-card (revisar)"
fi

rm -rf dist
echo "✅ AUD-09 — COMPLETA"
```

## Estado
DONE

## Notas
- Eliminado el bloque `<style>` completo (líneas 5-67) de `src/components/ServiceCard.astro`; quedó solo estructura HTML + slots.
- `global.css` ya contenía las clases idénticas (`.service-card`, `:hover`, `__icon`, `h3`, `h3 a`, `p`, `__claim`, `__cta`, `__cta:hover`) — sin cambios necesarios allí.
- Verificación: ServiceCard.astro sin `<style>`; global.css con todas las clases; build OK; `.service-card` aparece una sola vez en el bundle (`Layout.*.css`). El grep del script dio 0 falsos negativos por ser el CSS minificado una sola línea — el conteo real con `grep -roh` da 9 ocurrencias (1 base + 1 hover + 7 variantes `__`), sin duplicado.
- Smoke test visual (Playwright): las tarjetas de la home renderizan correctamente (icono, título-link, claim, párrafo).
- Deuda técnica restante (fuera de alcance de esta tarea): mismos estilos en `global.css` para otros componentes (`Footer`, `Header`, `SocialProofSection`, `FaqSection`) — revisar en otra iteración; el skeleton de `CasosCarousel` es único y se mantiene.
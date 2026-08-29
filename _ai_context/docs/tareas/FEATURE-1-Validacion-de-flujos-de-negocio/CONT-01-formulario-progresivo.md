# CONT-01 — Formulario progresivo multi-step de contacto (P4-step a)

> **Spec SDD + BDD.** Estado: **DONE** (verificado con `verify-CONT-01.sh`).

## Contexto

El funnel de SACsi era 100% manual: los CTAs de servicios/casos apuntan a `WhatsApp`. Esto no permite medir el funnel real (tasa de abandono por step, tiempo hasta submit) ni capturar briefs estructurados.

**P4 (AUT-01)** exige "medir antes de automatizar" (§1.2, propuesta híbrida incremental). Este spec cierra el **step (a)**: un formulario progresivo multi-step que captura el funnel real **antes** de conectar MercadoPago o fijar umbrales n8n.

**Reutilización:** el formulario (`FormContactoProgresivo.astro`) es un **componente genérico** reutilizable desde `servicios/*`, landing de marketing, o futuros canales. Recibe props: `categoria?` (precargada), `asunto?` (readonly), `source?` (tracking).

## Spec (WHAT)

- **3 stages visibles uno a la vez** (CSS `hidden` + JS), no frameworks.
- **Step 1:** select de categoría de servicio (precargado build-time vía `getTrabajos()` → `categorias[0]` de cada trabajo, 5 categorías reales + "Otro" con texto libre).
- **Step 2:** nombre + email + asunto (readonly, derivado de categoria) + brief textarea.
- **Step 3:** recap + botón "Confirmar".
- **Submit:** POST al endpoint de Formspree (`config.contact.form_endpoint`), NO a WhatsApp.
- **Eventos GTM** (dataLayer.push, patrón `contacto.astro`): `form_step_1`/`form_step_2` (on advance), `checkout_started` (botón step3), `form_submit` (on submit exitoso).
- **Accesible:** labels asociados, foco en field activo, botón "Siguiente" disabled si campos requeridos vacíos.
- **Noscript fallback:** formulario simple con los mismos fields + Formspree.
- **Página contenedora:** `/contacto-v2/` (pública, index/follow). NO protegida (a diferencia de `/padmin/*`).

## Scenarios (Gherkin)

```gherkin
Scenario: Usuario atraviesa el formulario completo
  Given el visitante está en /contacto-v2/
  When selecciona una categoría en el step 1 y avanza
  And completa nombre, email y brief en el step 2
  And confirma en el step 3
  Then se envía POST a Formspree y dispara dataLayer form_submit.
```

```gherkin
Scenario: Usuario elige "Otro" y escribe texto libre
  Given el step 1 está activo
  When selecciona "Otro"
  Then aparece un input de texto libre "categoria_otro".
  When escribe y avanza
  Then el select categoría incluye el texto escrito.
```

```gherkin
Scenario: Validación previa al submit
  Given el step 1 está activo
  When no selecciona ninguna categoría
  Then el botón "Siguiente" está disabled.
```

```gherkin
Scenario: Checkout simulado dispara evento
  Given el formulario está completado hasta el step 3
  When hace click en "Confirmar"
  Then dispara dataLayer checkout_started antes del submit.
```

```gherkin
Scenario: Navegador sin JavaScript ve el fallback
  Given el visitante tiene JS deshabilitado
  Then ve el <noscript> con formulario simple + Formspree + mailto link opcional.
```

## Plan (HOW)

1. Crear `src/components/FormContactoProgresivo.astro` (3 stages + GTM + Formspree).
2. Crear `src/pages/contacto-v2.astro` (wrapper público + noscript fallback).
3. Validar `npm run build` + `verify-CONT-01.sh`.

## Verification

```bash
cd _ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/
bash verify-CONT-01.sh
# exit 0 = PASS (build + Formspree + categorías + GTM eventos + tests rentabilidad 15/15)
```

## Estado

DONE — `verify-CONT-01.sh` exit 0 (2026-08-29). Archivos:
- `src/components/FormContactoProgresivo.astro`
- `src/pages/contacto-v2.astro`
- `verify-CONT-01.sh`

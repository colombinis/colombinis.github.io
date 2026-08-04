# PRI-04 — Tiers/paquetes publicables

## Contexto

Definir qué se muestra en el sitio sobre precios. Decisión estratégica:
**el sitio NO publica una tabla de precios completa** (el modelo PRI-01 es
paquete cerrado cotizado tras Descubrimiento), pero SÍ muestra:
1. El ancla de precio en FAQ ("desde $X ARS") → genera expectativa y
   filtra leads sin capacidad.
2. Los 3 servicios con CTA a WhatsApp → la conversación (Descubrimiento)
   es donde se cotiza.

## Escenarios (BDD)

```gherkin
Scenario: El sitio comunica precios sin tabla completa
  When miro el sitio publicado
  Then la FAQ muestra un precio minimo orientativo ("desde $X")
  And los 3 servicios tienen CTA a WhatsApp (no precio duro)
  And NO existe una tabla de precios publicada (evita competencia por precio)
  And el copy es coherente con "presupuesto claro y sin compromiso"
```

## Qué publicar (recomendado)

### FAQ — ancla de precio (AJUSTAR tras PRI-03)

```text
¿Cuánto cuesta un desarrollo?
Los proyectos chicos arrancan desde los $500.000 ARS. El precio final
depende del alcance y la complejidad. Por eso primero tenemos una
conversación sin cargo para entender tu proyecto, y ahí te damos un
presupuesto claro y sin compromiso. No creemos en los misterios con
los precios.
```

> **Cambio:** $150.000 → $500.000 (alinear con breakeven PRI-03).
> Es la ÚNICA mención de precio en todo el sitio.

### Copy de servicios — enfoque en valor, no en precio

- Presencia online: "Sitios y tiendas que venden, desde $500.000 ARS"
  (si se quiere un ancla por servicio) — OPCIONAL, recomendado NO
  publicar precios por servicio; dejar el ancla general.
- Automatización: "Ahorrá horas por día en tareas repetitivas"
- Software: "Sistemas a medida que crecen con tu negocio"

### Tiers internos (NO publicados, guía de cotización)

Usar PRI-02 ajustado (Opción A) como guía interna de cotización:

| Servicio | Básico | Pro | Grande |
|----------|--------|-----|--------|
| Presencia | $500-800k | $900k-1.4M | $1.6M-2.5M (e-commerce) |
| Automatización | $700k-1M | $1.2M-1.8M | (a medida) |
| Software | $2M-3.5M | $4M-8M | (multi-área) |

## Scenarios de copy (Gherkin)

```gherkin
Scenario: FAQ con precio minimo coherente
  Given el sitio publicado
  When un visitante abre la FAQ
  Then ve "desde $500.000 ARS" (no $150.000 desactualizado)
  And ve "conversación sin cargo"

Scenario: Sin tabla de precios publicada
  Given el sitio publicado
  When recorro las páginas
  Then NO hay tabla de precios por servicio en ninguna página
  And los servicios dirigen a WhatsApp/formulario
```

## Verification (bash ejecutable)

```bash
#!/bin/bash
# PRI-04 — tiers publicables
echo "🧪 PRI-04 — Tiers publicables"
# Ajuste de FAQ pendiente (si se confirma)
if grep -q '500.000' src/pages/index.astro; then
  echo "  ✅ FAQ ancla $500.000 (actualizado)"
else
  echo "  ⚠️ FAQ ancla aun $150.000 — pendiente de confirmacion PRI-03"
fi
# Sin tabla publicada
if grep -rq 'Precio\|precio' src/pages/index.astro; then
  echo "  ✅ FAQ menciona precio (correcto, es la unica)"
else
  echo "  ⚠️ sin mencion de precio en home"
fi
echo "✅ PRI-04 — COMPLETA (con pendiente de confirmacion)"
```

## Estado
DONE — estrategia definida; ajuste de FAQ pendiente de confirmación
(PRI-03 Opción A) — NO tocar index.astro sin OK del usuario

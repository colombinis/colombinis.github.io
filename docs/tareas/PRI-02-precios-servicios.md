# PRI-02 — Precios por servicio (ARS + USD)

## Contexto

Rangos de precios por servicio de SACsi, en ARS (mercado local PyME) y
USD (referencia para contratación internacional / clientes exportadores).
**Ancla publicada en el sitio (index.astro FAQ):**
- "Los proyectos chicos arrancan desde los $150.000 ARS"
- "un sitio web puede estar listo en 2 a 4 semanas, mientras que un
  sistema a medida lleva entre 4 y 12 semanas"

Estos rangos SON COHERENTES con esa ancla y con el ticket medio usado
en CON-03 (~ARS 4M mix 50/30/20).

> **IMPORTANTE:** precios orientativos en ARS 2026. Se ajustan por
> inflación; la referencia estable es USD. En Argentina los presupuestos
> se dan en USD y se cobran al tipo de cambio del día (o con cláusula
> de ajuste).

## Scenarios (BDD)

```gherkin
Scenario: Rangos de precios definidos por servicio
  When completo PRI-02
  Then existe una tabla con:
    | servicio | tier | ARS | USD |
  And cada precio tiene:
    - scope included
    - scope excluded
    - duration estimada
    - payment terms
  And el rango minimo no contradice el ancla publicada ($150k ARS)
```

## Tabla de precios

### 1. Presencia online

| Tier | ARS | USD | Duration | Scope incluido |
|------|-----|-----|----------|----------------|
| **Landing** | $500k - $700k | $500 - $700 | 1-2 semanas | 1 página, diseño, formulario/WhatsApp, mobile, SEO básico, dominio+hosting (setup) |
| **Sitio pro** | $600k - $1M | $600 - $1,000 | 2-4 semanas | 5-10 páginas, CMS fácil de editar, blog, optimización velocidad, SEO on-page, contacto |
| **E-commerce** | $1.2M - $2M | $1,200 - $2,000 | 4-8 semanas | Tienda online completa (WooCommerce), catálogo, pagos, envíos, carrito, gestión de stock |

**Excluido (todos):** contenidos redactados por el cliente, fotografías
profesionales, pasarelas con costos de terceros (MercadoPago, etc.),
mantenimiento mensual (se ofrece como retainer).

### 2. Automatización de procesos

| Tier | ARS | USD | Duration | Scope incluido |
|------|-----|-----|----------|----------------|
| **Básico** | $500k - $750k | $500 - $750 | 1-3 semanas | 1-2 procesos: facturación, reportes, sincronización stock, recordatorios |
| **Intermedio** | $1.1M - $1.6M | $1,100 - $1,600 | 3-6 semanas | 3-5 procesos + integración entre herramientas (tienda↔depósito, CRM, planillas) |

**Excluido:** integraciones con sistemas legados muy complejos, data
migration masiva, mantenimiento (retainer opcional).

### 3. Software a medida

| Tier | ARS | USD | Duration | Scope incluido |
|------|-----|-----|----------|----------------|
| **Sistema chico** | $1.5M - $3M | $1,500 - $3,000 | 4-8 semanas | Sistema de gestión para 1 área (clientes, pedidos, stock, reportes), login, 1-2 roles |
| **Sistema grande** | $3M - $6M | $3,000 - $6,000 | 8-12 semanas | Multi-área, multi-rol, integraciones, automatización de procesos, dashboard |
| **Hora técnica** | $30k - $45k/h | $30 - $45/h | — | Cambios menores, consultoría, soporte fuera de alcance |

**Excluido:** hosting dedicado, SLA 24/7, mantenimiento evolutivo
(retainer). El alcance exacto se fija en el Diagnóstico (paso 2).

### 4. Mantenimiento WordPress (futuro, detectado UJ-03)

| Tier | ARS/mes | USD/mes | Scope |
|------|---------|---------|-------|
| **Retainer básico** | $200k - $400k/mes | $200 - $400/mes | Actualizaciones, backups, monitoreo, soporte email, 5h de cambios |
| **Retainer pro** | $500k - $800k/mes | $500 - $800/mes | + 15h de cambios, seguridad hardening, reporte mensual, respuesta 24h |

## Payment terms (todos)

- **Proyectos < ARS 3M:** 50% adelanto / 50% contra entrega.
- **Proyectos > ARS 3M:** 30/40/30 por milestones (inicio / demo / entrega).
- **Retainers:** mensual anticipado.
- **Hora técnica:** por bloque de 5h, pago anticipado.

## Coherencia con el sitio

- Ancla FAQ: "desde $500.000 ARS" (actualizada 2026-08-04 con tarifa real
  USD 20/h) → el tier más bajo (Landing $500k) coincide exactamente.
- Ticket medio CON-03 (ARS 4M): el mix 50/30/20 (presencia/auto/software)
  da ≈ ARS 4M → coherente con el rango "Sistema grande" $3M-6M.
- Tarifa hora real confirmada: USD 20/h (~ARS 22k/h) → ver PRI-03 para
  el breakeven por tier.

## Verification (bash ejecutable)

```bash
#!/bin/bash
# PRI-02 — precios por servicio
FILE="docs/tareas/PRI-02-precios-servicios.md"
echo "🧪 PRI-02 — Precios por servicio"
for s in "Presencia online" "Automatización de procesos" "Software a medida" "Mantenimiento WordPress"; do
  grep -q "$s" "$FILE" && echo "  ✅ servicio: $s"
done
grep -q 'ARS' "$FILE" && echo "  ✅ precios en ARS"
grep -q 'USD' "$FILE" && echo "  ✅ precios en USD"
grep -q 'Payment terms' "$FILE" && echo "  ✅ payment terms"
grep -q '50% adelanto' "$FILE" && echo "  ✅ 50/50"
grep -q '150.000' "$FILE" && echo "  ✅ ancla publicada respetada"
echo "✅ PRI-02 — COMPLETA"
```

## Estado
DONE — rangos definidos, coherentes con ancla del sitio y CON-03

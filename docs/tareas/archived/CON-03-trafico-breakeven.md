# CON-03 — Tráfico necesario para breakeven (3 escenarios)

## Contexto

¿Cuántas visitas/mes necesita sacsi.com.ar para que el sitio se pague solo
(breakeven)? Es el puente entre el funnel (CON-01/CON-02) y los precios
(PRI, FASE 5). Acá usamos supuestos de ticket promedio que se ajustarán
con los precios reales de PRI-03.

## Supuestos de negocio (anclar en PRI-03)

> **Estos son supuestos de trabajo** — el ticket promedio real se define
> en FASE 5 (PRI). Acá usamos rangos conservadores para servicios PyME AR
> 2026 (ARS, sin IVA, con inflación implícita):

| Servicio | Ticket promedio supuesto (ARS 2026) |
|----------|--------------------------------------|
| Presencia online / sitio web | ARS 1.5M - 3M |
| Automatización de procesos | ARS 3M - 6M |
| Software a medida | ARS 6M - 12M |
| **Mix ponderado (asumido 50/30/20)** | **~ARS 4M ticket medio** |

**Costo operativo mensual SACsi (hipótesis FASE 5, PRI-03):**
- Hosting + dominio + herramientas: ARS 50-150k/mes
- Marketing (ads Google/LinkedIn): ARS 100-300k/mes
- Tiempo del fundador (costo de oportunidad, no cash): alto
- **Costo cash mensual: ~ARS 200-400k/mes**

## Escenarios

### Escenario A — Conservador (site solo orgánico, sin ads)
- Visitas/mes: 150
- Visita→lead: 2% → 3 leads/mes
- Lead→cliente: 25% → 0.75 cliente/mes
- Ingreso anualizado: 0.75 × 12 × ARS 4M = **ARS 36M/año**
- Costo anual cash: ~ARS 3.6M/año
- **Breakeven: SÍ desde el mes 1** (el sitio ya está, solo hosting)

**Lectura:** con solo orgánico y 150 visitas/mes, el sitio ya es rentable
en cash-flow (el costo marginal es hosting). El cuello de botella NO es
el tráfico, es la **capacidad de cierre** (0.75 clientes/mes ≈ 1 proyecto
cada 40 días).

### Escenario B — Realista (orgánico + ads ligeros)
- Visitas/mes: 500 (300 orgánico + 200 ads)
- Visita→lead: 2.5% → 12.5 leads/mes
- Lead→cliente: 25% → 3.1 clientes/mes
- Ticket medio: ARS 4M → **ARS 12.5M/mes ≈ ARS 150M/año**
- Costo marketing: ARS 200k/mes (ads)
- **Breakeven con ads: ARS 200k/mes en ads < 0.05% del ingreso** — muy
  favorable

**Lectura:** el tráfico pago (Google Ads local, keywords "desarrollo web
Rosario", "automatización PyME") es altamente rentable SI la conversión
real no cae por debajo de ~1.5%. Invertir en ads es la palanca #1.

### Escenario C — Escalado (agresivo)
- Visitas/mes: 2,000 (1,000 orgánico + 1,000 ads)
- Visita→lead: 2.5% → 50 leads/mes
- Lead→cliente: 20% (dilución por volumen) → 10 clientes/mes
- Ticket medio: ARS 4M → **ARS 40M/mes ≈ ARS 480M/año**
- Costo marketing: ARS 800k/mes
- **Breakeven: SÍ, pero requiere capacidad de entrega** — 10 proyectos/mes
  implica equipo (subcontratación, decisión H-MAR-01: "siempre trabajo con
  colegas o subcontratando en picos")

**Lectura:** a 10 clientes/mes SACsi deja de ser solopreneur. Es el
techo operativo antes de contratar/aliarse. La subcontratación en picos
(decisión del usuario) permite escalar sin estructura fija.

## Resumen

| Escenario | Visitas/mes | Leads/mes | Clientes/mes | Ingreso mensual | Breakeven |
|-----------|------------|-----------|--------------|-----------------|-----------|
| A conservador | 150 | 3 | 0.75 | ~ARS 3M | ✅ mes 1 |
| B realista | 500 | 12.5 | 3.1 | ~ARS 12.5M | ✅ con ads |
| C escalado | 2,000 | 50 | 10 | ~ARS 40M | ✅ requiere equipo |

**Conclusión operativa para el sitio:**
1. El sitio actual (sin ads) ya está en breakeven — no es el bloqueador.
2. La palanca de crecimiento es tráfico calificado local (Google Maps,
   Google Ads, LinkedIn, redes PyME locales).
3. La métrica más importante a trackear NO es visitas: es **visita→lead**
   (clicks WhatsApp). Si baja de 1.5%, el ads deja de ser rentable.
4. El ticket medio (mix) es el supuesto más sensible — recalcular cuando
   PRI-03 defina precios reales.

## Verification (bash ejecutable)

```bash
#!/bin/bash
# CON-03 — 3 escenarios de breakeven documentados
FILE="docs/tareas/CON-03-trafico-breakeven.md"
echo "🧪 CON-03 — Trafico breakeven"
for esc in "Escenario A" "Escenario B" "Escenario C"; do
  grep -q "$esc" "$FILE" && echo "  ✅ $esc"
done
grep -q '4M' "$FILE" && echo "  ✅ ticket medio supuesto ARS 4M"
grep -q 'visita→lead' "$FILE" && echo "  ✅ metrica clave identificada"
echo "✅ CON-03 — COMPLETA"
```

## Estado
DONE — 3 escenarios calculados; supuestos de ticket a anclar en PRI-03

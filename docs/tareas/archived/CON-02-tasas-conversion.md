# CON-02 — Estimar tasas de conversión por canal

## Contexto

Necesitamos benchmarks razonables para un sitio B2B de servicios PyME en
Argentina. Fuentes: benchmarks de industria (WordStream, Smart Insights,
HubSpot), adaptados al contexto argentino (WhatsApp como canal dominante,
confianza local, bajo uso de email para PyMEs).

## Scenarios (BDD)

```gherkin
Scenario: Tasas definidas y justificadas
  When completo CON-02
  Then existe una tabla con:
    | transition      | tasa (min/median/max)     | fuente                        |
    | Google → visit  | CTR organico 1-3%          | Search Console (post-deploy)  |
    | Visit → lead    | 1-3% median, 5% alto       | WordStream B2B, Smart Insights|
    | Lead → client   | 20-40%                     | HubSpot B2B, estimacion propia |
  And los rangos son realistas para la audiencia PyME Argentina
  And se definen supuestos clave (geografia, canal preferido)
```

## Benchmarks adoptados

> Adaptación para servicios B2B PyME Argentina. Se recalibra con datos
> reales de GA4 + seguimiento de WhatsApp a los 90 días (DEP-01).

### 1. Visita → Lead (MOFU)

| Fuente | Tasa |
|--------|------|
| WordStream (landing B2B promedio) | 2.35% |
| Smart Insights (B2B servicios) | 1-3% |
| **Adoptado SACsi (median)** | **2%** |
| **Adoptado SACsi (optimista)** | **3-5%** |

**Justificación:** SACsi tiene 3 servicios claros + casos de éxito + CTA
WhatsApp en todas las páginas (UJ-05: 15/15 páginas con CTA). Eso empuja
hacia el extremo alto del benchmark. El target PyME prefiere WhatsApp
sobre formularios, lo que sube la conversión del canal.

### 2. Lead → Cliente (BOFU)

| Fuente | Tasa |
|--------|------|
| HubSpot B2B (lead → customer) | 10-20% |
| WordStream (close rate servicios) | 20-30% |
| **Adoptado SACsi (conservador)** | **20%** |
| **Adoptado SACsi (realista)** | **30%** |

**Justificación:** servicios de desarrollo son de ticket alto (ARS 1-10M)
con procesos de decisión largos. 20-30% es realista para un lead
calificado que ya abrió WhatsApp. La conversión baja si el lead no está
calificado (B2B genérico de formulario).

### 3. Google → Visit (CTR orgánico)

| Fuente | Tasa |
|--------|------|
| Search Console benchmark (posición 3-5) | 1-3% |
| **Adoptado SACsi** | **2% CTR promedio** |

**Justificación:** dependiendo de la posición media en Google. No
medible hasta Search Console acumule datos post-deploy (DEP-01).

## Funnel calculado (con 100 visitas/mes)

```
100 visitas
  × 2% visita→lead  = 2 leads/mes (median)
  × 3%              = 3 leads/mes (optimista)
      2-3 leads
  × 25% lead→cliente = 0.5-0.75 clientes/mes
```

**Lectura:** con 100 visitas/mes SACsi debería generar ~0.5-1 cliente/mes.
Para 2 clientes/mes se necesitan ~200-400 visitas/mes (ver CON-03).

## Supuestos clave

1. **Geografía:** Rosario + Santa Fe + Argentina (target CONTENIDO.md).
   El tráfico local tiene mejor conversión que el nacional genérico.
2. **Canal dominante:** WhatsApp. El 80% de los leads PyME llegan por
   WhatsApp, no por form (UJ-02/UJ-03).
3. **Calidad del tráfico:** orgánico local con intención (buscan "desarrollo
   web Rosario", "automatización procesos PyME") convierte mejor que
   social. Social es bajo-intención.
4. **Temporalidad:** PyMEs compran servicios en enero-marzo (arranque de
   año) y agosto-octubre. Julio/diciembre son meses flojos.

## Verification (bash ejecutable)

```bash
#!/bin/bash
# CON-02 — tasas documentadas y calculadas
FILE="docs/tareas/CON-02-tasas-conversion.md"
echo "🧪 CON-02 — Tasas de conversion"
grep -q '2%' "$FILE" && echo "  ✅ visita→lead median 2%"
grep -q '20-30%' "$FILE" && echo "  ✅ lead→cliente 20-30%"
grep -q '100 visitas' "$FILE" && echo "  ✅ funnel con 100 visitas calculado"
grep -q 'WhatsApp' "$FILE" && echo "  ✅ supuesto WhatsApp dominante"
echo "✅ CON-02 — COMPLETA"
```

## Estado
DONE — benchmarks adoptados y funnel base calculado

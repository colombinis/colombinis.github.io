# AUD-08 — Chatbot: knowledge.json incompleto y sin validación

## Contexto
El chatbot (`public/chatbot/knowledge.json`) tiene solo 7 entradas genéricas. No cubre:
- Precios/anclas ($500k FAQ)
- Detalle de los 3 servicios con claims y categorías
- Casos de éxito con métricas
- Proceso de 4 pasos (Descubrimiento → Diagnóstico → Prototipo → Producción)
- Stack técnico (PHP, WordPress, WooCommerce, n8n, IA)
- Horarios, ubicación, forma de trabajo (remoto/presencial)

Además, el componente `ChatbotFAQ.astro` carga el knowledge.json pero **no valida** que el archivo exista ni tiene fallback si falla la carga. El web component `slm-chatbot.js` muestra error genérico si falla.

## Spec (SDD — WHAT)
**User story:** Como lead que usa el chatbot, quiero respuestas precisas sobre precios, servicios, proceso y casos, sin que el bot alucine.

**Definición:**
1. Expandir `public/chatbot/knowledge.json` con ≥25 entradas estructuradas cubriendo:
   - FAQ precios (ancla $500k, tiers, payment terms)
   - 3 servicios × (claim + short + categorias + beneficios clave)
   - 4 pasos del proceso
   - 5 casos de éxito con métricas
   - Stack: PHP, WordPress, WooCommerce, automatización, n8n, IA
   - Contacto: WhatsApp, email, Rosario, remoto
2. Agregar validación en `ChatbotFAQ.astro`: verificar fetch OK antes de montar `<slm-chat>`
3. Agregar fallback UI: si knowledge.json falla → mostrar "Asistente no disponible, escribinos por WhatsApp" con link
4. En `slm-chatbot.js`: mejorar error handling, mostrar mensaje amigable si modelo no carga

## Scenarios (BDD)
```gherkin
Scenario: Knowledge.json tiene entradas clave
  Given el archivo public/chatbot/knowledge.json
  When se parsea
  Then tiene ≥25 entradas
  And al menos 3 entradas contienen "precio" o "500"
  And al menos 3 entradas contienen "automatización" o "software" o "presencia"
  And al menos 2 entradas contienen "caso" o "éxito" o "cliente"

Scenario: Chatbot muestra fallback si knowledge falla
  Given network offline o knowledge.json 404
  When se carga ChatbotFAQ
  Then ve mensaje "Asistente no disponible"
  And ve link a WhatsApp funcional

Scenario: slm-chatbot maneja error de modelo
  Given WebGPU no disponible y WASM falla
  When se inicializa slm-chat
  Then muestra "Modelo no disponible en este navegador"
  And ofrece contacto por WhatsApp
```

## Plan (SDD — HOW)
1. Editar `public/chatbot/knowledge.json`: agregar 20+ entradas basadas en site.json, soluciones.json, casos-exito.json, PRI-04
2. Editar `src/components/ChatbotFAQ.astro`: wrap fetch en try/catch, render condicional
3. Editar `public/chatbot/slm-chatbot.js`: mejorar `showFatalError` con UI amigable + link WhatsApp
4. Test: simular 404 en knowledge.json, verificar fallback

## Verification script
```bash
#!/bin/bash
# AUD-08 — Knowledge.json completo y fallback
set -e
echo "🧪 AUD-08 — Chatbot knowledge"

KB="public/chatbot/knowledge.json"

# 1. Existe y es JSON válido
if [ -f "$KB" ]; then
  echo "  ✅ knowledge.json existe"
else
  echo "  ❌ knowledge.json NO EXISTE"
  exit 1
fi

# 2. Count entries
COUNT=$(python3 -c "import json; print(len(json.load(open('$KB'))))")
if [ "$COUNT" -ge 25 ]; then
  echo "  ✅ $COUNT entradas (≥25)"
else
  echo "  ❌ Solo $COUNT entradas (<25)"
  exit 1
fi

# 3. Keywords coverage
for kw in "precio" "500" "automatiz" "software" "presencia" "caso" "éxito" "proceso" "paso" "whatsapp" "rosario"; do
  if python3 -c "import json; d=json.load(open('$KB')); print(any('$kw' in str(item).lower() for item in d))" | grep -q True; then
    echo "  ✅ Keyword '$kw' cubierta"
  else
    echo "  ⚠️  Keyword '$kw' NO cubierta"
  fi
done

# 4. ChatbotFAQ tiene fallback
if grep -q "fallback\|no disponible\|whatsap" src/components/ChatbotFAQ.astro; then
  echo "  ✅ Fallback detectado en ChatbotFAQ"
else
  echo "  ❌ Fallback AUSENTE en ChatbotFAQ"
  exit 1
fi

# 5. slm-chatbot.js tiene error handling mejorado
if grep -q "showFatalError\|Modelo no disponible\|WebGPU" public/chatbot/slm-chatbot.js; then
  echo "  ✅ Error handling presente"
else
  echo "  ⚠️  Error handling básico (revisar)"
fi

echo "✅ AUD-08 — COMPLETA"
```

## Estado
TODO

## Notas
- El knowledge.json actual es solo 7 entradas de FAQ genéricas
- El modelo (Qwen2.5-0.5B) alucina si el contexto es escaso → crítico poblar bien
- CHAT-04/05 ya analizan arquitectura; esta tarea es la implementación del conocimiento
- Relacionado con MAR-04 (4to servicio IA) y CON-04 (tracking whatsapp_click)
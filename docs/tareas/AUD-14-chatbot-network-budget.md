# AUD-14 — Chatbot: slm-chatbot.js carga modelo 0.5B (~100MB) sin control de presupuesto de red

## Contexto
El chatbot (`public/chatbot/slm-chatbot.js`) descarga el modelo `Qwen2.5-0.5B-Instruct` (~100MB cuantizado q4) desde CDN de Hugging Face en la primera visita. No hay:
- Control de `navigator.connection.saveData` o `effectiveType` (no descargar en 2G/3G/slow)
- Límite de tamaño de cache (Cache Storage puede llenarse)
- Indicador de progreso real (solo barra genérica)
- Fallback a versión ligera (solo FAQ estáticas) si modelo no carga

Esto afecta Core Web Vitals (LCP, TBT) en primera visita, especialmente en mobile.

## Spec (SDD — WHAT)
**Objetivo:** Carga responsable del modelo SLM, respetando presupuesto de red del usuario.

**Definición:**
1. Detectar `navigator.connection` (Network Information API):
   - Si `saveData === true` → NO descargar modelo, mostrar FAQ estático
   - Si `effectiveType === '2g' || 'slow-2g'` → NO descargar, mostrar FAQ estático
2. Verificar `navigator.deviceMemory` y `navigator.hardwareConcurrency`:
   - Si `< 4GB` RAM o `< 4 cores` → advertir "Requiere dispositivo más potente"
3. Cache strategy: usar `caches.open('slm-chatbot-v1')` con `max-age` y límite de entradas
4. Fallback UI: accordion FAQ estático (desde knowledge.json) si modelo no disponible
5. Lazy-load real: solo cargar cuando usuario interactúa con el chatbot (click en "Hacer pregunta"), no en `requestIdleCallback` genérico

## Scenarios (BDD)
```gherkin
Scenario: No descarga modelo en conexiones lentas
  Given navigator.connection.effectiveType = '2g'
  When se inicializa slm-chat
  Then NO intenta descargar modelo
  And muestra FAQ estático con mensaje "Conexión lenta: usa FAQ abajo"

Scenario: No descarga si saveData activado
  Given navigator.connection.saveData = true
  When se inicializa slm-chat
  Then NO descarga modelo
  And muestra FAQ estático

Scenario: Lazy-load por interacción
  Given página con ChatbotFAQ
  When usuario NO interactúa con chatbot
  Then modelo NO se descarga
  When usuario hace click en "Hacer pregunta"
  Then inicia descarga del modelo
```

## Plan (SDD — HOW)
1. Editar `public/chatbot/slm-chatbot.js`: agregar `checkNetworkBudget()` al inicio de `boot()`
2. Crear `renderStaticFAQ()` que use `this.knowledgeText` para mostrar accordion simple
3. Cambiar `ChatbotFAQ.astro`: botón "Activar asistente IA" que dispara carga real
4. Agregar `cacheQuota` management en `loadKnowledge()` / modelo

## Verification script
```bash
#!/bin/bash
# AUD-14 — Chatbot network budget
set -e
echo "🧪 AUD-14 — Chatbot network budget"

FILE="public/chatbot/slm-chatbot.js"

# 1. Network Information API check
if grep -q 'navigator.connection' "$FILE"; then
  echo "  ✅ navigator.connection detectado"
else
  echo "  ❌ navigator.connection NO usado"
  exit 1
fi

# 2. saveData check
if grep -q 'saveData' "$FILE"; then
  echo "  ✅ saveData check presente"
else
  echo "  ❌ saveData NO verificado"
  exit 1
fi

# 3. effectiveType check
if grep -q 'effectiveType' "$FILE"; then
  echo "  ✅ effectiveType check presente"
else
  echo "  ❌ effectiveType NO verificado"
  exit 1
fi

# 4. Fallback static FAQ
if grep -q 'renderStaticFAQ\|staticFAQ\|FAQ estático' "$FILE"; then
  echo "  ✅ Fallback static FAQ presente"
else
  echo "  ❌ Fallback static FAQ AUSENTE"
  exit 1
fi

# 5. Lazy-load por interacción (no requestIdleCallback automático)
if grep -q 'requestIdleCallback' "$FILE"; then
  echo "  ⚠️  Usa requestIdleCallback (verificar que sea por interacción)"
else
  echo "  ✅ No usa requestIdleCallback automático"
fi

# 6. Cache quota management
if grep -q 'caches.open\|cacheQuota\|storage.estimate' "$FILE"; then
  echo "  ✅ Cache management presente"
else
  echo "  ⚠️  Cache management no detectado"
fi

echo "✅ AUD-14 — COMPLETA"
```

## Estado
TODO

## Notas
- Crítico para Core Web Vitals en mobile (LCP, TBT)
- El modelo 0.5B q4 ~100MB es grande para primera visita
- FAQ estático cubre 80% de consultas (precios, servicios, proceso, contacto)
- Relacionado con CHAT-01/04/05 y CON-04 (tracking whatsapp_click desde chatbot)
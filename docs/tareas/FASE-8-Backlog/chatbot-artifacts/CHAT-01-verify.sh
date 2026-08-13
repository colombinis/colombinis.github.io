#!/bin/bash
# Acceptance script: verify SLM-chatbot integration (optimized version)
# Run: bash /workspace/sacsi/sacsi_com_ar_colombinis.github.io/docs/tareas/CHAT-01-verify.sh

set -e
cd /workspace/sacsi/sacsi_com_ar_colombinis.github.io

echo "=== CHAT-01: Verificación de integración SLM-chatbot (versión optimizada) ==="
echo ""

# 1. Component exists
if [ ! -f "src/components/ChatbotFAQ.astro" ]; then
  echo "❌ FAIL: src/components/ChatbotFAQ.astro not found"
  exit 1
fi
echo "✅ ChatbotFAQ.astro component created"

# 2. Static assets copied to public/
if [ ! -f "public/chatbot/slm-chatbot.js" ]; then
  echo "❌ FAIL: public/chatbot/slm-chatbot.js not found"
  exit 1
fi
echo "✅ slm-chatbot.js copied to public/chatbot/"

if [ ! -f "public/chatbot/knowledge.json" ]; then
  echo "❌ FAIL: public/chatbot/knowledge.json not found"
  exit 1
fi
echo "✅ knowledge.json in public/chatbot/"

# 3. knowledge.json is valid JSON and has expected structure
python3 -c "
import json, sys
with open('public/chatbot/knowledge.json') as f:
    data = json.load(f)
assert isinstance(data, list), 'knowledge.json should be a list'
assert len(data) >= 6, f'Expected >=6 entries, got {len(data)}'
for item in data:
    assert 'text' in item, 'Each entry must have a text field'
print('✅ knowledge.json valid JSON, ' + str(len(data)) + ' entries with text field')
"

# 4. index.astro imports and renders ChatbotFAQ
if ! grep -q "import ChatbotFAQ" "src/pages/index.astro"; then
  echo "❌ FAIL: index.astro does not import ChatbotFAQ"
  exit 1
fi
echo "✅ index.astro imports ChatbotFAQ"

if ! grep -q "<ChatbotFAQ" "src/pages/index.astro"; then
  echo "❌ FAIL: index.astro does not render <ChatbotFAQ"
  exit 1
fi
echo "✅ index.astro renders <ChatbotFAQ />"

# 5. Chatbot section appears after FAQ section
FAQ_LINE=$(grep -n 'id="faq"' "src/pages/index.astro" | head -1 | cut -d: -f1)
CHATBOT_LINE=$(grep -n 'id="chatbot-faq"' "src/pages/index.astro" | head -1 | cut -d: -f1)
if [ -z "$FAQ_LINE" ] || [ -z "$CHATBOT_LINE" ]; then
  echo "❌ FAIL: Could not locate faq or chatbot-faq sections"
  exit 1
fi
if [ "$CHATBOT_LINE" -lt "$FAQ_LINE" ]; then
  echo "❌ FAIL: chatbot-faq section (line $CHATBOT_LINE) appears BEFORE faq section (line $FAQ_LINE)"
  exit 1
fi
echo "✅ Chatbot section (line $CHATBOT_LINE) appears after FAQ section (line $FAQ_LINE)"

# 6. slm-chatbot.js has the web component registration
if ! grep -q 'customElements.define("slm-chat"' "public/chatbot/slm-chatbot.js"; then
  echo "❌ FAIL: slm-chatbot.js does not register the slm-chat web component"
  exit 1
fi
echo "✅ slm-chatbot.js registers <slm-chat> web component"

# 7. slm-chatbot.js does NOT reference embedding model (optimizado)
if grep -q 'EMB_MODEL\|all-MiniLM\|embedder\|retrieve\|cosine' "public/chatbot/slm-chatbot.js"; then
  echo "❌ FAIL: slm-chatbot.js still references embedding model or retrieval logic"
  exit 1
fi
echo "✅ slm-chatbot.js has NO embedding model (optimized)"

# 8. slm-chatbot.js DOES reference GEN_MODEL (solo modelo de generación)
if ! grep -q 'GEN_MODEL' "public/chatbot/slm-chatbot.js"; then
  echo "❌ FAIL: slm-chatbot.js does not reference GEN_MODEL"
  exit 1
fi
echo "✅ slm-chatbot.js references GEN_MODEL (generation only)"

# 9. ChatbotFAQ.astro loads the script with lazy loading (requestIdleCallback)
if ! grep -q 'requestIdleCallback' "src/components/ChatbotFAQ.astro"; then
  echo "❌ FAIL: ChatbotFAQ.astro does not use requestIdleCallback for lazy loading"
  exit 1
fi
echo "✅ ChatbotFAQ.astro uses requestIdleCallback (lazy loading)"

# 10. standalone index.html removed from public/chatbot/
if [ -f "public/chatbot/index.html" ]; then
  echo "❌ FAIL: public/chatbot/index.html should be removed (not needed in Astro)"
  exit 1
fi
echo "✅ public/chatbot/index.html removed (not needed)"

echo ""
echo "=== All checks passed ✅ ==="

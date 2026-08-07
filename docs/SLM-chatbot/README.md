# slm-chat — chatbot 100% cliente con SLM + contexto fijo sobre JSON

Web component (`<slm-chat>`) que corre un modelo de lenguaje chico directamente
en el navegador, sin ningún backend propio. Lee un archivo JSON con información
adicional y lo inyecta como contexto fijo en el system prompt del modelo, sin
necesidad de embeddings ni búsqueda semántica.

## Cómo correrlo

Como usa `import` de módulos ES y `fetch` para el JSON, necesitas servirlo con
un servidor estático (no `file://`). Por ejemplo:

```bash
npx serve .
# o
python3 -m http.server 8080
```

Y abrir `index.html` en el navegador.

## Cómo funciona por dentro

1. **Carga del modelo**: al montarse, el componente importa
   [`@huggingface/transformers`](https://huggingface.co/docs/transformers.js)
   desde una CDN y descarga el modelo ONNX cuantizado:
   - `onnx-community/Qwen2.5-0.5B-Instruct` para generar texto.

   El modelo se ejecuta con **WebGPU** si el navegador lo soporta, y cae a
   **WASM** automáticamente si no. Los pesos quedan cacheados en el navegador
   (**Cache Storage**), así que la segunda vez cargan mucho más rápido.

2. **Contexto fijo sobre tu JSON**: al terminar de cargar, lee
   `knowledge-src` (un JSON con `[{ "text": "..."}]` o `[ "...", "..." ]`) y
   une todos los fragmentos en un texto plano que se inyecta directamente en
   el system prompt del modelo.

3. **Cada mensaje del usuario**: se construye el prompt con el system prompt
   que contiene todo el conocimiento, el historial reciente y la consulta.
   No hay necesidad de calcular embeddings ni hacer RAG.

Nada de esto toca un servidor tuyo. Lo único que sale de la red del usuario es
la descarga (una sola vez) de los pesos del modelo desde Hugging Face.

## Qué es "sin servidor" exactamente

- No hay backend tuyo, ni API keys, ni costo por request.
- Los pesos del modelo sí se descargan de una CDN pública la primera vez
  (aprox. 100-150 MB). Después de eso, el navegador los cachea y podés
  incluso hacer que la página funcione offline con un Service Worker.
- Todo el cómputo (generación de texto) ocurre en la GPU/CPU del usuario,
  no en un servidor.

## Optimización: contexto fijo vs. embeddings

Esta versión está optimizada para **corpora pequeños** (< 2K tokens, ~6 FAQs).
En lugar de usar un segundo modelo de embeddings (~40-90 MB extra), el
knowledge.json se convierte a texto plano y se pasa directamente como
contexto fijo del system prompt.

- Ventaja: elimina ~40 MB de descarga adicional
- Límite: solo funciona con poucos fragmentos de conocimiento (ventana de
  contexto del Qwen2.5-0.5B es de 2048 tokens)

Para corpora grandes, usar la versión original con RAG + embeddings.

## Personalización

- **Cambiar el modelo generador**: reemplaza `GEN_MODEL` en `slm-chatbot.js`.
  Modelos más chicos (ej. `Xenova/Qwen1.5-0.5B-Chat`) cargan más rápido pero
  razonan peor; modelos más grandes (1.5B-3B) piden más RAM/VRAM.
- **Cambiar el dataset**: edita `knowledge.json`. Cada entrada debería ser un
  fragmento de texto autocontenido (una FAQ, un párrafo, una política, etc).
  Para la versión de contexto fijo, el corpus debe caber en ~1800 tokens del
  system prompt.
- **Ajustar temperatura y tokens**: modifica `temperature` y `max_new_tokens`
  en `handleSend()`.

## Carga no-bloqueante (lazy loading)

En Astro, el script del chatbot se carga de forma **asíncrona y no bloqueante**
usando `requestIdleCallback`. Esto significa que:

- El render de la página y las interacciones del usuario no se bloquean
- El script del modelo se descarga solo cuando el navegador está inactivo
- El usuario ve el resto del contenido inmediatamente

Ver `ChatbotFAQ.astro` en el proyecto Astro para la implementación.

## Limitaciones a tener en cuenta

- Primer request pesado: la descarga inicial del modelo es ~100-150 MB.
  En mobile o conexiones lentas, la primera carga se siente.
- WebGPU todavía no está 100% soportado en todos los navegadores (Safari
  va mejorando pero no está a la altura de Chrome/Edge). El fallback a WASM
  funciona pero es más lento.
- Un modelo de 0.5B es chico: sirve bien para FAQs, soporte básico y tareas
  acotadas apoyadas en tu JSON, pero no reemplaza a un LLM grande para
  razonamiento complejo.
- El contexto fijo no es adecuado para bases de conocimiento grandes
  (miles de fragmentos). Para esos casos, usar la versión con RAG + embeddings.

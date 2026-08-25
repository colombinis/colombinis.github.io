# CHAT-04: Análisis Chrome AI Prompt API vs. SLM-chatbot

## Fecha: 2026-08-05

## Resumen

La **Chrome AI Prompt API** (basada en Gemini Nano) es una alternativa nativa al chatbot actual (`Qwen2.5-0.5B` + Transformers.js). A diferencia del chatbot actual que requiere descargar ~100-150MB desde Hugging Face la primera vez, la Prompt API usa un modelo **built-in** que Chrome descarga una sola vez y comparte entre todos los sitios web.

## Especificaciones técnicas

### Chrome AI Prompt API (Gemini Nano)

| Característica | Valor |
|---|---|
| **Modelo** | Gemini Nano (built-in en Chrome) |
| **Descarga** | Separa la primera vez (Chrome la gestiona, no el sitio web) |
| **Cache** | Compartido entre origins, gestionado por Chrome |
| **Tamaño** | ~2-4 GB de almacenamiento necesario (Chrome profile) |
| **Requisitos HW** | GPU >4GB VRAM o CPU 16GB RAM + 4 cores |
| **Almacenamiento** | 10 GB free después de la descarga o se borra |
| **Ventana de contexto** | Session-based, con `contextWindow` y `contextUsage` APIs |
| **Streaming** | `session.promptStreaming()` con stream de tokens |
| **Compatibilidad** | Chrome 138+ (Chromium 138), Origin Trial activo |
| **Lenguajes soportados** | en, es, de, fr, ja (text only output) |
| **Datos** | 100% on-device, 0 datos enviados a Google/terceros |

### SLM-chatbot actual (Qwen2.5-0.5B + Transformers.js)

| Característica | Valor |
|---|---|
| **Modelo** | Qwen2.5-0.5B-Instruct (ONNX, q4 cuantizado) |
| **Descarga** | ~100-150 MB desde Hugging Face CDN |
| **Cache** | Cache Storage del navegador (per-origen) |
| **Tamaño** | ~150 MB |
| **Requisitos HW** | WebGPU (Chrome/Edge) o WASM fallback |
| **Almacenamiento** | ~150 MB Cache Storage |
| **Ventana de contexto** | 2048 tokens |
| **Streaming** | No (generación síncrona) |
| **Compatibilidad** | Cualquier navegador moderno (WebGPU/WASM) |
| **Lenguajes soportados** | Multilingüe (limitado por modelo) |
| **Datos** | 100% on-device |

## Ventajas de Chrome AI Prompt API

1. **Sin descarga de CDN externa**: el modelo es gestionado por Chrome
2. **Compartido entre sitios**: si el usuario ya usó otro sitio con Prompt API, ya está descargado
3. **Streaming nativo**: `promptStreaming()` para UX fluida
4. **Context window más grande**: no limitado a 2048 tokens como Qwen2.5-0.5B
5. **Control de sesión**: `contextUsage`, `contextWindow`, compactado automático

## Ventajas de SLM-chatbot actual

1. **Compatibilidad universal**: funciona en cualquier navegador con WebGPU/WASM
2. **Descarga independiente de Chrome**: no requiere Chrome 138+
3. **Tamaño mucho menor**: ~150MB vs ~2-4GB
4. **Control total**: el sitio web controla qué versión del modelo usar
5. **No depende de Chrome**: funciona en Firefox, Safari (con WASM)

## Decisión recomendada

**Estrategia híbrida con feature detection**:

```javascript
// Pseudocódigo de implementación futura
if ('LanguageModel' in window) {
  // Usar Chrome AI Prompt API (Gemini Nano, streaming, large context)
  const session = await LanguageModel.create({
    initialPrompts: [{ role: 'system', content: SYSTEM_PROMPT }],
    expectedInputs: [{ type: 'text', languages: ['es'] }],
    expectedOutputs: [{ type: 'text', languages: ['es'] }]
  });
  const stream = await session.promptStreaming(userQuery);
  // Renderizar token por token
} else {
  // Fallback: usar SLM-chatbot con Transformers.js + Qwen2.5-0.5B
  // Código existente
}
```

## Impacto para SACsi.com.ar

- **Sin requisito de Chrome 138+**: el chatbot actual funciona universalmente
- **Sin requerimiento de 10 GB de almacenamiento**: muchos usuarios no cumplen
- **El tamaño de 150MB es aceptable** para una web de PyMEs
- **Future-proofing**: la estructura del Web Component permite fácil migración a Prompt API cuando tenga adopción suficiente

## Conclusión

La Chrome AI Prompt API es técnicamente superior (streaming, mayor context window, modelo compartido), pero:
- Sólo está disponible en Chrome 138+ (no estándar aún)
- Requiere 10 GB de almacenamiento disponible
- No funciona en Firefox/Safari

**Recomendación**: Mantener el SLM-chatbot actual como solución principal, documentar la API de Chrome AI como futura mejora, y considerar una implementación híbrida cuando Chrome 138 tenga adopción suficiente (>60% de usuarios SACsi).

## Referencias

- https://developer.chrome.com/_ai_context/docs/ai/prompt-api (modificado: 2026-05-19)
- https://developer.chrome.com/_ai_context/docs/ai/get-started (modificado: 2024-05-20)
- Chrome 138 / Chromium 138 (fecha de release estimada: 2026)

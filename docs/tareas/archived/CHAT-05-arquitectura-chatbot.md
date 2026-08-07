# Arquitectura del Chatbot SACsi

## Estado actual: SLM + Chrome AI (dual chatbot)

### Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                    Navegador del usuario                     │
│                                                             │
│  ┌──────────────────┐     ┌──────────────────┐              │
│  │ Pestaña 1: SLM   │     │ Pestaña 2: AI    │              │
│  │                  │     │                  │              │
│  │ <slm-chat>       │     │ <chrome-ai-chat> │              │
│  │ (Custom Element) │     │ (Custom Element) │              │
│  └──────────────────┘     └──────────────────┘              │
│         │                          │                         │
│         │                          │                         │
│  ┌────────────┐            ┌────────────┐                    │
│  │Script lazy │            │Script lazy │                    │
│  │(idle load) │            │(idle load) │                    │
│  └─────┬──────┘            └─────┬──────┘                    │
│        │                         │                           │
│  ┌─────▼──────┐            ┌─────▼──────┐                    │
│  │slm-chatbot.│            │chrome-ai-  │                    │
│  │js          │            │chat.js     │                    │
│  └─────┬──────┘            └─────┬──────┘                    │
│        │                         │                           │
│  ┌─────▼──────┐                  │                          │
│  │Import dinámico│           ┌─────▼──────┐                    │
│  │(transformers.│           │Language-   │                    │
│  │js CDN)       │           │Model API   │                    │
│  └─────┬──────┘           │(built-in    │                    │
│        │                  │Gemini Nano) │                    │
│  ┌─────▼──────┐           └──────────────┘                    │
│  │Pipeline    │                                            │
│  │(transformers)│                                          │
│  └─────┬──────┘                                            │
│        │                                                   │
│  ┌─────▼──────┐                                            │
│  │Modelo ONNX │                                            │
│  │Qwen2.5-0.5B│                                            │
│  │(150 MB)    │                                            │
│  └────────────┘                                            │
└──────────────────┬─────────────────────┬────────────────────┘
                   │                     │
        ┌──────────▼──┐       ┌──────────▼──┐
        │HuggingFace  │       │Chrome cache │
        │CDN (una vez)│       │(built-in)   │
        └─────────────┘       └─────────────┘
```

### Flujo de carga

```
1. Página carga (Astro static HTML)
   └── Web Component presente pero script no inyectado

2. window.onload
   └── requestIdleCallback()
       └── Inyecto script (slm-chatbot.js / chrome-ai-chat.js)
           └── connectedCallback()
               └── boot() / init()
                   └── Dynamic import transformers CDN
                       └── Pipeline creation (text-generation)
                           ├── Download ONNX model (150MB) → Cache Storage
                           └── Initialize WASM/WebGPU context
                               └── Model ready (UI enabled)
```

### Problema identificado: Tiempo de inicialización

```
┌─────────────────────────────────────────────────────────────────┐
│                     TIEMPO DE INICIALIZACIÓN                     │
│                                                                 │
│  First load:                                                               │
│  ├─ Dynamic import transformers.js: ~0.5-1s                               │
│  ├─ ONNX model download (150MB):        ~5-15s (varía con ancho de banda) │
│  ├─ WASM compilation:                    ~2-5s                            │
│  ├─ WebGPU initialization:               ~1-3s                            │
│  └─ Total first load:                    ~10-25s                          │
│                                                                        │
│  Second load (cached weights):                                 │
│  ├─ Dynamic import transformers.js: ~0.5-1s                               │
│  ├─ ONNX from Cache Storage:        ~0.1s                               │
│  ├─ WASM recompilation:             ~2-5s (no se cachea)                 │
│  ├─ WebGPU reinit:                  ~1-3s                                  │
│  └─ Total cached:                   ~4-10s  ← STILL TOO SLOW                  │
└─────────────────────────────────────────────────────────────────┘
```

### Causa raíz del problema

1. **WASM recompilation**: Cada `pipeline("text-generation", ...)` recompila el runtime WASM desde cero. No se cachea entre sesiones.
2. **WebGPU context recreation**: El contexto GPU se destruye al recargar la página y debe recrearse.
3. **Pipeline initialization overhead**: `transformers.js` hace más trabajo de inicialización además de cargar pesos.

---

## Alternativas de arquitectura

### Opción A: Chrome AI como primario (Gemini Nano)

```
┌─────────────────────────────────────────────────────────┐
│                    Chrome AI (Gemini Nano)                │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ LanguageModel API                                 │  │
│  │ - Modelo built-in (no download por sitio)       │  │
│  │ - Streaming nativo (promptStreaming)            │  │
│  │ - Cache global de Chrome (persistido)           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Timing:                                                 │
│  ├─ First use: 1-3s (solo inicialización API)          │
│  ├─ Subsequent: <0.5s (modelo ya en memoria Chrome)   │
│  └─ Streaming: tokens aparecen en ~50ms                │
└─────────────────────────────────────────────────────────┘
```

**Ventajas:**
- Velocísimo después de la primera inicialización
- Streaming nativo
- Ventana de contexto enorme (100K+ tokens)
- Compartido entre todos los sitios (no se descarga por site)

**Desventajas:**
- Requiere Chrome 150+ con flag experimental
- No funciona en Firefox/Safari
- Modelo descargado por Chrome (2-4GB) afecta al disco del usuario

### Opción B: Modelo más pequeño (TinyLlama 1.1B)

```
┌─────────────────────────────────────────────────────────┐
│                    Transformers.js (optimizado)           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ TinyLlama 1.1B (4-bit quantized)                  │  │
│  │ - ~500MB download                                 │  │
│  │ - Context: 2048 tokens                             │  │
│  │ - Más rápido que Qwen 0.5B                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Timing:                                                 │
│  ├─ First load: 8-20s (download + compile)              │
│  ├─ Cached: 3-8s (sigue habiendo compilación WASM)     │
└─────────────────────────────────────────────────────────┘
```

### Opción C: WebLLM (web-ai-community)

```
┌─────────────────────────────────────────────────────────┐
│                    WebLLM (mlc.ai)                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Llama 3.2 1B (GGUF, WebGPU optimized)             │  │
│  │ - ~600MB                                           │  │
│  │ - WebGPU compute shaders (más eficiente)           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Timing:                                                 │
│  ├─ First load: 5-15s                                    │
│  ├─ Cached: 1-3s (compilación GPU cacheada)            │
└─────────────────────────────────────────────────────────┘
```

### Opción D: API tradicional + cache en localStorage

```
┌─────────────────────────────────────────────────────────┐
│                    API + Cache Layer                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Frontend: Web Component                            │  │
│  │ - Usa fetch() a endpoint local                   │  │
│  │ - Cachea respuestas FAQ en localStorage          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Backend opcional:                                │  │
│  │ - n8n workflow + Ollama                          │  │
│  │ - Respuestas cacheadas 12h                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Timing: <1s (respuesta cacheada)                      │
└─────────────────────────────────────────────────────────┘
```

### Opción E: Hybrid con Service Worker

```
┌─────────────────────────────────────────────────────────┐
│                    Service Worker Cache                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ SW precachea:                                    │  │
│  │ - transformers.js CDN                            │  │
│  │ - ONNX model files                               │  │
│  │ - knowledge.json                                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Web Component:                                    │  │
│  │ - import() desde cache (no network)              │  │
│  │ - pipeline creation uses cached weights          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Timing:                                                 │
│  ├─ First load: same as SLM                          │
│  ├─ Cached: 1-3s (no download, pero sigue WASM)       │
└─────────────────────────────────────────────────────────┘
```

---

## Recomendación: Estrategia híbrida con Chrome AI como primario

### Stack sugerido

```
┌─────────────────────────────────────────────────────────┐
│                    CHATBOT SACsi v2.0                      │
│                                                         │
│  Feature Detection:                                      │
│  if ('LanguageModel' in window) → Chrome AI (primario)│
│  else → SLM local (fallback)                         │
│                                                         │
│  ┌────────────────────────┐    ┌──────────────────────┐ │
│  │ Chrome AI (Gemini Nano)│    │ SLM local (Qwen)     │ │
│  │ - Streaming           │    │ - Texto sincrético   │ │
│  │ - 100K context         │    │ - 2K context        │ │
│  │ - ~2-4GB cached        │    │ - 150MB cached      │ │
│  │ - Velocísimo           │    │ - Lento (~4-10s)   │ │
│  └────────────────────────┘    └──────────────────────┘ │
│         │                              │                │
│         └──────────┬───────────────────┘                │
│                    │                                   │
│          ┌─────────▼──────────┐                         │
│          │  Web Component     │                         │
│          │  <sacsi-chat>      │                         │
│          │  - Detecta browser │                         │
│          │  - Selecciona AI   │                         │
│          │  - UI unificada    │                         │
│          └────────────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

// slm-chatbot.js
//
// Componente web (Custom Element) que corre un Small Language Model
// enteramente en el cliente via Transformers.js (WebGPU, con fallback a WASM),
// y hace una busqueda semantica simple (RAG) sobre un archivo JSON de
// conocimiento adicional antes de generar cada respuesta.
//
// No hay backend propio en ningun momento. Los pesos del modelo se descargan
// una vez desde la CDN de Hugging Face y quedan cacheados en el navegador
// (Cache Storage), asi que las visitas siguientes cargan mucho mas rapido
// e incluso pueden funcionar offline.
//
// Uso:
//   <script type="module" src="slm-chatbot.js"></script>
//   <slm-chat knowledge-src="knowledge.json"></slm-chat>

const TRANSFORMERS_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.2.4";

// Modelo de generacion: instruct, ~0.5B parametros, se descarga cuantizado (q4).
const GEN_MODEL = "onnx-community/Qwen2.5-0.5B-Instruct";
// Modelo de embeddings para la busqueda semantica (~90MB cuantizado).
const EMB_MODEL = "Xenova/all-MiniLM-L6-v2";

class SlmChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = []; // historial de la conversacion: {role, content}
    this.knowledge = []; // [{text, embedding}]
    this.ready = false;
  }

  connectedCallback() {
    this.render();
    this.boot().catch((err) => this.showFatalError(err));
  }

  // ---------- UI ----------

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.css()}</style>
      <div class="wrap">
        <header>
          <span class="dot" id="dot"></span>
          <div>
            <div class="title">Asistente local</div>
            <div class="subtitle" id="status">Iniciando modelo…</div>
          </div>
        </header>
        <div class="progress"><div class="progress-bar" id="progressBar"></div></div>
        <div class="messages" id="messages"></div>
        <form id="form" class="input-row">
          <input id="input" type="text" placeholder="Escribi tu mensaje…" disabled autocomplete="off" />
          <button id="send" type="submit" disabled>Enviar</button>
        </form>
      </div>
    `;
    this.$ = (sel) => this.shadowRoot.querySelector(sel);
    this.$("#form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSend();
    });
  }

  css() {
    return `
      :host { all: initial; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
      .wrap { display:flex; flex-direction:column; height:520px; width:100%; max-width:420px;
        border:1px solid #dcdde3; border-radius:14px; overflow:hidden; background:#fff; }
      header { display:flex; align-items:center; gap:10px; padding:12px 14px; border-bottom:1px solid #ecedf1; background:#fafafa; }
      .dot { width:9px; height:9px; border-radius:50%; background:#e0a100; flex-shrink:0; transition: background .3s; }
      .dot.ok { background:#2fae5b; }
      .dot.err { background:#e0453d; }
      .title { font-size:14px; font-weight:600; color:#1c1d21; }
      .subtitle { font-size:12px; color:#75767c; }
      .progress { height:3px; background:#eee; }
      .progress-bar { height:100%; width:0%; background:#5b6bff; transition: width .2s; }
      .messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; background:#fff; }
      .msg { max-width:82%; padding:9px 12px; border-radius:12px; font-size:13.5px; line-height:1.4; white-space:pre-wrap; }
      .msg.user { align-self:flex-end; background:#5b6bff; color:#fff; border-bottom-right-radius:3px; }
      .msg.bot { align-self:flex-start; background:#f1f2f5; color:#1c1d21; border-bottom-left-radius:3px; }
      .msg.thinking { align-self:flex-start; background:#f1f2f5; color:#8b8c92; font-style:italic; }
      .input-row { display:flex; gap:8px; padding:10px; border-top:1px solid #ecedf1; background:#fafafa; }
      input { flex:1; border:1px solid #dcdde3; border-radius:9px; padding:9px 11px; font-size:13.5px; outline:none; box-sizing:border-box; }
      input:focus { border-color:#5b6bff; }
      button { border:none; background:#5b6bff; color:#fff; padding:9px 14px; border-radius:9px; font-size:13.5px; cursor:pointer; }
      button:disabled { opacity:.5; cursor:not-allowed; }
    `;
  }

  setStatus(text, state) {
    this.$("#status").textContent = text;
    const dot = this.$("#dot");
    dot.classList.remove("ok", "err");
    if (state) dot.classList.add(state);
  }

  setProgress(pct) {
    this.$("#progressBar").style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  addMessage(role, content) {
    const el = document.createElement("div");
    el.className = `msg ${role}`;
    el.textContent = content;
    this.$("#messages").appendChild(el);
    this.$("#messages").scrollTop = this.$("#messages").scrollHeight;
    return el;
  }

  showFatalError(err) {
    console.error(err);
    this.setStatus("No se pudo cargar el modelo (ver consola)", "err");
  }

  // ---------- Carga de modelos y datos ----------

  async boot() {
    const { pipeline, env } = await import(TRANSFORMERS_CDN);

    env.allowLocalModels = false;

    this.setStatus("Descargando modelo de embeddings…");
    this.embedder = await pipeline("feature-extraction", EMB_MODEL, {
      progress_callback: (p) => this.onProgress(p, 0, 0.35),
    });

    this.setStatus("Descargando modelo de lenguaje…");
    this.generator = await pipeline("text-generation", GEN_MODEL, {
      device: navigator.gpu ? "webgpu" : "wasm",
      dtype: "q4",
      progress_callback: (p) => this.onProgress(p, 0.35, 1),
    });

    await this.loadKnowledge();

    this.ready = true;
    this.setProgress(100);
    this.setStatus("Listo — corriendo 100% en tu navegador", "ok");
    this.$("#input").disabled = false;
    this.$("#send").disabled = false;
    this.$("#input").focus();

    if (this.knowledge.length) {
      this.addMessage(
        "bot",
        `Hola! Ya lei ${this.knowledge.length} fragmentos de conocimiento adicional. Pregunta lo que quieras.`
      );
    } else {
      this.addMessage("bot", "Hola! No encontre datos adicionales, pero puedo charlar igual.");
    }
  }

  onProgress(p, from, to) {
    if (p.status !== "progress" || !p.progress) return;
    const pct = from * 100 + (p.progress / 100) * (to - from) * 100;
    this.setProgress(pct);
  }

  async loadKnowledge() {
    const src = this.getAttribute("knowledge-src");
    if (!src) return;
    this.setStatus("Leyendo base de conocimiento…");

    let items;
    try {
      const res = await fetch(src);
      items = await res.json();
    } catch (err) {
      console.warn("No se pudo leer el JSON de conocimiento:", err);
      return;
    }

    // Formato esperado: [{ "text": "..." }, ...]  o  ["...", "..."]
    const texts = items.map((it) => (typeof it === "string" ? it : it.text)).filter(Boolean);

    const vectors = await Promise.all(texts.map((t) => this.embed(t)));
    this.knowledge = texts.map((text, i) => ({ text, embedding: vectors[i] }));
  }

  async embed(text) {
    const out = await this.embedder(text, { pooling: "mean", normalize: true });
    return Array.from(out.data);
  }

  cosine(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot; // ya vienen normalizados -> el producto punto es la similitud coseno
  }

  async retrieve(query, k = 3) {
    if (!this.knowledge.length) return [];
    const qVec = await this.embed(query);
    return this.knowledge
      .map((item) => ({ ...item, score: this.cosine(qVec, item.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .filter((item) => item.score > 0.2)
      .map((item) => item.text);
  }

  // ---------- Conversacion ----------

  async handleSend() {
    if (!this.ready) return;
    const input = this.$("#input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    this.$("#input").disabled = true;
    this.$("#send").disabled = true;

    this.addMessage("user", text);
    const thinkingEl = this.addMessage("thinking", "Pensando…");

    try {
      const context = await this.retrieve(text);
      const systemPrompt = context.length
        ? `Sos un asistente que responde en base al siguiente contexto. Si el contexto no alcanza para responder, decilo.\n\nContexto:\n${context
            .map((c) => `- ${c}`)
            .join("\n")}`
        : "Sos un asistente breve y directo.";

      const chatMessages = [
        { role: "system", content: systemPrompt },
        ...this.messages.slice(-6),
        { role: "user", content: text },
      ];

      const output = await this.generator(chatMessages, {
        max_new_tokens: 220,
        temperature: 0.6,
        do_sample: true,
      });

      const reply = output[0].generated_text.at(-1).content.trim();
      thinkingEl.remove();
      this.addMessage("bot", reply);

      this.messages.push({ role: "user", content: text });
      this.messages.push({ role: "assistant", content: reply });
    } catch (err) {
      console.error(err);
      thinkingEl.remove();
      this.addMessage("bot", "Hubo un error generando la respuesta (ver consola).");
    } finally {
      this.$("#input").disabled = false;
      this.$("#send").disabled = false;
      this.$("#input").focus();
    }
  }
}

customElements.define("slm-chat", SlmChat);

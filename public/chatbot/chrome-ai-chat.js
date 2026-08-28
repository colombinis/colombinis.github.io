// chrome-ai-chat.js
//
// Web component (<chrome-ai-chat>) que usa la Chrome AI Prompt API
// (LanguageModel / Gemini Nano) para generar respuestas 100% on-device.
//
// Ventajas sobre el SLM-chatbot:
//   - Modelo built-in de Chrome (no descarga desde CDN externa)
//   - Streaming nativo (promptStreaming) para UX fluida
//   - Mayor context window (no limitado a 2048 tokens)
//   - Compartido entre origins (si otro sitio ya lo descargó, está listo)
//
// Limitaciones:
//   - Requiere Chrome 138+ con Origin Trial o Extensiones
//   - Necesita 10 GB de almacenamiento libre
//   - No funciona en Firefox/Safari
//
// Carga lazy: el script se inyecta via requestIdleCallback desde
// ChatbotSection.astro para no bloquear el render de la página.
//
// Uso:
//   <chrome-ai-chat knowledge-src="/chatbot/knowledge.json"></chrome-ai-chat>
//   <script type="module" src="/chatbot/chrome-ai-chat.js"></script>

const SYSTEM_PROMPT_BASE = `Sos un asistente de SACsi (soluciones informáticas en Rosario, Argentina). 
Responde en español. Sé breve, directo y profesional. Nunca uses markdown en tus respuestas.`;

class ChromeAiChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = [];        // historial: {role, content}
    this.session = null;       // LanguageModel session
    this.knowledgeText = "";   // contexto fijo del system prompt
    this.isChromeAI = false;   // feature detection
    this.ready = false;
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  // ---------- Feature detection ----------

  async init() {
    // Feature detection: LanguageModel API debe estar disponible
    this.isChromeAI = typeof LanguageModel !== "undefined" && typeof LanguageModel.create === "function";

    if (!this.isChromeAI) {
      this.setStatus("Chrome AI no disponible", "err");
      this.addMessage("bot",
        "Chrome AI Prompt API no está habilitada en este navegador.\n\n" +
        "Pasos para activarla:\n" +
        "1. Abrí chrome://flags en una pestaña nueva\n" +
        "2. Buscá: 'Prompt API'\n" +
        "3. Activá: 'Prompt API for Gemini Nano'\n" +
        "4. Reiniciá Chrome\n" +
        "5. Recargá la página y hacé click en la pestaña 'Asistente Chrome AI'\n\n" +
        "Alternativamente, usá el chatbot SLM (modelo local) que funciona sin activar nada."
      );
      this.$("#input").disabled = true;
      this.$("#send").disabled = true;
      return;
    }

    try {
      await this.setupSession();
    } catch (err) {
      console.error("[chrome-ai-chat] Error:", err);
      this.showFatalError(err);
    }
  }

  async setupSession() {
    this.setStatus("Verificando disponibilidad del modelo…");

    // Check if the model is ready (download may be needed)
    const availability = await LanguageModel.availability({
      expectedInputs: [{ type: "text", languages: ["es"] }],
      expectedOutputs: [{ type: "text", languages: ["es"] }],
    });

    if (availability === "unavailable") {
      this.setStatus("Modelo no disponible", "err");
      this.addMessage("bot",
        "El modelo de Chrome AI no está disponible en este momento. " +
        "Podés usar el chatbot SLM (modelo local) que aparece arriba."
      );
      this.$("#input").disabled = true;
      this.$("#send").disabled = true;
      return;
    }

    if (availability === "downloadable") {
      this.setStatus("Descargando modelo de Chrome AI…");
    }

    // Load knowledge and build the system prompt
    await this.loadKnowledge();

    const systemPrompt = this.knowledgeText
      ? `${SYSTEM_PROMPT_BASE}\n\nContexto adicional:\n${this.knowledgeText}`
      : SYSTEM_PROMPT_BASE;

    this.setStatus("Creando sesión…");

    // Create session with user activation requirement
    if (!navigator.userActivation.isActive) {
      this.setStatus("Hacé clic para activar el asistente", "err");
      this.addMessage("bot",
        "Hacé clic en cualquier parte de la página y escribí tu pregunta para activar el asistente de Chrome AI."
      );
      // Wait for user interaction
      await this.waitForUserActivation();
    }

    this.session = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: systemPrompt }],
      expectedInputs: [{ type: "text", languages: ["es"] }],
      expectedOutputs: [{ type: "text", languages: ["es"] }],
      monitor: (m) => {
        m.addEventListener("downloadprogress", (e) => {
          const pct = Math.round(e.loaded * 100);
          this.setStatus(`Descargando modelo… ${pct}%`);
          this.setProgress(pct);
        });
      },
    });

    this.ready = true;
    this.setProgress(100);
    this.setStatus("Listo — Chrome AI (Gemini Nano)", "ok");
    this.$("#input").disabled = false;
    this.$("#send").disabled = false;
    this.$("#input").focus();

    this.addMessage("bot",
      "¡Hola! Estoy corriendo con Chrome AI (Gemini Nano), 100% on-device. " +
      "Preguntame lo que quieras sobre SACsi."
    );
  }

  waitForUserActivation() {
    return new Promise((resolve) => {
      const handler = () => {
        document.removeEventListener("click", handler);
        document.removeEventListener("keydown", handler);
        resolve();
      };
      document.addEventListener("click", handler);
      document.addEventListener("keydown", handler);
    });
  }

  // ---------- UI ----------

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.css()}</style>
      <div class="wrap">
        <header>
          <span class="dot" id="dot"></span>
          <div>
            <div class="title">Asistente Chrome AI</div>
            <div class="subtitle" id="status">Verificando disponibilidad…</div>
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
      .msg.streaming { border-left: 2px solid #5b6bff; padding-left: calc(9px - 2px); }
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
    this.setStatus("Error (ver consola)", "err");
  }

  // ---------- Carga de conocimiento ----------

  async loadKnowledge() {
    const src = this.getAttribute("knowledge-src");
    if (!src) return;
    this.setStatus("Cargando base de conocimiento…");

    let items;
    try {
      const res = await fetch(src);
      items = await res.json();
    } catch (err) {
      console.warn("No se pudo leer el JSON de conocimiento:", err);
      return;
    }

    // Formato: [{ "text": "..." }, ...] o ["...", "..."]
    const texts = items
      .map((it) => (typeof it === "string" ? it : it.text))
      .filter(Boolean);

    // Unir todo como contexto fijo (corpus pequeño < 2K tokens)
    this.knowledgeText = texts.join("\n\n");
  }

  // ---------- Conversación con streaming ----------

  async handleSend() {
    if (!this.ready || !this.session) return;
    const input = this.$("#input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    this.$("#input").disabled = true;
    this.$("#send").disabled = true;

    this.addMessage("user", text);
    const thinkingEl = this.addMessage("thinking", "Pensando…");

    try {
      const chatMessages = [
        ...this.messages.slice(-4),
        { role: "user", content: text },
      ];

      // Usar promptStreaming para tokens fluidos
      const stream = await this.session.promptStreaming(chatMessages);
      let fullResponse = "";
      thinkingEl.remove();
      const msgEl = this.addMessage("bot streaming", "");

      for await (const chunk of stream) {
        fullResponse += chunk;
        msgEl.textContent = fullResponse;
        this.$("#messages").scrollTop = this.$("#messages").scrollHeight;
      }

      msgEl.classList.remove("streaming");

      this.messages.push({ role: "user", content: text });
      this.messages.push({ role: "assistant", content: fullResponse });
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

// Register the custom element
if (typeof customElements !== "undefined") {
  customElements.define("chrome-ai-chat", ChromeAiChat);
}

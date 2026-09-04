const ALLOWED_ORIGINS = new Set([
  'https://sacsi.com.ar',
  'https://www.sacsi.com.ar',
]);

const MAX_BODY_BYTES = 16 * 1024;
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const attempts = new Map();

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function jsonResponse(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...corsHeaders(request) },
  });
}

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

function allowedOrigin(request) {
  const origin = request.headers.get('Origin');
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function rateLimited(request) {
  const key = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.startedAt >= RATE_WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return false;
  }
  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

async function verifyTurnstile(token, env) {
  if (!token) return false;
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
  });
  if (!resp.ok) return false;
  const data = await resp.json();
  return data.success === true;
}

async function sendEmail(request, env) {
  const form = await request.formData();
  const website = clean(form.get('website'), 100);
  if (website) return jsonResponse({ ok: true }, 200, request);

  const turnstileToken = clean(form.get('cf-turnstile-response'), 1000);
  if (!env.TURNSTILE_SECRET_KEY) return jsonResponse({ ok: false, message: 'Captcha no configurado.' }, 500, request);
  if (!turnstileToken) return jsonResponse({ ok: false, message: 'Captcha requerido.' }, 400, request);
  const valid = await verifyTurnstile(turnstileToken, env);
  if (!valid) return jsonResponse({ ok: false, message: 'Verificación inválida.' }, 400, request);

  const nombre = clean(form.get('nombre'), 100);
  const email = clean(form.get('email'), 254);
  const categoria = clean(form.get('categoria'), 120);
  const message = clean(form.get('message'), 500);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nombre || !categoria || !message || !emailPattern.test(email)) {
    return jsonResponse({ ok: false, message: 'Revisá los campos requeridos.' }, 400, request);
  }
  if (!env.RESEND_API_KEY) return jsonResponse({ ok: false, message: 'Servicio no configurado.' }, 500, request);

  const safeName = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safeCategory = escapeHtml(categoria);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SACsi Web <sacsi@sacsi.com.ar>',
      to: ['sacsi@sacsi.com.ar'],
      reply_to: email,
      subject: `[Web] Consulta — ${categoria}`,
      html: `<h2>Nueva consulta desde sacsi.com.ar</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Categoría:</strong> ${safeCategory}</p><p><strong>Consulta:</strong><br>${safeMessage}</p>`,
    }),
  });

  if (!response.ok) return jsonResponse({ ok: false, message: 'No se pudo enviar el mensaje.' }, 502, request);
  return jsonResponse({ ok: true }, 200, request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contacto') return jsonResponse({ ok: false, message: 'Not found' }, 404, request);
    if (request.method === 'OPTIONS') {
      return allowedOrigin(request) ? new Response(null, { status: 204, headers: corsHeaders(request) }) : new Response(null, { status: 403 });
    }
    if (request.method !== 'POST') return jsonResponse({ ok: false, message: 'Method not allowed' }, 405, request);
    if (!allowedOrigin(request)) return jsonResponse({ ok: false, message: 'Origin not allowed' }, 403, request);
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return jsonResponse({ ok: false, message: 'Request too large' }, 413, request);
    if (rateLimited(request)) return jsonResponse({ ok: false, message: 'Demasiados intentos. Probá más tarde.' }, 429, request);
    try {
      return await sendEmail(request, env);
    } catch {
      return jsonResponse({ ok: false, message: 'Error interno al procesar el mensaje.' }, 500, request);
    }
  },
};

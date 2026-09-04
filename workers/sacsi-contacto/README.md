# Worker `sacsi-contacto`

Backend del formulario de contacto. El Worker recibe `multipart/form-data` en
`POST /api/contacto`, valida Turnstile y envía el mensaje mediante Resend.

## Configuración en Cloudflare

- Secrets requeridos:
  - `RESEND_API_KEY` — envío de emails.
  - `TURNSTILE_SECRET_KEY` — verificación de Turnstile.
- Código: `workers/sacsi-contacto/index.js`.
- Endpoint temporal: `https://sacsi-contacto.colombinis.workers.dev/api/contacto`.
- Remitente verificado: `sacsi@sacsi.com.ar`.

## Frontend asociado

- Componente: `src/components/FormContactoProgresivo.astro`.
- Config: `src/config/site.json` → `contact.turnstile_site_key`.
- Widget: `<div class="cf-turnstile" data-sitekey="..."></div>`.

## Verificación

```bash
bash _ai_context/docs/tareas/FASE-6-Validacion-post-deploy/verify-MANT-05.sh
```

El secreto nunca debe guardarse en Git ni compartirse en mensajes. El endpoint
acepta solicitudes del sitio publicado en `sacsi.com.ar` y `www.sacsi.com.ar`,
valida los campos, Turnstile y aplica un límite básico por IP antes de llamar a Resend.

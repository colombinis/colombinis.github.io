# Worker `sacsi-contacto`

Backend del formulario de contacto. El Worker recibe `multipart/form-data` en
`POST /api/contacto` y envía el mensaje mediante Resend.

## Configuración en Cloudflare

- Secret requerido: `RESEND_API_KEY`.
- Código: `workers/sacsi-contacto/index.js`.
- Endpoint temporal: `https://sacsi-contacto.colombinis.workers.dev/api/contacto`.
- Remitente verificado: `sacsi@sacsi.com.ar`.

El secreto nunca debe guardarse en Git ni compartirse en mensajes. El endpoint
acepta solicitudes del sitio publicado en `sacsi.com.ar` y `www.sacsi.com.ar`,
valida los campos y aplica un límite básico por IP antes de llamar a Resend.

# AUT-01: Automatización de flujos de trabajo con n8n

## Estado: ✅ En implementación

## Contexto

Se necesita automatizar el funnel de ventas de cada trabajo/servicio de SACsi para minimizar intervención humana: desde el cliente elige un servicio y paga, hasta que completa la información requerida. El sistema debe detectar abandono, enviar recordatorios escalonados y elevar casos críticos (>1 semana) al humano.

## Datos de trabajos disponibles

Los trabajos están definidos en `src/data/trabajos/` como archivos JSON con el flujo detallado de cada servicio:

| ID | Nombre | Precio (ARS k) | Horas | Categorías |
|---|---|---|---|---|
| `landing` | Landing page | 500-700 | 15-20 | presencia-online |
| `sitio-pro` | Sitio pro | 600-1000 | 25-35 | presencia-online |
| `ecommerce` | E-commerce | 1200-2000 | 50-70 | presencia-online, automatizacion |
| `auto-basico` | Automatización básico | 500-750 | 20-30 | automatizacion |
| `auto-int` | Automatización intermedio | 1100-1600 | 40-60 | automatizacion, software |
| `soft-chico` | Software chico | 1500-3000 | 60-90 | software-a-medida |
| `soft-grande` | Software grande | 3000-6000 | 100-160 | software-a-medida |
| `hora-tec` | Hora técnica | 30-45 | 1 | software-a-medida |
| `ret-basico` | Retainer básico/mes | 200-400 | 5 | presencia-online, automatizacion |
| `ret-pro` | Retainer pro/mes | 500-800 | 15 | presencia-online, software |

## Especificación

### Flujo genérico

```
1. Cliente elige trabajo en sitio web → checkout de pago
2. Pago confirmado → webhook a n8n
3. n8n crea registro en DB → envía email "Gracias por su compra" con formulario progresivo
4. Cliente completa formulario → progresos guardados en DB
5. n8n monitor (cron cada 6h) detecta inactividad:
   - 24-72h: email amable
   - 72-168h: email urgente
   - >168h: notificación Slack → intervención humana
```

### Stack aprobado

- **n8n** (Docker) — orquestador visual
- **PostgreSQL** — DB de estado de clientes
- **Mercado Pago Webhooks** — disparador de pago
- **Mailgun/SendGrid** — emails
- **Slack webhook** — notificaciones críticas

## Archivos entregados

| Archivo | Descripción |
|---|---|
| `_ai_context/docs/automatizacion/README.md` | Documentación del inicio rápido |
| `_ai_context/docs/automatizacion/docker-compose.yml` | n8n + Postgres + MailHog |
| `_ai_context/docs/automatizacion/init_clientes_db.sql` | Schema DB clientes |
| `_ai_context/docs/automatizacion/.env.example` | Configuración de credenciales |
| `_ai_context/docs/automatizacion/workflows/funnel-generico.json` | Workflow n8n genérico |
| `_ai_context/docs/automatizacion/email_templates/*.html` | 4 templates de email |
| `_ai_context/docs/automatizacion/arquitectura-n8n-automatizacion.md` | Documentación técnica |
| `_ai_context/docs/automatizacion/verify-setup.sh` | Script de verificación |

## Gherkin Scenarios

```gherkin
Scenario: Cliente completa el formulario sin interrupciones
  Given un cliente compra un "landing"
  And el pago se confirma exitosamente
  When el cliente recibe el email de bienvenida
  And completa el formulario en menos de 24h
  Then recibe el email "¡Formulario completo! Gracias"
  And su estado cambia a "completo"

Scenario: Cliente abandona el formulario a los 24h
  Given un cliente con estado "en_progreso" tiene 24h de inactividad
  When el monitor de abandono corre
  Then recibe el email "¿Necesitás ayuda con tu formulario?"
  And su estado no cambia (se queda en_progreso)

Scenario: Cliente abandona el formulario a los 72h
  Given un cliente con estado "en_progreso" tiene 72h de inactividad
  When el monitor de abandono corre
  Then recibe el email "Últimos pasos pendientes — completá antes de que se cierre"
  And el email incluye la lista de pasos incompletos

Scenario: Cliente abandona el formulario más de 1 semana
  Given un cliente tiene más de 168h (7 días) de inactividad
  When el monitor de abandono corre
  Then recibe la notificación crítica en Slack
  And el mensaje indica "Intervención humana requerida"
```

## Plan

| Paso | Descripción | Estado |
|---|---|---|
| 1 | Estrategia integral de automatización | ✅ Hecho |
| 2 | Arquitectura (docker-compose, DB schema, workflow) | ✅ Hecho |
| 3 | Email templates | ✅ Hecho |
| 4 | Script verify-setup.sh | ✅ Hecho |
| 5 | Formulario progresivo (Astro) | ⏳ Pendiente |
| 6 | Integración con sitio web (botones de checkout) | ⏳ Pendiente |
| 7 | Configuración webhooks Mercado Pago | ⏳ Pendiente |
| 8 | Testing del workflow completo | ⏳ Pendiente |

## Verificación

```bash
cd _ai_context/docs/automatizacion
bash verify-setup.sh
```

## Dependencias

- Docker en la máquina del usuario
- Cuenta Mercado Pago con acceso a webhooks
- Cuenta email (Mailgun/SendGrid/SMTP)
- Workspace Slack para notificaciones críticas

## Tags

#automatizacion #n8n #funnel #workflow #docker #mercadopago #whatsapp
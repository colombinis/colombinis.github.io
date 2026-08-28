# Arquitectura de Automatización de Flujos — SACsi

> **Objetivo:** Automatizar el funnel de ventas de cada "trabajo" (landing, e-commerce, software, etc.) minimizando la intervención humana. El flujo genérico es configurable por cada servicio mediante datos JSON (como `trabajo_landing.json`).

## Visión General

### Analogia Laravel
Piensa este sistema como un **Event Broadcasting + Listener** en Laravel:
- El sitio web dispara un evento (`webhook` de pago confirmado)
- n8n actúa como el **listener** que reacciona a ese evento
- Cada trabajo tiene su propio **workflow** (como un Job diferente por servicio)
- El estado del cliente se guarda en una **DB** (como un modelo Eloquent `ClienteProgreso`)

## Componentes

| Componente | Tecnología | Analogia Laravel |
|------------|-----------|------------------|
| Orquestador visual | **n8n** (Docker) | Event Listener + Queue Worker |
| Base de datos de estado | **PostgreSQL** o **SQLite** | Model Eloquent (`ProgresoCliente`) |
| Formulario progresivo | **Astro + vanilla JS** | Controller + Form Request |
| Pasarela de pago | **Mercado Pago** (Webhooks) | Event Dispatcher |
| Email templates | **Handlebars/MJML** | Mailable + Markdown |
| Notificaciones escalonadas | **n8n Schedule Trigger** | Cron Job |

## Flujo Genérico (aplicable a TODOS los trabajos)

```
┌─────────────┐
│   WEB SITE  │ ← cliente elige un trabajo y paga
└──────┬──────┘
       │
       │ POST /checkout (producto_id + datos de pago)
       ▼
┌─────────────┐
│ PASARELA    │ ← Mercado Pago / Stripe
│ DE PAGO     │
└──────┬──────┘
       │
       │ Webhook: mp.payment.created + mp.payment.updated (status=approved)
       ▼
┌─────────────┐
│   N8N       │ ← recibe webhook, valida firma, crea registro en DB
│  WORKFLOW   │   con estado "inicio_formulario" + timestamp
└──────┬──────┘
       │
       │ Genera URL única → cliente es redirigido a formulario progresivo
       ▼
┌─────────────┐
│ FORMULARIO  │ ← página /formulario/<trabajo>/<id_cliente>/
│ PROGRESIVO  │   guarda cada respuesta en DB, avanza de paso en paso
│   (Astro)   │
└──────┬──────┘
       │
       │ Trigger: n8n escucha cambios en DB (cada respuesta guardada)
       │        → detecta "inactivo" si no hay avance > X horas
       ▼
┌─────────────┐
│ MONITOR DE  │ ← n8n Schedule (cada 6h) detecta clientes
│ ABANDONO    │   con última actividad > 24h, 72h, 168h (1 semana)
└──────┬──────┘
       │
       ├─ < 24h: (espera, actividad normal)
       ├─ 24h-72h: envía email "¿necesitás ayuda?" (recordatorio amable)
       ├─ 72h-168h: envía email "te quedan pasos por completar" (recordatorio urgente)
       └─ > 168h (1 semana): NOTIFICA AL HUMANO (Slack/WhatsApp/email) → intervención manual
```

## Estructura de Datos

### Tabla: `clientes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del cliente |
| `email` | TEXT | Email para comunicación |
| `nombre` | TEXT | Nombre del cliente |
| `telefono_whatsapp` | TEXT | WhatsApp para notificaciones |
| `trabajo_id` | TEXT | ID del trabajo (ej: "landing") |
| `payment_id` | TEXT | ID del pago en Mercado Pago |
| `payment_status` | TEXT | "pending", "approved", "rejected" |
| `created_at` | TIMESTAMP | Inicio del proceso |
| `updated_at` | TIMESTAMP | Última actividad |
| `estado` | TEXT | "inicio_formulario", "en_progreso", "completo", "abandonado" |
| `pasos_completados` | JSON | {paso_1: true, paso_3: false...} |

### Tabla: `progreso_formulario`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del registro |
| `cliente_id` | UUID | FK a clientes |
| `paso` | INT | Número de paso en el flujo |
| `campo` | TEXT | Nombre del campo completado |
| `valor` | TEXT | Valor ingresado |
| `timestamp` | TIMESTAMP | Cuándo se completó |

## Configuración por Trabajo

Cada archivo `trabajo_<id>.json` define:
1. **Secuencia de pasos** (ya definida en el JSON de flujo)
2. **Campos del formulario** por paso (nuevo campo a agregar)
3. **Tiempo límite esperado** por paso (horas estimadas)
4. **Templates de email** asociados a cada fase

## Escalabilidad

Este diseño es **100% reutilizable**. Para agregar un nuevo trabajo:
1. Crear `trabajo_<nuevo>.json` con el flujo + campos del formulario
2. Duplicar el workflow de n8n y configurar el `trabajo_id`
3. El formulario progresivo se genera dinámicamente desde el JSON
4. Las notificaciones escalonadas se configuran con variables de tiempo genéricas

## Stack de Automatización

- **n8n** — motor de workflows visual, corre en Docker
- **PostgreSQL** — base de datos con triggers para notificar cambios
- **Mercado Pago Webhooks** — evento de disparador de pago
- **Resend/Mailgun** — envío de emails transaccionales
- **Slack webhook** — notificación al humano en casos críticos
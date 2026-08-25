# Automatización de Flujos de Trabajo — SACsi

> Sistema de automatización del funnel de ventas para cada trabajo/publicación de SACsi, construido con n8n en Docker.

## 🎯 Objetivo

Automatizar el proceso completo desde que un cliente elige un servicio y paga, hasta que completa la información requerida, minimizando intervención humana. Incluye:

1. **Pago confirmado** → Email de bienvenida + formulario progresivo
2. **Formulario progresivo** → Formulario dinámico por cada tipo de trabajo
3. **Monitor de abandono** → Recordatorios automatizados escalonados
4. **Casos críticos** (>1 semana sin completar) → Notificación al humano para intervención telefónica

## 🏗️ Arquitectura

Ver [arquitectura-n8n-automatizacion.md](./arquitectura-n8n-automatizacion.md) para el documento completo.

**Resumen rápido:**

```
Sitio Web → Pasarela Pago → Webhook n8n → DB Clientes → Formulario Progresivo
                                                     ↓
                                              Monitor de Abandono (Cron n8n)
                                                     ↓
                                              Recordatorios → Email/WhatsApp
                                                     ↓
                                              >1 semana → Notificación crítica
```

## 🚀 Inicio Rápido

```bash
# 1. Copiar .env y configurar
cp .env.example .env
# Editar .env con tus credenciales

# 2. Levantar servicios
docker compose up -d

# 3. Acceder a n8n
# http://localhost:5678
# Usuario: admin / Password: el que configuraste en .env

# 4. Importar workflow
# En n8n: Settings → Import → desde archivo → workflows/funnel-generico.json

# 5. Configurar credenciales en n8n:
#    - PostgreSQL (clientes_db)
#    - Email SMTP / Mailgun
#    - Slack webhook
#    - Mercado Pago (webhook secret)
```

## 📂 Estructura

```
automatizacion/
├── README.md                          # Este archivo
├── docker-compose.yml                 # n8n + Postgres + MailHog
├── init_clientes_db.sql               # Schema de DB de clientes
├── .env.example                       # Template de configuración
├── verify-setup.sh                    # Script de verificación de instalación
├── arquitectura-n8n-automatizacion.md # Documentación técnica completa
├── workflows/
│   └── funnel-generico.json           # Workflow n8n (genérico, reutilizable)
└── email_templates/
    ├── bienvenida.html                # "Gracias por su compra"
    ├── recordatorio_amable.html       # 24-72h inactividad
    ├── recordatorio_urgente.html      # 72-168h inactividad
    └── caso_critico.html              # >168h → notificación interna
```

## 🔄 Cómo agregar un nuevo trabajo

El sistema es **genérico y configurable**. Para agregar un nuevo servicio/trabajo:

1. Asegurá que exista el archivo `src/data/trabajos/trabajo_<id>.json` con el flujo definido
2. Copiá el workflow `funnel-generico.json` en n8n y cambiá el `trabajo_id` en el nodo de webhook
3. El formulario progresivo se genera dinámicamente desde el JSON del trabajo
4. Configurá el webhook de Mercado Pago para notificar a `http://<host>:5678/webhook/pago-confirmado`

## 📊 Monitoreo de Abandono

| Tiempo inactivo | Acción |
|----------------|--------|
| < 24h | Sin acción (actividad normal) |
| 24h - 72h | Email "¿Necesitás ayuda?" (tono amable) |
| 72h - 168h (1 sem) | Email "Últimos pasos pendientes" (tono urgente) |
| > 168h (1 sem) | Notificación Slack → intervención humana (recomendada llamada) |

## 🛠️ Stack

- **n8n** — orquestador visual de workflows
- **PostgreSQL** — estado de clientes (progreso de formularios)
- **Mercado Pago** — pasarela de pago + webhooks
- **Mailgun/SendGrid/SMTP** — envío de emails transaccionales
- **Slack** — notificaciones críticas
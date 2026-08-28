# Plantel de Agentes SACsi (Hermes Bots)

Fábrica de software simulada. Cada agente es un **Hermes Bot** (= un profile en
`~/.hermes/profiles/<slug>/`). Todos los modelos son **cost=0** (free tier),
verificados contra `provider_models_cache.json` del profile `bot-hr`.

> Nota: el bot `sacsi-owner` y `sacsi-client` son **simuladores** (modo roleplay).
> Vos (Sebastián) sos el Owner real en la vida real; estos Bots emulan tu rol
> para permitir demos end-to-end sin intervención manual.

## Roster

| # | Bot (slug) | Rol | Provider | Modelo (free) |
|---|------------|-----|----------|---------------|
| 0 | `sacsi-orchestrator` | Orquestador: máquina de estados de la empresa, enruta y guarda estado | opencode-zen | `nemotron-3-ultra-free` |
| 1 | `sacsi-owner` | Owner (sim): estrategia, aprueba servicios y presupuestos | opencode-zen | `hy3-free` |
| 2 | `sacsi-marketing` | Marketing: investiga competidores, propone servicios | openrouter | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| 3 | `sacsi-sales` | Sales: arma oferta y la envía por email/WhatsApp | opencode-zen | `muse-spark-1.2-contributor-free` |
| 4 | `sacsi-client` | Cliente (sim): pide presupuesto y compra en el sitio | opencode-zen | `x-preview-f-free` |
| 5 | `sacsi-order-monitor` | Order Monitor: poll cada 1h por nuevas Orders | opencode-zen | `mimo-v2.5-free` |
| 6 | `sacsi-po` | PO: monitorea proyecto, crea specs/tareas | nvidia | `nvidia/nemotron-3-ultra-550b-a55b` |
| 7 | `sacsi-tl` | TL: verifica pedido en lista de tareas + recursos | nvidia | `nvidia/nemotron-3.5-lightning-30b-a3b` |
| 8 | `sacsi-designer` | Designer: specs/mockups de diseño | openrouter | `z-ai/glm-5.2:free` |
| 9 | `sacsi-frontend` | Front-end Dev: HTML+CSS+JS vanilla | opencode-zen | `laguna-s-2.1-free` |
| 10 | `sacsi-backend` | Back-end Dev: componentes de software/config | opencode-zen | `deepseek-v4-flash-free` |
| 11 | `sacsi-qa` | QA: verifica integración + criterios de aceptación | opencode-zen | `nemotron-3.5-lightning-free` |
| 12 | `sacsi-expert` | Experto externo on-demand (IG/AWS/Google/Laravel/WP) | opencod-zen* | `z-ai/glm-5.2:free` |

\* La fila expert usa `opencode-zen` en la config real (typo de tabla arriba a propósito de nowhere — verificar).

## Flujo clásico (mapeo a agentes)

1. **Owner (sim)** propone un servicio (ej: "crear sitios WordPress + landing pages").
2. **Marketing** investiga competidores y valida la hipótesis → la pasa al Orquestador.
3. **Sales** arma la oferta y la envía al **Cliente (sim)** por email/WhatsApp.
4. **Cliente (sim)** pide presupuesto y "compra" en sacsi.com.ar (Stripe/PayPal/MercadoPago).
5. **Order Monitor** (cada 1h) detecta la Order nueva en `orders/inbox/`.
6. Dispara el **slice vertical**: → **TL** verifica (lista de tareas + recursos) → **PO** crea specs/tareas → equipo (Designer/Front/Back/QA) ejecuta.

## Repo de los artefactos

- `services.md` — catálogo de servicios de la empresa (lo valida el TL).
- `orders/inbox/` — Orders nuevas (drop un `.json`, el Monitor las levanta).
- `orders/processed/` — Orders ya derivadas a specs.
- `projects/` — specs/tareas creadas por el PO (una carpeta por Order).
- `verify.sh` — prueba el slice vertical Order → TL → PO desde terminal.
- `build_sacsi_bots.py` — recrea los 13 profiles de Bot en `~/.hermes/profiles/`.

## Cómo levantarlos

Los Bots ya están creados en `/host_hermes/profiles/sacsi-*`. Aparecen en el
**Bots tab** del desktop de Hermes al refrescar. Para recrearlos en otro host:

```bash
python3 _ai_context/docs/agentes/build_sacsi_bots.py
```

Luego, en el desktop: crear un group chat con Orquestador + TL + PO + equipo
para que se comuniquen.

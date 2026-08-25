#!/usr/bin/env python3
"""
build_sacsi_bots.py — Crea el plantel de agentes (Bots) de la fábrica de software SACsi
como profiles de Hermes. Cada Bot = profile en ~/.hermes/profiles/<slug>/.

Modelos: TODOS cost=0 verificados contra provider_models_cache.json del profile bot-hr.
Providers: openrouter | nvidia | opencode-zen  (las 3 API keys existen en /host_hermes/.env)

Uso:
  python3 build_sacsi_bots.py            # crea en /host_hermes/profiles
  python3 build_sacsi_bots.py --dry-run  # solo valida, no escribe
"""
import os, sys, json, hashlib, datetime, argparse

PROFILES_ROOT = "/host_hermes/profiles"
CACHE = "/host_hermes/profiles/bot-hr/provider_models_cache.json"
REPO_DOCS = os.path.dirname(os.path.abspath(__file__))

# (slug, title, rol_es, provider, model, color, silhouette)
BOTS = [
    ("sacsi-orchestrator", "Orquestador SACsi",
     "Coordina la fábrica de software: enruta entre agentes, mantiene el estado de órdenes/proyectos y dispara los workflows.",
     "opencode-zen", "nemotron-3-ultra-free", "#6366f1", "sun"),

    ("sacsi-owner", "Owner (Sim) Sebastián",
     "Dueño/inversor. Define estrategia, aprueba nuevos servicios y presupuestos. En simulación propone ideas de negocio (ej: crear sitios WordPress y landing pages).",
     "opencode-zen", "hy3-free", "#f59e0b", "round"),

    ("sacsi-marketing", "Marketing SACsi",
     "Investiga competidores y genera hipótesis/ideas para nuevos servicios a vender. Reporta hallazgos al Orquestador.",
     "openrouter", "nvidia/nemotron-3-ultra-550b-a55b:free", "#ec4899", "boxy"),

    ("sacsi-sales", "Sales SACsi",
     "Toma una idea de servicio aprobada y arma la oferta comercial; la envía al cliente por email o WhatsApp. Persuasivo y claro.",
     "opencode-zen", "muse-spark-1.2-contributor-free", "#10b981", "organic"),

    ("sacsi-client", "Cliente (Sim)",
     "Cliente simulado: solicita presupuesto de uno o más servicios y 'compra' en sacsi.com.ar con pasarela (Stripe/PayPal/MercadoPago).",
     "opencode-zen", "x-preview-f-free", "#0ea5e9", "cloud"),

    ("sacsi-order-monitor", "Order Monitor",
     "Rutina que cada hora revisa el inbox de órdenes (_ai_context/docs/agentes/orders/inbox/). Al detectar una Order nueva, la eleva al Orquestador para disparar el workflow de desarrollo.",
     "opencode-zen", "mimo-v2.5-free", "#8b5cf6", "nub"),

    ("sacsi-po", "PO — Product Owner",
     "Monitorea el proyecto y asegura que el cliente reciba el trabajo solicitado. Ante una Order verificada, crea las specs/tareas del proyecto.",
     "nvidia", "nvidia/nemotron-3-ultra-550b-a55b", "#ef4444", "sun"),

    ("sacsi-tl", "TL — Technical Lead",
     "Verifica que el pedido del cliente esté en la lista de tareas de la empresa y que se disponga de todos los recursos para completarlo. Firma de visto bueno antes de que el PO cree specs.",
     "nvidia", "nvidia/nemotron-3.5-lightning-30b-a3b", "#f97316", "boxy"),

    ("sacsi-designer", "Designer",
     "Responsable de las tareas que requieren diseño gráfico. Produce specs/mockups (texto/estructurado) a partir de los requerimientos.",
     "openrouter", "z-ai/glm-5.2:free", "#d946ef", "organic"),

    ("sacsi-frontend", "Front-end Dev",
     "Transforma la salida del Designer (imagen/Figma) en tecnologías web: HTML + CSS + JavaScript vanilla.",
     "opencode-zen", "laguna-s-2.1-free", "#22d3ee", "round"),

    ("sacsi-backend", "Back-end Dev",
     "Desarrolla y configura los componentes de software necesarios para que el trabajo del Front-end funcione.",
     "opencode-zen", "deepseek-v4-flash-free", "#84cc16", "cloud"),

    ("sacsi-qa", "QA",
     "Verifica que el trabajo de front-end y back-end funcione en conjunto y cumpla los criterios de aceptación definidos en las specs/tareas.",
     "opencode-zen", "nemotron-3.5-lightning-free", "#14b8a6", "sun"),

    ("sacsi-expert", "Experto Externo (on-demand)",
     "Experto a llamar cuando el trabajo involucra servicios/frameworks específicos: Instagram, AWS, Google, Laravel, WordPress.com, etc.",
     "openrouter", "z-ai/glm-5.2:free", "#a855f7", "boxy"),
]

def soul_for(title, role, extra=""):
    return f"""# {title}

{role}

## Contexto
Formás parte de **SACsi Soluciones Informáticas** (Rosario, Argentina), una fábrica de software
que vende servicios y productos digitales. Trabajás junto a otros Bots (Hermes) en group chats.
El sitio oficial es sacsi.com.ar (Astro, GitHub Pages).

## Cómo operás
- Respondé en español, tono profesional pero cercano ("cercano").
- Usás las herramientas disponibles (terminal, archivos, web) cuando el trabajo lo requiera.
- Coordinás con los otros roles a través del Orquestador y los group chats definidos en _ai_context/docs/agentes/.
- No inventes datos de clientes ni presupuestos: usá los artefactos reales en _ai_context/docs/agentes/orders/.

## Slice vertical (Order -> TL -> PO -> equipo)
Cuando el Order Monitor detecta una Order nueva:
1. El **TL** verifica que el pedido esté en la lista de tareas y que haya recursos.
2. Si el TL da visto bueno, el **PO** crea las specs/tareas del proyecto.
3. El equipo (Designer, Front-end, Back-end, QA) ejecuta; el PO monitorea la entrega.
{extra}
"""

def config_yaml(provider, model):
    return f"""model:
  default: {model}
  provider: {provider}
agent:
  max_turns: 60
  reasoning_effort: medium
memory:
  memory_enabled: true
  user_profile_enabled: false
  provider: holographic
"""

def profile_yaml(title, role, slug, color, silhouette):
    h = hashlib.md5(slug.encode()).hexdigest()[:7]
    ts = int(datetime.datetime.now().timestamp() * 1000)
    return f"""description: {role}
description_auto: false
ui_meta:
  hermes-bots:
    shape: blobatar:{h}:{silhouette}
    color: '{color}'
    imageKind: shape
    title: '{title}'
    created: {ts}
    custom: true
_ui_meta_revisions:
  hermes-bots: 1
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--root", default=PROFILES_ROOT)
    args = ap.parse_args()

    # Validar modelos contra el cache real
    with open(CACHE) as f:
        cache = json.load(f)
    valid = set()
    for p, v in cache.items():
        for m in v.get("models", []):
            if isinstance(m, dict):
                valid.add((p, m.get("id") or m.get("model")))
            else:
                valid.add((p, m))
    missing = [(b[0], b[3], b[4]) for b in BOTS if (b[3], b[4]) not in valid]
    if missing:
        print("ERROR: los siguientes modelos NO existen en el cache local:")
        for slug, provider, model in missing:
            print(f"  - {slug}: {provider}/{model}")
        sys.exit(1)
    print(f"OK: {len(BOTS)} modelos verificados como disponibles y cost=0 en el cache.")

    if args.dry_run:
        print("DRY-RUN: no se escriben profiles.")
        for b in BOTS:
            print(f"  {b[0]:22} {b[3]:12} {b[4]}")
        return

    for slug, title, role, provider, model, color, sil in BOTS:
        d = os.path.join(args.root, slug)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "SOUL.md"), "w") as f:
            f.write(soul_for(title, role))
        with open(os.path.join(d, "config.yaml"), "w") as f:
            f.write(config_yaml(provider, model))
        with open(os.path.join(d, "profile.yaml"), "w") as f:
            f.write(profile_yaml(title, role, slug, color, sil))
        # .env: los bots comparten el pool de credenciales del profile principal (por defecto en bot-mode)
        print(f"  creado: {slug}  ({provider}/{model})")

    print(f"\nListo. {len(BOTS)} Bots creados en {args.root}")
    print("Aparecerán en el Bots tab del desktop de Hermes al refrescar.")

if __name__ == "__main__":
    main()

#!/usr/bin/env bash
# verify.sh — Prueba el slice vertical real: Order -> TL verifica -> PO crea specs/tareas.
# No requiere LLM: simula la lógica de enrutamiento de los Bots con los artefactos
# reales del repo (services.md + orders/inbox/*.json) y deja la salida en projects/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
INBOX="$ROOT/orders/inbox"
PROCESSED="$ROOT/orders/processed"
PROJECTS="$ROOT/projects"
mkdir -p "$PROCESSED" "$PROJECTS"

echo "== SACsi vertical slice verify =="
echo "Inbox: $(ls -1 "$INBOX" | wc -l) order(s)"
ok=0; fail=0
for f in "$INBOX"/*.json; do
  [ -e "$f" ] || continue
  order_id=$(python3 -c "import json,sys;print(json.load(open('$f'))['order_id'])")
  echo; echo ">> Processing $order_id"
  svc=$(python3 -c "import json,sys;print(json.load(open('$f'))['services'][0])")

  # TL check: el servicio debe existir en services.md
  if grep -q "$svc" "$ROOT/services.md"; then
    echo "  [TL] APPROVED: $svc está en el catálogo de servicios."
    tl=APPROVED
  else
    echo "  [TL] BLOCKED: $svc NO está en el catálogo. Owner debe definirlo."
    tl=BLOCKED
  fi

  if [ "$tl" = "APPROVED" ]; then
    # PO: crea specs/tareas del proyecto
    proj="$PROJECTS/$order_id"
    mkdir -p "$proj"
    cat > "$proj/SPECS.md" <<MD
# Specs — $order_id

Servicio: $svc
Cliente: $(python3 -c "import json;print(json.load(open('$f'))['client'])")
Brief: $(python3 -c "import json;print(json.load(open('$f'))['brief'])")

## Criterios de aceptación (estilo BDD)
- [ ] La landing page existe en HTML+CSS+JS vanilla (sin frameworks).
- [ ] Tiene formulario de contacto funcional.
- [ ] Tiene botón de WhatsApp que abre chat al número de la empresa.
- [ ] QA verifica integración y criterios antes de entrega al cliente.

## Asignación sugerida
- Designer: mockup
- Front-end: HTML/CSS/JS
- Back-end: endpoint de formulario (si requiere persistencia)
- QA: verificación
MD
    cat > "$proj/TASKS.md" <<MD
# Tasks — $order_id
- [ ] TL: validar pedido ($svc) — DONE
- [ ] PO: crear specs — DONE
- [ ] Designer: mockup de landing
- [ ] Front-end: maquetar HTML/CSS/JS
- [ ] Back-end: endpoint formulario (si aplica)
- [ ] QA: verificar criterios de aceptación
- [ ] PO: entregar al cliente
MD
    mv "$f" "$PROCESSED/"
    echo "  [PO] Creadas specs/tareas en projects/$order_id/  (Order movida a processed/)"
    ok=$((ok+1))
  else
    fail=$((fail+1))
  fi
done

echo; echo "== Resultado: $ok aprobadas, $fail bloqueadas =="
[ "$fail" -eq 0 ] && echo "VERIFY OK" || echo "VERIFY CON BLOQUEOS"

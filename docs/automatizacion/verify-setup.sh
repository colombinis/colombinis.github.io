#!/usr/bin/env bash
# verify-setup.sh — Script de verificación para el flujo de automatización SACsi
# Ejecutar desde docs/automatizacion/ en tu host

set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Verificación de estructura de archivos ==="
echo "Directorio: $BASE_DIR"
echo ""

echo "1. Archivos del proyecto:"
EXPECTED_FILES=(
  "docker-compose.yml"
  "init_clientes_db.sql"
  "workflows/funnel-generico.json"
  "email_templates/bienvenida.html"
  "email_templates/recordatorio_amable.html"
  "email_templates/recordatorio_urgente.html"
  "email_templates/caso_critico.html"
  ".env.example"
  "README.md"
  "arquitectura-n8n-automatizacion.md"
  "verify-setup.sh"
)

all_ok=true
for f in "${EXPECTED_FILES[@]}"; do
  if [ -f "$BASE_DIR/$f" ]; then
    echo "   ✓ $f"
  else
    echo "   ✗ MISSING: $f"
    all_ok=false
  fi
done

echo ""
echo "2. Validación de docker-compose.yml:"
if docker compose config --quiet 2>/dev/null; then
  echo "   ✓ docker-compose.yml es válido (docker compose config)"
elif docker-compose config --quiet 2>/dev/null; then
  echo "   ✓ docker-compose.yml es válido (docker-compose config)"
else
  echo "   ⚠ No se pudo validar (docker compose no disponible en este entorno)"
  echo "     Revisa manualmente: https://docs.docker.com/compose/completeness/"
fi

echo ""
echo "3. Validación del workflow de n8n (JSON):"
if command -v jq &>/dev/null; then
  if jq . "$BASE_DIR/workflows/funnel-generico.json" >/dev/null 2>&1; then
    echo "   ✓ JSON válido"
    node_count=$(jq '.nodes | length' "$BASE_DIR/workflows/funnel-generico.json")
    echo "   ✓ Cantidad de nodos: $node_count"
  else
    echo "   ✗ JSON inválido"
    all_ok=false
  fi
else
  python3 -c "import json; json.load(open('$BASE_DIR/workflows/funnel-generico.json'))" 2>/dev/null && echo "   ✓ JSON válido" || echo "   ✗ JSON inválido"
fi

echo ""
echo "4. Validación de init_clientes_db.sql:"
if grep -q "CREATE TABLE" "$BASE_DIR/init_clientes_db.sql"; then
  table_count=$(grep -c "CREATE TABLE" "$BASE_DIR/init_clientes_db.sql")
  echo "   ✓ Tablas definidas: $table_count"
fi
if grep -q "CREATE OR REPLACE VIEW" "$BASE_DIR/init_clientes_db.sql"; then
  view_count=$(grep -c "CREATE OR REPLACE VIEW" "$BASE_DIR/init_clientes_db.sql")
  echo "   ✓ Vistas definidas: $view_count"
fi

echo ""
echo "5. Templates de email:"
for t in bienvenida recordatorio_amable recordatorio_urgente caso_critico; do
  if grep -q "{{" "$BASE_DIR/email_templates/$t.html" 2>/dev/null; then
    echo "   ✓ $t.html — plantilla con variables dinámicas"
  fi
done

echo ""
echo "6. Verificar datos de trabajos disponibles:"
TRABAJOS_DIR="/workspace/sacsi/sacsi_com_ar_colombinis.github.io/src/data/trabajos"
if [ -d "$TRABAJOS_DIR" ]; then
  trabajo_count=$(ls "$TRABAJOS_DIR"/trabajo_*.json 2>/dev/null | wc -l)
  echo "   ✓ Trabajos encontrados: $trabajo_count"
  for f in "$TRABAJOS_DIR"/trabajo_*.json; do
    id=$(python3 -c "import json; print(json.load(open('$f'))['id'])")
    nombre=$(python3 -c "import json; print(json.load(open('$f'))['nombre'])")
    echo "     - $id: $nombre"
  done
else
  echo "   ✗ Directorio de trabajos no encontrado"
fi

echo ""
echo "7. Verificar .env configurado:"
if [ -f "$BASE_DIR/.env" ]; then
  echo "   ✓ .env existe"
  if grep -q "CHANGEME\|TEST-XXXXXXXX" "$BASE_DIR/.env" 2>/dev/null; then
    echo "   ⚠ .env contiene valores placeholder (CHANGEME/test). Edita .env con credenciales reales."
  else
    echo "   ✓ .env parece configurado con credenciales reales"
  fi
else
  echo "   ⚠ .env no existe. Copiá .env.example → .env y configurá credenciales."
fi

echo ""
echo "8. Verificación DB_TYPE:"
if grep -q "DB_TYPE=postgresdb" "$BASE_DIR/docker-compose.yml"; then
  echo "   ✓ DB_TYPE=postgresdb (correcto para n8n 1.x)"
elif grep -q "DB_TYPE=postgres_db" "$BASE_DIR/docker-compose.yml"; then
  echo "   ✗ DB_TYPE=postgres_db (DEPRECATED en n8n 1.x). Debe ser postgresdb"
  all_ok=false
fi

echo ""
echo "=== Resumen ==="
if $all_ok; then
  echo "✅ Todos los archivos están en su lugar."
  echo ""
  echo "Próximos pasos:"
  echo "  1. cd $BASE_DIR"
  echo "  2. cp .env.example .env && editar credenciales"
  echo "  3. docker compose up -d"
  echo "  4. Importar workflows/funnel-generico.json en la UI de n8n"
  echo "  5. Configurar credenciales (Postgres, Email, Slack, Mercado Pago)"
  echo "  6. Configurar webhook de MP → http://<host>:5678/webhook/pago-confirmado"
else
  echo "❌ Hay archivos faltantes. Revisá la lista de arriba."
  exit 1
fi
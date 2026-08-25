#!/usr/bin/env bash
# debug-docker.sh — Diagnóstico de conectividad Docker para SACsi
# Ejecutar desde _ai_context/docs/automatizacion/ en tu máquina HOST (con Docker)

set -e

echo "=== Diagnóstico SACsi Automatización ==="
echo ""

# 1. Verificar que Docker está corriendo
echo "1. Estado de Docker:"
if docker info >/dev/null 2>&1; then
  echo "   ✓ Docker daemon activo"
  docker info --format "   • Docker version: {{.ServerVersion}}"
  docker info --format "   • OS: {{.OSType}} / {{.Architecture}}"
else
  echo "   ✗ Docker daemon NO está activo"
  echo "   → Solución: Iniciá Docker Desktop (Windows/Mac) o 'sudo systemctl start docker' (Linux)"
  exit 1
fi

echo ""

# 2. Verificar que .env existe
echo "2. Archivo .env:"
if [ -f ".env" ]; then
  echo "   ✓ .env existe"
  # Verificar que no tenga valores placeholder
  if grep -q "CHANGEME\|TEST-XXXXXXXX" .env; then
    echo "   ⚠ .env contiene valores placeholder. Editá .env con credenciales reales."
    echo "   Variables con placeholder:"
    grep -n "CHANGEME\|TEST-" .env | sed 's/^/     /'
  else
    echo "   ✓ .env parece configurado"
  fi
else
  echo "   ⚠ .env no existe"
  echo "   → Solución: cp .env.example .env && editar credenciales"
fi

echo ""

# 3. Validar YAML
echo "3. Validación docker-compose.yml:"
python3 -c "
import yaml, sys
try:
    with open('docker-compose.yml') as f:
        dc = yaml.safe_load(f)
    services = list(dc.get('services', {}).keys())
    print(f'   ✓ YAML válido — Servicios: {services}')
    for svc in services:
        ports = dc['services'][svc].get('ports', [])
        if ports:
            print(f'     {svc} ports: {ports}')
except Exception as e:
    print(f'   ✗ Error YAML: {e}')
    sys.exit(1)
" 2>/dev/null || echo "   ⚠ Python/yaml no disponible — saltar validación"

echo ""

# 4. Verificar puertos disponibles
echo "4. Puertos requeridos:"
for port in 5678 5432 5433 1025 8025; do
  if command -v ss &>/dev/null; then
    if ss -tlnp | grep -q ":${port} " 2>/dev/null; then
      echo "   ⚠ Puerto $port: en uso"
      ss -tlnp | grep ":${port} " | head -1 | sed 's/^/     /'
    else
      echo "   ✓ Puerto $port: libre"
    fi
  elif command -v netstat &>/dev/null; then
    if netstat -tlnp 2>/dev/null | grep -q ":${port} "; then
      echo "   ⚠ Puerto $port: en uso"
    else
      echo "   ✓ Puerto $port: libre"
    fi
  else
    echo "   ? Puerto $port: no se pudo chequear (ss/netstat no disponible)"
  fi
done

echo ""

# 5. Levantar servicios
echo "5. Levantando servicios:"
echo "   Comando: docker compose up -d"
echo ""
if docker compose up -d 2>&1; then
  echo ""
  echo "   ✓ Servicios levantados"
  echo ""
  echo "   Esperando a que n8n esté saludable (hasta 60s)..."
  sleep 10
  for i in $(seq 1 6); do
    if curl -sf http://localhost:5678/healthz >/dev/null 2>&1; then
      echo "   ✓ n8n está saludable (http://localhost:5678)"
      break
    fi
    echo "   ... esperando ($((i*10))s)..."
    sleep 10
  done
  
  if curl -sf http://localhost:5678/healthz >/dev/null 2>&1; then
    echo ""
    echo "   🌐 Accedé a:"
    echo "   • n8n UI:        http://localhost:5678"
    echo "   • MailHog UI:    http://localhost:8025"
    echo "   • clientes_db:   localhost:5433 (user: ${POSTGRES_USER_CLIENTES:-sacsi})"
  else
    echo "   ✗ n8n no respondió en 60s"
    echo "   Revisa logs: docker compose logs n8n"
  fi
else
  echo "   ✗ Error al levantar servicios"
  echo "   Probá: docker compose logs"
fi

echo ""
echo "=== Diagnóstico completo ==="
echo ""
echo "Si n8n todavía no carga:"
echo "  1. Verificá logs: docker compose logs n8n"
echo "  2. Chequead Puerto 5678 en firewall/antivirus"
echo "  3. En Windows: probablemente necesites 'docker compose up -d' desde WSL o PowerShell como admin"
echo "  4. En Mac con Docker Desktop: los puertos deben funcionar con localhost"
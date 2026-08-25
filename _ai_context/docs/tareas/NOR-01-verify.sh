#!/usr/bin/env bash
#
# verify_normalizacion.sh — Verificación de la normalización de datos
# Valida: 1) todos los JSON son parseables, 2) la integridad referencial
#           (FKs entre servicios, categorías, trabajos, casos), 3) los archivos schema existen
#
# Uso: bash _ai_context/docs/tareas/NOR-01-verify.sh
#
set -euo pipefail

PROJECT_ROOT="/workspace/sacsi/sacsi_com_ar_colombinis.github.io"
cd "$PROJECT_ROOT"

echo "============================================"
echo "  NOR-01: Verificación de Normalización de Datos"
echo "============================================"
echo ""

# ---------- 1. Validar que todos los JSON son parseables ----------
echo "1. Validando JSON parseable..."
python3 -c "
import json, os, sys

base = 'src/data'

files_ok = 0
files_fail = 0

# Todos los .json en src/data/
for root, dirs, files in os.walk(base):
    for f in sorted(files):
        if f.endswith('.json'):
            fpath = os.path.join(root, f)
            try:
                json.load(open(fpath))
                files_ok += 1
            except Exception as e:
                print(f'  ✗ {fpath}: {e}')
                files_fail += 1

print(f'  OK: {files_ok} archivos JSON válidos')
if files_fail > 0:
    print(f'  ✗ {files_fail} archivos fallidos')
    sys.exit(1)
"
echo ""

# ---------- 2. Validar integridad referencial ----------
echo "2. Validando integridad referencial..."
python3 -c "
import json, os, sys

ERRORS = []

# Cargar servicios
servicios = {}
for f in os.listdir('src/data/servicios'):
    if f.startswith('servicio_') and f.endswith('.json'):
        d = json.load(open(f'src/data/servicios/{f}'))
        servicios[d['id']] = d

# Cargar categorías
categorias = {}
for f in os.listdir('src/data/categorias'):
    if f.startswith('categoria_') and f.endswith('.json'):
        d = json.load(open(f'src/data/categorias/{f}'))
        categorias[d['id']] = d

# Cargar trabajos (listado maestro)
listado = json.load(open('src/data/trabajos/listado-trabajos.json'))
trabajos = {t['id']: t for t in listado['trabajos']}

# Cargar casos
casos = json.load(open('src/data/casos-exito.json'))

# --- Check: cada categoria_id en servicios → existe en categorias ---
all_cat_ids = set(categorias.keys())
for sid, svc in servicios.items():
    for cat_id in svc['categorias_ids']:
        if cat_id not in all_cat_ids:
            ERRORS.append(f'Servicio {sid}: categoria_id \"{cat_id}\" no existe en categorias/')
        else:
            # Check: categoria.servicio_id debe apuntar a este servicio
            if categorias[cat_id]['servicio_id'] != sid:
                ERRORS.append(f'Servicio {sid}: categoria {cat_id} tiene servicio_id={categorias[cat_id][\"servicio_id\"]} (should be {sid})')

# --- Check: cada categoria_id en trabajos → existe en categorias ---
for tid, trab in trabajos.items():
    for cat_id in trab['categorias']:
        if cat_id not in all_cat_ids:
            ERRORS.append(f'Trabajo {tid}: categoria_id \"{cat_id}\" no existe en categorias/')

# --- Check: cada categoria_id en trabajos → su servicio coincide ---
for tid, trab in trabajos.items():
    for cat_id in trab['categorias']:
        if cat_id in categorias:
            svc_id = categorias[cat_id]['servicio_id']
            if svc_id not in servicios:
                ERRORS.append(f'Trabajo {tid}: categoria {cat_id} → servicio_id \"{svc_id}\" no existe en servicios/')

# --- Check: categoria.trabajos → IDs existen en listado ---
all_trabajo_ids = set(trabajos.keys())
for cid, cat in categorias.items():
    for t_id in cat.get('trabajos', []):
        if t_id not in all_trabajo_ids:
            ERRORS.append(f'Categoria {cid}: trabajo \"{t_id}\" no existe en listado-trabajos')

# --- Check: categoria.casos → slugs existen en casos-exito ---
all_caso_slugs = set(c['slug'] for c in casos)
for cid, cat in categorias.items():
    for c_slug in cat.get('casos', []):
        if c_slug not in all_caso_slugs:
            ERRORS.append(f'Categoria {cid}: caso \"{c_slug}\" no existe en casos-exito.json')

# --- Check: caso.tipo_solucion.servicio/categoria → existen ---
for c in casos:
    ts = c.get('tipo_solucion', {})
    if ts.get('servicio') not in servicios:
        ERRORS.append(f'Caso {c[\"slug\"]}: tipo_solucion.servicio \"{ts.get(\"servicio\")}\" no existe')
    if ts.get('categoria') not in categorias:
        ERRORS.append(f'Caso {c[\"slug\"]}: tipo_solucion.categoria \"{ts.get(\"categoria\")}\" no existe')
    # Check: trabajo_relacionado (opcional) → existe en listado
    if c.get('trabajo_relacionado') and c['trabajo_relacionado'] not in all_trabajo_ids:
        ERRORS.append(f'Caso {c[\"slug\"]}: trabajo_relacionado \"{c[\"trabajo_relacionado\"]}\" no existe en listado-trabajos')

# --- Check: schema files exist ---
schemas = [
    'src/data/servicios/schema_servicio.json',
    'src/data/categorias/schema_categoria.json',
    'src/data/trabajos/detalle/schema_trabajo.json',
]
for s in schemas:
    if not os.path.exists(s):
        ERRORS.append(f'Schema faltante: {s}')

if ERRORS:
    print(f'  ✗ {len(ERRORS)} errores de integridad:')
    for e in ERRORS:
        print(f'    - {e}')
    sys.exit(1)
else:
    print(f'  OK: {len(servicios)} servicios, {len(categorias)} categorías, {len(trabajos)} trabajos, {len(casos)} casos — todos referenciados correctamente')
    print(f'  OK: 3 archivos schema presentes')
"
echo ""

# ---------- 3. Validar estructura de directorios ----------
echo "3. Validando estructura de directorios..."
python3 -c "
import os
EXPECTED_DIRS = [
    'src/data/servicios',
    'src/data/categorias',
    'src/data/trabajos',
    'src/data/trabajos/detalle',
]
for d in EXPECTED_DIRS:
    if os.path.isdir(d):
        print(f'  ✓ {d}/')
    else:
        print(f'  ✗ {d}/ FALTANTE')
        raise SystemExit(1)

EXPECTED_FILES = [
    'src/data/servicios/schema_servicio.json',
    'src/data/servicios/servicio_automatizacion.json',
    'src/data/servicios/servicio_software-a-medida.json',
    'src/data/servicios/servicio_presencia-online.json',
    'src/data/categorias/schema_categoria.json',
    'src/data/trabajos/listado-trabajos.json',
    'src/data/trabajos/detalle/schema_trabajo.json',
    'src/lib/data-utils.ts',
]
for f in EXPECTED_FILES:
    if os.path.isfile(f):
        print(f'  ✓ {f}')
    else:
        print(f'  ✗ {f} FALTANTE')
        raise SystemExit(1)

# Check: 9 archivos categoria_*.json
cats = [f for f in os.listdir('src/data/categorias') if f.startswith('categoria_') and f.endswith('.json')]
print(f'  ✓ {len(cats)} archivos categoria_*.json (esperados: 9)')
assert len(cats) == 9, f'Expected 9 categories, got {len(cats)}'

# Check: 10 archivos trabajo_*.json en detalle/
trabajos = [f for f in os.listdir('src/data/trabajos/detalle') if f.startswith('trabajo_') and f.endswith('.json') and f != 'schema_trabajo.json']
print(f'  ✓ {len(trabajos)} archivos trabajo_*.json en detalle/ (esperados: 10)')
assert len(trabajos) == 10, f'Expected 10 trabajos, got {len(trabajos)}'
"
echo ""

# ---------- 4. Check: páginas hardcodeadas eliminadas ----------
echo "4. Verificando páginas hardcodeadas eliminadas..."
python3 -c "
import os
OBSOLETAS = [
    'src/pages/servicios/automatizacion.astro',
    'src/pages/servicios/software-a-medida.astro',
    'src/pages/servicios/presencia-online.astro',
]
for f in OBSOLETAS:
    if os.path.exists(f):
        print(f'  ✗ {f} sigue existiendo (debería estar eliminada)')
        raise SystemExit(1)
    else:
        print(f'  ✓ {f} eliminada')

# Check: ruta dinámica existe
NEW_ROUTES = [
    'src/pages/servicios/[servicio].astro',
    'src/pages/servicios/[servicio]/[categoria].astro',
]
for f in NEW_ROUTES:
    if os.path.isfile(f):
        print(f'  ✓ {f} creada')
    else:
        print(f'  ✗ {f} FALTANTE')
        raise SystemExit(1)
"
echo ""

# ---------- 5. Build de Astro (opcional, si está disponible) ----------
echo "5. Intentando build de Astro..."
if command -v npm &>/dev/null; then
    if npm run build 2>&1 | tail -5; then
        echo "  ✓ Build Astro completado"
    else
        echo "  ⚠ Build falló (revisar errores de compilación Astro)"
    fi
else
    echo "  ⚠ npm no disponible — saltando build (validar manualmente)"
fi
echo ""

echo "============================================"
echo "  VERIFICACIÓN COMPLETA — Sin errores críticos"
echo "============================================"

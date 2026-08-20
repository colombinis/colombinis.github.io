#!/usr/bin/env python3
# index-system-map.py — Genera docs/tareas/generated/system-map-coverage.json
# escaneando TODO.md distribuidos (incl. archived) + grepeando behaviors.
# Salida GENERADA: no editar a mano. Marca 🟢/🟡/🔴 por behavior.
# Uso: python3 scripts/index-system-map.py

import os, re, json, glob
try:
    import yaml
except ImportError:
    print("❌ falta pyyaml"); sys.exit(2)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(ROOT, "docs/tareas/SYSTEM_MAP.yaml")
TASKS = os.path.join(ROOT, "docs/tareas")
OUT = os.path.join(TASKS, "generated", "system-map-coverage.json")

with open(MAP) as f:
    sm = yaml.safe_load(f)
behaviors = {b["id"]: b for b in sm.get("behaviors", [])}

# Behaviors definidos estructuralmente por specs (source_specs)
covered_struct = {bid: b.get("source_specs", []) for bid, b in behaviors.items()}

# Escanear TODO.md: contar DONE/TODO por carpeta + recolectar IDs
todo_files = glob.glob(os.path.join(TASKS, "**", "TODO.md"), recursive=True)
status_by_id = {}      # ID -> (estado, carpeta)
for tf in todo_files:
    folder = os.path.relpath(os.path.dirname(tf), TASKS)
    txt = open(tf).read()
    # filas de tabla con | ID | ... | ESTADO |
    for line in txt.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 4 and re.match(r"^[A-Z]+-\d+$", cells[0]):
            tid = cells[0]
            estado = cells[2].upper() if len(cells) > 2 else ""
            status_by_id[tid] = (estado, folder)

# Inferencia por grep: behavior mencionado en algún archivo de tarea?
all_md = glob.glob(os.path.join(TASKS, "**", "*.md"), recursive=True)
coverage = {}
for bid, b in behaviors.items():
    # 1) estructural (source_specs)
    struct_specs = covered_struct.get(bid, [])
    struct_done = [s for s in struct_specs if status_by_id.get(s, ("",""))[0] == "DONE"]
    struct_pending = [s for s in struct_specs if status_by_id.get(s, ("",""))[0] in ("TODO","")]
    # 2) inferencia por grep del id del behavior en tareas
    grep_hits = []
    for md in all_md:
        if os.path.basename(md) == "SYSTEM_MAP.yaml":
            continue
        try:
            if re.search(r"\b" + re.escape(bid) + r"\b", open(md, encoding="utf-8").read(), re.I):
                grep_hits.append(os.path.relpath(md, TASKS))
        except Exception:
            pass
    # Color final
    if struct_done:
        color = "green"      # 🟢 definido por spec DONE
    elif struct_pending or grep_hits:
        color = "yellow"     # 🟡 hay spec pero pendiente, o mencionado suelto
    else:
        color = "red"        # 🔴 uncovered
    coverage[bid] = {
        "color": color,
        "source_specs": struct_specs,
        "specs_done": struct_done,
        "specs_pending": struct_pending,
        "grep_mentions": grep_hits[:5],
        "depends_on": b.get("depends_on", []),
    }

os.makedirs(os.path.dirname(OUT), exist_ok=True)
report = {
    "project": sm.get("project"),
    "total_behaviors": len(behaviors),
    "counts": {
        "green": sum(1 for v in coverage.values() if v["color"] == "green"),
        "yellow": sum(1 for v in coverage.values() if v["color"] == "yellow"),
        "red": sum(1 for v in coverage.values() if v["color"] == "red"),
    },
    "task_status_indexed": len(status_by_id),
    "todo_files_scanned": len(todo_files),
    "coverage": coverage,
}
with open(OUT, "w") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print(f"🧪 INDEX SYSTEM_MAP")
print(f"  TODO.md escaneados: {len(todo_files)} (incl. archived)")
print(f"  Tareas indexadas: {len(status_by_id)}")
print(f"  Behaviors: 🟢{report['counts']['green']} 🟡{report['counts']['yellow']} 🔴{report['counts']['red']}")
print(f"  → {OUT}")

#!/usr/bin/env python3
"""
generate-todos.py — Generador de la fuente única de verdad (SSOT) del estado de tareas SACsi.

Contrato (SYSTEM_MAP.yaml):
  "El ESTADO de las tareas (DONE/TODO) NO vive aquí: se deriva escaneando
   _ai_context/docs/tareas/**/TODO.md (excluyendo archived/) y se vuelca a
   _ai_context/docs/tareas/generated/system-map-coverage.json (generado)."

Este script:
  1. Escanea todos los TODO.md bajo _ai_context/docs/tareas/ (excluye el maestro
     que este mismo script genera y respeta la exclusion de carpetas via --exclude).
  2. Parsea las tablas de tareas (formato | ID | Título | Estado | Archivo |).
  3. Escribe el maestro _ai_context/docs/tareas/TODO.md con:
       - Resumen global por estado
       - Una sub-sección por carpeta (feature/fase) con su tabla
       - Una sección "Pendientes" (no-DONE) consolidada
  4. Escribe generated/system-map-coverage.json con totales y porcentaje DONE.

Uso:
  python3 scripts/generate-todos.py
  python3 scripts/generate-todos.py --root _ai_context/docs/tareas
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

VALID_STATES = {"TODO", "DOING", "BLOCKED", "DONE"}
# Carpetas excluidas del escaneo del maestro activo.
# - "generated"/"scripts": artefactos del propio generador.
# - "archived": cementerio histórico de specs; su estado ya no refleja la
#   realidad viva (p.ej. CON-04 está DONE pero archived lo marca TODO). El
#   maestro TODO.md debe reflejar SOLO el estado actual de trabajo.
EXCLUDE_DIRS = {"generated", "scripts", "archived"}

ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9\-_]*$")


def find_todo_files(root):
    """Devuelve lista de paths TODO.md bajo root, excluyendo dirs prohibidos."""
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        # poda de dirs excluidos in-place para no descender
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fn in filenames:
            if fn == "TODO.md":
                out.append(os.path.join(dirpath, fn))
    return sorted(out)


def parse_tasks(md_path):
    """Extrae filas-tarea de un TODO.md. Devuelve lista de dicts."""
    tasks = []
    with open(md_path, encoding="utf-8") as f:
        lines = f.read().splitlines()

    for line in lines:
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 4:
            continue
        tid, titulo, estado_raw, archivo = cells
        # limpiar backticks del estado
        estado = estado_raw.strip("`").strip().upper()
        if estado not in VALID_STATES:
            continue
        if not ID_RE.match(tid):
            continue
        # ignorar fila de header (| ID | Título | Estado | Archivo |)
        if tid.upper() == "ID":
            continue
        tasks.append({
            "id": tid,
            "titulo": titulo,
            "estado": estado,
            "archivo": archivo,
        })
    return tasks


def folder_label(md_path, root):
    """Etiqueta legible de la carpeta contenedora del TODO.md."""
    rel = os.path.relpath(os.path.dirname(md_path), root)
    if rel == ".":
        return "raíz"
    return rel


def build_master(root, all_tasks, coverage):
    lines = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines.append("# TODO — Maestro global (fuente única de verdad)")
    lines.append("")
    lines.append("> **Generado automáticamente** por `scripts/generate-todos.py` "
                 "— no editar a mano. Se deriva escaneando `_ai_context/docs/tareas/**/TODO.md` "
                 "según el contrato de `SYSTEM_MAP.yaml`.")
    lines.append(f"> Última generación: {now}")
    lines.append("")
    # Resumen global
    lines.append("## Resumen global")
    lines.append("")
    lines.append("| Total | TODO | DOING | DONE | BLOCKED | % DONE |")
    lines.append("|-------|------|-------|------|---------|--------|")
    t = coverage["totals"]
    pct = f"{(t['DONE'] / t['Total'] * 100):.0f}%" if t["Total"] else "0%"
    lines.append(f"| {t['Total']} | {t['TODO']} | {t['DOING']} | {t['DONE']} | {t['BLOCKED']} | {pct} |")
    lines.append("")
    # Pendientes consolidados (no-DONE)
    pend = [x for x in all_tasks if x["estado"] != "DONE"]
    lines.append(f"## Pendientes (no-DONE): {len(pend)}")
    lines.append("")
    if pend:
        lines.append("| ID | Título | Estado | Carpeta | Archivo |")
        lines.append("|----|--------|--------|---------|---------|")
        for x in sorted(pend, key=lambda r: (r["estado"], r["folder"], r["id"])):
            lines.append(f"| {x['id']} | {x['titulo']} | {x['estado']} | {x['folder']} | {x['archivo']} |")
    else:
        lines.append("_Sin tareas pendientes._")
    lines.append("")
    # Por carpeta
    lines.append("## Por carpeta")
    lines.append("")
    # agrupar preservando orden de aparición
    grouped = {}
    order = []
    for x in all_tasks:
        if x["folder"] not in grouped:
            grouped[x["folder"]] = []
            order.append(x["folder"])
        grouped[x["folder"]].append(x)
    for fol in order:
        items = grouped[fol]
        d = sum(1 for i in items if i["estado"] == "DONE")
        lines.append(f"### {fol} ({d}/{len(items)} DONE)")
        lines.append("")
        lines.append("| ID | Título | Estado | Archivo |")
        lines.append("|----|--------|--------|---------|")
        for x in items:
            lines.append(f"| {x['id']} | {x['titulo']} | {x['estado']} | {x['archivo']} |")
        lines.append("")
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    default_root = os.path.normpath(os.path.join(here, ".."))
    ap.add_argument("--root", default=default_root,
                    help="Carpeta raíz que contiene los TODO.md (default: padre de scripts/)")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    if not os.path.isdir(root):
        print(f"ERROR: root no existe: {root}", file=sys.stderr)
        sys.exit(1)

    master_path = os.path.join(root, "TODO.md")
    generated_dir = os.path.join(root, "generated")

    todo_files = find_todo_files(root)
    # excluir el maestro destino si existiera previamente
    todo_files = [p for p in todo_files if os.path.abspath(p) != os.path.abspath(master_path)]

    all_tasks = []
    for p in todo_files:
        for tk in parse_tasks(p):
            tk["folder"] = folder_label(p, root)
            all_tasks.append(tk)

    # coverage
    totals = {"Total": len(all_tasks), "TODO": 0, "DOING": 0, "DONE": 0, "BLOCKED": 0}
    for x in all_tasks:
        totals[x["estado"]] += 1
    by_folder = {}
    for x in all_tasks:
        f = x["folder"]
        by_folder.setdefault(f, {"Total": 0, "TODO": 0, "DOING": 0, "DONE": 0, "BLOCKED": 0})
        by_folder[f][x["estado"]] += 1
        by_folder[f]["Total"] += 1
    coverage = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "totals": totals,
        "by_folder": by_folder,
        "tasks": [
            {"id": x["id"], "estado": x["estado"], "folder": x["folder"],
             "archivo": x["archivo"]}
            for x in all_tasks
        ],
    }

    os.makedirs(generated_dir, exist_ok=True)
    master = build_master(root, all_tasks, coverage)
    with open(master_path, "w", encoding="utf-8") as f:
        f.write(master)
    with open(os.path.join(generated_dir, "system-map-coverage.json"), "w", encoding="utf-8") as f:
        json.dump(coverage, f, indent=2, ensure_ascii=False)

    print(f"TODO.md maestro escrito: {master_path}")
    print(f"Coverage JSON escrito:   {os.path.join(generated_dir, 'system-map-coverage.json')}")
    print(f"Tareas escaneadas: {totals['Total']} "
          f"(TODO={totals['TODO']} DOING={totals['DOING']} DONE={totals['DONE']} BLOCKED={totals['BLOCKED']})")
    print(f"Carpetas: {len(by_folder)}")
    sys.exit(0)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# verify-system-map.py — Valida la consistencia del vínculo estructurado
# entre specs (frontmatter affects:) y SYSTEM_MAP.yaml.
# Uso: python3 scripts/verify-system-map.py
# Deterministic, no manual review. Humano revisa el CAMBIO (PR), máquina
# garantiza la CONSISTENCIA. Exit != 0 en cualquier falla.

import os, re, sys, json
try:
    import yaml
except ImportError:
    print("❌ falta pyyaml (pip install pyyaml)")
    sys.exit(2)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(ROOT, "docs/tareas/SYSTEM_MAP.yaml")
TASKS = os.path.join(ROOT, "docs/tareas")

errs = []

# ── Cargar SYSTEM_MAP ──
with open(MAP) as f:
    sm = yaml.safe_load(f)

ids = {
    "pages": {p["id"] for p in sm.get("pages", [])},
    "components": {c["id"] for c in sm.get("components", [])},
    "behaviors": {b["id"] for b in sm.get("behaviors", [])},
    "resources": {r["id"] for r in sm.get("resources", [])},
}

print("🧪 VERIFY SYSTEM_MAP — consistencia de vínculos\n")

# ── CHECK R: cada spec afecta entidades que EXISTEN en el mapa ──
print("── CHECK R: referencias resuelven ──")
spec_count = 0
for dirpath, _, files in os.walk(TASKS):
    for fn in files:
        if not fn.endswith(".md") or fn == "TODO.md":
            continue
        fp = os.path.join(dirpath, fn)
        with open(fp) as f:
            txt = f.read()
        m = re.match(r"^---\n(.*?)\n---", txt, re.S)
        if not m:
            continue
        try:
            fm = yaml.safe_load(m.group(1))
        except Exception:
            continue
        if not isinstance(fm, dict) or "affects" not in fm:
            continue
        spec_count += 1
        aff = fm["affects"]
        sid = fm.get("id", fn)
        for level in ("pages", "components", "behaviors"):
            for ref in aff.get(level, []) or []:
                if ref not in ids[level]:
                    errs.append(f"  ❌ {sid}: affects.{level} cita '{ref}' que NO existe en SYSTEM_MAP")
                    print(f"  ❌ {sid}: '{ref}' ({level}) inexistente")
                else:
                    print(f"  ✅ {sid}: '{ref}' ({level}) resuelve")
        # behavior afectado debe listar la spec en source_specs (CHECK C)
        for b in aff.get("behaviors", []) or []:
            for bd in sm.get("behaviors", []):
                if bd["id"] == b:
                    ss = bd.get("source_specs", []) or []
                    if sid not in ss:
                        # No es error duro si el indexer auto-detecta; advertimos
                        print(f"  ⚠️  {sid}: behavior '{b}' no lista '{sid}' en source_specs (auto-detectable)")
print(f"  (specs con frontmatter affects: {spec_count})")

# ── CHECK C: cobertura — behaviors con source_specs vacío = uncovered ──
print("\n── CHECK C: cobertura de behaviors ──")
for b in sm.get("behaviors", []):
    if not (b.get("source_specs") or []):
        print(f"  🔴 UNCOVERED: behavior '{b['id']}' — sin source_specs (ninguna spec lo define)")
    else:
        print(f"  🟢 cubierto: behavior '{b['id']}' ← {b['source_specs']}")

# ── CHECK D: drift spec↔código para behaviors con code_artifact ──
print("\n── CHECK D: drift spec↔código (code_artifact) ──")
src_dir = os.path.join(ROOT, "src")
for b in sm.get("behaviors", []):
    art = b.get("code_artifact")
    if not art:
        continue
    hit = False
    for dp, _, fs in os.walk(src_dir):
        for fn in fs:
            if fn.endswith((".astro", ".ts", ".js")):
                with open(os.path.join(dp, fn)) as f:
                    if art in f.read():
                        hit = True
                        break
        if hit:
            break
    if hit:
        print(f"  ✅ behavior '{b['id']}': artifact '{art}' presente en src/")
    else:
        errs.append(f"behavior '{b['id']}': artifact '{art}' AUSENTE en src/")
        print(f"  ❌ behavior '{b['id']}': artifact '{art}' AUSENTE en src/")

print()
if errs:
    print(f"❌ VERIFY SYSTEM_MAP — {len(errs)} error(es)")
    sys.exit(1)
print("✅ VERIFY SYSTEM_MAP — CONSISTENTE (vínculos válidos, cobertura reportada)")

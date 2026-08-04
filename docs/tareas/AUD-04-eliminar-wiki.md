# AUD-04 — Eliminar docs/wiki/ (info migrada a docs/tareas/)

## Contexto

`docs/wiki/` contiene 6 documentos (Home, Progreso, Roadmap, Arquitectura,
Contenido, Diseno) que fueron la fuente de verdad durante el rebranding.
Ahora el trabajo nuevo se registra en `docs/tareas/`.

**Decisión del usuario (2026-08-04):** eliminar la wiki, no marcarla
como solo lectura. Doble fuente de verdad = confusión.

Pero ANTES de borrar, hay que migrar la información VIVA que todavía
es referenciada o útil para el futuro. No todo es histórico.

### Análisis de qué es histórico y qué es vivo

| Archivo wiki        | Tipo     |_destino                              |
|---------------------|----------|--------------------------------------|
| Home.md             | Histórico| **Borrar** — reemplazado por TODO.md |
| Progreso.md         | Histórico| **Migrar a `docs/tareas/HISTORIAL-REBRANDING.md`** |
| Roadmap.md          | Histórico| **Migrar a `docs/tareas/HISTORIAL-REBRANDING.md`** |
| Arquitectura.md     | Vivo     | **Migrar a `docs/tareas/ARQUITECTURA.md`** |
| Contenido.md        | Vivo     | **Migrar a `docs/tareas/CONTENIDO.md`** |
| Diseno.md           | Vivo     | **Migrar a `docs/tareas/DISENO.md`** |

**Histórico** = registro del rebranding (T0-T16, H1-H18, fases F0-F5).
Cuajando en `git log` está todo igualmente. Vale como crash course para
un nuevo developer, pero no se actualiza.

**Vivo** = info de referencia activa (arquitectura del sitio, copy,
decisiones de diseño). Si la borro, perdemos contexto útil.

`DESIGN.md` (raíz) **NO se toca** — sigue siendo la fuente canónica de tokens.

## Spec (SDD — WHAT)

**User story:** Como mantenedor del proyecto, quiero eliminar `docs/wiki/`
para que haya una sola fuente de verdad (`docs/tareas/`), pero preservando
la información viva que todavía es útil como referencia.

## Scenarios (BDD)

```gherkin
Scenario: Wiki eliminada
  Given docs/tareas/TODO.md es la fuente de verdad de tareas activas
  When se completa AUD-04
  Then el directorio docs/wiki/ NO existe
  And no quedan links rotos apuntando a docs/wiki/*

Scenario: Información viva preservada
  Given docs/wiki/ tenía 3 archivos vivos (Arquitectura, Contenido, Diseno)
  When se completa AUD-04
  Then existe docs/tareas/ARQUITECTURA.md con el contenido de Arquitectura.md
  And existe docs/tareas/CONTENIDO.md con el contenido de Contenido.md
  And existe docs/tareas/DISENO.md con el contenido de Diseno.md

Scenario: Historial del rebranding preservado
  Given docs/wiki/Progreso.md y Roadmap.md son históricos
  When se completa AUD-04
  Then existe docs/tareas/HISTORIAL-REBRANDING.md que fusiona ambos
  And el historial contiene las tablas de T0-T16 + H1-H18 + fases F0-F5

Scenario: Links internos actualizados
  Given AGENTS.md y README.md referencian docs/wiki/*
  When se completa AUD-04
  Then AGENTS.md apunta a docs/tareas/ARQUITECTURA.md (no docs/wiki/Arquitectura)
  And README.md apunta a docs/tareas/TODO.md (no docs/wiki/Home.md)
  And no hay `docs/wiki/` enlaces rotos en ningún .md del repo

Scenario: DESIGN.md (raíz) intacto
  Given DESIGN.md en la raíz del repo es la fuente canónica de tokens
  When se completa AUD-04
  Then DESIGN.md sigue existiendo en su misma ruta
  And su contenido no fue modificado
```

## Plan (SDD — HOW)

### Paso 1 — Migrar archivos VIVOS

Conservar contenido íntegro de:
1. `docs/wiki/Arquitectura.md` → `docs/tareas/ARQUITECTURA.md`
2. `docs/wiki/Contenido.md` → `docs/tareas/CONTENIDO.md`
3. `docs/wiki/Diseno.md` → `docs/tareas/DISENO.md`

(Estos archivos se actualizan en AUD-03 para Diseno, pero el resto se
mueve sin cambios por ahora — las correcciones de contenido van aparte.)

### Paso 2 — Migrar historial del rebranding

Fusionar `Progreso.md` + `Roadmap.md` en un solo archivo:

`docs/tareas/HISTORIAL-REBRANDING.md` con:
- Estado final de fases F0-F5 (todas ✅, post corrección AUD-01)
- Tabla de hallazgos H1-H18 (todos resueltos)
- Tabla de tareas T0-T16 (todas DONE)
- Pendientes post-deploy (migrados a AUD-06)

### Paso 3 — Actualizar enlaces internos

1. `AGENTS.md` línea 80-86:
   - `docs/wiki/Home.md` → `docs/tareas/TODO.md`
   - `docs/wiki/Roadmap.md` → `docs/tareas/HISTORIAL-REBRANDING.md`
   - `docs/wiki/Arquitectura.md` → `docs/tareas/ARQUITECTURA.md`
   - `docs/wiki/Contenido.md` → `docs/tareas/CONTENIDO.md`
   - `docs/wiki/Diseno.md` → `docs/tareas/DISENO.md`

2. `README.md`:
   - `[Ver documentación del proyecto →](docs/wiki/Home.md)` → `[TODO y tareas →](docs/tareas/TODO.md)`
   - `[Roadmap](docs/wiki/Roadmap.md)` → `[Historial rebranding](docs/tareas/HISTORIAL-REBRANDING.md)`

3. Buscar todos los `docs/wiki/` restantes en el repo y actualizarlos:
   ```bash
   grep -rn 'docs/wiki/' --include='*.md' .
   ```

### Paso 4 — Eliminar docs/wiki/

```bash
git rm -r docs/wiki/
```

### Paso 5 — Verificar

Correr el verification script. Build `npm run build` también para confirmar
que no hay link interno roto tirando el build.

## Verification script

```bash
#!/bin/bash
# Verificación AUD-04 — Eliminar docs/wiki/ con migración
# Uso: bash docs/tareas/verify-AUD-04.sh

BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
PASS=0; FAIL=0

echo "🧪 AUD-04 — Eliminar docs/wiki/ (info migrada)"

# 1. docs/wiki/ NO existe
if [ ! -d "$BASE_DIR/../docs/wiki" ]; then
    echo "  ✅ docs/wiki/ eliminado"
else
    echo "  ❌ docs/wiki/ todavía existe"
    FAIL=1
fi

# 2. Archivos vivos migrados
for f in ARQUITECTURA.md CONTENIDO.md DISENO.md HISTORIAL-REBRANDING.md; do
    if [ -f "$BASE_DIR/$f" ]; then
        echo "  ✅ $f existe"
    else
        echo "  ❌ $f FALTA"
        FAIL=1
    fi
done

# 3. DESIGN.md (raíz) intacto
if [ -f "$BASE_DIR/../DESIGN.md" ]; then
    echo "  ✅ DESIGN.md (raíz) intacto"
else
    echo "  ❌ DESIGN.md (raíz) FALTA — no se debía tocar"
    FAIL=1
fi

# 4. No hay links rotos a docs/wiki/ en ningún .md
BROKEN=$(grep -rln 'docs/wiki/' --include='*.md' "$BASE_DIR/.." 2>/dev/null)
if [ -z "$BROKEN" ]; then
    echo "  ✅ No hay referencias a docs/wiki/ en .md"
else
    echo "  ❌ Referencias a docs/wiki/ aún presentes en:"
    echo "$BROKEN"
    FAIL=1
fi

# 5. AGENTS.md y README.md actualizados
if grep -q 'docs/tareas/TODO.md' "$BASE_DIR/../AGENTS.md" 2>/dev/null && \
   grep -q 'docs/tareas/TODO.md' "$BASE_DIR/../README.md" 2>/dev/null; then
    echo "  ✅ AGENTS.md y README.md apuntan a docs/tareas/TODO.md"
else
    echo "  ⚠️ Verificar que AGENTS.md y README.md enlazan TODO.md"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
    echo "✅ AUD-04 — COMPLETA"
else
    echo "❌ AUD-04 — INCOMPLETA"
    exit 1
fi
```

## Estado
TODO

## Notas

**Orden de ejecución recomendado:**
1. Hacer AUD-01 (reconciliar Roadmap) primero — así el histórico ya está corregido al migrarlo
2. Hacer AUD-03 (actualizar Diseno) primero — así el DISENO.md ya está corregido al migrarlo
3. AUD-04 corona la limpieza: migra lo vivo, conserva lo histórico con correcciones ya aplicadas, borra la wiki

**No perder info:** ANTES de `git rm -r docs/wiki/`, commitear la migración
en un commit aparte con los 4 archivos nuevos (ARQUITECTURA, CONTENIDO,
DISENO, HISTORIAL-REBRANDING). Así si algo se rompe, revert es trivial
y no se pierde nada.

# AUD-04 — Eliminar _ai_context/docs/wiki/ (info migrada a _ai_context/docs/tareas/)

## Contexto

`_ai_context/docs/wiki/` contenía 6 documentos (Home, Progreso, Roadmap, Arquitectura,
Contenido, Diseno) que fueron la fuente de verdad durante el rebranding.
Ahora el trabajo nuevo se registra en `_ai_context/docs/tareas/`.

**Decisión del usuario (2026-08-04):** eliminar la wiki, no marcarla
como solo lectura. Doble fuente de verdad = confusión.

Pero ANTES de borrar, hay que migrar la información VIVA que todavía
es referenciada o útil para el futuro. No todo es histórico.

### Análisis de qué es histórico y qué es vivo

| Archivo wiki        | Tipo     | Destino                                |
|---------------------|----------|----------------------------------------|
| Home.md             | Histórico| **Borrar** — reemplazado por TODO.md |
| Progreso.md         | Histórico| **Migrar a `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`** |
| Roadmap.md          | Histórico| **Migrar a `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`** |
| Arquitectura.md     | Vivo     | **Migrar a `_ai_context/docs/tareas/ARQUITECTURA.md`** |
| Contenido.md        | Vivo     | **Migrar a `_ai_context/docs/tareas/CONTENIDO.md`** |
| Diseno.md           | Vivo     | **Migrar a `_ai_context/docs/tareas/DISENO.md`** |

**Histórico** = registro del rebranding (T0-T16, H1-H18, fases F0-F5).
Conservado en `git log`. Vale como crash course para un nuevo developer,
pero no se actualiza.

**Vivo** = info de referencia activa (arquitectura del sitio, copy,
decisiones de diseño).

`DESIGN.md` (raíz) **NO se toca** — sigue siendo la fuente canónica de tokens.

## Spec (SDD — WHAT)

**User story:** Como mantenedor del proyecto, quiero eliminar `_ai_context/docs/wiki/`
para que haya una sola fuente de verdad (`_ai_context/docs/tareas/`), pero preservando
la información viva que todavía es útil como referencia.

## Scenarios (BDD)

```gherkin
Scenario: Wiki eliminada
  Given _ai_context/docs/tareas/TODO.md es la fuente de verdad de tareas activas
  When se completa AUD-04
  Then el directorio _ai_context/docs/wiki/ NO existe
  And no quedan links rotos apuntando a _ai_context/docs/wiki/*

Scenario: Información viva preservada
  Given _ai_context/docs/wiki/ tenía 3 archivos vivos (Arquitectura, Contenido, Diseno)
  When se completa AUD-04
  Then existe _ai_context/docs/tareas/ARQUITECTURA.md con el contenido de Arquitectura.md
  And existe _ai_context/docs/tareas/CONTENIDO.md con el contenido de Contenido.md
  And existe _ai_context/docs/tareas/DISENO.md con el contenido de Diseno.md

Scenario: Historial del rebranding preservado
  Given _ai_context/docs/wiki/Progreso.md y Roadmap.md son históricos
  When se completa AUD-04
  Then existe _ai_context/docs/tareas/HISTORIAL-REBRANDING.md que fusiona ambos
  And el historial contiene las tablas de T0-T16 + H1-H18 + fases F0-F5

Scenario: Links internos actualizados
  Given AGENTS.md y README.md referencian _ai_context/docs/wiki/*
  When se completa AUD-04
  Then AGENTS.md apunta a _ai_context/docs/tareas/ARQUITECTURA.md (no _ai_context/docs/wiki/Arquitectura)
  And README.md apunta a _ai_context/docs/tareas/TODO.md (no _ai_context/docs/wiki/Home.md)
  And no hay links de markdown rotos apuntando a _ai_context/docs/wiki/* en ningún .md del repo

Scenario: DESIGN.md (raíz) intacto
  Given DESIGN.md en la raíz del repo es la fuente canónica de tokens
  When se completa AUD-04
  Then DESIGN.md sigue existiendo en su misma ruta
  And su contenido no fue modificado
```

## Plan (SDD — HOW) — ejecutado

### Paso 1 — Migrar archivos VIVOS

Contenido íntegro conservado:
1. `_ai_context/docs/wiki/Arquitectura.md` → `_ai_context/docs/tareas/ARQUITECTURA.md`
2. `_ai_context/docs/wiki/Contenido.md` → `_ai_context/docs/tareas/CONTENIDO.md`
3. `_ai_context/docs/wiki/Diseno.md` → `_ai_context/docs/tareas/DISENO.md`

### Paso 2 — Migrar historial del rebranding

Fusionar `Progreso.md` + `Roadmap.md` en `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`
con:
- Estado final de fases F0-F5 (todas ✅, tras AUD-01)
- Tabla de hallazgos H1-H18 (todos resueltos)
- Tabla de tareas T0-T16 (todas DONE)
- Pendientes post-deploy (sección 5, propios)

### Paso 3 — Actualizar enlaces internos

- `AGENTS.md`: sección Reference apunta a `_ai_context/docs/tareas/*` (ARQUITECTURA,
  CONTENIDO, DISENO, TODO, HISTORIAL-REBRANDING).
- `README.md`: enlaza `_ai_context/docs/tareas/TODO.md`, `_ai_context/docs/tareas/ARQUITECTURA.md`
  y `_ai_context/docs/tareas/HISTORIAL-REBRANDING.md`.
- Sin links de markdown rotos a _ai_context/docs/wiki en ningún .md (verificación en script).

### Paso 4 — Eliminar _ai_context/docs/wiki/

`_ai_context/docs/wiki/` fue borrada físicamente del working tree. **No estaba
rastreada por git** (`git ls-files _ai_context/docs/wiki` vacío), por lo que no
requirió `git rm` ni commit de la eliminación.

### Paso 5 — Verificar

Verification script ejecutado ✅. Build `npm run build` OK (sin links
internos rotos afectando el build).

## Verification script

```bash
#!/bin/bash
# Verificación AUD-04 — Eliminar _ai_context/docs/wiki/ con migración
# Uso: bash _ai_context/docs/tareas/verify-AUD-04.sh

BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
PASS=0; FAIL=0

echo "🧪 AUD-04 — Eliminar _ai_context/docs/wiki/ (info migrada)"

# 1. _ai_context/docs/wiki/ NO existe
if [ ! -d "$BASE_DIR/../_ai_context/docs/wiki" ]; then
    echo "  ✅ _ai_context/docs/wiki/ eliminado"
else
    echo "  ❌ _ai_context/docs/wiki/ todavía existe"
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

# 4. No hay LINKS rotos a _ai_context/docs/wiki/ (patrón de markdown link ](_ai_context/docs/wiki)
#    en ningún .md del repo, salvo este archivo histórico (AUD-04) que
#    documenta la migración y menciona el patrón. Las menciones en
#    backticks del registro histórico no son links.
BROKEN=$(grep -rln '](_ai_context/docs/wiki' --include='*.md' "$BASE_DIR/.." 2>/dev/null | grep -v 'AUD-04-eliminar-wiki.md')
if [ -z "$BROKEN" ]; then
    echo "  ✅ No hay links rotos a _ai_context/docs/wiki/ en .md"
else
    echo "  ❌ Links rotos a _ai_context/docs/wiki/ aún presentes en:"
    echo "$BROKEN"
    FAIL=1
fi

# 5. AGENTS.md y README.md actualizados
if grep -q '_ai_context/docs/tareas/TODO.md' "$BASE_DIR/../AGENTS.md" 2>/dev/null && \
   grep -q '_ai_context/docs/tareas/TODO.md' "$BASE_DIR/../README.md" 2>/dev/null; then
    echo "  ✅ AGENTS.md y README.md apuntan a _ai_context/docs/tareas/TODO.md"
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
DONE

## Notas

**Orden de ejecución (seguido):**
1. AUD-01 (reconciliar Roadmap) primero → histórico corregido al migrarlo
2. AUD-03 (actualizar Diseno) primero → DISENO.md corregido al migrarlo
3. AUD-04 corona la limpieza

**Resultado de la verificación:**
- `_ai_context/docs/wiki/` eliminada (nunca fue trackeada por git → sin `git rm`).
- `ARQUITECTURA.md`, `CONTENIDO.md`, `DISENO.md`, `HISTORIAL-REBRANDING.md`
  presentes en `_ai_context/docs/tareas/`.
- `DESIGN.md` (raíz) intacto.
- Sin links de markdown rotos a _ai_context/docs/wiki en ningún .md del repo (este
  archivo es el registro histórico y se auto-excluye de la búsqueda);
  README y AGENTS apuntan a `_ai_context/docs/tareas/`.
- Restan solo menciones descriptivas a la wiki en el registro histórico
  (este archivo, AUD-01, AUD-03, TODO.md línea 9) — no son links.

**Pendiente del usuario:** el working tree completo (docs migrados, capa de
datos JSON, componentes) sigue sin commitear; cuando se commitee, cerrar
también la nota "Trabajo NO commiteado" de TODO.md.

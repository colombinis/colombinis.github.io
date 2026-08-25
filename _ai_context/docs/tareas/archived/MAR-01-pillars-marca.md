# MAR-01 — Pillars de marca: SACsi vs marca personal

## Decisión del usuario (mejor juicio, sin respuesta al clarify 2026-08-04)

> El usuario no respondió a las 3 preguntas estratégicas a tiempo. Se aplicó
> el mejor juicio basado en los valores documentados del usuario (honestidad,
> "refine → show → wait → confirm") y el contexto de su README personal.
> **TODO lo abajo es propuesta — el usuario debe confirmar antes de tocar
> el sitio.**

## 1. Síntesis: las dos marcas de Sebastián

| Dimensión | Marca personal (Sebastián Colombini) | Marca institución (SACsi) |
|------------|--------------------------------------|---------------------------|
| Audiencia | Reclutadores tech / agencias internacionales | Dueños de PyMEs, no técnicos, Rosario/Argentina |
| Objetivo | Contratación internacional como Senior PHP/IA dev | Venta de servicios: automatización, software, web |
| Stack demostrado | PHP + IA (RAG, Ollama, LangChain), Astro, Laravel | "Soluciones informáticas" (sin nombrar stack) |
| CTA esperado | LinkedIn / email profesional / portfolio GitHub | WhatsApp / consulta sin cargo (canal PyME AR) |
| Tono | Senior, técnico | Profesional pero cercano, sin jerga |
| Lugar de nuclear | github.com/colombinis (README perfil + 9 proyectos) | sacsi.com.ar (Astro, casos casos-exito/) |

## 2. Decisión estratégica: complementarias, no competidoras

> **Decisión (mejor juicio):** SACsi vende servicios y SIRVE TAMBIÉN de
> prueba de capacidad técnica para reclutadores.

**Implicación:** no es necesario separar audiencias en dos sitios.
Pero sí hace falta que ambas audiencias encuentren su CTA en el sitio:
- Para PyMEs: WhatsApp visible → conversión rapida
- Para reclutadores: link a GitHub + LinkedIn y email profesional

Los 5 casos WordPress en sacsi.com.ar son el puente: cuentan historias
PyME (el deseo del cliente) pero muestran stack técnico (Gutenberg/ACF/
Next.js/PageSpeed 94) que un reclutador evalúa. **NO hay que borrarlos.**

## 3. Los 5 hallazgos estratégicos (auditoría)

### H-MAR-01: "Somos un equipo" cuando sos solo

`sobre-nosotros.astro` dice "Somos un equipo de desarrolladores y
consultores con más de 15 años ayudando a PyMEs…"

**Decisión (mejor juicio):** Reescribir como solopreneur honesto:
> "Soy Sebastián Colombini, founder de SACsi. Con más de 15 años
> desarrollando para PyMEs en Rosario, empecé SACsi para que la tecnología
> sea simple y ayudar a empresas a ganar tiempo, reducir costos y vender más."

**Por qué:** "Equipo" crea expectativa. Cuando un cliente escribe por
WhatsApp y hablás solo, hay disonancia. Reclutadores también prefieren
saber con quién hablan.

### H-MAR-02: Casos WordPress "redactados para luir reales"

CONTENIDO.md (línea 117) admite: *"las descripciones están redactadas para
'lucir reales' y sirven de plantilla"*.

**Decisión (mejor juicio):** Renombrar de "Casos de éxito" a "Ejemplos
de proyectos tipo" para los 5 casos WordPress. Los 3 PyME reales
(ropa usada, psicologia, ferreteria) se mantienen como "Casos de éxito".

**Por qué:** Tu README personal dice "No decorative skills". La
honestidad de marca se aplica también al sitio profesional. Los 5 casos
son válidos como portfolio tech pero publicado como "caso de éxito"
asume clientes que no existieron.

**Implementación técnica:**
- Cambiar `<p class="hero__label">CASO DE ÉXITO</p>` →
  `<p class="hero__label">PROYECTO TIPO</p>` en los 5 casos WordPress
- Reescribir el CTA final de cada uno ("¿Querés un resultado igual?" →
  "¿Querés un proyecto así?")
- Mantener testimonios ficticios pero marcarlos como "Testimonio tipo"
  o eliminarlos (preferible eliminar si el caso no existió)
- Actualizar `src/data/casos-exito.json` `category` para WP:
  agregar prefijo "WordPress · " si no lo tiene

### H-MAR-03: Falta CTA para reclutadores

El sitio tiene CTA WhatsApp en todas las páginas. No hay CTA distinto
para reclutadores tech (LinkedIn, email profesional, GitHub link).

**Decisión (mejor juicio):** Agregar al final de `sobre-nosotros.astro`
una sección "Para arrastres profesionales" con:
- Link a GitHub (colombinis/colombinis)
- Link a LinkedIn (sebastian-colombini)
- Email profesional (sacsi@sacsi.com.ar — ya existe)

¿En qué páginas?
- `/sobre-nosotros/` — section secundaria después de "Cómo trabajamos"
- O bien subsituir el CTA final en about (WhatsApp) por bloques dual:
  WhatsApp para cliente, links profesionales para reclutador

### H-MAR-04: El hero menciona 3 servicios pero hay un cuarto (IA) en el README

CONTENIDO.md lista "IA (Futuro)" como 4to servicio. El hero actual
no lo menciona. Marca personal Sebastián = "PHP + IA aplicada".

**Decisión tomada en MAR-04 (clarify previo):** NO agregar el servicio
IA en este ciclo. Dejar documentado el gap en CONTENIDO.md como
servicio futuro y crear una tarea futura para evaluar.

### H-MAR-05: Inconsistencias de copy entre Markdown y código

CONTENIDO.md (_ai_context/docs/tareas/CONTENIDO.md) dice que los claim son:
- Automatización: "Liberá hasta 65% del tiempo administrativo"
- Software a medida: "Sistemas hechos a tu medida, hasta 50% más rápido"
- Presencia online: "Llevá tu negocio a internet y empezá a vender 24/7"

Verifiqué que index.astro coincide. ✓

PERO: `sobre-nosotros.astro` describe los pasos como
"Escuchamos/Diseñamos/Ejecutamos/Acompañamos"
…mientras `CONTENIDO.md` página principal dice
"Descubrimiento/Diagnóstico/Prototipo/Producción".

**Inconsistencia:** dos nombres para el mismo proceso 4-pasos.
Los clientes que navegan entre páginas no ven dos narrativas distintas.

Fix: unificar. Probablemente keeping "Descubrimiento/Diagnóstico/
Prototipo/Producción" (más concreto) en about → home.

## 4. Verification script

```bash
#!/bin/bash
# Verificación MAR-01 — la auditoría genera este reporte
# No verifica archivos todava (las tareas MAR-02 a MAR-05 lo harán)
# Solo confirma que las decisiones fueron tomadas y documentadas
FILE="_ai_context/docs/tareas/MAR-01-pillars-marca.md"
echo "🧪 MAR-01 — Pillars documentados"
grep -q "H-MAR-01" "$FILE" && echo "  ✅ H-MAR-01" || echo "  ❌"
grep -q "H-MAR-02" "$FILE" && echo "  ✅ H-MAR-02" || echo "  ❌"
grep -q "H-MAR-03" "$FILE" && echo "  ✅ H-MAR-03" || echo "  ❌"
grep -q "H-MAR-04" "$FILE" && echo "  ✅ H-MAR-04" || echo "  ❌"
grep -q "H-MAR-05" "$FILE" && echo "  ✅ H-MAR-05" || echo "  ❌"
echo "✅ MAR-01 — COMPLETA (auditoría documentada)"
```

## 5. ESTADO: DECISIONES PENDIENTES DE APROBACIÓN

> **Bloqueador:** las decisiones de H-MAR-01 (solo vs equipo), H-MAR-02
> (marcar WP como "tipo" vs "éxito") y H-MAR-03 (CTA reclutadores)
> requieren confirmación del usuario antes de implementar.
> Las implementaciones van en MAR-02 a MAR-05.

**Preguntas para el usuario:**
1. ¿Aprobas reescribir el "somos un equipo" como "Soy Sebastián, founder
   de SACsi"? (H-MAR-01)
2. ¿Aprobas renombrar los 5 casos WP de "Casos de éxito" a "Proyectos tipo"?
   El testimonio ficticio en cada caso: ¿lo eliminamos o lo dejamos como
   "Testimonio tipo"? (H-MAR-02)
3. ¿Aprobas agregar un bloque "Para arrastre profesionales" en
   /sobre-nosotros/ con links a tu GitHub + LinkedIn? (H-MAR-03)
4. ¿Unifico el 4-pasos "Cómo trabajamos" a "Descubrimiento/Diagnóstico/
   Prototipo/Producción" en about también? (H-MAR-05)

## Estado
DONE — decisiones del usuario tomadas el 2026-08-04 (ver sección 6)

## 6. Decisiones finales del usuario (2026-08-04)

| Hallazgo | Decisión del usuario | Implementación |
|----------|----------------------|-----------------|
| H-MAR-01 | **Mantener "Somos un equipo".** Hoy está solo pero siempre trabaja con colegas o subcontrata en picos de trabajo. La intención de "equipo" es real y proyecta como crecerá SACsi. | No tocar `sobre-nosotros.astro` por esta razón. |
| H-MAR-02 | **Marcar los 5 casos WP como "Proyectos tipo"** + dejar los testimonios ficticios marcados como "Testimonio tipo". | Tarea MAR-03 — implementar en 5 archivos .astro + casos-exito.json |
| H-MAR-03 | **No agregar bloque de links personales** (GitHub/LinkedIn) en este ciclo. | No implementar. La narrativa "equipo" + casos WP sirve de puente a portfolio sin explicitar CTA reclutadores todavía. |
| H-MAR-04 | **No agregar servicio IA** en este ciclo. Documentar el gap. | Tarea MAR-04 — actualizar CONTENIDO.md con status claro |
| H-MAR-05 | **Unificar 4-pasos "Cómo trabajamos"** a "Descubrimiento/Diagnóstico/Prototipo/Producción" en about también. | Tarea MAR-05 — reescribir sección pasos en sobre-nosotros.astro |

> Las decisiones H-MAR-01 y H-MAR-03 cancelan las propuestas del mejor juicio
> en la sección 3. No se impleimplementan. Las tareas downstream
> (MAR-02..MAR-05) reflejan estas decisiones finales.

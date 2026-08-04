# Diseño

> Razonamiento de diseño y glosario. Los **valores de los tokens** viven en un único lugar: [`/DESIGN.md`](https://github.com/colombinis/colombinis.github.io/blob/v0_alternativo_rebranding/DESIGN.md) (raíz del repo).

## Fuente de tokens

`/DESIGN.md` (raíz) es la **fuente canónica** de colores, tipografía, spacing y componentes. No se duplican acá para evitar drift. En el código, esos tokens se materializan como CSS custom properties en `src/styles/global.css`.

### Tokens y drift (resuelto — T6)

El drift entre `DESIGN.md` y `global.css` fue reconciliado en la tarea T6
(ver H8 en el historial). Estado actual:

| Token | Valor en `global.css` | En `DESIGN.md` | Estado |
|-------|-----------------------|----------------|--------|
| `--tertiary` | `#0A7CFF` | `#0A7CFF` | ✅ sincronizado |
| `--tertiary-dark` | `#0066CC` | no existe | Extensión accesible añadida al CSS para texto pequeño (labels/claims) sobre fondo claro. Decisión tomada en T6: justificada por contraste WCAG AA, se mantiene sin tocar DESIGN.md. |
| `--whatsapp` | `#25D366` | `#25D366` | ✅ sincronizado |
| `--whatsapp-hover` | `#1DA851` | `#1DA851` | ✅ sincronizado (antes era `#128C7E`, corregido) |
| `--rounded-xs` | `4px` | `4px` | ✅ sincronizado |
| `--rounded-sm/md/full/circle` | todos | todos | ✅ sincronizado |

> **Resuelto en T6:** `global.css` alineado a `DESIGN.md`. Si surgiera un
> nuevo drift, corregir `global.css` hacia `DESIGN.md` (fuente canónica)
> y registrar el cambio en `docs/tareas/`.

## Decisiones de diseño

### 1. Paleta navy + azul eléctrico
Navy profundo (`#1A1A2E`) como primario y azul eléctrico (`#0A7CFF`) como único acento de interacción. Transmite solidez y profesionalismo para un target que valora la confianza. Se descartaron paletas cálidas (urgencia/informalidad) y monocromáticas (poca diferenciación de lo interactivo).

### 2. Tipografía del sistema
Pila nativa (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`) sin fuentes externas. Máxima performance (sin request extra, sin FOIT/FOUT) y familiaridad. Se descartaron Google Fonts (costo en performance) y fuentes variables custom (mantenimiento).

### 3. Mobile-first responsive
Se diseña primero para < 600px y se escala con `min-width`. +60% del tráfico PyME en Argentina es mobile, y Google indexa mobile-first. Se descartó desktop-first.

### 4. WhatsApp como CTA principal
WhatsApp es el canal predominante para PyMEs en Argentina; convierte más que un formulario. Verde `#25D366` exclusivo del botón de contacto directo. Se descartó el formulario como CTA principal (más fricción).

### 5. Output estático, layouts reutilizables
El sitio es 100% estático (GitHub Pages). Astro genera ese estático pero elimina la duplicación de header/footer/tokens que tenía la versión HTML previa mediante layouts y componentes. Sin estado reactivo ni JS de framework en cliente. (Ver [Arquitectura](Arquitectura).)

## Do's and Don'ts

**Do**
- Usar el azul (`#0A7CFF`) SOLO para acciones e interacciones.
- Cards limpias, sin bordes gruesos.
- Tipografía del sistema.
- CTA principal siempre visible en el hero.
- WhatsApp exclusivo para contacto directo.

**Don't**
- Verde WhatsApp fuera del botón de chat.
- Sombras/elevaciones inconsistentes.
- Imágenes de stock sin optimizar.
- Animaciones decorativas sin propósito.
- Reutilizar el diseño antiguo (`theme/mobile1`).

## Glosario

| Término | Definición |
|---------|-----------|
| Token de diseño | Valor único que representa una decisión de diseño (color, fuente, espaciado). Ej: `--primary = #1A1A2E`. |
| DESIGN.md | Especificación de diseño (formato Google: YAML + Markdown) con los tokens de marca. Fuente canónica. |
| DoD | Definition of Done — condiciones que un issue debe cumplir para considerarse completo. |
| WCAG | Web Content Accessibility Guidelines — estándar de accesibilidad; nivel AA es el mínimo recomendado. |
| CTA | Call to Action — elemento que invita a una acción (contactar, comprar). |
| Hero | Sección superior de una landing, visible sin scroll. |
| Mobile-first | Diseñar primero para pantallas chicas y luego adaptar a grandes. |
| Lighthouse | Herramienta de Google que audita performance, accesibilidad, SEO y buenas prácticas. |
| Astro | Framework de sitios estáticos usado como stack oficial del proyecto. |

## Historial de issues (F0)

- **#17 — Crear DESIGN.md:** especificación de diseño única (colores, tipografía, spacing, componentes) validada con el linter de Google. → `DESIGN.md`.
- **#18 — Anonimizar inspiración original:** búsqueda recursiva, 1 ocurrencia reemplazada, 0 restantes confirmadas.
- **#19 — Documentación / wiki:** decisiones de diseño documentadas.

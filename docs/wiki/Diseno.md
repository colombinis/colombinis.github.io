# Diseño

> Razonamiento de diseño y glosario. Los **valores de los tokens** viven en un único lugar: [`/DESIGN.md`](https://github.com/colombinis/colombinis.github.io/blob/v0_alternativo_rebranding/DESIGN.md) (raíz del repo).

## Fuente de tokens

`/DESIGN.md` (raíz) es la **fuente canónica** de colores, tipografía, spacing y componentes. No se duplican acá para evitar drift. En el código, esos tokens se materializan como CSS custom properties en `src/styles/global.css`.

### Tokens y drift pendiente

Hay diferencias entre `DESIGN.md` y lo implementado en `global.css` que conviene resolver (F5):

| Token en código | Valor en `global.css` | En `DESIGN.md` | Nota |
|-----------------|-----------------------|----------------|------|
| `--tertiary-dark` | `#0066CC` | no existe | Usado en hero; documentar o eliminar |
| `--whatsapp-dark` | `#128C7E` | hover WhatsApp = `#1DA851` | Valores distintos; unificar |
| hover `button-primary` | — | `#0A7CFF` (tertiary) | Verificar consistencia |
| `--rounded-xs`, `--rounded-circle` | ausentes | definidos | Faltan en `global.css` |

> Acción: elegir una única verdad (preferentemente ajustar `global.css` a `DESIGN.md`, o actualizar `DESIGN.md` si el código es el correcto) y dejar ambos sincronizados.

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

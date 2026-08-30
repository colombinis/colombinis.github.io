---
version: alpha
name: SACsi Rebranding
description: Identidad visual renovada para SACsi — soluciones informáticas con presencia robusta y tono profesional pero cercano.
colors:
  primary: "#1A1A2E"
  secondary: "#444444"
  tertiary: "#0A7CFF"
  neutral: "#FAFAFA"
  surface: "#FFFFFF"
  muted: "#6B6B6B"
  whatsapp: "#25D366"
typography:
  h1:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 2.8rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h2:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  h3:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 1.15rem
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 0.93rem
    fontWeight: 400
    lineHeight: 1.6
  label-uppercase:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 0.8rem
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  xs: 4px
  sm: 8px
  md: 16px
  full: 100px
  circle: 50%
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 80px
  container: 1120px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: 14px 32px
    fontWeight: 600
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: 14px 32px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: 1.5px solid "#DDDDDD"
    rounded: "{rounded.sm}"
    padding: 14px 32px
  button-outline-hover:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: 1.5px solid "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 14px 32px
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: 14px 32px
  button-whatsapp-hover:
    backgroundColor: "#1DA851"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: 14px 32px
  card:
    backgroundColor: "#F9F9FB"
    rounded: "{rounded.md}"
    padding: 28px 24px 32px
  card-hover:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    borderColor: "#E0E0E0"
    padding: 28px 24px 32px
  tag-pill:
    backgroundColor: "#E8F0FE"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.full}"
    padding: 6px 16px
  step-number:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    size: 48px
    rounded: "{rounded.circle}"
---

## Overview

SACsi es una empresa de soluciones informáticas con más de 15 años de experiencia en Rosario, Argentina. La identidad renovada busca proyectar **profesionalismo, cercanía y modernidad** — pasando de un estilo artesanal/antiguo a uno limpio, corporativo pero accesible.

El tono es **directo, sin vueltas**. Las páginas deben comunicar valor en segundos. La paleta es sobria (navy profundo + grises) con un único acento azul eléctrico para acciones. El verde WhatsApp se usa exclusivamente para el CTA de contacto directo.

Target: dueños de PyMEs y emprendedores que necesitan automatización y desarrollo de software pero no son técnicos. Buscan confianza, resultados medibles y comunicación clara.

## Colors

La paleta está anclada en un navy profundo y grises neutros de alto contraste, con un solo acento de color para interacción.

- **Primary (#1A1A2E):** Navy profundo. Se usa para fondos oscuros (CTA final, headlines principales) y texto de alto impacto. Transmite solidez, profesionalismo y confianza.
- **Secondary (#444444):** Gris oscuro para texto corporal, navegación y metadatos secundarios. Ajustado de #555555 para cumplir WCAG 2.1 AA (AUD-12).
- **Tertiary (#0A7CFF):** Azul eléctrico. Es el único color de interacción — hover de botones, links, acentos. Señal de que algo es cliqueable.
- **Neutral (#FAFAFA):** Fondo general de página. Casi blanco pero más suave, evita la dureza del blanco puro.
- **Surface (#FFFFFF):** Fondos de cards, secciones destacadas, formularios. Separa contenido del fondo general.
- **Muted (#6B6B6B):** Texto secundario, subtítulos, marcas de agua. Ajustado de #888888 para cumplir WCAG 2.1 AA (5.1:1 sobre neutral).
- **WhatsApp (#25D366):** Exclusivo para el botón de contacto directo. No se usa en ningún otro contexto.

### Design Tokens

```yaml
colors:
  primary: "#1A1A2E"
  secondary: "#444444"
  tertiary: "#0A7CFF"
  neutral: "#FAFAFA"
  surface: "#FFFFFF"
  muted: "#6B6B6B"
  whatsapp: "#25D366"
```

## Typography

Se utiliza tipografía del sistema nativa (-apple-system / Segoe UI / Helvetica) para máxima performance y familiaridad. Sin cargas externas de fonts. La jerarquía se logra con peso y tamaño, no con familias múltiples.

- **H1 — Headlines (2.8rem, 700):** Exclusivo para el hero de landing. Máximo impacto, tracking compacto (-0.02em). Una sola idea por página.
- **H2 — Section titles (2rem, 700):** Títulos de sección. Tracking ligeramente compacto (-0.01em).
- **H3 — Card / Step titles (1.15rem, 600):** Títulos dentro de cards o pasos.
- **Body-md — Texto principal (1rem, 400, 1.6):** Párrafos, descripciones de servicios.
- **Body-sm — Texto secundario (0.93rem, 400):** Texto de apoyo, features, detalles.
- **Label-uppercase — Tags / badges (0.8rem, 600, 0.08em):** Exclusivo para etiquetas de categoría. Siempre en mayúscula con tracking expansivo.

## Layout & Spacing

El layout sigue un modelo **Fluid Grid** con contenedor centrado de max-width 1120px. En mobile (< 600px) los paddings se mantienen pero las grillas pasan a 1 columna.

Espaciado base: 8px (con variantes 4px, 16px, 24px, 32px, 80px).

| Nivel | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Micro-ajustes, separación íntima |
| sm | 8px | Gap entre elementos de una misma línea |
| md | 16px | Padding interno compacto, gap entre ctas |
| lg | 24px | Padding de container, gap de grillas |
| xl | 32px | Separación entre secciones en mobile |
| xxl | 80px | Separación entre secciones en desktop |

### Design Tokens

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 80px
```

## Elevation & Depth

La profundidad se logra mediante **sutiles sombras en hover** combinadas con desplazamiento vertical (-4px). No se usan sombras en estado default. El efecto es:

```css
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.06);
}
```

La sección oscura de CTA final (background primary) genera profundidad por contraste de color, no por sombra.

## Shapes

El lenguaje de formas es **orgánico controlado**:

- **Cards:** Border-radius 16px para un look moderno pero no agresivo
- **Botones:** Border-radius 8px — clicables pero sin exceso de suavidad
- **Tags/Pills:** Border-radius 100px para forma de píldora
- **Números de paso:** 48px círculo perfecto para contenedores numéricos

### Design Tokens

```yaml
rounded:
  sm: 8px
  md: 16px
  full: 100px
  circle: 50%
```

## Components

### Buttons

Tres variantes de botón, todas con 8px de border-radius y 14px/32px de padding:

- **button-primary:** Usado para la acción principal de cada página. Fondo navy, texto blanco. En hover cambia a azul (#0A7CFF).
- **button-outline:** Usado para acciones secundarias. Borde sutil (#DDD), sin fondo. En hover el borde se oscurece a navy.
- **button-whatsapp:** Exclusivo para el CTA de contacto. Fondo verde WhatsApp. En hover se oscurece a #1DA851.

### Cards

Usadas para presentar servicios. Tienen fondo #F9F9FB, border-radius 16px, y en hover se elevan (translateY -4px + sombra suave). Contienen: imagen superior (180px height, object-fit cover), cuerpo con padding 28px/24px/32px.

### Tags

Píldoras informativas. Fondo azul muy claro (#E8F0FE), texto azul eléctrico (#0A7CFF), uppercase con tracking 0.08em.

## Do's and Don'ts

**Do:**
- Usar el azul (#0A7CFF) SOLO para acciones e interacciones (hover, links)
- Mantener las cards limpias y sin bordes gruesos
- Usar tipografía del sistema — no cargar fonts externas
- CTA principal siempre visible en el hero
- WhatsApp exclusivo para contacto directo

**Don't:**
- No usar verde WhatsApp fuera del botón de chat
- No mezclar sombras múltiples o elevaciones inconsistentes
- No usar imágenes de stock sin recortar/optimizar
- No agregar animaciones decorativas sin propósito funcional
- No usar el diseño antiguo (mobile1 theme) en páginas nuevas

## Razonamiento de diseño (decisiones)

> Sección migrada desde `_ai_context/docs/tareas/DISENO.md` al unificar la documentación
> de diseño en un único archivo canónico (`DESIGN.md`). Los valores de los tokens siguen
> viviendo arriba, en las secciones YAML. Ver también `ARQUITECTURA.md`.

### 1. Paleta navy + azul eléctrico
Navy profundo (`#1A1A2E`) como primario y azul eléctrico (`#0A7CFF`) como único acento de interacción. Transmite solidez y profesionalismo para un target que valora la confianza. Se descartaron paletas cálidas (urgencia/informalidad) y monocromáticas (poca diferenciación de lo interactivo).

### 2. Tipografía del sistema
Pila nativa (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`) sin fuentes externas. Máxima performance (sin request extra, sin FOIT/FOUT) y familiaridad. Se descartaron Google Fonts (costo en performance) y fuentes variables custom (mantenimiento).

### 3. Mobile-first responsive
Se diseña primero para < 600px y se escala con `min-width`. +60% del tráfico PyME en Argentina es mobile, y Google indexa mobile-first. Se descartó desktop-first.

### 4. WhatsApp como CTA principal
WhatsApp es el canal predominante para PyMEs en Argentina; convierte más que un formulario. Verde `#25D366` exclusivo del botón de contacto directo. Se descartó el formulario como CTA principal (más fricción).

### 5. Output estático, layouts reutilizables
El sitio es 100% estático (GitHub Pages). Astro genera ese estático pero elimina la duplicación de header/footer/tokens que tenía la versión HTML previa mediante layouts y componentes. Sin estado reactivo ni JS de framework en cliente.

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


# Guía de marca para redes — SACsi / Sebastián

Versión alfanumérica. Basada en `DESIGN.md`.

## 1. Paleta oficial

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#1A1A2E` | Fondos oscuros, títulos, elementos de alto impacto |
| Secondary | `#444444` | Texto corporal, metadatos |
| Tertiary | `#0A7CFF` | Links, hover, acentos interactivos |
| Tertiary-dark | `#0066CC` | Texto pequeño sobre fondos claros |
| Neutral | `#FAFAFA` | Fondo general |
| Surface | `#FFFFFF` | Cards, secciones destacadas |
| Muted | `#6B6B6B` | Texto secundario |
| WhatsApp | `#25D366` | Solo botón de contacto |

## 2. Tipografía

- Familia: system-ui (-apple-system / Segoe UI / Helvetica / Arial)
- Sin fuentes externas.
- Jerarquía: H1 2.8rem / H2 2rem / H3 1.15rem / Body 1rem / Small 0.93rem / Label 0.8rem uppercase.

## 3. Logo

- `logo.svg` para fondos claros.
- `logo-autor.svg` para contenido personal de Sebastián.
- Mantener espacio libre igual a la altura de la “S” alrededor del logo.

## 4. Rutas visuales

- **Institucional (SACsi):** fondo neutral o surface, logo institucional, tono directo, foco en servicio/resultado.
- **Personal (Sebastián):** mismo sistema visual, logo-autor, tono cercano, foco en aprendizaje/experiencia.

Ambas rutas comparten paleta y tipografía. No crear variantes de color.

## 5. Reglas de uso

✅ Usar:
- Paleta navy/grises con acento azul eléctrico solo para interacción.
- Imágenes propias de `public/assets/` optimizadas.
- Tarjetas con border-radius 16px, botones 8px.
- Verde WhatsApp exclusivo en CTA de contacto.

❌ No usar:
- Verde WhatsApp en fondos, iconos decorativos, badges.
- Sombras múltiples o elevaciones inconsistentes.
- Animaciones decorativas sin propósito.
- Imágenes sin recortar o con ratio inconsistente.

## 6. Accesibilidad mínima

- Contraste mínimo AA: 4.5:1 para texto normal, 3:1 para texto grande.
- Usar `tertiary-dark (#0066CC)` en texto pequeño sobre fondos claros.
- No usar `tertiary (#0A7CFF)` como color de texto normal sobre blanco (3.5:1, insuficiente).

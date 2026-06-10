# Decisiones de Diseño

> Documentación de las decisiones de diseño tomadas durante el rebranding de SACsi.
> Issue #19 — Fase 0 (Fundación)

---

## 1. Paleta Navy + Azul Eléctrico

**Decisión:** Usar navy profundo (#1A1A2E) como color primario y azul eléctrico (#0A7CFF) como único acento de interacción.

**Fundamento:** El target de SACsi son dueños de PyMEs y emprendedores no técnicos que buscan confianza y profesionalismo. El navy transmite solidez, seriedad y estabilidad — atributos críticos para una empresa que maneja tecnología y datos. El azul eléctrico como acento único señala interactividad sin agregar ruido visual. Se evitó una paleta colorida porque el target valora la claridad por sobre la espectacularidad visual.

**Alternativas descartadas:** Paletas con colores cálidos (naranja, rojo) o verdes vibrantes se descartaron por transmitir urgencia o informalidad. Una paleta monocromática completa se descartó por falta de diferenciación en elementos interactivos.

---

## 2. Tipografía del Sistema

**Decisión:** Usar la pila de fuentes del sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`) sin cargas externas de fonts.

**Fundamento:** Cada fuente externa agrega una solicitud HTTP adicional y retrasa la primera pintura con contenido (FCP). En GitHub Pages sin CDN avanzado, cada recurso externo impacta directamente en Lighthouse. Las fuentes del sistema ya están cacheadas en el dispositivo del usuario, ofrecen la máxima familiaridad visual, y no requieren negociación de licencias. Además, las fuentes nativas se renderizan más rápido y evitan el flash de texto invisible (FOIT) o el flash de texto sin estilo (FOUT).

**Alternativas descartadas:** Google Fonts (Inter, Roboto) se descartaron por el costo en performance y la dependencia externa. Una fuente variable custom se descartó por complejidad y mantenimiento.

---

## 3. Mobile-First Responsive

**Decisión:** Diseñar primero para pantallas chicas (< 600px) y luego adaptar a desktop con media queries de `min-width`.

**Fundamento:** Según datos del mercado argentino, más del 60% del tráfico web de PyMEs proviene de dispositivos móviles. Los dueños de PyMEs consultan servicios desde el celular mientras están en movimiento. Diseñar mobile-first fuerza a priorizar contenido esencial, simplificar la navegación y optimizar para pantallas táctiles. Además, es más fácil escalar de mobile a desktop que viceversa, y Google indexa con prioridad la versión mobile (Mobile-First Indexing).

**Alternativas descartadas:** Desktop-first o responsive genérico sin punto de quiebre claro se descartaron porque históricamente generaban experiencias pobres en mobile.

---

## 4. WhatsApp como CTA Principal

**Decisión:** Usar WhatsApp como canal de contacto primario, con el verde corporativo de WhatsApp (#25D366) como color exclusivo del botón de contacto directo.

**Fundamento:** En Argentina, WhatsApp es el canal de comunicación predominante para PyMEs y emprendedores. Prefieren escribir un mensaje directo antes que llenar un formulario web o hacer una llamada. SACsi ha validado internamente que la tasa de conversión por WhatsApp es significativamente más alta que por formulario de contacto. El botón de WhatsApp en el hero permite la conversión inmediata sin fricción.

**Alternativas descartadas:** Formulario como CTA principal (más fricción, menor conversión), llamada telefónica (no es el hábito del target).

---

## 5. Sin Frameworks Externos

**Decisión:** Construir el sitio con HTML, CSS y JavaScript vanilla — sin Bootstrap, Tailwind, jQuery, React, ni ningún framework o biblioteca externa.

**Fundamento:** El sitio es estático y hosteado en GitHub Pages. No necesita JavaScript del lado del servidor, enrutamiento complejo, ni estado reactivo. Usar frameworks agregaría cientos de KB innecesarios, complejidad de tooling, y dependencias que requieren mantenimiento. CSS vanilla con custom properties es más que suficiente para el alcance del proyecto. La simplicidad garantiza: cero dependencias que actualizar, builds instantáneos (no hay build), y máxima portabilidad.

**Alternativas descartadas:** Bootstrap (pesado, sobrescribe estilos propios), Tailwind (requiere build step, complejidad innecesaria para un sitio chico), React/Vue (overkill total para un sitio de 5 páginas estáticas).

---

## 6. Decisiones Técnicas Adicionales

### Sin framework CSS
Se usa CSS vanilla con custom properties referenciando los tokens de DESIGN.md. Esto permite mantener una única fuente de verdad y cambiar la paleta completa modificando solo las variables en un archivo.

### Sin build step
Todo el sitio se abre directamente en el navegador sin necesidad de compilación. Ideal para GitHub Pages donde no hay servidor que ejecute build steps.

### Arquitectura plana de archivos
Cada página es un `.html` independiente en la raíz. Sin rutas anidadas, sin enrutamiento dinámico. Máxima simplicidad y compatibilidad.

---

## Historial de Issues

### Issue #17 — Crear DESIGN.md con tokens de marca siguiendo Google Design Spec

**Problema:** El proyecto necesitaba una especificación de diseño única y autoritativa que definiera colores, tipografía, espaciado y componentes. Sin esto, el desarrollo visual sería inconsistente.

**Solución:** Se creó `DESIGN.md` siguiendo el formato de especificación de diseño de Google (YAML frontmatter + Markdown). El archivo define tokens de diseño, componentes, y reglas de uso. Se validó con el linter [`@google/design.md`](https://github.com/google/design.md) para asegurar que cumple con el estándar.

**Archivos involucrados:** `DESIGN.md` (raíz del repositorio)

**Resultado:** Design tokens definidos, componentes especificados, y documentación validada contra el linter de Google.

### Issue #18 — Anonimizar referencias a la empresa de inspiración original

**Problema:** El repositorio contenía referencias a la empresa de inspiración original del tema mobile1. Era necesario eliminar cualquier mención o atribución para evitar confusiones y consolidar la marca SACsi como propia.

**Solución:** Se realizó una búsqueda recursiva en todo el repositorio con `grep -r` para encontrar cualquier referencia. Se encontró exactamente 1 ocurrencia en un archivo de metadata. Se reemplazó con el nombre de SACsi y se verificó con una segunda búsqueda que no quedaran ocurrencias restantes (0 ocurrencias confirmadas).

**Archivos involucrados:** Archivo con metadata del tema (wiki/)

**Resultado:** 0 referencias a la empresa original en el repositorio. Marca completamente anonimizada.

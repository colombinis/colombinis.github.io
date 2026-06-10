# SACsi Rebranding — Wiki

Bienvenido a la documentación del proyecto de rebranding de SACsi.

## Indice

- [Plan de Rebranding](Plan-de-Rebranding)
- [DESIGN.md — Tokens de Marca](https://github.com/colombinis/colombinis.github.io/blob/master/DESIGN.md)
- [Glosario](Glosario)
- [SITEMAP — Arquitectura de Contenido](SITEMAP)
- [SERVICE_COPY — Redacción de Servicios](SERVICE_COPY)

## Propuesta de Valor — F1 (Issue #20)

### Value Proposition (Homepage Hero)

La propuesta de valor de SACsi se comunica en el hero de la homepage con tres niveles de información, diseñados para que un visitante entienda qué hace la empresa en menos de 8 segundos sin hacer scroll:

| Nivel | Texto | Función |
|-------|-------|---------|
| **Label** (label-uppercase) | `SOLUCIONES INFORMÁTICAS` | Categoriza el servicio de inmediato |
| **H1** (headline principal) | `Tecnología simple para PyMEs que quieren crecer` | Comunica qué hace (tecnología), para quién (PyMEs) y qué resultado (crecer) |
| **Subtitle** (body-md) | `Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online. Más de 15 años ayudando a empresas como la tuya a ganar tiempo, reducir costos y vender más.` | Detalla los 3 servicios principales y el resultado concreto (ganar tiempo, reducir costos, vender más) |

### Principios de Copy

- **Sin jerga técnica**: no se usan términos como "desarrollo full-stack", "SaaS", "integración API". Se usa lenguaje simple: "automatizamos procesos", "software a medida", "presencia online".
- **Orientado a resultados**: cada servicio se describe por el beneficio para el cliente, no por la tecnología.
- **Argentino rioplatense**: se usa "PyMEs", "empresas como la tuya", "consultános" — tono profesional pero cercano.
- **8-second test**: un visitante que no conoce SACsi puede repetir después de 8 segundos: "SACsi es una empresa de tecnología que ayuda a PyMEs a automatizar procesos, hacer software y vender más online."

### Target

Dueños de PyMEs y emprendedores no técnicos que necesitan automatización y desarrollo de software pero buscan confianza, resultados medibles y comunicación clara. Principalmente en Rosario, Santa Fe y Argentina.

### CTA Strategy

- **CTA primario**: WhatsApp (`hero__cta` con color `--whatsapp` #25D366) — "Consultános sin cargo". El verde WhatsApp indica canal de chat directo, que es el medio de contacto preferido del target.
- **CTA secundario**: "Conocé más" (botón outline) — lleva a la página de contacto para quienes prefieren un formulario tradicional.
- Ambos visibles sin scrolling en mobile y desktop.

## Estructura del Proyecto

El rebranding se organiza en 5 fases:

| Fase | Nombre | Issues |
|------|--------|--------|
| F0 | Fundacion | DESIGN.md, Anonimizar, Wiki |
| F1 | Estructura | Investigacion, Arquitectura, UI/UX |
| F2 | Construccion | Homepage, Servicios, Proceso |
| F3 | Conversion | Metricas, FAQ, Contacto |
| F4 | Crecimiento | SEO, Analytics |
| F5 | Cierre | QA, Deploy |

## Stack Tecnologico

- Sitio static HTML/CSS/JS hosteado en GitHub Pages
- Sin frameworks externos — CSS vanilla con diseno mobile-first
- DESIGN.md como source of truth de tokens visuales
- Google Tag Manager + Analytics 4 para medicion

## Enlaces

- [Repositorio](https://github.com/colombinis/colombinis.github.io)
- [Sitio en vivo](https://sacsi.com.ar)

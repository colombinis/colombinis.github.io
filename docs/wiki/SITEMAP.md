# SITEMAP — Arquitectura de Contenido

> Documento de arquitectura de contenido para el rebranding de SACsi.
> Fase 1 (Estructura) — Issue #21

## Principios de Arquitectura

- **Mobile-first**: la navegación debe funcionar en una columna en mobile
- **8-second rule**: un visitante debe entender qué ofrecemos en menos de 8 segundos
- **Conversión en 3 clics**: landing → servicio → CTA → contacto
- **Sin jerga técnica**: lenguaje para dueños de PyME, no para programadores
- **Max 5 items en nav**: para no abrumar en mobile

## Estructura del Sitio

Cada página sigue la misma **progresión de contenido**:

```
Hero → Soluciones → Cómo trabajamos → Métricas/Casos → FAQ → CTA Final
```

### Flujo de navegación para conversión

```
Landing (index.html)
  │
  ├─► Servicio 1 (página de servicio)
  ├─► Servicio 2 (página de servicio)
  └─► Servicio 3 (página de servicio)
        │
        └─► CTA interno (WhatsApp / formulario)
              │
              └─► Contacto (contacto.html)
```

El camino ideal de un visitante con intención de compra:

1. **Aterriza** en el Hero de la homepage (entiende qué hace SACsi en 8 segundos)
2. **Explora** la sección de Soluciones (elige el servicio que necesita)
3. **Hace clic** en un servicio y lee cómo soluciona su problema
4. **Ve** el CTA específico de ese servicio ("Consultá por este servicio")
5. **Contacta** vía WhatsApp (CTA primario) o formulario (CTA secundario)

## Navegación Principal (max 5 items)

| # | Item | Página | Notas |
|---|------|--------|-------|
| 1 | Inicio | `index.html` | Hero con propuesta de valor |
| 2 | Servicios | `index.html#servicios` o páginas individuales | Sección de tarjetas o página de servicios |
| 3 | Cómo trabajamos | `index.html#proceso` | Sección que explica el proceso en 3-4 pasos |
| 4 | Sobre nosotros | `sobre-nosotros.html` | Quiénes somos, experiencia, valores |
| 5 | Contacto | `contacto.html` | WhatsApp + formulario |

> **Nota:** "Servicios" puede ser un dropdown o un link a una sección en la homepage
> con tarjetas que lleven a cada página de servicio individual.

## Mapa de Páginas

### 1. Homepage (`index.html`)

| Sección | Contenido | Estado |
|---------|-----------|--------|
| Hero | Label + H1 + Subtítulo + 2 CTAs | ✅ Listo (Issue #20) |
| Soluciones | 3 tarjetas de servicio con hover | ⬜ Fase 2 |
| Cómo trabajamos | 3-4 pasos del proceso | ⬜ Fase 2 |
| Métricas/Casos | Logros, clientes, datos concretos | ⬜ Fase 3 |
| FAQ | Preguntas frecuentes | ⬜ Fase 3 |
| CTA Final | Fondo primary + WhatsApp | ⬜ Fase 3 |

### 2. Páginas de Servicio (3 individuales)

Cada página de servicio sigue esta estructura:

```
Hero (nombre + tagline)
  │
  ├─► Problema que resuelve
  ├─► Solución que ofrecemos
  ├─► Beneficios medibles (claim cuantificable)
  ├─► Cómo funciona (2-3 pasos)
  └─► CTA específico del servicio
```

#### Servicio 1: Automatización de Procesos

| Elemento | Descripción |
|----------|-------------|
| **Nombre corto** | Automatización de Procesos |
| **Problema** | Tareas manuales repetitivas que consumen tiempo y generan errores |
| **Solución** | Software que automatiza tareas administrativas, facturación, reportes |
| **Claim** | "Libera hasta 65% del tiempo administrativo de tu equipo" |
| **CTA** | "Automatizá tus procesos" → WhatsApp |

#### Servicio 2: Desarrollo de Software a Medida

| Elemento | Descripción |
|----------|-------------|
| **Nombre corto** | Software a Medida |
| **Problema** | Los programas estándar no se adaptan a cómo trabaja tu negocio |
| **Solución** | Creamos el sistema exacto que necesitás, ni más ni menos |
| **Claim** | "Sistemas que crecen con tu empresa, sin límites ni costos ocultos" |
| **CTA** | "Pedí tu sistema a medida" → WhatsApp |

#### Servicio 3: Presencia Online y Comercio Electrónico

| Elemento | Descripción |
|----------|-------------|
| **Nombre corto** | Presencia Online |
| **Problema** | Tu negocio no está en internet o no vende online |
| **Solución** | Sitio web profesional + tienda online lista para vender |
| **Claim** | "Llevá tu negocio a internet y empezá a vender 24/7" |
| **CTA** | "Creamos tu presencia online" → WhatsApp |

### 3. Cómo trabajamos (`index.html#proceso` o página separada)

Incluir en la homepage como sección, o crear página separada en Fase 2.

Pasos sugeridos:
1. **Contanos tu idea** — Una conversación sin compromiso para entender qué necesitás
2. **Te presentamos una propuesta** — Alcance, tiempos y presupuesto claro, sin sorpresas
3. **Ponemos manos a la obra** — Desarrollamos con entregas periódicas para que veas el avance
4. **Soporte continuo** — No desaparecemos después de entregar. Seguimos al lado

### 4. Sobre nosotros (`sobre-nosotros.html`)

Mantener pero modernizar. Valores: velocidad, sencillez, eficacia. Más de 15 años en Rosario.

### 5. Contacto (`contacto.html`)

Dos canales principales:
- **WhatsApp** (CTA primario) — El canal preferido del target PyME
- **Formulario web** (alternativa) — Para quienes prefieren escribir más detalles

### 6. Inteligencia Artificial (`/inteligencia-artificial/`)

Sección existente. Mantener como página independiente. Puede ser un cuarto servicio o un complemento.

## Sitemap Técnico (SEO `sitemap.xml`)

El `sitemap.xml` actual incluye 7 URLs. Con el rebranding se recomienda:

```
https://sacsi.com.ar/                          (prioridad 1.0)
https://sacsi.com.ar/sobre-nosotros.html        (prioridad 0.7)
https://sacsi.com.ar/contacto.html              (prioridad 0.7)
https://sacsi.com.ar/automatizacion-procesos.html       (prioridad 0.8)
https://sacsi.com.ar/programacion-sistemas-a-medida.html (prioridad 0.8) *
https://sacsi.com.ar/desarrollo-web-facebook-comercio-electronico.html (prioridad 0.8) *
https://sacsi.com.ar/inteligencia-artificial/   (prioridad 0.8)
```

> * Estos nombres de archivo pueden cambiar si se renombran en Fase 2.

## Wireframes (descripción)

### Mobile (< 600px) — Flujo de homepage

```
┌──────────────────────┐
│ [Logo]   [Nav ☰]     │  ← Header fijo
├──────────────────────┤
│                      │
│  SOLUCIONES INFORM.  │  ← Label
│                      │
│  Tecnología simple   │  ← H1
│  para PyMEs que     │
│  quieren crecer      │
│                      │
│  [Subtítulo de 2-3   │  ← Body
│   líneas]            │
│                      │
│  ┌────────────────┐  │
│  │ Consultános    │  │  ← CTA WhatsApp
│  │ sin cargo      │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Conocé más     │  │  ← CTA secundario
│  └────────────────┘  │
├──────────────────────┤
│                      │
│  SOLUCIONES          │  ← H2
│                      │
│  ┌────────────────┐  │
│  │ 🤖 Automatiz. │  │  ← Card servicio 1
│  │ Liberá tiempo  │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ 💻 Software    │  │  ← Card servicio 2
│  │ a medida       │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ 🌐 Presencia   │  │  ← Card servicio 3
│  │ online         │  │
│  └────────────────┘  │
│                      │
├──────────────────────┤
│  CÓMO TRABAJAMOS     │  ← H2
│                      │
│  ① Contanos tu idea  │
│  ② Propuesta clara   │
│  ③ Desarrollamos     │
│  ④ Soporte continuo  │
│                      │
├──────────────────────┤
│  RESULTADOS          │  ← H2 (Fase 3)
│  [métricas/casos]    │
│                      │
├──────────────────────┤
│  FAQ                 │  ← H2 (Fase 3)
│  [acordeón]          │
│                      │
├──────────────────────┤
│  [Fondo primary]     │
│                      │
│  ¿Empezamos?        │  ← H2
│                      │
│  ┌────────────────┐  │
│  │ Hablá con     │  │  ← CTA WhatsApp
│  │ nosotros      │  │
│  └────────────────┘  │
│                      │
├──────────────────────┤
│ [Links] [WhatsApp]   │  ← Footer
│ [Facebook] [Tel]     │
└──────────────────────┘
```

### Desktop (> 600px)

Mismo contenido pero en grilla de 2-3 columnas para servicios, proceso y métricas.
El hero centrado con max-width 720px. Navegación horizontal visible sin hamburguesa.

## Convenciones de Contenido

| Elemento | Especificación |
|----------|---------------|
| Tono | Profesional pero cercano ("cercano") |
| Idioma | Español rioplatense (argentino) |
| Jerga técnica | No usar. Reemplazar por lenguaje simple |
| Claims medibles | Incluir al menos 1 por servicio (ej: "65% del tiempo") |
| CTAs | Verbos en imperativo: "Consultá", "Automatizá", "Creamos" |
| Voseo | Sí, usar "vos", "tu negocio", "pedí" |

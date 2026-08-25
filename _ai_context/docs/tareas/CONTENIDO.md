# Contenido

> Fuente de verdad de la arquitectura de contenido y del copy. Fusiona los antiguos *SITEMAP* y *SERVICE_COPY*.

## Principios

- **Mobile-first**: la navegación funciona en una columna en mobile.
- **Regla de 8 segundos**: un visitante entiende qué ofrecemos en menos de 8 segundos.
- **Conversión en 3 clics**: landing → servicio → CTA → contacto.
- **Sin jerga técnica**: lenguaje para dueños de PyME, no para programadores.
- **Máx. 5 ítems** en la navegación principal.

## Propuesta de valor (hero de la homepage)

Tres niveles de información para el test de 8 segundos:

| Nivel | Texto | Función |
|-------|-------|---------|
| Label | `SOLUCIONES INFORMÁTICAS` | Categoriza el servicio de inmediato |
| H1 | `Tecnología simple para PyMEs que quieren crecer` | Qué hace (tecnología), para quién (PyMEs), qué resultado (crecer) |
| Subtítulo | `Automatizamos procesos, desarrollamos software a medida y potenciamos tu presencia online. Más de 15 años ayudando a empresas como la tuya a ganar tiempo, reducir costos y vender más.` | Detalla los 3 servicios y el resultado concreto |

### Target
Dueños de PyMEs y emprendedores no técnicos que necesitan automatización y desarrollo de software, y buscan confianza, resultados medibles y comunicación clara. Principalmente Rosario, Santa Fe y Argentina.

### CTA strategy
- **Primario**: WhatsApp (verde `--whatsapp` #25D366) — "Consultános sin cargo". Es el canal preferido del target.
- **Secundario**: "Conocé más" (botón outline) hacia contacto.
- Ambos visibles sin scroll en mobile y desktop.

## Navegación principal (máx. 5)

| # | Ítem | Ruta | Notas |
|---|------|------|-------|
| 1 | Inicio | `/` | Hero con propuesta de valor |
| 2 | Servicios | `/#servicios` o páginas individuales | Tarjetas → páginas de servicio |
| 3 | Cómo trabajamos | `/#como-trabajamos` | Proceso en 4 pasos |
| 4 | Sobre nosotros | `/sobre-nosotros` | Quiénes somos, experiencia, valores |
| 5 | Contacto | `/contacto` | WhatsApp + formulario |

## Estructura de la homepage

Progresión de contenido:

```
Hero → Soluciones → Cómo trabajamos → Métricas/Testimonios → Casos de éxito → FAQ → CTA final
```

| Sección | Contenido |
|---------|-----------|
| Hero | Label + H1 + subtítulo + 2 CTAs + **carrusel de casos de éxito** (render asíncrono) |
| Soluciones | 3 tarjetas de servicio con hover |
| Cómo trabajamos | 4 pasos: Descubrimiento, Diagnóstico, Prototipo, Producción |
| Métricas | 15+ años · 65% tiempo liberado · 50+ clientes · 2 semanas al prototipo |
| Testimonios | 3 testimonios |
| Todos los casos de éxito | Grilla con los **8 casos** completos |
| FAQ | 6 preguntas, acordeón accesible |
| CTA final | Fondo `--primary` + WhatsApp + email (`sacsi@sacsi.com.ar`) |

> El **carrusel** se ubica en el hero, debajo de los CTAs, y es el punto de entrada rápido a los casos; la grilla completa "Todos los casos de éxito" vive más abajo. El footer contiene solo el copyright (sin links de redes).

## Estructura de una página de servicio

```
Hero (nombre + tagline)
  ├─ Problema que resuelve
  ├─ Solución que ofrecemos
  ├─ Beneficio medible (claim cuantificable)
  ├─ Cómo funciona (2–4 pasos)
  └─ CTA específico del servicio → WhatsApp
```

---

## Copy de servicios

> Tono: profesional pero cercano. Idioma: español rioplatense (voseo). Sin jerga técnica, sin siglas. Se explican **resultados**, no tecnología.

### 1. Automatización de Procesos

- **Problema:** "Pasás horas cargando datos, haciendo cuentas en Excel y mandando mails con adjuntos. Parte de tu día se pierde en tareas repetitivas que una máquina haría más rápido y sin errores."
- **Solución:** Un sistema que se encarga solo de esas tareas: genera facturas, envía reportes, actualiza precios, sincroniza stock.
- **Cómo funciona:** 1) Relevamos qué se puede automatizar · 2) Diseñamos el sistema a medida · 3) Lo ponemos a funcionar.
- **Claim medible:** *"Liberá hasta 65% del tiempo administrativo de tu equipo."*
- **CTA:** "Consultá por este servicio" → WhatsApp.
- **Ejemplos:** facturación electrónica automática · reportes de ventas diarios por mail · sincronización tienda↔depósito · recordatorios de pago.
- **Diferencial:** no vendemos software genérico; analizamos tu negocio y creamos algo a tu medida.

### 2. Software a Medida

- **Problema:** "Compraste un programa que prometía todo, pero terminás adaptándote vos a él. Perdés tiempo, plata y paciencia."
- **Solución:** El sistema exacto que tu negocio necesita, ni más ni menos.
- **Cómo funciona:** 1) Escuchamos qué necesitás · 2) Diseñamos a tu medida · 3) Desarrollamos con entregas cada pocos días · 4) Ajustamos hasta que quede justo.
- **Claim medible:** *"Sistemas hechos a tu medida, hasta un 50% más rápido que adaptar un programa genérico."*
- **CTA:** "Contanos tu idea" → WhatsApp.
- **Ejemplos:** gestión de pedidos para distribuidora · portal de facturas/pagos para clientes · app interna de partes de trabajo · portal de proveedores.
- **Diferencial:** +15 años desarrollando para PyMEs.

### 3. Presencia Online y Comercio Electrónico

- **Problema:** "Si tu negocio no está en internet, perdés clientes todos los días. No necesitás algo rebuscado: necesitás algo simple, profesional, que venda."
- **Solución:** Sitio web profesional con o sin tienda online. Rápido, limpio, pensado para vender.
- **Cómo funciona:** 1) Definimos qué necesitás · 2) Diseñamos un sitio limpio y responsive · 3) Lo publicamos y te enseñamos a manejarlo.
- **Claim medible:** *"Llevá tu negocio a internet y empezá a vender 24/7 — hasta duplicar tus consultas online."*
- **CTA:** "Empezá hoy" → WhatsApp.
- **Ejemplos:** sitio institucional · tienda online nacional · integración con Instagram/Facebook · panel de administración sencillo.
- **Diferencial:** nada de plantillas genéricas; foco en usabilidad y conversión.

### 4. (Futuro) Inteligencia Artificial

Servicio potencial, aún **no implementado** (la vieja página
`/inteligencia-artificial/` se eliminó con el legacy).

**Estado (MAR-04, 2026-08-04):** fuera del scope de la auditoría actual.
Evaluado en fase 2 — la decisión fue NO agregar el 4to servicio IA en
este ciclo. El gap queda documentado y se evaluará en una tarea futura
post-auditoría (ver `_ai_context/docs/tareas/MAR-04-servicio-ia.md`).

Claim potencial cuando se implemente: *"IA aplicada a tu negocio —
chatbots de soporte, generación de contenido y automatización
inteligente"*. Renombrar de "machine learning" (académico) a
"IA aplicada" para alinear con el posicionamiento híbrido
"PHP + IA aplicada" de la marca personal del fundador.

Requerimientos para habilitar el servicio:
- Renombrar el claim
- Agregar página `src/pages/servicios/ia.astro`
- Actualizar hero (`src/pages/index.astro`) para mencionar 4 servicios
- Agregar 2-3 casos de IA en `src/data/casos-exito.json`
- Renombrar título de la sección "Soluciones" a "Soluciones" ( manter
  3 → 4 cards en la grilla de homepage)

---

## Casos de éxito (8)

La fuente de datos es `src/data/casos-exito.json`; cada caso tiene su página de detalle en `src/pages/casos-exito/<slug>/`. Los 5 casos WordPress se sumaron para evidenciar competencias que un reclutador de ese perfil evalúa. Cada página de detalle sigue el patrón: **deseo del cliente → cómo visualizaba el logro → solución → stack técnico → métricas**.

| # | Caso | Slug | Enfoque |
|---|------|------|---------|
| 1 | Tienda de ropa usada | `tienda-ropa-usada` | E-commerce PyME |
| 2 | Consultorio de psicología | `consultorio-psicologia` | Presencia online / turnos |
| 3 | Ferretería (gas y plomería) | `ferreteria-gas-plomeria` | Tienda online sin fricción |
| 4 | Estudio de arquitectura | `tema-wordpress-a-medida-gutenberg` | Tema a medida + bloques Gutenberg/ACF |
| 5 | Club de café de especialidad | `tienda-woocommerce-suscripciones` | WooCommerce + suscripciones |
| 6 | Medio digital | `wordpress-headless-nextjs` | WordPress headless + Next.js (WPGraphQL) |
| 7 | Rescate de e-commerce | `rescate-rendimiento-seguridad-wordpress` | Performance + hardening de seguridad |
| 8 | Academia online | `plataforma-cursos-lms-membresias` | LMS + membresías |

> **Nota de contenido:** las descripciones están redactadas para "lucir reales" y sirven de plantilla. A futuro se mapean a proyectos concretos o se crean como proyectos nuevos que se ajusten a cada narrativa.

---

## Cómo trabajamos (4 pasos)

1. **Descubrimiento** — Analizamos tu negocio y necesidades; recibís un diagnóstico claro.
2. **Diagnóstico** — Evaluamos la mejor solución; recibís propuesta con alcance, tiempos y presupuesto sin sorpresas.
3. **Prototipo** — Construimos una versión funcional; recibís entregas periódicas para sugerir ajustes.
4. **Producción** — Ponemos la solución en marcha; recibís soporte continuo post-entrega.

## Principios de copy

| Principio | Explicación |
|-----------|-------------|
| Sin jerga técnica | No: full-stack, SaaS, API, backend, frontend, deployment |
| Sin siglas en inglés | No: CRM, ERP, MVP |
| Orientado a resultados | Describir por el beneficio, no por la tecnología |
| Rioplatense / voseo | "consultános", "pedí", "empezá", "tu negocio" |
| Cercano | Profesional pero de igual a igual, no corporativo frío |
| < 8 segundos | Entender el servicio de una hojeada |

### Reemplazos

| ❌ Evitar | ✅ Usar |
|-----------|--------|
| Desarrollo web full-stack | Creamos tu sitio web o tienda online |
| Integración de APIs | Conectamos tus herramientas entre sí |
| Automatización RPA | Automatizamos las tareas repetitivas de tu negocio |
| Solución SaaS | Un sistema que usás por internet, sin instalar nada |
| MVP | Arrancamos con lo justo y necesario, después sumamos |
| Deployment | Lo ponemos en marcha |
| Backend / Frontend | La parte de adentro / la parte que se ve |

## Wireframe mobile (referencia)

```
┌──────────────────────┐
│ [Logo]      [Nav ☰]  │  Header
├──────────────────────┤
│ SOLUCIONES INFORM.   │  Label
│ Tecnología simple    │  H1
│ para PyMEs...        │
│ [Subtítulo]          │  Body
│ [ Consultános ]      │  CTA WhatsApp
│ [ Conocé más  ]      │  CTA secundario
├──────────────────────┤
│ SOLUCIONES (3 cards) │
│ CÓMO TRABAJAMOS (4)  │
│ RESULTADOS (métricas)│
│ FAQ (acordeón)       │
│ CTA FINAL (primary)  │
├──────────────────────┤
│ Footer (links/redes) │
└──────────────────────┘
```

En desktop (> 600px) el mismo contenido pasa a grillas de 2–3 columnas; el hero se centra con max-width 720px y la navegación es horizontal.

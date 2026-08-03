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
| Hero | Label + H1 + subtítulo + 2 CTAs |
| Soluciones | 3 tarjetas de servicio con hover |
| Cómo trabajamos | 4 pasos: Descubrimiento, Diagnóstico, Prototipo, Producción |
| Métricas | 15+ años · 65% tiempo liberado · 50+ clientes · 2 semanas al prototipo |
| Testimonios | 3 testimonios |
| Casos de éxito | 3 casos (tienda ropa usada, consultorio psicología, ferretería) |
| FAQ | 6 preguntas, acordeón accesible |
| CTA final | Fondo `--primary` + WhatsApp + email |

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

Sección existente en `/inteligencia-artificial/` (legacy). Se puede integrar como cuarto servicio o como complemento transversal. Claim potencial: *"Machine learning y automatización inteligente para empresas que quieren dar el salto."*

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

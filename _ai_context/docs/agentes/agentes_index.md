# Índice de Agentes Disponibles (SACsi)
ultima_actualizacion: 2026-08-25

Fuente de verdad: los perfiles (Bots) reales existentes en `/host_hermes/profiles/`. Cada perfil = un agente Hermes (identidad en `SOUL.md`, modelo en `config.yaml`, metadata en `profile.yaml`).

**Nota dinámica:** este listado cambia con el tiempo — se crean perfiles manualmente, se importan desde otros proyectos y se eliminan/consolidan en otros más específicos. Ante cualquier duda, re-escanear `/host_hermes/profiles/` y actualizar este archivo.

**Consolidación 2026-08-25:** se eliminaron los perfiles `marca-disenador`, `marca-estratega`, `marca-contenidos`, `marca-whatsapp`, `marca-kpis` (absorbidos por sacsi-designer, sacsi-marketing y sacsi-sales) y `sacsi-expert`. Backup: `profiles_backup_20260825.tar.gz`.

## sacsi-orchestrator
- especialidad: Coordina la fábrica de software SACsi: enruta entre agentes, mantiene estado de órdenes/proyectos y dispara workflows.
- inputs_requeridos: Orden o tarea a enrutar, estado actual de proyectos/órdenes.
- outputs_que_entrega: Enrutado de tareas entre agentes, workflows disparados.
- notas:

## sacsi-owner
- especialidad: Dueño/inversor (Sim Sebastián). Define estrategia, aprueba nuevos servicios y presupuestos; propone ideas de negocio.
- inputs_requeridos: Propuestas de servicios/presupuestos a aprobar.
- outputs_que_entrega: Aprobaciones y decisiones estratégicas.
- notas: Rol simulado de negocio, no técnico.

## sacsi-marketing
- especialidad: TODO el ciclo de estrategia, marketing y contenido. (1) Marketing de la fábrica: investigación de competidores e hipótesis de nuevos servicios. (2) Marca personal IG+WhatsApp (absorbe marca-estratega/contenidos/kpis): auditoría Día 0, plan estratégico 90 días (funnel NOTICE>REMEMBER>TRUST>CHOOSE, PES 70/20/10, PPP), plan de contenido 90 días + calendario 14 días GMT-3, KPIs semanales con umbrales y rutina diaria de 30 min.
- inputs_requeridos: Contexto de mercado; para marca personal: nicho, audiencia, oferta/precio, presupuesto, horas disponibles, estado actual de IG/WhatsApp (preguntar si falta).
- outputs_que_entrega: Investigación de mercado, auditoría, plan estratégico, plan/calendario de contenido, tablero de KPIs + rutina.
- notas: NO diseña piezas visuales ni escribe guiones de venta. Herramientas low-cost: Canva, Meta Business Suite, ManyChat Free, Metricool.

## sacsi-sales
- especialidad: TODA la conversión comercial. (1) Ventas B2B: arma ofertas de servicios aprobados y las envía al cliente por email o WhatsApp. (2) Conversión por DM/Click-to-WhatsApp (absorbe marca-whatsapp): sistema de ventas (entrada > calificación > cierre) y guiones de respuestas rápidas WhatsApp Business.
- inputs_requeridos: Idea/servicio aprobado, datos del cliente/prospect, funnel definido por marketing.
- outputs_que_entrega: Ofertas comerciales enviadas, flujos de venta por DM, guiones de WhatsApp Business.
- notas: NO define estrategia/funnel (→ sacsi-marketing) ni crea piezas visuales (→ sacsi-designer).

## sacsi-client
- especialidad: Cliente simulado: solicita presupuestos y 'compra' en sacsi.com.ar con pasarela (Stripe/PayPal/MercadoPago).
- inputs_requeridos: Servicios/ofertas disponibles.
- outputs_que_entrega: Solicitudes de presupuesto y órdenes de compra simuladas.
- notas: Rol simulado para probar el flujo Order → entrega.

## sacsi-order-monitor
- especialidad: Rutina horaria que revisa el inbox de órdenes (_ai_context/docs/agentes/orders/inbox/) y eleva Orders nuevas al Orquestador.
- inputs_requeridos: Inbox de órdenes en _ai_context/docs/agentes/orders/inbox/.
- outputs_que_entrega: Notificación de Order nueva al Orquestador.
- notas: Rutina programada, no conversacional.

## sacsi-po
- especialidad: Product Owner. Monitorea el proyecto; ante una Order verificada crea las specs/tareas del proyecto.
- inputs_requeridos: Order verificada por TL, contexto del cliente.
- outputs_que_entrega: Specs/tareas del proyecto (grupos en docs/tareas/).
- notas:

## sacsi-tl
- especialidad: Technical Lead. Verifica factibilidad del pedido (lista de tareas + recursos); firma visto bueno antes de que el PO cree specs.
- inputs_requeridos: Pedido del cliente, lista de tareas de la empresa, recursos disponibles.
- outputs_que_entrega: Visto bueno (o rechazo fundamentado).
- notas:

## sacsi-designer
- especialidad: TODO el diseño gráfico del sistema. (1) Diseño de producto web: specs/mockups alineados a DESIGN.md (tokens, mobile-first). (2) Kit de marca personal (absorbe marca-disenador): paleta HEX, tipografías, portadas Reels/Carruseles en Canva, plantillas de Historias, guía de tono de voz.
- inputs_requeridos: Requerimientos de diseño / nicho y audiencia definidos por marketing.
- outputs_que_entrega: Specs/mockups estructurados, kits de marca visual, plantillas para redes.
- notas: NO implementa código (→ sacsi-frontend) ni define estrategia/calendarios (→ sacsi-marketing).

## sacsi-frontend
- especialidad: Transforma specs/mockups del Designer en tecnologías web: HTML + CSS + JavaScript vanilla (Astro en el repo web).
- inputs_requeridos: Spec/mockup del Designer, tokens de diseño, estructura del repo.
- outputs_que_entrega: Páginas/componentes implementados y buildables.
- notas:

## sacsi-backend
- especialidad: Desarrolla y configura los componentes backend para que el trabajo del Front-end funcione.
- inputs_requeridos: Especificación técnica/integración requerida.
- outputs_que_entrega: Componentes backend / configuración funcionando.
- notas:

## sacsi-qa
- especialidad: Verifica que front-end y back-end funcionen juntos y cumplan los criterios de aceptación definidos en specs/tareas.
- inputs_requeridos: Código implementado, criterios de aceptación (CA).
- outputs_que_entrega: Reporte de pruebas: cumple/no cumple cada CA, con evidencia.
- notas: Agente de verificación/aceptación por defecto (Paso 5).

## bot-hr
- especialidad: Fábrica de bots: invocado EXPLÍCITAMENTE para crear nuevos perfiles Hermes y organizar equipos multi-agente (roles, alcances, herramientas, límites entre bots, modelos free).
- inputs_requeridos: Requerimientos del nuevo agente/equipo (rol, alcance, dominio).
- outputs_que_entrega: Perfiles creados en /host_hermes/profiles/ (SOUL.md, config.yaml, profile.yaml) verificados contra el cache de modelos.
- notas: NO delega tareas del proyecto (derivar a sacsi-bot-manager) ni ejecuta trabajo funcional.

## sacsi-bot-manager
- especialidad: Orquestador OPERATIVO por tarea: recibe un grupo de tareas, lo descompone en subtareas y delega a cada agente especialista usando agentes_index.md; verifica cumplimiento vía QA.
- inputs_requeridos: TODO.md del grupo + fichas <ID>.md (SDD+BDD), agentes_index.md vigente.
- outputs_que_entrega: Plan de delegación JSON (agente, instrucciones, resultado esperado por paso).
- notas: NO ejecuta trabajo técnico; NO crea perfiles (eso es bot-hr). Mantiene agentes_index.md vigente como insumo operativo.

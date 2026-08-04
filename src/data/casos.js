// Fuente única de verdad de los casos de éxito y proyectos tipo.
// Consumido por el endpoint /casos.json (para el carrusel asíncrono)
// y disponible para cualquier página que quiera listarlos.
//
// Campo `tipo`:
//   'caso-exito'    — PyMEs reales con resultado verificable (3 casos)
//   'proyecto-tipo' — Narrativas redactadas para mostrar capacidades
//                     WordPress a dueños PyME y reclutadores tech.
//                     Los testimonios son "Testimonio tipo" en la
//                     página de detalle (ver MAR-03, 2026-08-04).

export const casos = [
  {
    slug: 'tema-wordpress-a-medida-gutenberg',
    tipo: 'proyecto-tipo',
    title: 'Estudio de arquitectura con tema WordPress a medida',
    category: 'WordPress · Gutenberg',
    metric: '75% más rápido',
    excerpt:
      'Reemplazamos un sitio pesado hecho con page builder por un tema a medida con bloques Gutenberg editables. El equipo publica proyectos solo, sin romper el diseño.',
  },
  {
    slug: 'tienda-woocommerce-suscripciones',
    tipo: 'proyecto-tipo',
    title: 'Club de café de especialidad con suscripciones en WooCommerce',
    category: 'WooCommerce · Suscripciones',
    metric: '+60% ingresos recurrentes',
    excerpt:
      'Una marca que vendía por Instagram y cobraba por transferencia lanzó un club de suscripción con cobro recurrente automático y autogestión del cliente.',
  },
  {
    slug: 'wordpress-headless-nextjs',
    tipo: 'proyecto-tipo',
    title: 'Medio digital con WordPress headless y front-end en Next.js',
    category: 'Headless · Next.js',
    metric: 'LCP de 1.1s',
    excerpt:
      'Arquitectura headless: WordPress como CMS vía WPGraphQL y front en Next.js. Los redactores siguen usando el editor de siempre.',
  },
  {
    slug: 'rescate-rendimiento-seguridad-wordpress',
    tipo: 'proyecto-tipo',
    title: 'Rescate de un e-commerce WordPress lento y hackeado',
    category: 'Performance · Seguridad',
    metric: 'De 8s a 1.5s',
    excerpt:
      'Limpieza de malware, hardening de seguridad y optimización de rendimiento sin perder el catálogo ni el SEO. PageSpeed 95 y cero reinfecciones.',
  },
  {
    slug: 'plataforma-cursos-lms-membresias',
    tipo: 'proyecto-tipo',
    title: 'Academia online con LMS y membresías sobre WordPress',
    category: 'LMS · Membresías',
    metric: '+300 alumnos activos',
    excerpt:
      'Una capacitadora pasó de Zoom y Drive a su propia academia: acceso por membresía con pago recurrente, progreso del alumno y certificados automáticos.',
  },
  {
    slug: 'tienda-ropa-usada',
    tipo: 'caso-exito',
    title: 'Tienda de ropa usada con pagos automáticos a donantes',
    category: 'E-commerce · Automatización',
    metric: '-70% tareas administrativas',
    excerpt:
      'Inventario que se registra en dos pasos, publicación automática y pagos a donantes sin mover efectivo.',
  },
  {
    slug: 'consultorio-psicologia',
    tipo: 'caso-exito',
    title: 'Consultorio de psicología con alquiler de espacios de atención',
    category: 'Automatización · Agenda',
    metric: '-70% tareas administrativas',
    excerpt:
      'Agenda online, alquiler de consultorios automatizado y presentación a obras sociales centralizada.',
  },
  {
    slug: 'ferreteria-gas-plomeria',
    tipo: 'caso-exito',
    title: 'Ferretería familiar sin tiempo para la tienda online',
    category: 'E-commerce · PyME',
    metric: 'Tienda online sin fricción',
    excerpt:
      'Un negocio de accesorios de gas y plomería que necesitaba vender más por internet sin perder horas cargando stock ni configurando pagos.',
  },
]

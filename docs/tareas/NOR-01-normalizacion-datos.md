# NOR-01 — Normalización de Datos

## Estado: COMPLETADO ✅

- **Verificación**: `docs/tareas/NOR-01-verify.sh` — todos los checks pasan
- **Build Astro**: 36 páginas generadas sin errores (Node 22.12+)
- **Integridad referencial**: 0 errores

## Arquitectura Resultante

```
src/data/
├── servicios/
│   ├── schema_servicio.json       ← Schema: id, title, href, claim, short + hero_label, categoria_section_title, testimonios_section_title, testimoniales[], categorias_ids[]
│   ├── servicio_automatizacion.json
│   ├── servicio_software-a-medida.json
│   └── servicio_presencia-online.json
├── categorias/
│   ├── schema_categoria.json      ← Schema: id, servicio_id (FK), title, icon, descripcion, claim, beneficios[], casos[], trabajos[]
│   ├── categoria_facturacion-cobranzas.json
│   ├── categoria_stock-logistica.json
│   ├── categoria_reportes-dashboards.json
│   ├── categoria_sistemas-gestion.json
│   ├── categoria_integraciones.json
│   ├── categoria_apps-portales.json
│   ├── categoria_sitio-web-institucional.json
│   ├── categoria_tienda-online.json
│   └── categoria_contenido-seo-basico.json
├── trabajos/
│   ├── listado-trabajos.json      ← Índice maestro (10 trabajos)
│   └── detalle/
│       ├── schema_trabajo.json
│       ├── trabajo_landing.json
│       ├── trabajo_sitio-pro.json
│       ├── trabajo_ecommerce.json
│       ├── trabajo_auto-basico.json
│       ├── trabajo_auto-int.json
│       ├── trabajo_soft-chico.json
│       ├── trabajo_soft-grande.json
│       ├── trabajo_hora-tec.json
│       ├── trabajo_ret-basico.json
│       └── trabajo_ret-pro.json
├── casos-exito.json               ← 8 casos (6 tipo + 2 caso real), con trabajo_relacionado (opcional)
├── preguntas-frecuentes-solucion.json  ← 10 FAQs, indexadas por categoria_id
└── README.md                    ← (pendiente) documentación del esquema
```

## Decisiones tomadas (confirmadas por el usuario)

1. `config/site.json` — sincronizado: eliminada la sección `services` (réplica de soluciones.json). El menú del Header ahora se genera dinámicamente vía `getNavServicios()`.
2. Páginas de servicio hardcodeadas — reemplazadas por `[servicio].astro` (ruta dinámica genérica).
3. `casos-exito.json` — mantenido como archivo único (8 casos), con campo `trabajo_relacionado` opcional.
4. `listado-trabajos.json` — mantenido como índice maestro en `trabajos/` raíz.
5. `categorias` y `trabajos` — campo `categorias` normalizado a solo IDs (formato `"categoria_id"` en vez de `"servicio/categoria"`).

## Componentes migrados

| Archivo | Antes | Después |
|---------|-------|---------|
| `Header.astro` | `config.nav.links` con submenu hardcodeado | `getNavServicios()` desde `servicios/` + `categorias/` |
| `Footer.astro` | `config.services` + `trabajosData.trabajos` (import directo) | `getServicios()` + `getCategoriasByServicio()` + `getTrabajos()` desde `data-utils.ts` |
| `SolucionesSection.astro` | `soluciones.json` directo | `getServicios()` desde `data-utils.ts` |
| `TodosCasosSection.astro` | `casos-exito.json` directo | `getCasos()` desde `data-utils.ts` |
| `casos.json.js` | `casos-exito.json` directo | `getCasos()` desde `data-utils.ts` |
| `servicios/[servicio].astro` | (nuevo) | Carga servicio + categorías + testimonios desde datos normalizados |
| `servicios/[servicio]/[categoria].astro` | Busca dentro `soluciones.servicios[].categorias[]` | `getCategoriaByServicio()` desde `categorias/` (FK) |
| `trabajos/[trabajo].astro` | Carga `trabajo_<id>.json` desde `src/data/trabajos/` | Carga desde `src/data/trabajos/detalle/` |

## Archivos legacy preservados

- `src/data/soluciones.json` — conservado como backup (ya no importado por ningún componente)
- `src/data/preguntas-frecuentes-solucion.json` — sin cambios (estructura de FAQ flat, se mantiene)

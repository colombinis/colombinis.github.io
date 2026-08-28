# T01 — Header rebranding (logo + navegación jerárquica)

## Contexto
El header tenía: (1) logo viejo con colores deprecated (#00A1F1/#F65314), (2) texto "SOLUCIONES INFORMÁTICAS" todo en mayúsculas, (3) navegación plana sin jerarquía. Se requiere alinear al rebranding FASE 0-5.

## Spec
1. Logo moderno en `/logo.svg` (navy #1A1A2E + blue #0A7CFF)
2. Tagline: "Soluciones Informáticas" (S e I mayúsculas, resto minúsculas)
3. Navegación 3 niveles:
   - **Servicios** → Automatización / Software a Medida / Presencia Online → categorías (3er nivel)
   - **Recursos** → Blog / Recursos gratuitos / Cursos
   - Sobre nosotros

## Gherkin scenarios
```gherkin
Scenario: Logo moderno visible en header
  Given el sitio buildeado
  When abro index.html
  Then el <img> apunta a /logo.svg (no /logo-autor.svg)
  And no hay colores #00A1F1 o #F65314

Scenario: Tagline con iniciales mayúsculas
  Given el header renderizado
  When leo el texto del logo
  Then veo "Soluciones Informáticas" con S e I mayúsculas

Scenario: Navegación jerárquica 3 niveles
  Given el menú desplegado
  When paso el mouse por Servicios
  Then veo: Automatización de Procesos → Facturación y cobranzas / Stock y logística / Reportes y dashboards

Scenario: Menú Recursos desplegable
  When paso el mouse por Recursos
  Then veo: Blog, Recursos gratuitos, Cursos

Scenario: Mobile hamburger
  Given pantalla mobile
  When hago click en ☰
  Then se muestra el menú colapsable
```

## Plan
1. ✅ Crear `public/logo.svg` — nuevo branding
2. ✅ Actualizar `config/site.json` — `nav.links` jerárquico
3. ✅ Actualizar `LogoBrand.astro` — referenciar `/logo.svg`, tagline corregido
4. ✅ Reescribir `Header.astro` — dropdowns anidados (CSS + vanilla JS)
5. ✅ Actualizar `Footer.astro` — tagline "Soluciones Inteligentes"
6. ✅ Build + verify script

## Verification
```bash
bash _ai_context/docs/tareas/verify-header-rebranding.sh
```

## Estado
**DONE** — 23/23 checks OK ✅

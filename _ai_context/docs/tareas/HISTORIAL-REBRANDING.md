# Historial del Rebranding SACsi

> **Documento histórico.** Registro cerrado del rebranding del sitio SACsi
> (soluciones informáticas para PyMEs, Rosario, Argentina). Las fases F0-F5
> y las tareas T0-T16 están completas; los hallazgos H1-H18 resueltos.
>
> El trabajo nuevo se registra en [`TODO.md`](TODO.md).
>
> **Rama:** `v0_alternativo_rebranding` · **PR destino:** `master`
> **Cierre:** 2026-08-04

---

## 1. Objetivo del rebranding

Renovar la identidad digital de SACsi, pasando de un diseño antiguo
(`theme/mobile1`) a uno moderno, profesional y mobile-first, sobre un
stack mantenible (**Astro v7**) y con `DESIGN.md` como fuente única de
tokens de diseño.

---

## 2. Estado final de las fases (F0-F5)

| Fase | Nombre | Estado | Notas |
|------|--------|--------|-------|
| F0 | Fundación | ✅ | `DESIGN.md`, anonimización, wiki |
| F1 | Estructura | ✅ | Sitemap, copy, UI/UX responsive |
| F2 | Construcción | ✅ | Homepage y páginas en Astro |
| F3 | Conversión | ✅ | Social proof, FAQ, CTAs |
| F4 | Crecimiento | ✅ | SEO por página, GTM `GTM-T7PWJ99`, sitemap automático |
| F5 | Cierre | ✅ | QA, legacy eliminado, deploy workflow |

---

## 3. Hallazgos del análisis (H1-H18)

| # | Hallazgo | Severidad | Resolución |
|---|----------|-----------|------------|
| H1 | La documentación decía "HTML vanilla" pero el sitio ya fue migrado a Astro v7 | Alta | Docs reescritos |
| H2 | Rama documentada no coincidía con la real | Media | Corregida |
| H3 | `DESIGN.md` duplicado (raíz + wiki), byte-idéntico | Media | Eliminado el de la wiki |
| H4 | QA-Checklist validaba HTML estático, no las páginas `.astro` | Alta | QA re-ejecutado |
| H5 | Páginas duplicadas (`.html` raíz vs `.astro`) | Media | Legacy eliminado |
| H6 | `dist/` commiteado en git | Media | Quitado + `.gitignore` |
| H7 | `inteligencia-artificial/`, `theme/mobile1/` sin migrar | Media | Eliminados |
| H8 | Token drift: `global.css` vs `DESIGN.md` | Alta | Tokens reconciliados |
| H9 | GTM/GA4 era placeholder vacío | Media | GTM `GTM-T7PWJ99` centralizado |
| H10 | No existía GitHub Action para deploy | Alta | Workflow `deploy.yml` creado |
| H11 | Páginas sin estilos (scoped CSS en Astro) | Crítica | Design system promovido a `global.css` |
| H12 | 24 links rotos a URLs legacy `.html` | Alta | Migrados a formato directorio |
| H13 | FAQ no funcional (script dentro de style) | Alta | Convertido a `<script>` real |
| H14 | Hamburger no funcional (server-side inerte) | Alta | Toggle client-side en `Header.astro` |
| H15 | Nav rota (no había página índice en `/servicios/`) | Media | Creada `src/pages/servicios/index.astro` |
| H16 | Assets fuera de `public/` | Alta | Movidos a `public/` |
| H17 | Caracteres CJK corruptos en `software-a-medida.astro` | Baja | Corregido a español |
| H18 | `CaseStudyLayout.astro` era código muerto | Baja | Eliminado |

---

## 4. Tareas ejecutadas (T0-T16)

| Tarea | Fase | Descripción | Ref | Estado |
|-------|------|--------------|-----|--------|
| T0 | F0-1 | Consolidar y corregir la wiki | — | ✅ |
| T1 | F2 | Re-ejecutar QA sobre las páginas `.astro` | H4 | ✅ |
| T2 | F2 | Verificar componentes y responsive | — | ✅ |
| T3 | F3 | Validar formulario de contacto end-to-end | — | ✅ |
| T4 | F3 | Verificar FAQ accesible y CTAs de WhatsApp | — | ✅ |
| T5 | F4 | Restaurar analytics (GTM/GA4) | H9 | ✅ |
| T6 | F4 | Reconciliar token drift `global.css` ↔ `DESIGN.md` | H8 | ✅ |
| T7 | F4 | Metadatos SEO por página | — | ✅ |
| T8 | F5 | Limpieza de legacy (`.html`, `theme/`, `inteligencia-artificial/`) | H5,H7 | ✅ |
| T9 | F5 | Sacar `dist/` del control de versiones | H6 | ✅ |
| T10 | F5 | Definir deploy de Astro a GitHub Pages | H10 | ✅ |
| T11 | F5 | QA final + build + deploy | — | ✅ |
| T12 | F5+ | Casos de éxito para perfil desarrollador WordPress (5 nuevos) | — | ✅ |
| T13 | F5+ | Carrusel de casos con render asíncrono | — | ✅ |
| T14 | F5+ | Reubicar carrusel y reducir espacio en blanco del hero | — | ✅ |
| T15 | F5+ | Email de contacto y footer (`sacsi@sacsi.com.ar`) | — | ✅ |
| T16 | F5+ | Correcciones de auditoría (`meta theme-color`, Vite hosts) | — | ✅ |

> **Auditoría (build de producción):** Web Vitals excelentes (FCP/LCP ~148ms,
> CLS 0, TTFB 74ms). SEO impecable. Accesibilidad: 0 imágenes sin `alt`.

---

## 5. Pendientes post-deploy

Estos items se validan en producción (post merge a master) y se registran
en [`DEP-01`](DEP-01-post-deploy-validacion.md):

- [ ] Google Analytics recibe eventos reales
- [ ] Formulario de contacto envía mails
- [ ] Enlaces WhatsApp operativos
- [ ] Lighthouse > 80 URL productiva
- [ ] SSL vigente
- [ ] Monitorear 48 h post-lanzamiento

---

## 6. Plan de rollback

Si el despliegue falla:
1. `git checkout master`
2. Re-publicar el estado anterior de GitHub Pages
3. Esperar 2-5 minutos para propagación
4. Verificar que https://sacsi.com.ar responde

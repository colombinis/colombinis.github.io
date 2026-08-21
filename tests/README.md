# tests/ — Estructura de tests (estándar de industria)

Carpeta centralizada de todos los tests de validación del proyecto SACsi.

```
tests/
├── unit/                 # lógica de negocio, sin navegador (Node.js + mock DOM)
│   └── flujos/           # herramienta de flujos de trabajo
│       ├── test-listado-trabajos.cjs       (UNIT-01, 9 checks)
│       └── test-flujo-operativo-trabajo.cjs (UNIT-02, 19 checks)
├── e2e/                  # end-to-end en navegador real (Chromium/Playwright)
│   ├── journeys/         # recorridos de usuario (UJ-02/03/04 + CTA funnel)
│   ├── catalogo/         # catálogo (CAT-04)
│   └── post-deploy/      # validación producción (DEP-01: Lighthouse/GA4/SSL)
```

## Convenciones

- **unit/**: tests de lógica pura. Usan mock DOM propio (sin jsdom). Correr
  con `node tests/unit/flujos/<test>.cjs`. Rutas relativas resueltas con
  `__dirname`.
- **e2e/**: tests de navegador real contra el build (`dist/`). Levantar con
  `python3 -m http.server` sobre `dist/` y correr Playwright/Chromium.
- No se agregan dependencias npm de testing salvo Playwright (para e2e).

## Inventario completo

Ver `docs/tareas/FEATURE-3-Tests-E2E-UserJourneys/TODO.md` (categorías A-E:
journey mapeo, journey E2E, catálogo E2E, unit flujos, post-deploy).

## Estado

- UNIT-01/02: ✅ DONE y validados en `tests/unit/flujos/`.
- E2E journeys / catalogo / post-deploy: ⏳ TODO (escribir por spec).

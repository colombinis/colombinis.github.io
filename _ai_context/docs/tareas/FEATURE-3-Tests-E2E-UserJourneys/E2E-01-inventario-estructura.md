---
id: E2E-01
title: Inventario y estructura de tests E2E de User Journeys
affects:
  pages: []
  components: []
  behaviors: []
---

# E2E-01 — Inventario y estructura de tests E2E

## Contexto

El proyecto SACsi no contaba con una carpeta `tests/` centralizada. Los
tests existían sueltos en carpetas de tareas o como intenciones en specs.
Esta spec consolida el **inventario de todos los tests** (existentes y
nuevos) y define la **estructura de carpetas estándar de industria** donde
vivirán. NO escribe código de tests; documenta qué cubrir y dónde.

## Spec (WHAT)

- Estructura `tests/` con `unit/` (lógica de negocio) y `e2e/` (navegador
  real: journeys, catalogo, post-deploy).
- Inventario categorizado (A-E) en `FEATURE-3-Tests-E2E-UserJourneys/TODO.md`.
- Tests existentes (UNIT-01/02) movidos a `tests/unit/flujos/` y validados.
- Tests nuevos (B/C/E) listados como TODO, listos para implementar por spec.

## Scenarios (BDD)

```gherkin
Scenario: El inventario de tests es completo y categorizado
  Given el repositorio del proyecto
  When se lista el inventario en FEATURE-3/TODO.md
  Then cada test tiene ID, categoría, estado y descripción de qué cubre

Scenario: Los tests existentes viven en tests/ estándar
  Given UNIT-01 y UNIT-02 antes sueltos en FEATURE-1
  When se mueven a tests/unit/flujos/
  Then ambos pasan (9/9 y 19/19) desde la nueva ubicación
```

## Plan (HOW)

1. Crear estructura `tests/{unit/flujos,e2e/{journeys,catalogo,post-deploy}}`.
2. Mover UNIT-01/02 a `tests/unit/flujos/`, ajustar rutas (`__dirname`,
   `detalle/`), validar ambos pasan.
3. Documentar inventario en `FEATURE-3/TODO.md` (categorías A-E).
4. Dejar B/C/E como TODO para specs futuras.

## Verification

```bash
# Los tests unitarios existentes deben pasar desde tests/unit/flujos/
node tests/unit/flujos/test-listado-trabajos.cjs   # esperado: 9 OK
node tests/unit/flujos/test-flujo-operativo-trabajo.cjs  # esperado: 19 OK
# El inventario debe estar en FEATURE-3/TODO.md con 13 tests (7 DONE, 5 TODO, 1 BLOCK)
```

## Estado

DONE — estructura creada, tests existentes movidos y validados, inventario
documentado. Los tests B/C/E quedan como TODO (implementación posterior).

## Notas

- Estándar de industria: `tests/` a nivel raíz, `unit/` vs `e2e/`, archivos
  por superficie. Sin dependencias npm de testing (mock DOM propio en .cjs).
- El framework E2E sugerido para B/C/E es Playwright/Chromium (ya usado en
  FEATURE-1 y CAT-04 como referencia).

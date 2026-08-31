/**
 * rentabilidad.test.ts
 * Tests de la lógica de negocio extraída a src/lib/rentabilidad.ts.
 * Runner: node:test nativo (Node 22, --experimental-strip-types). Sin dependencias.
 *
 * Cubre: caso OK, caso NO RENTABLE, bordes (horas 0, precio 0),
 * clasificación por umbral de 14% y helpers de formato.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  UMBRAL_RENTABLE_PCT,
  precioAK,
  calcularCosto,
  calcularMargenPct,
  clasificarMargenPct,
  estadoRentabilidad,
  calcularRentabilidad,
  formatoPorcentaje,
  formatoMiles,
} from './rentabilidad.ts';

// Tarifa de referencia del HTML: usd 20 * fx 1100 = 22.000 ARS/h
const TARIFA = 20 * 1100;

test('precioAK convierte miles de ARS a ARS', () => {
  assert.equal(precioAK(500), 500_000);
  assert.equal(precioAK(0), 0);
});

test('calcularCosto = horas * tarifa + costoFijo', () => {
  assert.equal(calcularCosto(15, TARIFA, 0), 330_000);
  assert.equal(calcularCosto(15, TARIFA, 50_000), 380_000);
  assert.equal(calcularCosto(0, TARIFA, 50_000), 50_000);
});

test('calcularMargenPct calcula (precio-costo)/precio*100', () => {
  // 500k - 330k sobre 500k = 34%
  assert.ok(Math.abs(calcularMargenPct(500_000, 330_000) - 34) < 1e-9);
});

test('calcularMargenPct con precio 0 devuelve 0 (guard del origen)', () => {
  assert.equal(calcularMargenPct(0, 330_000), 0);
  assert.equal(calcularMargenPct(-10, 330_000), 0);
});

test('clasificarMargenPct respeta umbral de 14% (PRD §1.1)', () => {
  assert.equal(clasificarMargenPct(UMBRAL_RENTABLE_PCT), 'RENTABLE');
  assert.equal(clasificarMargenPct(50), 'RENTABLE');
  assert.equal(clasificarMargenPct(5), 'AJUSTAR'); // 0..14
  assert.equal(clasificarMargenPct(0), 'AJUSTAR');
  assert.equal(clasificarMargenPct(-1), 'NO RENTABLE');
});

test('estadoRentabilidad: OK solo si AMBOS margenes >= 0', () => {
  assert.equal(estadoRentabilidad(10, 20), 'OK');
  assert.equal(estadoRentabilidad(0, 20), 'OK');
  assert.equal(estadoRentabilidad(-1, 20), 'NO RENTABLE');
  assert.equal(estadoRentabilidad(10, -5), 'NO RENTABLE');
});

test('CASO OK: solución rentable en todo el rango', () => {
  const r = calcularRentabilidad({
    precioMin: 500,
    precioMax: 700,
    horasMin: 15,
    horasMax: 20,
    costoFijo: 0,
    tarifaPorHora: TARIFA,
  });
  assert.equal(r.ok, true);
  assert.equal(r.estado, 'OK');
  // margen pesimista: (500k - 440k)/500k = 12% ; optimista: (700k-330k)/700k = 52.9%
  assert.ok(r.margenMinPct > 0);
  assert.ok(r.margenMaxPct > r.margenMinPct);
  assert.equal(r.precioMinArs, 500_000);
  assert.equal(r.costoMaxArs, 440_000);
});

test('CASO NO RENTABLE: el costo supera el precio minimo', () => {
  const r = calcularRentabilidad({
    precioMin: 100, // 100k ARS
    precioMax: 200,
    horasMin: 40,
    horasMax: 60, // 60*22k = 1.320k ARS de costo
    costoFijo: 0,
    tarifaPorHora: TARIFA,
  });
  assert.equal(r.ok, false);
  assert.equal(r.estado, 'NO RENTABLE');
  assert.ok(r.margenMinPct < 0); // (100k - 1.320k)/100k = -92%
  assert.equal(r.clasificacion, 'NO RENTABLE');
});

test('BORDE horas 0 con costoFijo 0 -> margen 100% (OK/RENTABLE)', () => {
  const r = calcularRentabilidad({
    precioMin: 500,
    precioMax: 700,
    horasMin: 0,
    horasMax: 0,
    costoFijo: 0,
    tarifaPorHora: TARIFA,
  });
  assert.equal(r.costoMinArs, 0);
  assert.equal(r.costoMaxArs, 0);
  assert.ok(Math.abs(r.margenMinPct - 100) < 1e-9);
  assert.equal(r.estado, 'OK');
  assert.equal(r.clasificacion, 'RENTABLE');
});

test('BORDE horas 0 pero costoFijo > 0 -> NO RENTABLE', () => {
  const r = calcularRentabilidad({
    precioMin: 100,
    precioMax: 200,
    horasMin: 0,
    horasMax: 0,
    costoFijo: 500_000, // costo fijo supera el precio minimo (100k)
    tarifaPorHora: TARIFA,
  });
  assert.equal(r.costoMaxArs, 500_000);
  assert.ok(r.margenMinPct < 0);
  assert.equal(r.estado, 'NO RENTABLE');
});

test('BORDE precio 0 -> margen 0 por guard, estado OK (fiel al origen)', () => {
  const r = calcularRentabilidad({
    precioMin: 0,
    precioMax: 0,
    horasMin: 15,
    horasMax: 20,
    costoFijo: 0,
    tarifaPorHora: TARIFA,
  });
  assert.equal(r.margenMinPct, 0);
  assert.equal(r.margenMaxPct, 0);
  assert.equal(r.estado, 'OK'); // guard: precio<=0 => margen 0 => cubre
});

test('breakeven: horas para cubrir costo fijo y precio piso', () => {
  const r = calcularRentabilidad({
    precioMin: 500,
    precioMax: 700,
    horasMin: 15,
    horasMax: 20,
    costoFijo: 110_000, // 5h a 22k/h
    tarifaPorHora: TARIFA,
  });
  assert.ok(Math.abs(r.breakeven.horasFijo - 5) < 1e-9);
  // precio piso escenario pesimista (horas 20): 20*22k + 110k = 550k => 550 k
  assert.ok(Math.abs(r.breakeven.precioMinK - 550) < 1e-9);
  // precio piso escenario optimista (horas 15): 15*22k + 110k = 440k => 440 k
  assert.ok(Math.abs(r.breakeven.precioMaxK - 440) < 1e-9);
});

test('breakeven con tarifa 0 no divide por cero', () => {
  const r = calcularRentabilidad({
    precioMin: 500,
    precioMax: 700,
    horasMin: 15,
    horasMax: 20,
    costoFijo: 110_000,
    tarifaPorHora: 0,
  });
  assert.equal(r.breakeven.horasFijo, 0);
  assert.equal(r.costoMinArs, 110_000);
});

test('formatoPorcentaje usa coma decimal es-AR', () => {
  assert.equal(formatoPorcentaje(34), '34,0%');
  assert.equal(formatoPorcentaje(-5.2), '-5,2%');
  assert.equal(formatoPorcentaje(12.5), '12,5%');
  assert.equal(formatoPorcentaje(0), '0,0%');
});

test('formatoMiles separa miles es-AR', () => {
  assert.equal(formatoMiles(1100), '1.100');
  assert.equal(formatoMiles(330), '330');
});

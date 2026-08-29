/**
 * rentabilidad.ts
 * ----------------------------------------------------------------------------
 * Lógica pura de cálculo de rentabilidad / breakeven extraída de las
 * herramientas standalone del backoffice comercial:
 *   - _ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/flujo-operativo-trabajo.html
 *   - _ai_context/docs/tareas/FEATURE-1-Validacion-de-flujos-de-negocio/listado-trabajos.html
 *
 * Extraído para cerrar FEATURE-3 (tests de lógica de negocio) y reutilizarse
 * luego en el catálogo público (mostrando rangos sin costo interno).
 *
 * UNIDADES (fieles a las herramientas origen):
 *   - precioMin / precioMax : miles de ARS (k)  -> se multiplican por 1000.
 *   - horasMin / horasMax   : horas estimadas del servicio.
 *   - costoFijo             : ARS (se suma al costo por horas).
 *   - tarifaPorHora         : ARS/h (en el HTML = usd * tipoCambio).
 *
 * Sin dependencias de DOM. Solo matemática pura + helpers de formato.
 */

// ===== UMBRALES (PRD §1.1 / lógica origen) =====
/** Margen comercial mínimo deseable: >= 14% se considera RENTABLE. */
export const UMBRAL_RENTABLE_PCT = 14;
/** Margen mínimo aceptable en la tabla de rangos: >= 0 ya es OK (cubre costo). */
export const UMBRAL_MARGO_MINIMO_PCT = 0;

// ===== TIPOS =====
export interface TrabajoRentabilidad {
  /** Precio mínimo del rango, en miles de ARS (k). */
  precioMin: number;
  /** Precio máximo del rango, en miles de ARS (k). */
  precioMax: number;
  /** Horas mínimas estimadas. */
  horasMin: number;
  /** Horas máximas estimadas. */
  horasMax: number;
  /** Costo fijo del servicio, en ARS (default 0). */
  costoFijo?: number;
  /** Tarifa interna, en ARS/h (en el HTML = usd * tipoCambio). */
  tarifaPorHora: number;
}

export type EstadoRentabilidad = 'OK' | 'NO RENTABLE';
export type ClasificacionMargen = 'RENTABLE' | 'AJUSTAR' | 'NO RENTABLE';

export interface Breakeven {
  /** Horas de trabajo facturables necesarias para cubrir solo el costo fijo, a la tarifa dada. */
  horasFijo: number;
  /** Precio piso (k) para margen 0 en el escenario de horas mínimas. */
  precioMinK: number;
  /** Precio piso (k) para margen 0 en el escenario de horas máximas. */
  precioMaxK: number;
}

export interface ResultadoRentabilidad {
  precioMinArs: number;
  precioMaxArs: number;
  costoMinArs: number;
  costoMaxArs: number;
  /** Margen % del escenario pesimista (precio min, horas max). */
  margenMinPct: number;
  /** Margen % del escenario optimista (precio max, horas min). */
  margenMaxPct: number;
  /** true si AMBOS márgenes >= 0 (cubre costo en todo el rango). */
  ok: boolean;
  estado: EstadoRentabilidad;
  /** Clasificación comercial según umbral de 14% (sobre el peor margen). */
  clasificacion: ClasificacionMargen;
  breakeven: Breakeven;
}

// ===== FUNCIONES PURAS =====

/** Convierte un precio en miles de ARS (k) a ARS. */
export function precioAK(precioK: number): number {
  return precioK * 1000;
}

/**
 * Costo total en ARS = horas * tarifaPorHora + costoFijo.
 * Fuente: `costoMin = horasMin * tasa + (costoFijo || 0)`.
 */
export function calcularCosto(
  horas: number,
  tarifaPorHora: number,
  costoFijo = 0,
): number {
  return horas * tarifaPorHora + (costoFijo || 0);
}

/**
 * Margen porcentual = (precioArs - costoArs) / precioArs * 100.
 * Si el precio es <= 0 no hay base: devuelve 0 (guard fiel a flujo-operativo-trabajo.html,
 * que usa `precioMinArs > 0 ? ... : 0`).
 */
export function calcularMargenPct(precioArs: number, costoArs: number): number {
  if (precioArs <= 0) return 0;
  return ((precioArs - costoArs) / precioArs) * 100;
}

/**
 * Clasifica un margen % según el umbral comercial del PRD §1.1:
 *   >= 14%  -> RENTABLE
 *   0..14%  -> AJUSTAR
 *   < 0%    -> NO RENTABLE
 * Fuente: `recalcAll()` en flujo-operativo-trabajo.html.
 */
export function clasificarMargenPct(pct: number): ClasificacionMargen {
  if (pct >= UMBRAL_RENTABLE_PCT) return 'RENTABLE';
  if (pct >= UMBRAL_MARGO_MINIMO_PCT) return 'AJUSTAR';
  return 'NO RENTABLE';
}

/**
 * Estado de la tabla de rangos: OK si AMBOS márgenes cubren el costo (>= 0),
 * sino NO RENTABLE. Fuente: `ok = margenMin >= 0 && margenMax >= 0`.
 */
export function estadoRentabilidad(
  margenMinPct: number,
  margenMaxPct: number,
): EstadoRentabilidad {
  return margenMinPct >= UMBRAL_MARGO_MINIMO_PCT &&
    margenMaxPct >= UMBRAL_MARGO_MINIMO_PCT
    ? 'OK'
    : 'NO RENTABLE';
}

/**
 * Calcula la rentabilidad completa de un trabajo a partir de su rango de
 * precios/horas, costo fijo y tarifa por hora.
 *
 * Devuelve costos y márgenes en pesimista (precioMin/horasMax) y optimista
 * (precioMax/horasMin), el estado OK/NO RENTABLE, la clasificación comercial
 * (umbral 14%) y los puntos de breakeven.
 */
export function calcularRentabilidad(t: TrabajoRentabilidad): ResultadoRentabilidad {
  const costoFijo = t.costoFijo || 0;
  const tarifa = t.tarifaPorHora || 0;

  // Escenario pesimista: precio mínimo vs horas máximas (mayor costo).
  const precioMinArs = precioAK(t.precioMin);
  const costoMaxArs = calcularCosto(t.horasMax, tarifa, costoFijo);
  const margenMinPct = calcularMargenPct(precioMinArs, costoMaxArs);

  // Escenario optimista: precio máximo vs horas mínimas (menor costo).
  const precioMaxArs = precioAK(t.precioMax);
  const costoMinArs = calcularCosto(t.horasMin, tarifa, costoFijo);
  const margenMaxPct = calcularMargenPct(precioMaxArs, costoMinArs);

  const ok = margenMinPct >= UMBRAL_MARGO_MINIMO_PCT &&
    margenMaxPct >= UMBRAL_MARGO_MINIMO_PCT;
  const estado = ok ? 'OK' : 'NO RENTABLE';

  // Breakeven: horas para recuperar el costo fijo a la tarifa dada, y
  // precio piso (k) para no perder plata en cada escenario.
  const horasFijo = tarifa > 0 ? costoFijo / tarifa : 0;
  const breakeven: Breakeven = {
    horasFijo,
    precioMinK: costoMaxArs / 1000,
    precioMaxK: costoMinArs / 1000,
  };

  return {
    precioMinArs,
    precioMaxArs,
    costoMinArs,
    costoMaxArs,
    margenMinPct,
    margenMaxPct,
    ok,
    estado,
    clasificacion: clasificarMargenPct(margenMinPct),
    breakeven,
  };
}

// ===== HELPERS DE FORMATO =====

/**
 * Formatea un porcentaje estilo es-AR con 1 decimal y coma decimal
 * (fiel a `(pct).toFixed(1).replace('.', ',') + '%'` del HTML origen).
 */
export function formatoPorcentaje(pct: number): string {
  const v = Number.isFinite(pct) ? pct : 0;
  return v.toFixed(1).replace('.', ',') + '%';
}

/**
 * Formatea un valor en miles de ARS (k) con separador de miles es-AR,
 * p.ej. 330 -> "330" ; 1100 -> "1.100". Sin sufijo.
 */
export function formatoMiles(valor: number): string {
  const v = Number.isFinite(valor) ? valor : 0;
  return Math.round(v).toLocaleString('es-AR');
}

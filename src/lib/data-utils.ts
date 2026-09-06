/**
 * data-utils.ts — Central de datos normalizados para SACsi
 *
 * Analogia Laravel: este archivo actúa como un "Repository" o "Service Provider"
 * que reúne la lógica de acceso a datos. En lugar de importar JSON crudos
 * directamente en cada componente (como haría un "controller" que lee la BD),
 * los componentes llaman a estas funciones que abstraen el origen de los datos.
 *
 * Las funciones son síncronas (SSG estático) y cachean resultados en memoria
 * durante el build. No dependen de I/O en runtime.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Ruta base de datos (relativa al proyecto Astro)
const DATA_DIR = join(process.cwd(), 'src/data');

// Cache en memoria (solo vida del build SSG)
let _cache: Record<string, unknown> | null = null;

interface Servicio {
  id: string;
  title: string;
  href: string;
  claim: string;
  short: string;
  hero_label: string;
  categoria_section_title: string;
  categorias_ids: string[];
}

interface Categoria {
  id: string;
  servicio_id: string;
  title: string;
  icon: string;
  descripcion: string;
  claim: string;
  beneficios: { texto: string; caso?: string }[];
  casos: string[];
  soluciones: string[];
}

interface SolucionSimple {
  id: string;
  nombre: string;
  categorias: string[];
  precioMin: number;
  precioMax: number;
  horasMin: number;
  horasMax: number;
  costoFijo: number;
  descripcion_publica: string;
}

interface PasoFlujo {
  orden: number;
  paso: string;
  entradas: string;
  salidas: string;
  descripcion: string;
  horas: number;
}

interface SolucionDetalle {
  id: string;
  nombre: string;
  categorias: string[];
  precioMin: number;
  precioMax: number;
  horasMin: number;
  horasMax: number;
  costoFijo: number;
  recibis?: string;
  necesitamos?: string;
  flujo: PasoFlujo[];
}

interface CasoExito {
  slug: string;
  tipo: string;
  label: string;
  title: string;
  category: string;
  metric: string;
  excerpt: string;
  tipo_solucion: {
    servicio: string;
    categoria: string;
    etiqueta: string;
  };
  solucion_relacionada?: string;
}

interface Testimonio {
  quote: string;
  autor: string;
  rol?: string;
  ubicacion?: string;
}

interface TestimonioData {
  servicio_id?: string;
  section_title: string;
  testimonios: Testimonio[];
}

interface DatosNormalizados {
  servicios: Servicio[];
  categorias: Categoria[];
  soluciones: SolucionSimple[];
  casos: CasoExito[];
  testimonios: TestimonioData[];
}

/**
 * Carga todos los datos normalizados en memoria (cache SSG).
 * Analogia: "Eloquent::all()" pero para los archivos JSON.
 */
function loadCache(): DatosNormalizados {
  if (_cache) return _cache as DatosNormalizados;

  const servicios: Servicio[] = [];
  const categorias: Categoria[] = [];
  const casos: CasoExito[] = [];
  const testimonios: TestimonioData[] = [];

  // 1. Cargar servicios (src/data/servicios/servicio_*.json)
  const serviciosDir = join(DATA_DIR, 'servicios');
  const servicioFiles = readdirSync(serviciosDir).filter(
    (f) => f.startsWith('servicio_') && f.endsWith('.json')
  );
  for (const file of servicioFiles) {
    const data = JSON.parse(
      readFileSync(join(serviciosDir, file), 'utf-8')
    );
    servicios.push(data as Servicio);
  }

  // 2. Cargar categorías (src/data/categorias/categoria_*.json)
  const categoriasDir = join(DATA_DIR, 'categorias');
  const categoriaFiles = readdirSync(categoriasDir).filter(
    (f) => f.startsWith('categoria_') && f.endsWith('.json')
  );
  for (const file of categoriaFiles) {
    const data = JSON.parse(
      readFileSync(join(categoriasDir, file), 'utf-8')
    );
    categorias.push(data as Categoria);
  }

  // 3. Cargar listado de soluciones (índice maestro)
  const listadoPath = join(DATA_DIR, 'soluciones', 'listado-soluciones.json');
  const listado = JSON.parse(readFileSync(listadoPath, 'utf-8'));
  const soluciones: SolucionSimple[] = listado.soluciones;

  // 4. Cargar casos de éxito
  const casosPath = join(DATA_DIR, 'casos-exito.json');
  const casosData = JSON.parse(readFileSync(casosPath, 'utf-8'));
  casos.push(...casosData);

  // 5. Cargar testimonios (src/data/testimonios/*.json)
  const testimoniosDir = join(DATA_DIR, 'testimonios');
  const testimonioFiles = readdirSync(testimoniosDir).filter(
    (f) => f.endsWith('.json')
  );
  for (const file of testimonioFiles) {
    const data = JSON.parse(
      readFileSync(join(testimoniosDir, file), 'utf-8')
    );
    testimonios.push(data as TestimonioData);
  }

  _cache = { servicios, categorias, soluciones, casos, testimonios };
  return _cache as DatosNormalizados;
}

/**
 * Devuelve todos los servicios.
 */
export function getServicios(): Servicio[] {
  return loadCache().servicios;
}

/**
 * Devuelve un servicio por su ID.
 */
export function getServicio(id: string): Servicio | undefined {
  return loadCache().servicios.find((s) => s.id === id);
}

/**
 * Devuelve todas las categorías (planas).
 */
export function getCategorias(): Categoria[] {
  return loadCache().categorias;
}

/**
 * Devuelve las categorías de un servicio específico.
 * Analogia Laravel: Servicio::find($id)->categorias
 */
export function getCategoriasByServicio(servicioId: string): Categoria[] {
  return loadCache().categorias.filter((c) => c.servicio_id === servicioId);
}

/**
 * Devuelve una categoría por su ID (busca global, sin importar servicio).
 * Analogia: Categoria::find($id)
 */
export function getCategoria(id: string): Categoria | undefined {
  return loadCache().categorias.find((c) => c.id === id);
}

/**
 * Devuelve una categoría dentro de un servicio específico.
 * Usado por la ruta /servicios/<servicio>/<categoria>/
 */
export function getCategoriaByServicio(
  servicioId: string,
  categoriaId: string
): Categoria | undefined {
  return loadCache().categorias.find(
    (c) => c.servicio_id === servicioId && c.id === categoriaId
  );
}

/**
 * Devuelve todas las soluciones (índice maestro).
 */
export function getSoluciones(): SolucionSimple[] {
  return loadCache().soluciones;
}

/**
 * Devuelve una solución por ID (índice maestro).
 */
export function getSolucion(id: string): SolucionSimple | undefined {
  return loadCache().soluciones.find((s) => s.id === id);
}

/**
 * Carga el detalle (flujo) de una solución desde soluciones/detalle/solucion_<id>.json.
 * Analogia: Solucion::find($id) con eager-load del flujo.
 */
export function getSolucionDetalle(id: string): SolucionDetalle | null {
  const detallePath = join(DATA_DIR, 'soluciones', 'detalle', `solucion_${id}.json`);
  try {
    return JSON.parse(readFileSync(detallePath, 'utf-8')) as SolucionDetalle;
  } catch {
    return null;
  }
}

/**
 * Devuelve todas las soluciones (índice maestro) que tienen asociada una categoría.
 * La pertenencia se lee del campo `categorias` de cada detalle solucion_<id>.json
 * (fuente de verdad). Analogia Laravel: Categoria::find($id)->soluciones
 */
export function getSolucionesByCategoria(categoriaId: string): SolucionSimple[] {
  return loadCache().soluciones.filter((s) =>
    getSolucionDetalle(s.id)?.categorias.includes(categoriaId)
  );
}

/**
 * Devuelve solo las categorías que tienen ≥1 solución asociada (CA-02).
 * Analogia Laravel: Categoria::whereHas('soluciones')->get()
 */
export function getCategoriasConSoluciones(): Categoria[] {
  return loadCache().categorias.filter(
    (c) => getSolucionesByCategoria(c.id).length > 0
  );
}

/**
 * Devuelve solo los servicios que tienen ≥1 categoría con ≥1 solución (CA-02).
 * Analogia Laravel: Servicio::whereHas('categorias.soluciones')->get()
 */
export function getServiciosConSoluciones(): Servicio[] {
  const catsConSoluciones = getCategoriasConSoluciones();
  return loadCache().servicios.filter((s) =>
    catsConSoluciones.some((c) => c.servicio_id === s.id)
  );
}

/**
 * Devuelve todos los casos de éxito.
 */
export function getCasos(): CasoExito[] {
  return loadCache().casos;
}

/**
 * Devuelve un caso de éxito por slug.
 */
export function getCaso(slug: string): CasoExito | undefined {
  return loadCache().casos.find((c) => c.slug === slug);
}

/**
 * Devuelve los testimonios asociados a un servicio específico.
 * Si no hay testimonios específicos, devuelve null.
 */
export function getTestimoniosByServicio(servicioId: string): TestimonioData | null {
  const found = loadCache().testimonios.find((t) => t.servicio_id === servicioId);
  return found ?? null;
}

/**
 * Devuelve los testimonios generales (homepage).
 */
export function getTestimoniosGenerales(): TestimonioData | null {
  const found = loadCache().testimonios.find((t) => t.servicio_id === undefined);
  return found ?? null;
}

/**
 * Genera la navegación jerárquica para el Header.
 * Lee desde servicios/ + categorias/ normalizados.
 * Elimina la necesidad de replicar la jerarquía en config/site.json.
 */
export function getNavServicios() {
  return getServicios().map((svc) => ({
    label: svc.title,
    href: svc.href,
    submenu: getCategoriasByServicio(svc.id).map((cat) => ({
      label: cat.title,
      href: `${svc.href}${cat.id}/`,
      icon: cat.icon,
    })),
  }));
}

#!/usr/bin/env node
/**
 * prebuild-padm-10.ts — PADM-10: script pre-build del catálogo de SACsi.
 *
 * Vive en el REPO PÚBLICO (colombinis/colombinis.github.io).
 * Lee la API de lectura (PADM-06) del repo privado (api.sacsi.com.ar) con el
 * service token de App A de Cloudflare Access, aplica una guardia de escritura
 * de defensa en profundidad, y genera src/data/*.json en este mismo repo.
 *
 * El script NO decide qué es público: la API ya aplica la whitelist de
 * src/lib/proyeccion.ts (PADM-03, repo privado). El script es una barrera
 * adicional: si algún cuerpo de respuesta contiene una clave interna
 * (costo_fijo, costoFijo, nota_interna_pricing en cualquier nivel, o horas
 * dentro de un paso de flujo[]), aborta con error y no escribe nada.
 *
 * Variables de entorno (GitHub Actions secrets del repo público):
 *   PADM10_API_BASE_URL   base de la API (default http://localhost:8787 para
 *                         desarrollo local; producción usa
 *                         https://api.sacsi.com.ar)
 *   CF_ACCESS_CLIENT_ID   Client ID del service token de App A
 *   CF_ACCESS_CLIENT_SECRET Client Secret del service token de App A
 *
 * Ejecución:
 *   node --experimental-strip-types scripts/prebuild-padm-10.ts
 *
 * Endpoints consumidos (todos GET /api/v1/catalogo/*):
 *   /listado + /meta      → src/data/soluciones/listado-soluciones.json
 *   /soluciones/:id       → src/data/soluciones/detalle/solucion_<id>.json
 *   /categorias           → src/data/categorias/categoria_<id>.json
 *   /servicios            → src/data/servicios/servicio_<id>.json
 *   /casos-anonimos       → src/data/casos-anonimos.json
 *   /preguntas-frecuentes → src/data/preguntas-frecuentes.json
 *   /config               → src/config/site.json
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const BASE_URL =
  process.env.PADM10_API_BASE_URL ?? 'http://localhost:8787';
const CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET ?? '';

const esLocalhost = /^https?:\/\/(localhost|127\.0\.0.1)(:\d+)?\/?$/i.test(
  BASE_URL,
);
if (!esLocalhost && (!CLIENT_ID || !CLIENT_SECRET)) {
  console.error(
    'PADM-10: CF_ACCESS_CLIENT_ID y CF_ACCESS_CLIENT_SECRET son obligatorios ' +
      'cuando PADM10_API_BASE_URL no apunta a localhost.',
  );
  process.exit(1);
}

// Claves internas que nunca deben aparecer en el output público.
// Defensa en profundidad: la API ya filtra, esto es una segunda barrera.
const CLAVES_INTERNAS = [
  'costo_fijo',
  'costoFijo',
  'nota_interna_pricing',
];

async function fetchJson(path: string): Promise<unknown> {
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {};
  if (CLIENT_ID) headers['CF-Access-Client-Id'] = CLIENT_ID;
  if (CLIENT_SECRET) headers['CF-Access-Client-Secret'] = CLIENT_SECRET;

  let res: Response;
  try {
    res = await fetch(url, { headers });
  } catch (err) {
    throw new Error(
      `PADM-10: no se pudo conectar con ${url}: ${(err as Error).message}`,
    );
  }

  if (!res.ok) {
    const texto = await res.text().catch(() => '');
    throw new Error(
      `PADM-10: ${res.status} ${res.statusText} al GET ${url}${
        texto ? ` — ${texto.slice(0, 200)}` : ''
      }`,
    );
  }
  const data = await res.json();
  // Defensa en profundidad: D1 almacena algunos documentos JSON como texto
  // (columnas de tipo string que contienen JSON). Parsear esos strings para
  // que el sitio Astro reciba objetos, no strings escapados.
  return deepParseJsonStrings(data);
}

/**
 * Recorre un objeto recursivamente y hace JSON.parse() en cualquier valor
 * string que sea JSON válido (empiece con { o [). Esto convierte campos que
 * D1 almacena como texto en objetos reales que el sitio puede usar.
 */
function deepParseJsonStrings(v: unknown): unknown {
  if (Array.isArray(v)) {
    return v.map((item, i) => deepParseJsonStrings(item));
  }
  if (v === null || typeof v !== 'object') return v;
  const obj = v as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          result[k] = deepParseJsonStrings(JSON.parse(val));
          continue;
        } catch {
          // No es JSON válido, dejar como string
        }
      }
    }
    result[k] = deepParseJsonStrings(val);
  }
  return result;
}

/**
 * Recorre un valor buscando claves internas en cualquier nivel.
 * También detecta pasos de flujo[] que contengan 'horas'.
 */
function afirmarSinInternos(etiqueta: string, valor: unknown): void {
  const problemas: string[] = [];

  const visitar = (v: unknown, path: string): void => {
    if (Array.isArray(v)) {
      v.forEach((item, i) => visitar(item, `${path}[${i}]`));
      return;
    }
    if (v === null || typeof v !== 'object') return;
    const obj = v as Record<string, unknown>;

    // Claves internas en cualquier nivel
    for (const clave of CLAVES_INTERNAS) {
      if (clave in obj) {
        problemas.push(`${path}.${clave}`);
      }
    }

    // horas dentro de pasos de flujo[] (carga real de trabajo, nunca pública)
    if ('horas' in obj) {
      problemas.push(`${path}.horas`);
    }

    for (const [k, val] of Object.entries(obj)) {
      visitar(val, `${path}.${k}`);
    }
  };

  visitar(valor, '$');

  if (problemas.length) {
    throw new Error(
      `PADM-10: ${etiqueta} expone campos internos y no se escribe: ${problemas.join(', ')}`,
    );
  }
}

function escribir(rel: string, valor: unknown): void {
  const abs = join(ROOT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  const contenido = JSON.stringify(valor, null, 2) + '\n';
  writeFileSync(abs, contenido, 'utf-8');
  console.log(`  escribir ${rel}`);
}

async function main(): Promise<void> {
  console.log(`PADM-10 pre-build → ${BASE_URL}`);
  console.log(`  público: ${ROOT}`);

  const [listado, meta, categorias, servicios, casosAnonimos, preguntas, config] =
    await Promise.all([
      fetchJson('/api/v1/catalogo/listado'),
      fetchJson('/api/v1/catalogo/meta'),
      fetchJson('/api/v1/catalogo/categorias'),
      fetchJson('/api/v1/catalogo/servicios'),
      fetchJson('/api/v1/catalogo/casos-anonimos'),
      fetchJson('/api/v1/catalogo/preguntas-frecuentes'),
      fetchJson('/api/v1/catalogo/config'),
    ]);

  // Guardia de seguridad sobre todas las respuestas de colección, antes de
  // escribir un solo archivo: todo o nada.
  afirmarSinInternos('/api/v1/catalogo/listado', listado);
  afirmarSinInternos('/api/v1/catalogo/meta', meta);
  afirmarSinInternos('/api/v1/catalogo/categorias', categorias);
  afirmarSinInternos('/api/v1/catalogo/servicios', servicios);
  afirmarSinInternos('/api/v1/catalogo/casos-anonimos', casosAnonimos);
  afirmarSinInternos('/api/v1/catalogo/preguntas-frecuentes', preguntas);
  afirmarSinInternos('/api/v1/catalogo/config', config);

  const ids = (listado as { id: string }[]).map((s) => s.id);

  // Detalles en paralelo, uno por solución.
  const detalles = await Promise.all(
    ids.map(async (id) => {
      const cuerpo = await fetchJson(
        `/api/v1/catalogo/soluciones/${encodeURIComponent(id)}`,
      );
      afirmarSinInternos(`/api/v1/catalogo/soluciones/${id}`, cuerpo);
      return [id, cuerpo] as [string, unknown];
    }),
  );

  for (const c of categorias as { id: string }[]) {
    afirmarSinInternos(`/api/v1/catalogo/categorias:${c.id}`, c);
  }
  for (const s of servicios as { id: string }[]) {
    afirmarSinInternos(`/api/v1/catalogo/servicios:${s.id}`, s);
  }

  // Escritura.
  escribir(
    'src/data/soluciones/listado-soluciones.json',
    { meta, soluciones: listado },
  );
  for (const [id, cuerpo] of detalles) {
    escribir(`src/data/soluciones/detalle/solucion_${id}.json`, cuerpo);
  }
  for (const c of categorias as { id: string }[]) {
    escribir(`src/data/categorias/categoria_${c.id}.json`, c);
  }
  for (const s of servicios as { id: string }[]) {
    escribir(`src/data/servicios/servicio_${s.id}.json`, s);
  }
  escribir('src/data/casos-anonimos.json', casosAnonimos);
  escribir('src/data/preguntas-frecuentes.json', preguntas);
  escribir('src/config/site.json', config);

  console.log(
    `\nPADM-10 OK: ${ids.length} soluciones, ${categorias.length} categorías, ` +
      `${servicios.length} servicios, ${(casosAnonimos as unknown[]).length} casos anónimos, ` +
      `${(preguntas as unknown[]).length} preguntas frecuentes, config.`,
  );
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});

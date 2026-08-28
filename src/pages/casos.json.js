import { getCasos } from '../lib/data-utils';

// Endpoint estático: en el build se genera /casos.json
// El carrusel de la home lo consume con fetch() (render asíncrono en cliente).
// Datos obtenidos vía data-utils.ts (single source of truth normalizada).
export function GET() {
  return new Response(JSON.stringify(getCasos()), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

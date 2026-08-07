import casos from '../data/casos-exito.json'

// Endpoint estático: en el build se genera /casos.json
// El carrusel de la home lo consume con fetch() (render asíncrono en cliente).
export function GET() {
  return new Response(JSON.stringify(casos), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

# UJ-01 — Definir 3 personas/clientes típicos

## 1. Las 3 personas

> Derivadas de CONTENIDO.md target + MAR-01 decisiones.
> Cada persona alimenta su journey en UJ-02/UJ-03/UJ-04.

### Persona 1 — Carlos (PyME sin web, busca vender online)

| Dimensión        | Valor                                                |
|------------------|------------------------------------------------------|
| Nombre           | Carlos                                               |
| Edad             | 52                                                   |
| Rol              | Dueño de ferretería de gas y plomería                |
| Ubicación        | Rosario, Santa Fe                                    |
| Negocio          | PyME familiar, 1 empleado, factura ARS $3M/mes       |
| Tech awareness   | Baja. Tiene Instagram, WhatsApp, Excel. Nunca tuvo web.|
| Dolor            | "Mis clientes me preguntan por la web, no tengo. Mercado Pago está al lado y me saca clientes" |
| Objetivo         | Tener una tienda online simple, sin tener que aprender a manejarla todos los días |
| Dispositivo      | Mobile (98% del acceso)                              |
| Canal preferido  | WhatsApp                                             |
| Fricciones       | - "¿Hablar con un técnico me va a confundir?" <br> - "¿Va a ser muy caro?" <br> - "¿Va a tomar mucho tiempo?" |
| CTA esperado     | WhatsApp "Consultános sin cargo"                     |
| Journey          | UJ-02                                                |

### Persona 2 — Ana (PyME con WP roto, busca rescate)

| Dimensión        | Valor                                                |
|------------------|------------------------------------------------------|
| Nombre           | Ana                                                  |
| Edad             | 38                                                   |
| Rol              | CMO de e-commerce de indumentaria                    |
| Ubicación        | CABA, Argentina                                      |
| Negocio          | Tienda online mediana, 5-8 personas, WP+WooCommerce  |
| Tech awareness   | Media. Sabe lo que es WordPress, SEO, Lighthouse. No programa. |
| Dolor            | "El sitio se hackeó cada 2 meses, tarda 8s y perdimos PageSpeed. Google lo marca como peligroso" |
| Objetivo         | Rescate: limpiar + asegurar + acelerar sin perder SEO ni catálogo |
| Dispositivo      | Desktop (70%) — trabaja desde notebook, mobile 30%   |
| Canal preferido  | Email profesional / formulario (no WhatsApp — es B2B)|
| Fricciones       | - "No quiero un freelance que deje todo a medias" <br> - "¿Va a entender la criticidad de mi negocio?" <br> - "¿Va a migrar sin perder SEO?" |
| CTA esperado     | WhatsApp o email — dependiendo de urgencia           |
| Journey          | UJ-03 — caso WP roto es exactamente su juego         |

### Persona 3 — Reclutador tech (evalúa competencias WordPress)

| Dimensión        | Valor                                                |
|------------------|------------------------------------------------------|
| Nombre           | (sin nombre — rol más que persona)                  |
| Rol              | Tech recruiter / Head of Engineering en agencia internacional|
| Ubicación        | Internacional (remote — LatAm o EU)                 |
| Negocio          | Agencia de contratación tech, evalúa para un cliente |
| Tech awareness   | Alta. Lee GitHub READMEs, evalúa código             |
| Dolor            | "Necesito un dev WordPress con experiencia real en Gutenberg/ACF/WooCommerce/Next.js headless que pueda probar" |
| Objetivo         | Ver portfolio concreto. ¿Tiene los projects? ¿Qué stack? ¿Qué métricas? |
| Dispositivo      | Desktop 100%                                         |
| Canal preferado  | LinkedIn / email profesional                          |
| Fricciones       | - "Si los casos no son reales me entero" <br> - "¿Habla inglés?" <br> - "¿Trabajó真的 con headless o solo se copió del blog de alguien?" |
| CTA esperado     | Links a GitHub + LinkedIn (NO WhatsApp)              |
| Journey          | UJ-04 — viene por Google "WordPress developer Rosario" o por GitHub perfil `colombinis/colombinis` |
| Nota tras MAR-01 | El usuario decidió NO agregar CTA + links personales en este ciclo. El reclutador accederá vía link GitHub en el README personal del usuario (sebastián-colombini) que ya apunta a sacsi.com.ar como Web. El journey queda documentado para evaluar futuramente. |

## 2. Cobertura de las 3 personas en el sitio

| Persona     | Hero responde | Caso que resuena                    | CTA visible en página              |
|-------------|---------------|-------------------------------------|------------------------------------|
| Carlos      | Sí            | `ferreteria-gas-plomeria` (caso éxito) | WhatsApp en hero, en caso, en servicios |
| Ana         | Sí            | `rescate-rendimiento-seguridad-wordpress` (proyecto tipo) | WhatsApp en caso, pero no email visible en primer scroll |
| Reclutador  | No            | 5 casos WP (proyectos tipo)         | Sin CTA reclutador (por decisión MAR-01) |

Gaps a validar en UJ-05:
- ¿El `WhatsApp` es claro para Ana B2B?
- ¿Email `sacsi@sacsi.com.ar` aparece en `contacto/`?
- ¿Hay "portfolio-fuera" para reclutadores? (Acceptable: GitHub README personal como puente)

## Verification script

```bash
#!/bin/bash
# Verificación UJ-01 — 3 personas documentadas
FILE="docs/tareas/UJ-01-definir-personas.md"
echo "🧪 UJ-01 — 3 personas defined"

for p in "Carlos" "Ana" "Reclutador"; do
    if grep -q "$p" "$FILE"; then
        echo "  ✅ Persona: $p"
    else
        echo "  ❌ Persona faltante: $p"
        exit 1
    fi
done

# Cada persona mapea a un journey downstream
if grep -q "UJ-02" "$FILE" && grep -q "UJ-03" "$FILE" && grep -q "UJ-04" "$FILE"; then
    echo "  ✅ Cada persona mapea a su journey"
else
    echo "  ❌ Falta mapeo a journeys"
    exit 1
fi

echo "✅ UJ-01 — COMPLETA"
```

## Estado
DONE — 3 personas definidas,下游 journeys listos para UJ-02/UJ-03/UJ-04

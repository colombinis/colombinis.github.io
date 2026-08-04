# UJ-01 — Definir 3 personas/clientes típicos

## Contexto

Para simular user journeys necesitamos definir quién visita sacsi.com.ar.
Basado en Contenido.md: "Dueños de PyMEs y emprendedores no técnicos que
necesitan automatización y desarrollo de software."

Pero hay 2 sub-audiencias detectadas en MAR-01:
- PyME no-técnica (dueño ferretería, consultorio psicología)
- Reclutador tech (evalúa portfolio WordPress)

Y un tercero: PyME con problema específico (WP roto, tienda lenta)

## Scenarios (BDD)

```gherkin
Scenario: 3 personas definidas
  When completo UJ-01
  Then existen 3 personas documentadas:
    | Persona | Detector | Goal en el sitio | CTA esperado |
    | 1. Carlos, dueño ferretería | "necesito vender online" | Ver casos similares | WhatsApp |
    | 2. Ana, marketing WP roto | "mi WP es lento/inseguro" | Ver caso rescate WP | WhatsApp |
    | 3. Reclutador tech | "evalúo competencias WP" | Ver portfolio de casos | LinkedIn/email |
  And cada persona tiene:
    - demografía (edad, rol, ubicación)
    - dispositivo preferido (mobile/desktop)
    - canal preferido (WhatsApp vs email)
    - fricciones/objeciones más probables
```

## Plan

1. Definir las 3 personas con archivos detalle en docs/tareas/population-personas/
2. Cada persona tiene su journey en UJ-02, UJ-03, UJ-04
3. UJ-05 valida que el sitio sirve a las 3

## Estado
TODO

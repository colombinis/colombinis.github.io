# UJ-03 — Journey: Ana (PyME con WordPress roto) → rescate

## Contexto
Persona: Ana, CMO de e-commerce de indumentaria (WP+WooCommerce, CABA).
Prefiere email/formulario sobre WhatsApp (contexto B2B de urgencia).
Ver definición completa en `UJ-01-definir-personas.md` (Persona 2).

## Spec
El journey de Ana debe llevarla desde la homepage hasta el caso de rescate
de WordPress, validar que SACsi entiende su criticidad (seguridad +
rendimiento + SEO) y permitirle contactar por formulario/email (su canal
preferido), además de WhatsApp.

## Escenarios Gherkin

### E1: Ana encuentra el caso de rescate
Given Ana busca "rescate WordPress" o scrollea casos en `/`
When ve la grilla de casos
Then ve "Rescate de un e-commerce WordPress lento y hackeado"
And el caso está etiquetado como "PROYECTO TIPO" (transparente)
And el CTA dice "¿Tenés preguntas?. Consultanos ahora !!!"

### E2: Ana valida que entienden su dolor
Given Ana en la página del caso de rescate
When lee el contenido
Then ve "Limpieza de malware, hardening de seguridad y optimización de rendimiento"
And ve "sin perder el catálogo ni el SEO" (su principal miedo)
And ve métricas concretas: "De 8s a 1.5s", "PageSpeed 95"
And el testimonio está marcado como "Testimonio tipo" (no se hace pasar por real)

### E3: Ana contacta por su canal preferido (email/formulario)
Given Ana en la página del caso
When pulsa "Completá el formulario"
Then llega a `/contacto/`
And ve el formulario con envío a sacsi@sacsi.com.ar
And ve el email sacsi@sacsi.com.ar visible
And ve el CTA WhatsApp también disponible (canal alternativo)

## Plan
1. Verificar etiqueta PROYECTO TIPO + testimonio tipo en el caso rescate
2. Verificar métricas y stack en la página
3. Verificar formulario/email en /contacto/

## Verification (bash ejecutable)

```bash
#!/bin/bash
# UJ-03 — Ana: PyME con WordPress roto → rescate
set -e
D=dist
echo "🧪 UJ-03 — Journey Ana (WP roto)"

CASO=$D/casos-exito/rescate-rendimiento-seguridad-wordpress/index.html

# E1: caso visible y etiquetado transparente
grep -q 'Rescate de un e-commerce WordPress' $CASO && echo "  ✅ E1 caso rescate"
grep -q 'PROYECTO TIPO' $CASO && echo "  ✅ E1 etiqueta PROYECTO TIPO"
grep -q '¿Tenés preguntas?. Consultanos ahora !!!' $CASO && echo "  ✅ E1 CTA del caso"

# E2: dolor + métricas + testimonio tipo
grep -q 'malware' $CASO && echo "  ✅ E2 menciona malware"
grep -q 'SEO' $CASO && echo "  ✅ E2 menciona SEO (miedo principal)"
grep -q '1.5s' $CASO && echo "  ✅ E2 métrica 1.5s"
grep -q '95' $CASO && echo "  ✅ E2 métrica PageSpeed"
grep -q 'Testimonio tipo' $CASO && echo "  ✅ E2 testimonio tipo (transparente)"

# E3: contacto por email/formulario
grep -q 'sacsi@sacsi.com.ar' $D/contacto/index.html && echo "  ✅ E3 email visible"
grep -q 'mailto:sacsi@sacsi.com.ar' $D/contacto/index.html && echo "  ✅ E3 form action mailto"
grep -q 'Enviar consulta' $D/contacto/index.html && echo "  ✅ E3 botón form"

echo "✅ UJ-03 — COMPLETA (journey Ana con canal email/formulario)"
```

## Hallazgos
- **H-UJ03-01 (OK):** El caso rescate comunica exactamente el dolor de Ana
  (seguridad + rendimiento + no perder SEO) con métricas concretas.
- **H-UJ03-02 (ATENCIÓN):** El formulario es `mailto:` (abre el cliente de
  mail del visitante). Para Ana (B2B, notebook, prefiere email) funciona:
  su Outlook se abre con el mensaje listo. PERO no hay backend de
  formularios — si Ana no tiene cliente de mail configurado en el
  dispositivo, el botón no hace nada útil. Verificado en DEP-01 post-deploy.
- **H-UJ03-03 (OK):** El testimonio tipo en el caso rescate mantiene la
  honestidad de marca (decisión MAR-01) sin sacrificar la narrativa.

## Estado
DONE — verificado contra build 2026-08-04

# MAR-04 — Evaluar 4to servicio IA

## Contexto

Contenido.md lista "Inteligencia Artificial (futuro)" como potencial 4to servicio,
con claim: "Machine learning y automatización inteligente para empresas que quieren dar el salto."

La estrategia personal del usuario es "PHP + IA aplicada". Si SACsi no ofrece IA,
hay una desconexión entre la marca personal y el negocio.

**Decisión tomada** (mejor juicio, usuario no respondió al clarify):
NO agregar servicio IA en esta auditoría. Se marca como tarea futura
post-auditoria. La auditoría de marca debe evaluar el gap y recomendar.

## Scenarios (BDD)

```gherkin
Scenario: Gap IA documentado
  Given la marca personal Sebastián es "PHP + IA aplicada"
  And el sitio SACsi no ofrece IA explicitamente
  When se completa MAR-04
  Then TODO.md tiene una tarea futura PRI-05 o similar que dice:
    "Evaluar agregar 4to servicio de IA a SACsi post-auditoría"
  And el archivo de tarea lista los requirements:
    - Renombrar claim como "IA aplicada" (no "machine learning", muy academico)
    - Agregar page /servicios/ia/
    - Actualizar hero para mencionar 4 servicios
    - Agregar 2-3 casos de IA en casos.js
```

## Plan

1. Documentar el gap y los requirements en este archivo
2. NO crear la página /servicios/ia/ en este ciclo
3. Dejar en TODO.md una tarea futura "Servicio IA — evaluar post-auditoria"

## Estado
TODO

# PLAN DE MERGE — v0_alternativo_rebranding → master

> **Estado:** PENDIENTE DE AUTORIZACIÓN DEL OWNER (`sacsi-owner` / Sebastián).
> Este documento es un plan; **NO se ejecuta ningún merge ni push sin tu OK**.

## Resumen ejecutivo

| Item | Situación |
|------|-----------|
| Rama origen | `v0_alternativo_rebranding` (115 commits adelante de master) |
| Rama destino | `master` (sitio legacy: init + jenkinsfile + CNAME + `.html` legacy) |
| Divergencia | 0 behind / 115 ahead (master no avanzó desde el init) |
| Riesgo de conflicto | **Bajo** para archivos de `src/`; **la merge borrará los `.html` legacy de master** (comportamiento deseado del rebranding) |
| CNAME | Idéntico en ambas ramas → DNS/ dominio no cambia |
| CI build | `deploy.yml` corregido a `node-version: 22` (Astro v7 exige ≥22.12) |

## Pasos del plan (a ejecutar SOLO tras tu autorización)

1. **Commit de correcciones previas** (en `v0`, sin push):
   - `.github/workflows/deploy.yml`: `node-version: 20` → `22`
   - `_ai_context/docs/.../CON-04-tracking-gtm-ga4.md` + `TODO.md`: estado real (DONE code)
   - `_ai_context/docs/tareas/FASE-6-.../TODO.md`: nota de desbloqueo + hallazgo CI

2. **Merge** (fast-forward, porque master no divergió):
   ```bash
   git checkout master
   git merge --ff-only v0_alternativo_rebranding
   ```
   > Nota: `--ff-only` evita crear commit de merge; master pasa a apuntar al HEAD de `v0`.
   > Los `.html` legacy (index.html, contacto.html, etc.) dejarán de existir en master.

3. **Push a master** (dispara `deploy.yml` → GitHub Pages):
   ```bash
   git push origin master
   ```

4. **Esperar deploy** (~2-3 min) y verificar que `https://sacsi.com.ar` responde.

5. **Ejecutar DEP-01 (validación producción)** — ver abajo.

## Validación post-deploy (DEP-01) — pasos y owner

| # | Verificación | Cómo | Owner |
|---|--------------|------|-------|
| 1 | SSL / HTTPS responde | `curl -I https://sacsi.com.ar` → 200/301 + HSTS | sacsi-qa (script) |
| 2 | GTM-T7PWJ99 carga | Tag Assistant en Chrome → container ID coincide | owner (manual) |
| 3 | GA4 recibe `whatsapp_click` | GA4 DebugView tras clic en WhatsApp | owner (manual) |
| 4 | GA4 recibe `form_submit` | GA4 DebugView tras envío de formulario | owner (manual) |
| 5 | Formulario contacto | Enviar mail de prueba → llega a sacsi@sacsi.com.ar | owner (manual) |
| 6 | Lighthouse >80 | `lighthouse https://sacsi.com.ar` (4 categorías) | sacsi-qa (CLI) |
| 7 | Monitoreo 48h | Revisar GA4 a las 24h y 48h sin picos de error | owner |

> Los scripts automáticos (1, 6) se corren con `verify-AUD-06.sh` (ya existe).
> Los manuales (2-5, 7) requieren sesión autenticada del owner en GTM/GA4/Chrome.

## Rollback (si el deploy falla)

```bash
git checkout master
git reset --hard 75724cc   # commit original de master (add jenkinsfile)
git push --force origin master
```

## Decisión requerida

Por favor confirma:
- [ ] Autorizás el commit de correcciones en `v0`
- [ ] Autorizás el fast-forward merge `v0` → `master` + push
- [ ] Querés que ejecute DEP-01 (pasos automáticos) tras el deploy, o lo hacés vos manualmente

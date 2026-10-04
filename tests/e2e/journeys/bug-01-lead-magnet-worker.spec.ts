import { test, expect } from '@playwright/test';

/**
 * BUG-01 (regresión): el lead magnet del checklist hacía fire-and-forget del
 * POST a /api/contacto y mostraba éxito sin leer la respuesta. El worker exige
 * Turnstile (cf-turnstile-response) + message; sin ellos responde 400 y el
 * lead se perdía en silencio.
 *
 * Este test valida el contrato del FRONTEND en /checklist-automatizacion:
 *   1. El form declara action al endpoint del worker.
 *   2. Existe el widget Turnstile (div.cf-turnstile con data-sitekey).
 *   3. El form tiene un campo `message` oculto con valor por defecto.
 *   4. El submit SIN token de turnstile se frena con error visible.
 *   5. El submit con token solo muestra éxito si el worker responde ok.
 *
 * Nota: no asertamos el body del POST (Playwright no expone postData() de
 * FormData multipart interceptado); el payload lo determina new FormData(form),
 * cuyos campos validamos por DOM.
 */
test.describe('BUG-01 - Lead magnet checklist: envío real al worker', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacto', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, message: 'Captcha requerido.' }),
      });
    });
    await page.goto('/checklist-automatizacion/');
  });

  test('submit solo muestra éxito si el worker responde ok', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      // Ignorar ruido esperado: (a) el mock responde 400 a propósito y el
      // browser lo loguea como console error; (b) el widget de Turnstile
      // emite console.debug '%c%d font-size:0...' (conocido, inofensivo).
      if (
        msg.type() === 'error' &&
        !msg.text().includes('Failed to load resource') &&
        !msg.text().includes('font-size:0')
      ) {
        errors.push(msg.text());
      }
    });

    // El form debe apuntar al endpoint del worker
    const form = page.locator('#lead-magnet-form');
    await expect(form).toHaveAttribute(
      'action',
      /sacsi-contacto\.colombinis\.workers\.dev\/api\/contacto/
    );

    // Widget Turnstile presente con el sitekey de config
    const turnstile = page.locator('.cf-turnstile');
    await expect(turnstile).toHaveCount(1);
    await expect(turnstile).toHaveAttribute(
      'data-sitekey',
      '0x4AAAAAAEmlx5MeWdaszZEE'
    );

    // Campo message presente (oculto con valor por defecto)
    await expect(page.locator('#lead-magnet-form [name="message"]')).toHaveCount(1);

    // Llenar el form
    await page.locator('#lm-nombre').fill('Test E2E');
    await page.locator('#lm-email').fill('test-e2e@example.com');

    // Sin token de turnstile: el submit debe frenarse ANTES de enviar
    await page.locator('#lm-submit').click();
    await expect(page.locator('#lm-status')).toContainText('verificación de seguridad');
    await expect(page.locator('#lm-success')).toBeHidden();

    // Simular token (el widget real lo inyecta; el script de Turnstile ya crea
    // el input vacío, así que seteamos su valor directamente)
    await page.evaluate(() => {
      const form = document.getElementById('lead-magnet-form')!;
      let input = form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        form.appendChild(input);
      }
      input.value = 'XXXX.DUMMY.TOKEN';
    });

    // Con worker respondiendo 400: NADA de éxito — error visible
    await page.locator('#lm-submit').click();
    await expect(page.locator('#lm-success')).toBeHidden();
    await expect(page.locator('#lead-magnet-form')).toBeVisible();
    await expect(page.locator('#lm-status')).toContainText('No pudimos registrar');

    // Ahora simular respuesta OK del worker: éxito + descarga visible
    await page.unroute('**/api/contacto');
    await page.route('**/api/contacto', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });
    // El handler del 400 llama turnstile.reset() que vacía el token:
    // re-inyectar antes del nuevo intento
    await page.evaluate(() => {
      const input = document
        .querySelector<HTMLInputElement>('#lead-magnet-form input[name="cf-turnstile-response"]');
      if (input) input.value = 'XXXX.DUMMY.TOKEN.2';
    });
    await page.locator('#lm-submit').click();
    await expect(page.locator('#lm-success')).toBeVisible();
    await expect(page.locator('#lead-magnet-form')).toBeHidden();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

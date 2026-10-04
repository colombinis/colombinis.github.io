import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: PYME sin web - Contacto', () => {
  test('landing y journey de contacto sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/SACsi/);
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i }).first()).toBeVisible();

    // CTA WhatsApp directo desde /contacto (hay 2 links WhatsApp: botón + hero CTA)
    await page.goto('/contacto');
    const wa = page.getByRole('link', { name: /WhatsApp/i }).first();
    await expect(wa).toBeVisible();
    // El sitio usa api.whatsapp.com/send (no wa.me)
    await expect(wa).toHaveAttribute('href', /whatsapp\.com\/send\?phone=5493415197937/);

    await expect(page.locator('#form-contacto-progresivo')).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

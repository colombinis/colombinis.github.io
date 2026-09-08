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
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i })).toBeVisible();

    // CTA WhatsApp directo desde /contacto
    await page.goto('/contacto');
    const wa = page.getByRole('link', { name: /WhatsApp/i });
    await expect(wa).toBeVisible();
    await expect(wa).toHaveAttribute('href', /wa\.me\/5493415197937/);

    await expect(page.getByLabel('Nombre', { exact: false }).or(page.locator('form'))).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

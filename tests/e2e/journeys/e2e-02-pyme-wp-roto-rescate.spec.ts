import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: WP roto - rescate', () => {
  test('servicios y detalle con CTA visible, sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/servicios/');

    const cards = page.locator('.service-card');
    await expect(cards).toHaveCount(6);

    await page.goto('/servicios/presencia-online');
    await expect(page).toHaveTitle(/Presencia/);
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i })).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

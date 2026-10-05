import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: WP roto - rescate', () => {
  test('servicios y detalle con CTA visible, sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/servicios/');

    // Cards del sistema atómico (Card media-accent): 4 de SolucionesSection
    // + las de categorías cuando la página las incluye. Invariant: todas
    // las .service-card son ui-card del design system (ningún markup legado).
    const cards = page.locator('.service-card');
    await expect(cards).toHaveCount(8);
    await expect(page.locator('.service-card.ui-card--media-accent')).toHaveCount(8);
    await expect(page.locator('.service-card:not(.ui-card)')).toHaveCount(0);

    await page.goto('/servicios/ia-aplicada');
    await expect(page).toHaveTitle(/IA/);
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i }).first()).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

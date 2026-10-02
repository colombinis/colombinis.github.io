import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: Reclutador - Portfolio', () => {
  test('navegación a caso de éxito y CTAs, sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/servicios/');

    // El anchor del caso vive en el footer de casos (texto: "Medio digital con WordPress headless...")
    const casoLink = page.locator('a[href="/casos-exito/wordpress-headless-nextjs/"]').first();
    await expect(casoLink).toBeVisible();
    await casoLink.click();
    await expect(page).toHaveURL(/\/casos-exito\/wordpress-headless-nextjs/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i })).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: Reclutador - Portfolio', () => {
  test('navegación a caso de éxito y CTAs, sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/servicios/');

    const casoLink = page.getByRole('link', { name: /WordPress headless Next\.?JS/i });
    await expect(casoLink).toBeVisible();
    await casoLink.click();
    await expect(page).toHaveURL(/\/casos-exito\/wordpress-headless-nextjs/);
    await expect(page.getByRole('heading', { level: 1 }).or(page.getByRole('heading', { level: 2 }))).toBeVisible();
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i })).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: Funnel de CTAs', () => {
  test('CTAs principales presentes y sin errores JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i })).toBeVisible();

    await page.goto('/servicios/automatizacion');
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i }).first()).toBeVisible();

    await page.goto('/contacto');
    await expect(page.getByLabel('Nombre', { exact: false }).or(page.locator('form'))).toBeVisible();

    await page.goto('/sobre-nosotros');
    await expect(page.getByRole('link', { name: /Consultar sin cargo/i }).first()).toBeVisible();

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

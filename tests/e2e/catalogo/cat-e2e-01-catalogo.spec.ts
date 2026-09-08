import { test, expect } from '@playwright/test';

test.describe('FEATURE-3 - E2E: Catálogo', () => {
  test('filtros, tarjetas, búsqueda y detalle', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/catalogo');

    await expect(page.getByRole('heading', { name: /Catálogo de soluciones/i })).toBeVisible();

    const cards = page.locator('#catalogo-grilla .service-card');
    await expect(cards).toHaveCount(10);

    await expect(page.locator('#filtro-servicio')).toBeVisible();
    await expect(page.locator('#filtro-categoria')).toBeVisible();
    await expect(page.locator('#filtro-texto')).toBeVisible();

    await page.locator('#filtro-texto').fill('ecommerce');
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('#catalogo-vacio')).toHaveAttribute('hidden', '');

    await page.locator('#filtro-reset').click();
    await cards.first().click();
    await expect(page).toHaveURL(/\/soluciones\//);

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

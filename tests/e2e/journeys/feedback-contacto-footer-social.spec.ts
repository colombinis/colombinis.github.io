import { test, expect } from '@playwright/test';

/**
 * FEEDBACK 2026-10-06 (bloque superior + footer de /contacto):
 *   1. Banner CTA "¿Tenés una duda o proyecto en mente?" OCULTO en /contacto
 *      (esa página ya es el canal de contacto). En el resto del sitio sigue.
 *   2. Botón LinkedIn ELIMINADO del sitio (redes del form y footer).
 *   3. Instagram y YouTube movidos al footer col 4, debajo del item Email,
 *      como items NAP (icono lucide + link .footer-nap__link).
 *   4. Badge "Primera conversación sin cargo" removido del bloque superior
 *      de /contacto — la Card abre directo con el highlight.
 * Verificación en DOM parseado (regla del repo), no grep del HTML fuente.
 */

test.describe('Feedback 2026-10-06 — /contacto: footer y bloque superior', () => {
  test('/contacto: banner CTA del footer oculto, badge superior removido, redes en col 4', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'domcontentloaded' });

    // 1. Banner "¿Tenés una duda o proyecto en mente?" NO existe en /contacto
    await expect(page.locator('#cta-final')).toHaveCount(0);
    await expect(page.getByText('¿Tenés una duda o proyecto en mente?')).toHaveCount(0);

    // 2. Botón LinkedIn eliminado: ningún link a linkedin.com en la página
    const linkedinLinks = await page.locator('a[href*="linkedin.com"]').count();
    expect(linkedinLinks).toBe(0);

    // 3. Instagram y YouTube en el footer col 4, debajo del item Email.
    //    Verificación estructural: son items NAP dentro de .footer-nap,
    //    ordenados Email → Instagram → YouTube → MapPin.
    const napOrder = await page.evaluate(() => {
      const nap = document.querySelector('.footer-nap');
      if (!nap) return null;
      const items = Array.from(nap.querySelectorAll(':scope > .footer-nap__item'));
      return items.map((item) => {
        const link = item.querySelector('.footer-nap__link');
        const icon = item.querySelector('.footer-nap__icon svg');
        return {
          href: link ? link.getAttribute('href') : null,
          text: link ? (link.textContent || '').trim() : '',
          icon: icon ? icon.classList.toString() : '',
        };
      });
    });
    expect(napOrder).not.toBeNull();
    expect(napOrder!.map((i) => i.text)).toEqual([
      '+54-341-519-7937',   // Tel
      'sacsi@sacsi.com.ar', // Email
      'Instagram',          // ← nuevo, debajo del email
      'YouTube',            // ← nuevo, debajo de Instagram
      'Ver en Google Maps →',
    ]);
    expect(napOrder![2].href).toBe('https://instagram.com/sacsi');
    expect(napOrder![3].href).toBe('https://youtube.com/@sacsi');

    // 4. Badge "Primera conversación sin cargo" removido del bloque superior
    await expect(page.locator('.contact-promise-badge')).toHaveCount(0);
    await expect(page.getByText('Primera conversación sin cargo')).toHaveCount(0);

    // La Card de promesa sigue existiendo con su highlight
    await expect(page.locator('.contact-promise-card')).toBeVisible();
    await expect(page.getByText('Te decimos con honestidad si te conviene avanzar.').first()).toBeVisible();
  });

  test('home: banner CTA y footer intactos, redes presentes en col 4', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Banner sigue visible fuera de /contacto
    await expect(page.locator('#cta-final')).toBeVisible();
    await expect(page.getByText('¿Tenés una duda o proyecto en mente?')).toBeVisible();

    // Redes también en el footer de la home (col 4)
    const nap = page.locator('.footer-nap a.footer-nap__link', { hasText: 'Instagram' });
    await expect(nap).toBeVisible();
    await expect(page.locator('.footer-nap a.footer-nap__link', { hasText: 'YouTube' })).toBeVisible();

    // LinkedIn tampoco en la home
    expect(await page.locator('a[href*="linkedin.com"]').count()).toBe(0);
  });

  test('/contacto: sin links de redes en el form (removidos del FormContactoProgresivo)', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'domcontentloaded' });

    // El bloque social-links del form ya no existe
    await expect(page.locator('.social-links')).toHaveCount(0);

    // Los únicos links a instagram/youtube en la página son los del footer col 4
    const igLinks = await page.locator('a[href*="instagram.com"]').count();
    const ytLinks = await page.locator('a[href*="youtube.com"]').count();
    expect(igLinks).toBe(1);
    expect(ytLinks).toBe(1);
  });
});

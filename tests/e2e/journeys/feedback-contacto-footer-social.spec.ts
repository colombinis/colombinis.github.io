import { test, expect } from '@playwright/test';

/**
 * FEEDBACK 2026-10-06 (bloque superior + footer de /contacto):
 *   1. Banner CTA "¿Tenés una duda o proyecto en mente?" OCULTO en /contacto
 *      (esa página ya es el canal de contacto). En el resto del sitio sigue.
 *   2. Botón LinkedIn ELIMINADO del sitio (redes del form y footer).
 *   3. Instagram y YouTube movidos al footer, dentro de la fila NAP
 *      (icono lucide + link .footer-nap__link), después de Tel y Email.
 *   4. Badge "Primera conversación sin cargo" removido del bloque superior
 *      de /contacto — la Card abre directo con el highlight.
 * Verificación en DOM parseado (regla del repo), no grep del HTML fuente.
 *
 * NOTA (issue #48): los items NAP son solo-iconos — no tienen texto visible
 * (el nombre accesible vive en aria-label). Se verifica por href + aria-label,
 * nunca por hasText, y sin depender de un wrapper .footer-nap__item que el
 * componente no renderiza.
 */

/** Orden esperado de la fila NAP del footer: href + aria-label de cada link. */
const NAP_ITEMS = [
  { href: 'tel:+54-341-519-7937', label: /Llamar al/ },
  { href: 'mailto:sacsi@sacsi.com.ar', label: /Enviar un email a/ },
  { href: 'https://instagram.com/sacsi', label: /Instagram de SACsi/ },
  { href: 'https://youtube.com/@sacsi', label: /YouTube de SACsi/ },
  { href: /google\.com\/maps/, label: /Ver ubicación en Google Maps/ },
];

/** Lee la fila NAP del footer como datos estructurados (href, aria-label, icono). */
async function readFooterNap(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const nap = document.querySelector('.footer-nap');
    if (!nap) return null;
    const links = Array.from(nap.querySelectorAll(':scope > .footer-nap__link'));
    return links.map((link) => {
      const svg = link.querySelector('svg');
      return {
        href: link.getAttribute('href'),
        ariaLabel: link.getAttribute('aria-label'),
        icon: svg ? svg.classList.toString() : '',
      };
    });
  });
}

test.describe('Feedback 2026-10-06 — /contacto: footer y bloque superior', () => {
  test('/contacto: banner CTA del footer oculto, badge superior removido, redes en la fila NAP', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'domcontentloaded' });

    // 1. Banner "¿Tenés una duda o proyecto en mente?" NO existe en /contacto
    await expect(page.locator('#cta-final')).toHaveCount(0);
    await expect(page.getByText('¿Tenés una duda o proyecto en mente?')).toHaveCount(0);

    // 2. Botón LinkedIn eliminado: ningún link a linkedin.com en la página
    const linkedinLinks = await page.locator('a[href*="linkedin.com"]').count();
    expect(linkedinLinks).toBe(0);

    // 3. Fila NAP del footer: cantidad, orden y destinos exactos.
    //    Verificación estructural por href + aria-label (los links son solo-iconos).
    const napItems = await readFooterNap(page);
    expect(napItems).not.toBeNull();
    expect(napItems!.length).toBe(NAP_ITEMS.length);

    NAP_ITEMS.forEach((expected, i) => {
      const actual = napItems![i];
      if (expected.href instanceof RegExp) {
        expect(actual.href).toMatch(expected.href);
      } else {
        expect(actual.href).toBe(expected.href);
      }
      expect(actual.ariaLabel).toMatch(expected.label);
      // Cada item debe traer su icono lucide (no texto visible).
      expect(actual.icon).toContain('lucide');
    });

    // 4. Badge (pill) "Primera conversación sin cargo" removido del bloque superior.
    //    OJO: la frase sigue existiendo en .page-header__subtitle como texto de
    //    página — el que se removió es el BADGE dentro de la Card de promesa.
    //    Por eso el assert se acota a la Card, no a toda la página.
    await expect(page.locator('.contact-promise-badge')).toHaveCount(0);
    await expect(page.locator('.contact-promise-card .contact-promise-badge')).toHaveCount(0);
    await expect(
      page.locator('.contact-promise-card').getByText('Primera conversación sin cargo')
    ).toHaveCount(0);

    // La Card de promesa sigue existiendo con su highlight
    await expect(page.locator('.contact-promise-card')).toBeVisible();
    await expect(page.locator('.contact-promise-highlight')).toBeVisible();
    await expect(page.getByText('Te decimos con honestidad si te conviene avanzar.').first()).toBeVisible();
  });

  test('home: banner CTA y footer intactos, redes presentes en la fila NAP', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Banner sigue visible fuera de /contacto
    await expect(page.locator('#cta-final')).toBeVisible();
    await expect(page.getByText('¿Tenés una duda o proyecto en mente?')).toBeVisible();

    // Las redes están en la fila NAP del footer (misma estructura que en /contacto)
    const napItems = await readFooterNap(page);
    expect(napItems).not.toBeNull();

    const instagram = napItems!.find((i) => i.href === 'https://instagram.com/sacsi');
    const youtube = napItems!.find((i) => i.href === 'https://youtube.com/@sacsi');
    expect(instagram).toBeDefined();
    expect(youtube).toBeDefined();
    expect(instagram!.ariaLabel).toMatch(/Instagram de SACsi/);
    expect(youtube!.ariaLabel).toMatch(/YouTube de SACsi/);

    // Los links son visibles
    await expect(page.locator('.footer-nap a.footer-nap__link[href="https://instagram.com/sacsi"]')).toBeVisible();
    await expect(page.locator('.footer-nap a.footer-nap__link[href="https://youtube.com/@sacsi"]')).toBeVisible();

    // LinkedIn tampoco en la home
    expect(await page.locator('a[href*="linkedin.com"]').count()).toBe(0);
  });

  test('/contacto: sin links de redes en el form (removidos del FormContactoProgresivo)', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'domcontentloaded' });

    // El bloque social-links del form ya no existe
    await expect(page.locator('.social-links')).toHaveCount(0);

    // Los únicos links a instagram/youtube en la página son los del footer NAP
    const igLinks = await page.locator('a[href*="instagram.com"]').count();
    const ytLinks = await page.locator('a[href*="youtube.com"]').count();
    expect(igLinks).toBe(1);
    expect(ytLinks).toBe(1);
  });
});

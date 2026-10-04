import { test, expect } from '@playwright/test';

/**
 * HOME estilo donweb (rama feature/home-donweb-structure):
 *   1. Hero slider con 4 slides (uno por servicio), H1 solo en el primero.
 *   2. Dots navegan entre slides; autoplay no rompe la interacción.
 *   3. Header overlay: transparente al cargar, sólido tras scroll.
 *   4. Topbar promo presente.
 *   5. Orden de secciones: slider → social proof → soluciones → banner
 *      diagnóstico → casos → cómo trabajamos → por qué SACsi → checklist.
 *   6. CTA "Consultar sin cargo" sigue visible (contrato de e2e-01/e2e-04).
 */
test.describe('HOME donweb structure', () => {
  test('slider, overlay header y orden de secciones', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Topbar promo
    await expect(page.locator('.topbar-promo')).toBeVisible();
    await expect(page.locator('.topbar-promo a')).toHaveAttribute(
      'href',
      '/soluciones/diagnostico-ia/'
    );

    // Slider: 4 slides, uno por servicio, H1 solo en el primero
    const slides = page.locator('.hero-slider__slide');
    await expect(slides).toHaveCount(4);
    await expect(page.locator('.hero-slider__slide h1')).toHaveCount(1);
    await expect(page.locator('.hero-slider__slide h2')).toHaveCount(3);

    // Precios "desde" presentes en los 4 slides
    await expect(page.locator('.hero-slider__price')).toHaveCount(4);

    // Dots: click en el 3er slide
    const dots = page.locator('.hero-slider__dot');
    await expect(dots).toHaveCount(4);
    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute('aria-selected', 'true');

    // Slide 4: imagen correcta de software (regresión del fix anterior)
    // + GEOMETRÍA: cada slide = 1 viewport exacto (regresión "se ven todos juntos")
    const geo = await page.evaluate(() => {
      const vp = document.querySelector('#hero-slider-viewport');
      const slides = [...document.querySelectorAll('.hero-slider__slide')].map((s) => {
        const r = s.getBoundingClientRect();
        return { left: Math.round(r.left), width: Math.round(r.width) };
      });
      return { clientW: vp.clientWidth, slides };
    });
    expect(geo.clientW).toBeGreaterThan(0);
    geo.slides.forEach((s, i) => {
      expect(s.width, `slide ${i} debe ocupar el viewport completo`).toBe(geo.clientW);
      expect(s.left, `slide ${i} debe empezar justo donde termina el anterior`).toBe(i * geo.clientW);
    });

    // Slide visible contiene el título del 3er servicio
    const slide3 = slides.nth(2);
    await expect(slide3).toBeInViewport({ timeout: 5000 });

    // Header overlay: transparente al cargar, sólido tras scroll
    const header = page.locator('#header-container');
    await expect(header).not.toHaveClass(/solid/);
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveClass(/solid/);

    // Orden de secciones (por posición Y) — testimonios DEBAJO de casos (feedback dueño)
    const orden = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel);
      const pos = (el) => (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1);
      return {
        slider: pos(q('.hero-slider')),
        soluciones: pos(q('#soluciones')),
        diagnostico: pos(q('.diagnostico-banner')),
        casos: pos(q('.casos-anonimos-section')),
        testimonios: pos(q('#social-proof')),
        comoTrabajamos: pos(q('#como-trabajamos')),
        porQue: pos(q('.pq-sacsi')),
        checklist: pos(q('.lead-magnet-banner')),
        faq: pos(q('#faq')),
      };
    });
    expect(orden.slider).toBeLessThan(orden.soluciones);
    expect(orden.soluciones).toBeLessThan(orden.diagnostico);
    expect(orden.diagnostico).toBeLessThan(orden.casos);
    expect(orden.casos).toBeLessThan(orden.testimonios);
    expect(orden.testimonios).toBeLessThan(orden.comoTrabajamos);
    expect(orden.comoTrabajamos).toBeLessThan(orden.porQue);
    expect(orden.porQue).toBeLessThan(orden.checklist);
    expect(orden.checklist).toBeLessThan(orden.faq);

    // CTA "Consultar sin cargo" sigue visible en el hero (contrato E2E existente)
    await expect(
      page.getByRole('link', { name: /Consultar sin cargo/i }).first()
    ).toBeVisible();

    // POR QUÉ SACSI: 4 pilares
    await expect(page.locator('.pq-sacsi__card')).toHaveCount(4);

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

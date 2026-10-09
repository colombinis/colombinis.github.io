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

    // Slider: 4 slides (uno por servicio). El H1 de la página vive en el
    // hero de marca (debajo del slider): en el carrusel todos son h2.
    const slides = page.locator('.hero-slider__slide');
    await expect(slides).toHaveCount(4);
    await expect(page.locator('.hero-slider__slide h1')).toHaveCount(0);
    await expect(page.locator('.hero-slider__slide h2')).toHaveCount(4);
    await expect(page.locator('#hero h1')).toHaveCount(1);

    // Píldora de precio ELIMINADA por decisión del dueño (feedback 3)
    await expect(page.locator('.hero-slider__price')).toHaveCount(0);

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
    // Invariant real (inmune a la posición de scroll del carrusel en el
    // momento de medir): cada slide = ancho del viewport y contiguos sin
    // gap ni overlap (regresión "se ven todos juntos").
    geo.slides.forEach((s, i) => {
      expect(s.width, `slide ${i} debe ocupar el viewport completo`).toBe(geo.clientW);
      if (i > 0) {
        const prev = geo.slides[i - 1];
        const gap = s.left - (prev.left + prev.width);
        expect(gap, `slide ${i} debe ser contiguo al anterior (gap=${gap})`).toBe(0);
      }
    });

    // Slide visible contiene el título del 3er servicio
    const slide3 = slides.nth(2);
    await expect(slide3).toBeInViewport({ timeout: 5000 });

    // Header overlay: transparente al cargar, sólido tras scroll
    const header = page.locator('#header-container');
    await expect(header).not.toHaveClass(/solid/);
    // REGRESIÓN topbar: la topbar estática y el header fijo nunca se pisan.
    // El header arranca a top = altura real de la topbar (CSS var --topbar-h,
    // medida por JS en runtime) y solo sube a top:0 cuando la barra ya
    // scrolleó fuera. Bug original: top fijo 34px pisaba la topbar de 2
    // líneas (56px en mobile). Nota: la clase .solid la togglea el evento
    // scroll (asincrónico) — no muestrear la clase dentro de un evaluate.
    const topbarGeo = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const topbar = document.querySelector('.topbar-promo');
      const headerEl = document.getElementById('header-container');
      const tb = topbar.getBoundingClientRect();
      const hd = headerEl.getBoundingClientRect();
      return {
        topbarH: Math.round(tb.height),
        headerTop: Math.round(hd.top),
        cssVar: getComputedStyle(document.documentElement).getPropertyValue('--topbar-h').trim(),
      };
    });
    // El header arranca EXACTAMENTE debajo de la topbar (±1px subpixel)
    expect(Math.abs(topbarGeo.headerTop - topbarGeo.topbarH)).toBeLessThanOrEqual(1);
    // La CSS var refleja la altura medida (contrato con el JS de Header)
    expect(topbarGeo.cssVar).toBe(`${topbarGeo.topbarH}px`);

    // Umbral de "solid" = altura medida + 4px: al cruzarlo, la topbar ya
    // tiene que estar fuera del viewport (bottom <= 0) — nunca se pisan.
    await page.evaluate((y) => window.scrollTo(0, y), topbarGeo.topbarH + 10);
    await expect(header).toHaveClass(/solid/);
    const topbarBottomWhenSolid = await page.evaluate(() =>
      document.querySelector('.topbar-promo').getBoundingClientRect().bottom
    );
    expect(topbarBottomWhenSolid).toBeLessThanOrEqual(0);

    // Un pelo por debajo del umbral: aún no es sólido (la topbar sigue viva)
    await page.evaluate((y) => window.scrollTo(0, y), topbarGeo.topbarH + 3);
    await page.waitForTimeout(120); // dejar que el evento scroll se procese
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
        porQue: pos(q('.pq-foto')),
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

    // POR QUÉ SACSI: 4 pilares en el organismo foto + filas (2026-10-09)
    await expect(page.locator('.pq-foto__row')).toHaveCount(4);

    expect(errors, `Errores JS detectados:\n${errors.join('\n')}`).toEqual([]);
  });
});

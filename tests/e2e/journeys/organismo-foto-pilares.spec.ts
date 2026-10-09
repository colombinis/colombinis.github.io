import { test, expect } from '@playwright/test';

/**
 * ORGANISMO 2026-10-09 — PorQueSacsiConFoto.astro (guía §13):
 * UNA columna. La foto ocupa el 100% del ancho del contenedor y las
 * filas "POR QUÉ SACSI" de la home (4 pilares) van SUPERPUESTAS sobre la
 * imagen, ALINEADAS A LA IZQUIERDA y con los ICONOS EN LA DERECHA (borde
 * derecho de la imagen). Cada fila: título (naranja #F16529) + bajada
 * (blanca #FAFAFA) a la izquierda e icono (azul #0A7CFF) a la derecha.
 * El velo de la foto es #10192E61 (38%) y cada fila es un chip navy que
 * garantiza el contraste AA de los tres colores sobre el retrato.
 *
 * Reglas verificadas (layout sobre DOM parseado, no grep del HTML):
 *   1. La foto ocupa el 100% del ancho del contenedor.
 *   2. ≥901px: el contenido se superpone a la foto, a la izquierda, con los
 *      iconos en la derecha. <901px: el contenido pasa a un panel navy
 *      DEBAJO de la imagen.
 *   3. Los 4 pilares salen de src/data/pilares.json (mismos de la home).
 *   4. Cada fila: 1 icono a la derecha + título + bajada a la izquierda,
 *      con el chip navy de respaldo.
 *   5. El retrato se sirve como PNG optimizado (1100x614) y carga.
 */

const NARANJA = 'rgb(241, 101, 41)'; // #F16529 — título
const BLANCO = 'rgb(250, 250, 250)'; // #FAFAFA — bajada
const AZUL = 'rgb(10, 124, 255)'; // #0A7CFF — icono
const CHIP = 'rgba(16, 25, 46, 0.9)';

const TITULOS = [
  'Más de 15 años de oficio',
  'Hablamos tu idioma, no código',
  'IA sobre lo que ya tenés',
  'Tecnología que se paga sola',
];

const BAJADAS = [
  'No improvisamos: 15+ años construyendo tiendas, sistemas y automatizaciones.',
  'Te explicamos qué necesitás y qué NO, de forma clara y sin letra chica ni sorpresas.',
  'Asistentes de WhatsApp y automatizaciones sobre lo que ya tenés.',
  'Si no genera ahorro de horas o ventas, no te lo vendemos.',
];

test.describe('Organismo PorQueSacsiConFoto (/design-style-guide §13)', () => {
  test('desktop: 1 columna, foto al 100%, texto a la izquierda e iconos a la derecha', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/design-style-guide/');

    const section = page.locator('#foto-pilares');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    // La imagen es lazy: se espera a que esté decodificada antes de medir.
    await page.waitForFunction(() => {
      const img = document.querySelector('#foto-pilares .pq-foto__img') as HTMLImageElement | null;
      return !!img && img.complete && img.naturalWidth > 0;
    });

    const geo = await section.evaluate((el) => {
      const container = el.querySelector('.container') as HTMLElement;
      const stage = el.querySelector('.pq-foto__stage') as HTMLElement;
      const media = el.querySelector('.pq-foto__media') as HTMLElement;
      const content = el.querySelector('.pq-foto__content') as HTMLElement;
      const img = el.querySelector('.pq-foto__img') as HTMLImageElement;
      const rows = [...el.querySelectorAll('.pq-foto__row')] as HTMLElement[];
      const box = (x: Element) => {
        const b = x.getBoundingClientRect();
        return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) };
      };
      return {
        container: box(container),
        stage: box(stage),
        media: box(media),
        content: box(content),
        img: box(img),
        imgLoaded: img.complete && img.naturalWidth === 1100 && img.naturalHeight === 614,
        rows: rows.length,
        detalle: rows.map((r) => {
          const icon = r.querySelector('.pq-foto__icon')!.getBoundingClientRect();
          const title = r.querySelector('.pq-foto__row-title') as HTMLElement;
          const text = r.querySelector('.pq-foto__row-text') as HTMLElement;
          const tRect = title.getBoundingClientRect();
          const xRect = text.getBoundingClientRect();
          return {
            iconos: r.querySelectorAll('.pq-foto__icon').length,
            iconLeft: Math.round(icon.left),
            iconRight: Math.round(icon.right),
            iconCenterY: Math.round(icon.top + icon.height / 2),
            titleLeft: Math.round(tRect.left),
            titleRight: Math.round(tRect.right),
            titleBottom: Math.round(tRect.bottom),
            titleCenterY: Math.round(tRect.top + tRect.height / 2),
            textTop: Math.round(xRect.top),
            textLeft: Math.round(xRect.left),
            colorTitle: getComputedStyle(title).color,
            colorText: getComputedStyle(text).color,
            colorIcon: getComputedStyle(r.querySelector('.pq-foto__icon') as HTMLElement).color,
            chip: getComputedStyle(r).backgroundColor,
            titulo: title.textContent,
            bajada: text.textContent,
          };
        }),
      };
    });

    // 1. Foto al 100% del ancho del contenedor; la imagen cubre el stage.
    expect(geo.stage.left).toBe(geo.container.left);
    expect(geo.stage.right).toBe(geo.container.right);
    expect(Math.abs(geo.img.w - geo.stage.w)).toBeLessThanOrEqual(1);
    expect(Math.abs(geo.img.h - geo.stage.h)).toBeLessThanOrEqual(1);

    // 2. Contenido SUPERPUESTO a la izquierda, a todo el ancho.
    expect(geo.content.left).toBe(geo.stage.left);
    expect(geo.content.right).toBe(geo.stage.right);
    expect(geo.content.top).toBeGreaterThanOrEqual(geo.stage.top - 1);
    expect(geo.content.bottom).toBeLessThanOrEqual(geo.stage.bottom + 1);
    // La media ocupa exactamente el stage (está detrás del contenido).
    expect(geo.media.w).toBe(geo.stage.w);
    expect(geo.media.h).toBe(geo.stage.h);

    // 3. Los 4 pilares, con los títulos y bajadas de la home.
    expect(geo.rows).toBe(4);
    expect(geo.detalle.map((d) => d.titulo)).toEqual(TITULOS);
    expect(geo.detalle.map((d) => d.bajada)).toEqual(BAJADAS);

    // 4. Cada fila: título + bajada a la izquierda, icono a la derecha,
    //    con el chip navy de respaldo.
    for (const d of geo.detalle) {
      expect(d.iconos).toBe(1);
      // El título arranca a la izquierda del contenido (mismo left en las 4).
      expect(d.titleLeft).toBe(geo.detalle[0].titleLeft);
      // El icono va a la derecha del título, al final de la fila.
      expect(d.iconLeft).toBeGreaterThan(d.titleRight);
      // El icono se alinea con la primera línea del título.
      expect(Math.abs(d.iconCenterY - d.titleCenterY)).toBeLessThanOrEqual(2);
      // La bajada va DEBAJO del título.
      expect(d.textTop).toBeGreaterThanOrEqual(d.titleBottom - 1);
      // Colores del dueño: título naranja, bajada blanca, icono azul.
      expect(d.colorTitle).toBe(NARANJA);
      expect(d.colorText).toBe(BLANCO);
      expect(d.colorIcon).toBe(AZUL);
      // Chip navy de respaldo.
      expect(d.chip).toBe(CHIP);
    }
    // Iconos alineados en columna a la derecha (mismo right en las 4 filas).
    const iconRights = geo.detalle.map((d) => d.iconRight);
    expect(Math.max(...iconRights) - Math.min(...iconRights)).toBeLessThanOrEqual(1);

    // 5. PNG optimizado servido y decodificado.
    expect(geo.imgLoaded).toBe(true);
  });

  test('mobile: la foto sigue al 100% y el contenido pasa debajo (panel)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/design-style-guide/');

    const section = page.locator('#foto-pilares');
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector('#foto-pilares .pq-foto__img') as HTMLImageElement | null;
      return !!img && img.complete && img.naturalWidth > 0;
    });

    const geo = await section.evaluate((el) => {
      const container = el.querySelector('.container') as HTMLElement;
      const stage = el.querySelector('.pq-foto__stage') as HTMLElement;
      const media = el.querySelector('.pq-foto__media') as HTMLElement;
      const content = el.querySelector('.pq-foto__content') as HTMLElement;
      const box = (x: Element) => {
        const b = x.getBoundingClientRect();
        return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) };
      };
      return {
        container: box(container),
        stage: box(stage),
        media: box(media),
        content: box(content),
        contentBg: getComputedStyle(content.parentElement as Element).backgroundColor,
        rows: el.querySelectorAll('.pq-foto__row').length,
        bajadas: [...el.querySelectorAll('.pq-foto__row-text')].length,
        titulosALaIzquierda: [...el.querySelectorAll('.pq-foto__row-title')].every(
          (t) => getComputedStyle(t).textAlign === 'left'
        ),
      };
    });

    // Foto al 100% del contenedor, con el contenido DEBAJO (apilado).
    expect(geo.stage.left).toBe(geo.container.left);
    expect(geo.stage.right).toBe(geo.container.right);
    expect(geo.content.top).toBeGreaterThanOrEqual(geo.media.bottom - 1);
    expect(geo.content.bottom).toBeLessThanOrEqual(geo.stage.bottom + 1);
    // El panel mantiene el navy del velo: los colores conservan el contraste.
    expect(geo.contentBg).toBe('rgb(16, 25, 46)');
    expect(geo.rows).toBe(4);
    expect(geo.bajadas).toBe(4);
    expect(geo.titulosALaIzquierda).toBe(true);
  });

  test('home: usa el MISMO organismo (foto + filas), pilares desde src/data/pilares.json', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const section = page.locator('.pq-foto');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector('.pq-foto .pq-foto__img') as HTMLImageElement | null;
      return !!img && img.complete && img.naturalWidth > 0;
    });

    // LAS 4 filas del organismo, con el copy vigente.
    await expect(section.locator('.pq-foto__row')).toHaveCount(4);
    await expect(section.locator('.pq-foto__row-title')).toHaveText(TITULOS);
    await expect(section.locator('.pq-foto__row-text')).toHaveText(BAJADAS);

    // El título de la sección es el de la home.
    await expect(section.locator('#pq-foto-title')).toHaveText('POR QUÉ SACSI');

    // El retrato se sirve optimizado.
    await expect
      .poll(() =>
        section.locator('.pq-foto__img').evaluate((i: HTMLImageElement) => i.naturalWidth)
      )
      .toBe(1100);

    // En desktop el contenido se superpone a la izquierda, a todo el ancho.
    const geo = await section.evaluate((el) => {
      const stage = el.querySelector('.pq-foto__stage')!.getBoundingClientRect();
      const content = el.querySelector('.pq-foto__content')!.getBoundingClientRect();
      return { stageLeft: stage.left, stageRight: stage.right, contentLeft: content.left, contentRight: content.right };
    });
    expect(geo.contentLeft).toBe(geo.stageLeft);
    expect(geo.contentRight).toBe(geo.stageRight);
  });
});

import { test, expect } from '@playwright/test';

/**
 * FEEDBACK 2026-10-06 (banda accent #0A7CFF en cards):
 *   1. Card media-accent (home, /servicios/*, /catalogo, guía): el fondo
 *      de la banda de imagen (.ui-card__media) pasa de #F16529 a
 *      var(--tertiary) #0A7CFF — "Accent".
 *   2. Card case-flow (CasosAnonimosSection: home y /servicios/*, guía):
 *      el fondo del h3 .ui-card__title pasa de #F16529 a #0A7CFF.
 *   3. Geometría: la banda del h3 llega flush al 100% del ancho del card
 *      y al borde superior (top = top del card contenedor) — igual que la
 *      banda .ui-card__media de media-accent.
 * La verificación es sobre computed styles + bounding boxes (regla del
 * repo: layout verificado en DOM parseado, no grep del HTML fuente).
 */

const ACCENT = 'rgb(10, 124, 255)'; // #0A7CFF
const LEGACY = 'rgb(241, 101, 41)'; // #F16529 — no debe aparecer en bandas

type Banda = { left: number; top: number; width: number; height: number };

async function cardBand(page: import('@playwright/test').Page, cardSel: string, bandSel: string): Promise<{ card: Banda; band: Banda; bg: string; border: { top: number; left: number; right: number } }> {
  return page.evaluate(({ cardSel, bandSel }) => {
    const card = document.querySelector(cardSel) as HTMLElement;
    const band = card.querySelector(bandSel) as HTMLElement;
    const cs = getComputedStyle(band);
    const cardCs = getComputedStyle(card);
    const r = (el: Element) => {
      const b = el.getBoundingClientRect();
      return { left: Math.round(b.left), top: Math.round(b.top), width: Math.round(b.width), height: Math.round(b.height) };
    };
    return {
      card: r(card),
      band: r(band),
      bg: cs.backgroundColor,
      border: {
        top: parseFloat(cardCs.borderTopWidth) || 0,
        left: parseFloat(cardCs.borderLeftWidth) || 0,
        right: parseFloat(cardCs.borderRightWidth) || 0,
      },
    };
  }, { cardSel, bandSel });
}

/** Banda flush: llega al borde superior y al 100% del ancho del card,
 *  es decir ocupa exactamente la content-box (por dentro del border
 *  de 1px del card, mismo comportamiento visual del media-accent en
 *  producción: la banda pega contra el cromo). */
function expectFlush(b: { card: Banda; band: Banda; border: { top: number; left: number; right: number } }) {
  expect(b.band.top).toBe(b.card.top + b.border.top);
  expect(b.band.left).toBe(b.card.left + b.border.left);
  expect(b.band.width).toBe(b.card.width - b.border.left - b.border.right);
}

test.describe('Feedback 2026-10-06 — banda accent #0A7CFF en cards', () => {
  test('home: media-accent y case-flow con banda accent + flush', async ({ page }) => {
    await page.goto('/');

    // 1. media-accent (home): fondo de la banda de imagen = accent.
    const media = await cardBand(page, '#soluciones .service-card', '.ui-card__media');
    expect(media.bg).toBe(ACCENT);
    // La banda ya era flush — se verifica como contraste del punto 3.
    expectFlush(media);

    // 2. case-flow (home): fondo del h3 = accent, banda flush al tope y al
    //    100% del ancho del card contenedor (padding del card = 0).
    const caso = await cardBand(page, '.casos-anonimos-section .caso-card', '.ui-card__title');
    expect(caso.bg).toBe(ACCENT);
    expectFlush(caso);

    // 3. El color legacy #F16529 no queda en ninguna banda de cards.
    const legacy = await page.evaluate(() => {
      const bands = [
        ...document.querySelectorAll('.ui-card__media, .ui-card__title'),
      ] as HTMLElement[];
      return bands.map((b) => getComputedStyle(b).backgroundColor);
    });
    expect(legacy.includes(LEGACY)).toBe(false);
  });

  test('/servicios/presencia-online/: mismas reglas en página de servicio', async ({ page }) => {
    await page.goto('/servicios/presencia-online/');

    // media-accent (cards de categorías del servicio)
    const media = await cardBand(page, '.service-card.ui-card--media-accent', '.ui-card__media');
    expect(media.bg).toBe(ACCENT);
    expectFlush(media);

    // case-flow (CasosAnonimosSection del servicio)
    const caso = await cardBand(page, '.casos-anonimos-section .caso-card', '.ui-card__title');
    expect(caso.bg).toBe(ACCENT);
    expectFlush(caso);
  });

  test('/catalogo/: banda media-accent accent en la grilla', async ({ page }) => {
    await page.goto('/catalogo/');
    const media = await cardBand(page, '#catalogo-grilla .service-card', '.ui-card__media');
    expect(media.bg).toBe(ACCENT);
    expectFlush(media);
  });

  test('/design-style-guide/: ambos exhibits con banda accent + flush', async ({ page }) => {
    await page.goto('/design-style-guide/');

    // Exhibit media-accent
    const media = await cardBand(page, '.cards-preview-grid .ui-card--media-accent', '.ui-card__media');
    expect(media.bg).toBe(ACCENT);
    expectFlush(media);

    // Exhibit case-flow: fondo accent + flush top + 100% del ancho
    const caso = await cardBand(page, '.cards-preview-grid .ui-card--case-flow', '.ui-card__title');
    expect(caso.bg).toBe(ACCENT);
    expectFlush(caso);
  });
});

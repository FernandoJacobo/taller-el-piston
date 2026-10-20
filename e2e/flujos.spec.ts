import { expect, test } from '@playwright/test';

test.describe('Diagnóstico por síntoma', () => {
  test('elegir un síntoma muestra su expediente y prellena la orden', async ({ page }) => {
    await page.goto('/');
    await page.locator('label[for="sin-se-calienta"]').click();
    const exp = page.locator('[data-exp="se-calienta"]');
    await expect(exp).toBeVisible();
    await expect(exp.getByRole('img', { name: /No lo manejes/ })).toBeVisible();
    await expect(exp).toContainText('Orientativo');
    await exp.getByRole('link', { name: 'Llevarlo a revisión' }).click();
    await expect(page.locator('#o-falla')).toHaveValue(/^Se calienta\./);
  });
});

test.describe('Orden de servicio', () => {
  test('valida y arma el enlace de WhatsApp', async ({ page, context }) => {
    await page.goto('/contacto');
    await page.getByRole('button', { name: 'Firmar y mandar por WhatsApp' }).click();
    await expect(page.locator('[data-resumen]')).toContainText('Faltan');
    await page.fill('#o-placa', 'jal-482-c');
    await page.fill('#o-marca', 'Nissan');
    await page.fill('#o-modelo', 'Versa');
    await page.fill('#o-anio', '2014');
    await page.fill('#o-falla', 'Rechina al frenar en las mañanas');
    await page.fill('#o-nombre', 'Mariana T.');
    await page.fill('#o-tel', '33 1234 5678');
    const popup = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Firmar y mandar por WhatsApp' }).click();
    const wa = await popup;
    expect(decodeURIComponent(wa.url().replaceAll('+', ' '))).toContain('ORDEN DE SERVICIO');
    expect(decodeURIComponent(wa.url().replaceAll('+', ' '))).toContain('Placa: JAL-482-C');
  });
});

test.describe('Cotizador', () => {
  test('suma refacciones y mano de obra por separado y agrega IVA', async ({ page }) => {
    await page.goto('/presupuesto?s=balatas-delanteras');
    await page.locator('label.op', { hasText: 'Compacto' }).click();
    await page.locator('label.sv', { hasText: 'Rectificado de discos' }).click();
    const t = page.locator('[data-ticket]');
    await expect(t.locator('[data-t="refacciones"]')).toHaveText('$760');
    await expect(t.locator('[data-t="manoObra"]')).toHaveText('$960');
    await expect(t.locator('[data-t="total"]')).toHaveText('$1,720');
    await page.locator('label.iva').click();
    await expect(t.locator('[data-t="total"]')).toHaveText('$1,995');
    await expect(t.locator('[data-t-sello]')).toBeVisible();
  });
});

test.describe('Seguimiento por placa', () => {
  test('autorizar sincroniza dos pestañas y "Restablecer demo" lo deja como nuevo', async ({ context }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await a.goto('/seguimiento');
    await a.getByRole('button', { name: 'Restablecer demo' }).click();
    await a.getByRole('button', { name: 'JAL-482-C' }).click();
    await b.goto('/seguimiento?placa=JAL-482-C');
    await expect(b.locator('[aria-current="step"]')).toContainText('Autorización');

    await a.getByRole('button', { name: 'Autorizar reparación' }).click();
    await expect(a.locator('[aria-current="step"]')).toContainText('Reparación');
    // La otra pestaña se entera por el evento `storage`
    await expect(b.locator('[aria-current="step"]')).toContainText('Reparación');
    await expect(b.locator('.historial')).toContainText('Autorizado por Mariana T.');

    await b.getByRole('button', { name: 'Restablecer demo' }).click();
    await expect(b.locator('[aria-current="step"]')).toContainText('Autorización');
    await expect(a.locator('[aria-current="step"]')).toContainText('Autorización');
  });

  test('una placa que no existe lo dice claro', async ({ page }) => {
    await page.goto('/seguimiento');
    await page.fill('#placa', 'abc123');
    await page.getByRole('button', { name: 'Ver', exact: true }).click();
    await expect(page.locator('[data-pizarra]')).toContainText('No tenemos la placa ABC123');
  });
});

test.describe('Responsive', () => {
  for (const ancho of [360, 390, 768, 1024, 1280, 1536]) {
    test(`sin scroll horizontal a ${ancho}px`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const ruta of ['/', '/servicios', '/presupuesto', '/seguimiento?placa=JHT-917-B', '/contacto', '/404']) {
        await page.goto(ruta);
        const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(sobra, `${ruta} @${ancho}`).toBeLessThanOrEqual(0);
      }
    });
  }
});

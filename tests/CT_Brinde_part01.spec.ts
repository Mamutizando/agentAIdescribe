import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://mamutizando.lojaintegrada.com.br/');
  await page.getByTitle('Horizon Forbidden West - PS5').click();
  await page.getByRole('link', { name: ' Comprar' }).click();
  await page.getByRole('button', { name: ' Finalizar compra' }).click();
});
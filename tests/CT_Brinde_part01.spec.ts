import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.buscaintegrada.com.br/');
  await page.getByRole('textbox', { name: 'O que você procura?' }).fill('Red Matter 2 VR2 - PS5');
  await page.locator('form').getByRole('button').click();
  await page.getByText('-23% Red Matter 2 VR2 - PS5 R').click();
  await page.locator('a > .w-full').first().click();
  await page.getByRole('paragraph').filter({ hasText: 'Red Matter 2 é um jogo' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Ir para a loja' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'PRIMARIA' }).click();
  await page1.getByRole('textbox', { name: 'CEP' }).click();
  await page1.getByRole('textbox', { name: 'CEP' }).fill('98400-000');
  await page1.getByRole('button', { name: 'OK' }).click();
  await page1.getByRole('list').filter({ hasText: 'R$ 0,00 4 dias úteis Frete Gr' }).click();
  await page1.getByRole('link', { name: ' Comprar' }).click();
  await page1.getByText('4 dias úteis R$ 0,00 Frete Gr').click();
  await page1.getByRole('link', { name: 'Continuar comprando' }).click();
});
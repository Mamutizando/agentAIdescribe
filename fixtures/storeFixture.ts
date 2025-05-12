//Classe responsavel por manter todos os métodos que são compartilhados entre os scripts


import { expect, Locator, Page } from '@playwright/test';
import { formatString } from '../utils/common';
import { buildUrl } from '../utils/urlHelper';



export class StoreFixture {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Obtém o nome do produto na posição especificada.
     * @param index - Índice do produto na lista.
     * @returns Nome do produto.
     */
    async getNomeProduto(index: number) {
        let text = await this.page.locator(".produto-info").nth(index - 1).textContent()
        let texts = text?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text);
        let nomeProduto = texts[0] == "Combo" ? texts[1] : texts[0];
        return nomeProduto;
    }

    /**
     * Obtém o preço subtotal do produto na posição especificada.
     * @param index - Índice do produto na lista.
     * @returns Preço subtotal do produto formatado.
     */
    async getPrecoSubtotalProduto(index: number) {
        let text = await this.page.locator(".preco-produto > strong").nth(index - 1).textContent() ?? ''
        let texts = text?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text);
        let valor = texts[0]
        valor = formatString(valor);
        return valor
    }

    /**
     * Remove um produto do carrinho usando a API.
     * @param store - Nome da loja.
     * @param product - ID do produto.
     */
    async #deleteProductWithAPI(store:string, product:string) {
        const base = await buildUrl(store);
        const urlFinal = `${base}carrinho/produto/${product}/remover`;

        await this.page.evaluate(async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
           
        }, urlFinal);

    }

    /**
     * Remove vários produtos do carrinho usando a API.
     * @param store - Nome da loja.
     * @param products - Lista de IDs dos produtos.
     */
    async #deleteManyProductsWithAPI(store:string, products:[]) {
        for (const product of products) {
            try {
                await this.#deleteProductWithAPI(store, product);
            } catch (error) {
                
            }
        }
    }

    /**
     * Limpa todos os produtos do carrinho.
     * @param store - Nome da loja.
     */
    async limparCarrinho(store:string) {
        await this.page.waitForFunction(() => (window as any).hasOwnProperty('CARRINHO_PRODS'), { timeout: 10000 });
        const cartItems = await this.page.evaluate(() => {
            return (window as any).CARRINHO_PRODS || [];
          });

          console.log(`cartItems: ${JSON.stringify(cartItems)}`);          

          if (cartItems.length > 0) {
            await this.#deleteManyProductsWithAPI(store, cartItems);
            console.log("Produtos removidos do carrinho");
          }          
                
          
    }

    /**
     * Realiza login na API.
     * @param url - URL do serviço de login.
     * @param loja - Nome da loja.
     * @param usuario - Email do usuário.
     * @param senha - Senha do usuário.
     */
    async realizarLoginAPI(url: string, loja: string, usuario: string, senha: string) {
        const base = await buildUrl(loja);
        const urlFinal = `${base}${url}`;

        await this.page.evaluate(async ({ urlFinal, usuario, senha }) => {
            const response = await fetch(urlFinal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    next: '/conta/index',
                    email: usuario,
                    senha: senha
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }, { urlFinal, usuario, senha });
    }

}
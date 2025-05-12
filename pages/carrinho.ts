import { expect, Locator, Page } from '@playwright/test';
import { buildUrl } from '../utils/urlHelper';
import { saveData } from '../utils/storageDataHelper';
import { formatString } from '../utils/common';
import { StoreFixture } from '../fixtures/storeFixture';

export enum FormasEnvioCarrinho {
    RETIRADA = '[data-codigo="retirar_pessoalmente"]',
    MOTOBOY = 'input[data-code="motoboy"]',
    SEDEX = 'input[data-code="SEDEX"]'
}

export class Carrinho extends StoreFixture {
    readonly page: Page;
    private txtCep: Locator;
    private btnCep: Locator;
    private messageAlertFreeShipping: Locator;
    private txtCupom: Locator;
    private btnCupom: Locator;
    private txtCupomDescontoFreteGratis: Locator;
    private txtCupomDesconto: Locator;
    private txtCupomCod: Locator;
    private txtMsgErroCupom: Locator;
    private totalSpan: Locator
    private inputQuantidade: Locator;
    private erroAlertGeral: Locator;
    private boxProductPrice: Locator;
    private selectedItem: Locator;
    private progressiveOfferCardItem: Locator;
    private descontoPorcentagem: Locator;
    private descontoValor: Locator;
    private cardInfo: Locator;
    private txtValorCupom: Locator;
    private txtDescontoValorCupom: Locator;
    private subTotalItens: Locator;
    private btnMais: Locator;
    private btnMenos: Locator;
    private btnDelete: Locator;
    private successAlertGeral: Locator;
    private carrinhoVazio: Locator;
    private qtdCarrinho: Locator;
    private totalCarrinho: Locator;

    constructor(page: Page) {
        super(page)
        this.page = page
        this.txtCep = page.locator('#calcularFrete.input-small.input-cep');
        this.btnCep = page.locator('#btn-frete.btn');
        this.messageAlertFreeShipping = page.locator('.li-alerta-frete-gratis-content');
        this.txtCupom = page.locator('#usarCupom');
        this.btnCupom = page.locator('#btn-cupom');
        this.txtCupomDescontoFreteGratis = page.locator('.cupom-valor > .cor-secundaria');
        this.txtCupomDesconto = page.locator('.cupom-valor > strong');
        this.txtCupomCod = page.locator('.cupom-codigo.borda-alpha');
        this.txtMsgErroCupom = page.locator('.alert.alert-danger.alert-geral');
        this.totalSpan = page.locator('.total > .titulo');
        this.inputQuantidade = page.locator('input[name="quantidade"]');
        this.erroAlertGeral = page.locator('#corpo > div > div.alert.alert-danger.alert-geral');
        this.boxProductPrice = page.locator('[data-produto-id]');
        this.selectedItem = page.locator('.progressive-offer__card_tiers .progressive-offer__card_item_selected');
        this.progressiveOfferCardItem = page.locator('.progressive-offer__card_tiers .progressive-offer__card_item');
        this.descontoPorcentagem = page.locator('.progressive-offer__card_item_selected');
        this.descontoValor = page.locator('.desconto-valor');
        this.cardInfo = page.locator('.progressive-offer__card_info > p');
        this.txtValorCupom = page.locator('#cupom_desconto.cor-principal');
        this.txtDescontoValorCupom = page.locator('span#cupom_valor_real');
        this.subTotalItens = page.locator('.valor-subtotal');
        this.btnMais = page.locator('a.cor-secundaria.icon-plus');
        this.btnMenos = page.locator('a.cor-secundaria.icon-minus');
        this.btnDelete = page.getByRole('link', { name: '' });
        this.successAlertGeral = page.locator('div.alert.alert-success.alert-geral');
        this.carrinhoVazio = page.locator('.span4 > .carrinho > a > .vazio-text');
        this.qtdCarrinho = page.locator('.qtd-carrinho');
        this.totalCarrinho = page.locator('.titulo.cor-principal.valor-total');

    }

    /**
     * Método responsavel por realizar o clique em finalizar a compra no carrinho
     */
    async clickFinalizarCompra() {
        await this.#salvarInfoProdutos()

        await this.page.getByRole('button', { name: ' Finalizar compra' }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async montarCarrinhoUrl(service: string, store: string, produto: string, quantidade: string) {
        let urlFinal;
        let urlBase = await buildUrl(store);
        urlFinal = `${urlBase}${service}${produto}=${quantidade}`;
        await this.page.goto(urlFinal);
    }

    async inserirCep(value: string) {
        await this.txtCep.clear();
        await this.page.getByLabel('Calcule o frete:').fill(value);
        await this.page.getByRole('button', { name: ' Calcular' }).click();
        await this.page.waitForResponse('**/carrinho/valor/?envio_id=**');
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('.formas-envio')).toBeVisible();
    }

    async validarAlertaFreteGratis(message: string) {
        await expect(this.messageAlertFreeShipping, 'Validando a mensagem de frete grátis').toHaveText(message);
    }

    async informarCupom(cupom: string) {

        //se logado com cupom, remove para preencher novamente
        let remove = this.page.getByRole('link', { name: '' })
        if (await remove.isVisible()) {
            await this.page.waitForLoadState('networkidle');
            remove.click();
        }

        await this.txtCupom.fill(cupom);
        await this.btnCupom.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validarDescontoCupom(value: string) {
        if (value != "ERRO") {
            saveData('existCupom', true);
            var locator: Locator;
            if (value == 'Frete Grátis') {
                locator = this.txtCupomDescontoFreteGratis;
            } else {
                locator = this.txtCupomDesconto;
            }
            await expect(this.txtCupomCod, 'Verificando se o cupom preenchido está na tela').toBeVisible();
            let textCupom = await this.txtCupomCod.textContent();
            saveData('cupom', textCupom);

            let valCupom = await locator.nth(0).textContent() ?? '';
            valCupom = valCupom.replace(/\s/g, '');
            expect(valCupom, 'Verificando se está sendo aplicado o cupom').toContain(value.replace(/\s/g, ''));

        } else {
            saveData('existCupom', false);
            expect(await this.txtMsgErroCupom.textContent(), 'Validando que a mensagem de erro do cupom está presente').not.toBeFalsy();
            await expect(this.txtCupomDescontoFreteGratis, 'Verificando que o elemento de frete grátis não existe').not.toBeVisible();
            expect(this.txtCupomDesconto, 'Verificando que o elemento de cupom não existe').not.toBeVisible();
        }
    }

    async validaProdutosBrinde(payloadBrindes: { nomeBrinde: string; qtd: string; preco: string; }[]) {
        let locator = 'tr[data-brinde-id]'
        expect(await this.page.locator(locator).count(), 'Validando a quantidade de brindes').toEqual(payloadBrindes.length)
        for (const el of await this.page.locator(locator).all()) {
            let nomeProduto = await el.locator('.produto-info > .cor-secundaria').textContent() ?? '';
            let brinde = payloadBrindes.find(produto => produto.nomeBrinde.includes(nomeProduto.trim()));
            expect(brinde, 'Validando que o brinde está na lista').not.toBeFalsy();
            await expect(el.locator('.brinde__tag'), 'Validando a visibilidade da tag de brinde').toBeVisible()
            await expect(el.locator('[name="quantidade"]'), 'Validando a visibilidade do campo de quantidade').toBeVisible()
            await expect(el.locator('[name="quantidade"]'), 'Validando o valor da quantidade do brinde').toHaveAttribute('value', brinde?.qtd.toString() ?? "0")
            await expect(el.locator('.preco-produto'), 'Validando o preço do brinde').toContainText(brinde?.preco ?? '')
            await expect(el.locator('.excluir.hidden'), 'Validando que o botão de excluir está oculto').not.toBeVisible()

        }
    }

    async validaDescontoCarrinho(valorDesconto: string) {
        await expect(this.page.locator('strong[data-desconto-valor]').first(), 'Validando o valor do desconto no carrinho').toContainText(valorDesconto);
    }

    async validaTotalCarrinho(total: string) {
        await expect(this.totalSpan, 'Validando a visibilidade do total do carrinho').toBeVisible();
        await expect(this.totalSpan, 'Validando o valor total do carrinho').toContainText(total);
    }

    async #salvarInfoProdutos() {
        type Produto = {
            nomeProd: string;
            qtdUnit: string;
            valUnit: string;
        };
        const produtos: Produto[] = [];

        //SubTotal da Compra
        let subTotal = await this.page.locator('.subtotal > .titulo').textContent() ?? '';
        subTotal = formatString(subTotal);
        saveData('subTotalCompra', subTotal);

        const qtd = await this.page.locator("tr[data-produto-id]").count();
        saveData('qtdProd', qtd);
        for (let index = 1; index <= qtd; index++) {
            let produto = await this.getNomeProduto(index);
            let qtdUnitaria = await this.#getQtdUnitProduto(index);
            let valUnitario = await this.#getValorUnitProduto(index);

            let prd = {
                nomeProd: produto,
                qtdUnit: qtdUnitaria,
                valUnit: valUnitario
            };
            produtos.push(prd);

        }
        saveData('produtos', produtos);

    }

    async #getQtdUnitProduto(index: number) {
        let text = await this.page.locator("input[name='quantidade']").nth(index - 1).getAttribute('value') ?? ''
        return text;
    }

    async #getValorUnitProduto(index: number) {
        let text = await this.page.locator("tr[data-produto-id]").nth(index - 1).locator('.preco-promocional ').nth(1).textContent() ?? ''
        let texts = text?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text);
        let valor = texts[0]
        valor = formatString(valor);
        return valor;
    }

    async inserirQuantidade(qtd: string) {
        await this.inputQuantidade.first().clear();
        await this.inputQuantidade.first().fill(qtd);
        await this.page.getByRole('button', { name: 'Atualizar quantidade' }).click()
        await this.page.waitForLoadState('load');
    }

    async validarMsgErro(msg: string) {
        await expect(this.erroAlertGeral, 'Validando a visibilidade da mensagem de erro geral').toBeVisible();
        await expect(this.erroAlertGeral, 'Validando o texto da mensagem de erro geral').toContainText(msg);
    }

    async validaCompreJuntoCarrinho(buytogether: {nome:string;regular:string;promocional:string}[]) {
        let index = 0;
        for (const el of await this.boxProductPrice.all()) {
            await expect(el, 'Validando o preço regular do produto').toContainText(buytogether[index].regular);
            await expect(el, 'Validando o preço promocional do produto').toContainText(buytogether[index].promocional);
            index++
        }
    }

    async validarTiersDescontoProgressivo(selectedItemCount: number, cardItemCount: number) {
        if (selectedItemCount > 0) {
            const selectedItemsCount = await this.selectedItem.count();
            expect(selectedItemsCount, 'Validando a quantidade de itens selecionados').toEqual(selectedItemCount);
        }

        if (cardItemCount > 0) {
            const cardItemsCount = await this.progressiveOfferCardItem.count();
            expect(cardItemsCount, 'Validando a quantidade de itens no card de oferta progressiva').toEqual(cardItemCount);
        }
    }

    async validarDescontoProgressivo(valorDescontoEsperado: string) {
        if (await this.selectedItem.count() > 0) {
            const ultimoItemSelecionado = await this.selectedItem.last().locator('span').textContent() ?? '';
            await expect(this.descontoPorcentagem, 'Validando o desconto percentual').toContainText(ultimoItemSelecionado);
            await expect(this.descontoValor.first(), 'Validando o valor do desconto').toContainText(valorDescontoEsperado);
        }

        if (await this.progressiveOfferCardItem.count() > 0) {
            const primeiroItem = await this.progressiveOfferCardItem.first().locator('span').textContent() ?? '';
            await expect(this.cardInfo, 'Validando a informação do card').toContainText(primeiroItem)
        }
    }

    async validarPrecoPromocional(valorPromocional: string) {
        const precosPromocionais = await this.page.locator('.preco-produto > .preco-promocional').allTextContents();
        let valorEncontrado = false;

        for (const preco of precosPromocionais) {
            if (preco.includes(valorPromocional)) {
                valorEncontrado = true;
                break;
            }
        }

        expect(valorEncontrado, `Validando se o valor ${valorPromocional} esta presente`).toBe(true);
    }

    async validarInformacoesEnvio(valorFrete: string, prazo: string, tipoEnvio: string) {
        for (const el of await this.page.locator('.radio ').all()) {
            let text = await el.locator(('.nome')).textContent() ?? '';
            if (text.includes(tipoEnvio)) {
                await expect(el.locator('.valor.cor-principal')).toContainText(valorFrete);
                await expect(el.locator('.prazo')).toContainText(prazo);
                await expect(el.locator('.nome')).toContainText(tipoEnvio);
            }
        }

    }

    async acessarHomeCarrinho(service: string, store: string) {
        let urlBaseCarrinho = await buildUrl(store);
        let urlFinalCarrinho = `${urlBaseCarrinho}${service}`;
        await this.page.goto(urlFinalCarrinho);
    }

    async validaElementoNaoExiste(selector: string) {
        const elemento = this.page.locator(selector);
        await expect(elemento).not.toBeVisible();
    }

    async clickFinalizarCompraMiniCart() {
        let locator = this.page.locator('.botao.principal.ir-carrinho.hidden-phone');
        await expect(locator).toBeVisible();
        await locator.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validarCalculoDeCupom() {
        let valorCupom = await this.txtValorCupom.getAttribute('data-desconto-valor') ?? '';
        let descontoCupom = await this.txtDescontoValorCupom.getAttribute('data-desconto-valor-real') ?? '';
        let subtotalCarrinho = await this.subTotalItens.textContent() ?? '';
        let descontoValor = parseFloat(valorCupom.replace(",", "."));
        let descontoValorReal = parseFloat(descontoCupom.replace(",", "."));
        let subtotal = parseFloat(subtotalCarrinho.replace(/[^0-9,-]+/g, "").replace(",", "."));
        let valorDescontoCalculado = descontoValor;

        let textExistente = await this.txtCupomDesconto.first().textContent() ?? '';;

        if (textExistente.includes('%')) {
            valorDescontoCalculado = (subtotal * descontoValor) / 100;
            console.log('valorDescontoCalculado: ', valorDescontoCalculado);
        }
        expect(valorDescontoCalculado, 'Validando o valor do desconto do cupom').toBe(descontoValorReal);
        saveData('valorDescontoCalculado', valorDescontoCalculado);

    }

    async validarLabelFrete(valor: string, shouldContain = true) {
        let found = false;

        for (const el of await this.page.locator('.formas-envio').locator('label.radio').all()) {
            let texto = await el.textContent() ?? '';
            if (texto.includes(valor)) {
                found = true;
                if (shouldContain) {
                    expect(texto, 'Validando se o label contém o valor').toContain(valor);
                } else {
                    throw new Error(`Frete "${valor}" foi encontrado, mas não deveria estar presente!`);
                }
            }
        }
        if (!found && shouldContain) {
            throw new Error(`Frete "${valor}" não foi encontrado, mas deveria estar presente!`);
        }
    }

    async validarQuantidadeProduto(qtd: string) {
        await expect(this.inputQuantidade, 'Validando a quantidade do produto').toHaveValue(qtd);
    }

    async aumentarQuantidadeBotao(qtd: number) {
        for (let index = 0; index < qtd; index++) {
            await this.btnMais.click();
            await this.page.waitForLoadState('load');
        }
    }

    async diminuirQuantidadeBotao(qtd: number) {
        for (let index = 0; index < qtd; index++) {
            await this.btnMenos.click();
            await this.page.waitForLoadState('load');
        }
    }

    async deletarProdutoCarrinho() {

        let count = await this.btnDelete.count();

        for (let index = 0; index < count; index++) {
            await this.btnDelete.first().click();
            await this.page.waitForLoadState('load');
        }
    }

    async validarMsgSucesso(msg: string) {
        await expect(this.successAlertGeral, 'Validando a mensagem de sucesso').toContainText(msg);
    }
  
    async selecionaFormaEnvio(tiposEnvio: FormasEnvioCarrinho) {
        this.page.locator('div[class="formas-envio"]').waitFor({ state: 'visible' });
    
        let tpEnvio = this.page.locator(tiposEnvio);
        await tpEnvio.check();
    };

    async montarCarrinhoCompartilhadoUrl(service: string, store: string, produtos: { id: string, quantidade: string }[], cupom: string) {
        let urlFinal;
        const parametrosProdutos = produtos.map(produto => `${produto.id}=${produto.quantidade}`).join('&');
        const parametroCupom = cupom ? `&cupom=${cupom}` : '';

        const base = await buildUrl(store);
        urlFinal = `${base}${service}${parametrosProdutos}${parametroCupom}`;
        await this.page.goto(urlFinal);

    }

    async validarCarrinhoVazio(texto: string) {
        await expect(this.carrinhoVazio).toContainText(texto);
    }

    async validarqtdMiniCart(qtd: string) {
        await expect(this.qtdCarrinho.first()).toContainText(qtd);
    }

    async calcularTotal() {

        await this.page.waitForLoadState('networkidle');

        let subTotal = await this.subTotalItens.textContent() ?? '';
        const subTotalValue = parseFloat(subTotal.replace(/[^0-9,-]+/g, "").replace(",", "."));
        const validRadios: Locator[] = [];

        for (const radio of await this.page.locator('div.formas-envio label.radio input[type="radio"]').all()) {
            let val = (await radio.getAttribute('data-valor'))?.replace(",", ".") ?? '';
            const valorEnvio = parseFloat(val);
            if (valorEnvio > 0) {
                validRadios.push(radio);
            }
        }

        if (validRadios.length === 0) {
            throw new Error('Nenhuma opção de envio válida encontrada.');
        }

        const randomIndex = Math.floor(Math.random() * validRadios.length);
        const selectedRadio = validRadios[randomIndex];
        const val = await selectedRadio.getAttribute('data-valor');
        const envioValue = parseFloat(val?.replace(",", ".") ?? '0');

        await selectedRadio.click({ force: true });
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500)

        let expectedTotal = subTotalValue + envioValue;
        let locatorCupom = this.page.locator('body').locator('.cupom-valor');
        if (await locatorCupom.count() > 0) {
            const descontoAplicadoAoTotal = await locatorCupom.locator('strong').nth(0).getAttribute('data-desconto-aplicar-no-total');
            const descontoText = (await locatorCupom.locator('#cupom_valor_real').textContent()) ?? ''.replace(/[^0-9,-]+/g, "").replace(",", ".");
            const descontoValue = parseFloat(descontoText);

            if (descontoAplicadoAoTotal == 'sim') {
                expectedTotal = expectedTotal - descontoValue;
            } else {
                expectedTotal = (subTotalValue - descontoValue) + envioValue;
            }
        } else {
            expectedTotal = Math.round(expectedTotal * 100) / 100;
            const total = (await this.totalCarrinho.textContent()) ?? '';
            const totalValue = parseFloat(total.replace(/[^0-9,-]+/g, "").replace(",", "."));
            expect(totalValue).toEqual(expectedTotal);
        }

    }

    async calcularTotalFreteGratis() {
        await this.page.waitForLoadState('networkidle');

        let subTotal = await this.subTotalItens.textContent() ?? '';
        const subTotalValue = parseFloat(subTotal.replace(/[^0-9,-]+/g, "").replace(",", "."));

        let cupomText = await this.page.locator('.cupom-codigo').textContent() ?? '';
        if (cupomText.includes('FREE')) {
            await this.page.locator('div.formas-envio label.radio').locator('.nome', { hasText: 'Frete Grátis' }).click();

            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(500);

            const expectedTotal = Math.round(subTotalValue * 100) / 100;

            const total = (await this.totalCarrinho.textContent()) ?? '';
            const totalValue = parseFloat(total.replace(/[^0-9,-]+/g, "").replace(",", "."));
            expect(totalValue).toEqual(expectedTotal);
        } else {
            throw new Error('O cupom não contém "FREE".');
        }

    }

}

import { Locator, Page, expect } from '@playwright/test';
import { getData, saveData } from '../utils/storageDataHelper';
import { formatString } from '../utils/common';
import { StoreFixture } from '../fixtures/storeFixture';
import { fakerPT_BR as faker, th } from '@faker-js/faker';
import { count } from 'console';

export enum FormasEnvio {
    RETIRADA = '[data-codigo="retirar_pessoalmente"]',
    MOTOBOY = 'input[data-code="motoboy"]',
    SEDEX = '[data-codigo="SEDEX"]',
}

export enum FormasPag {
    ENTREGA,
    CARTAOMP,
    CARTAOPAGALI,
    CARTAOPAGARME,
    PIXPAGALI,
    BOLETOPAGALI,
    BOLETO
}

export class Checkout extends StoreFixture {

    readonly page: Page;

    private select_ret: Locator;
    private btn_finalizar: Locator;
    private txtNome: Locator;
    private radioCartaoMercadoPago: Locator;
    private txtCartaoCvv: Locator;
    private cbCartaoParcela: Locator;
    private btnFinalizarCompra: Locator;
    private radioCartaoPagali: Locator;
    private radioCartaoPagarme: Locator;
    private txtMsgAutenticacaoEntrega: Locator;
    private btnFazerAutentificacao: Locator;
    private radioPixPagali: Locator;
    private txtCep: Locator;
    private txtNumResidencia: Locator;
    private txtEndereco: Locator;
    private txtBairro: Locator;
    private txtCidade: Locator;
    private txtDesconto: Locator;
    private totalSpan: Locator;
    private radioBoletoPagali: Locator;
    private txtValorCupomAplicado: Locator;
    private radioBoletoBancario: Locator;


    constructor(page: Page) {
        super(page)
        this.page = page

        this.select_ret = page.locator('[id="id_escolher_tipo_pagamento"]');
        this.btn_finalizar = page.locator('[id="finalizarCompra"]');
        this.radioCartaoMercadoPago = page.locator('#radio-cartao');
        this.txtCartaoCvv = page.locator('#cartao_cartao_cvv');
        this.cbCartaoParcela = page.locator('#cartao_cartao_parcelas');
        this.btnFinalizarCompra = page.locator('#finalizarCompra');
        this.radioCartaoPagali = page.locator('input[data-code=cartao]');
        this.radioCartaoPagarme = page.locator('input[data-code=cartao]');
        this.txtMsgAutenticacaoEntrega = page.locator('.text-center > p');
        this.btnFazerAutentificacao = page.locator('.text-center > .botao');
        this.radioPixPagali = page.locator('input[data-code=pagali-pix]');
        this.txtCep = page.locator('#id_cep')
        this.txtNome = page.locator("input[name='nome']");
        this.txtNumResidencia = page.locator("input[name='numero']");
        this.txtEndereco = page.locator("#id_endereco");
        this.txtBairro = page.locator("#id_bairro");
        this.txtCidade = page.locator("#id_cidade");
        this.txtDesconto = page.locator(".desconto-valor");
        this.totalSpan = page.locator(".total > .titulo");
        this.radioBoletoPagali = page.locator('input[data-code="pagali-boleto"]');
        this.txtValorCupomAplicado = page.locator('#cupomResultado > strong');
        this.radioBoletoBancario = page.locator('input[data-code="proxy-paghiper-v1-boleto"]');

    }


    async selecionarEnvio(formas: FormasEnvio) {
        const locator = this.page.locator('#formasEnvio');
        await expect(locator).toBeVisible();
        await expect(locator).toHaveCSS('display', 'block');
        await expect(locator).not.toHaveCSS('overflow', 'hidden');
        await expect(this.page.locator('#formularioEndereco')).not.toHaveClass('loading');

        let tpEnvio = this.page.locator(formas);
        if (!await tpEnvio.locator('..').locator('..').locator('input[type="radio"]').isChecked()) {
            let btnAlterarFrm = this.page.getByRole('link', { name: ' Alterar entrega' });
            if (await btnAlterarFrm.isVisible()) {
                await btnAlterarFrm.click();
            }
            await tpEnvio.click({ force: true });
            await this.page.waitForRequest('**/carrinho/valor/?envio_id**');
            expect(await this.page.locator('#exibirFormasEnvio').getAttribute('style'), 'Aguardando o menu opções de envio fechar').toContain('display: block;')
        }

    }

    async selecionarPagamento(formas: FormasPag) {
        const count = await this.page.locator('div[class~="li-box-payment"][style=""]').count();

        let modal = false
        let locator = await this.page.locator('#exibirFormasPagamento').getAttribute('style');
        if (locator?.includes('display: none;')) {
            modal = true
        }


        switch (formas) {
            case FormasPag.ENTREGA:
                await this.#pagEntrega();
                break;
            case FormasPag.CARTAOMP:
                await this.radioCartaoMercadoPago.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;
            case FormasPag.CARTAOPAGALI:
                await this.radioCartaoPagali.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;
            case FormasPag.CARTAOPAGARME:
                await this.radioCartaoPagarme.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;
            case FormasPag.PIXPAGALI:
                await this.radioPixPagali.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;
            case FormasPag.BOLETOPAGALI:
                await this.radioBoletoPagali.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;
            case FormasPag.BOLETO:
                await this.radioBoletoBancario.click();
                await this.page.waitForLoadState('domcontentloaded');
                break;

            default:
                break;
        }

        if (count > 1 && modal) {
            await this.page.waitForRequest('**/carrinho/valor/**');
        }
        await this.page.waitForTimeout(700);
        await this.page.waitForSelector("strong[class='titulo cor-principal preco-carrinho-total']");

    }

    async clickCadastrarEndereco() {
        await this.page.getByText('Cadastrar novo endereço').click();
    }

    async finalizarCompra() {
        await this.page.waitForSelector("strong[class='titulo cor-principal preco-carrinho-total']");
        await this.#validacaoPreResumo();
        await this.#salvarInfoValoresCompra();
        await this.btn_finalizar.click();
        await this.page.waitForURL('**/finalizacao');
    }

    async cartaoSalvoLia(cartao: string, cvv: string, parcelas: string) {

        await this.page.waitForFunction(() => {
            const element = document.querySelector('#escolha-cartao');
            if (element === null) return false;

            const style = window.getComputedStyle(element);
            return style.display === 'block';
        });

        await this.page.getByLabel(cartao).click();
        await this.txtCartaoCvv.fill(cvv);
        await this.cbCartaoParcela.selectOption(parcelas);
    }

    async informarCep(cep = '') {
        console.log('informando CEP ' + cep);
        await expect(this.txtCep).toBeVisible();
        await this.txtCep.clear();
        await this.txtCep.click();
        if (cep) {
            await this.txtCep.pressSequentially(cep, { delay: 300 });
        } else {
            await this.txtCep.pressSequentially(faker.location.zipCode(), { delay: 300 });
        }
        await this.txtCep.click();
        await expect(this.page.locator('div[class="formEndereco-conteiner spinner"]'), 'Aguardando atualização do cep iniciar').toBeVisible();
        await expect(this.page.locator('div[class="formEndereco-conteiner"]').first(), 'Aguardando atualização do cep finalizar').toBeVisible();
    }

    /**
     * Metodo responsavel por preencher o nome do destinatario,
     * deixe vazio o parametro para ser gerado automaticamente 
     * @param nome 
     */
    async informarNome(nome = '') {
        await expect(this.txtNome).toBeVisible();

        if (nome) {
            await this.txtNome.fill(nome);
        } else {
            await this.txtNome.fill(faker.person.fullName());
        }
    }

    async informarNumResidencia(numResidencia = '') {
        if (numResidencia) {
            await this.txtNumResidencia.fill(numResidencia);
        } else {
            await this.txtNumResidencia.fill(faker.location.buildingNumber())
        }
    }

    async informarLogradouro(logradouro = '') {
        if (logradouro) {
            await this.txtEndereco.fill(logradouro);
        } else {
            await this.txtEndereco.fill(faker.location.street());
        }
    }

    async informarBairro(bairro = '') {
        if (bairro) {
            await this.txtBairro.fill(bairro);
        } else {
            await this.txtBairro.fill(faker.location.county());
        }
    }

    async informarCidade(cidade = '') {
        if (cidade) {
            await this.txtCidade.fill(cidade);
        } else {
            await this.txtCidade.fill(faker.location.city());
        }
    }

    async validarEnderecoPrincipal(bairro: string) {
        const text = await this.page.locator('label[for=idEnderecoPrincipal1] > span:nth-child(2) > strong').textContent();
        expect(text).toEqual(bairro);
    }

    async validarBtnFinalizarHabilitado() {
        await expect(this.btnFinalizarCompra).not.toHaveClass('botao principal grande disabled');
    }

    async validarMsgAutNaEntrega(msg: string) {
        const text = await this.txtMsgAutenticacaoEntrega.textContent();
        expect(text).toEqual(msg);
    }

    async validarBtnAutenticacao() {
        await expect(this.btnFazerAutentificacao).toHaveClass('botao secundario anonimo-fazer-login');
        await this.btnFazerAutentificacao.click()
    }

    async validarBtnFinalizarDesabilitado() {
        await expect(this.btnFinalizarCompra).toHaveClass('botao principal grande disabled');
    }

    async #validacaoPreResumo() {
        let qtdProd = getData('qtdProd');
        let qtdProdCheckout = await this.page.locator("td[data-produto-id]").count()
        expect(qtdProd, "Validando a quantidade de produtos").toEqual(qtdProdCheckout);

        type Produto = {
            nomeProd: string;
            qtdUnit: string;
            precoSub: string;
        };
        const arrayProd: Produto[] = [];
        //Salva todo o resumo do pedido em uma lista
        let qtd = getData('qtdProd')
        for (let index = 1; index <= qtd; index++) {
            let produto = await this.getNomeProduto(index);
            let qtdUnitaria = await this.#getQtdUnitProduto(index);
            let precoSubTotalUnit = await this.getPrecoSubtotalProduto(index);

            let prd = {
                nomeProd: produto,
                qtdUnit: qtdUnitaria,
                precoSub: precoSubTotalUnit
            };
            arrayProd.push(prd);
        }
        

        arrayProd.forEach((prod) => {
            let obj = getData('produtos').find((o: Produto) => o.nomeProd === prod.nomeProd);
            expect(obj.nomeProd, "Validando o nome do produto").toContain(prod.nomeProd);
            expect(obj.qtdUnit, "Validando a qtd unitaria de cada produto").toEqual(prod.qtdUnit);
            expect(prod.precoSub, "Validando o valor subTotal de cada produto não esta vazio").toBeTruthy()

        });

        //validação subtotal dos produtos
        let val = await this.page.locator('.subtotal > .titulo').textContent();
        let texts = val?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text);
        let subTot = texts[0]
        expect(getData('subTotalCompra'), "Validando o subtotal dos produtos").toContain(subTot);


    }

    async #salvarInfoValoresCompra() {
        //valor do frete
        let frete = await this.page.locator("div.frete-preco > strong").textContent() ?? '';
        frete = formatString(frete);
        saveData('valFrete', frete);

        //valor total compra
        let totCompra = await this.page.locator("div.total > strong").textContent() ?? '';
        totCompra = formatString(totCompra);
        saveData('totalCompra', totCompra);
    }

    async #pagEntrega() {
        await this.page.getByAltText('Pague com Pagamento na entrega').click();
        expect(await this.page.locator('#exibirFormasPagamento').getAttribute('style')).toContain('display: block;')
        await this.select_ret.selectOption({ label: 'Dinheiro' });
    }

    async #getQtdUnitProduto(index: number) {
        let text = await this.page.locator(".conteiner-qtd").nth(index - 1).textContent();
        let texts = text?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text);
        let qtdUnit = texts[0]
        return qtdUnit
    }

    async validarDescontoCheckout(valor: string) {
        await expect(this.txtDesconto).toContainText(valor);
    }

    async validarTotal(total: string) {
        await this.page.waitForSelector("strong[class='titulo cor-principal preco-carrinho-total']");
        await expect(this.totalSpan).toContainText(total);
    }

    async validarProdutosBrinde(payloadBrindes: { nomeBrinde: string; qtd: string; preco: string; }[]) {
        let locator = '[data-brinde-id]'
        await this.page.waitForTimeout(1500)
        expect(await this.page.locator(locator).count()).toEqual(payloadBrindes.length)
        for (const el of await this.page.locator(locator).all()) {
            await expect(el.locator(".brinde__tag"), 'Validando se a tag brinde esta sendo exibida').toBeVisible();

            await el.locator('.brinde__tag').evaluate(tag => tag.remove());
            const nome = await el.locator('.brinde__info').textContent() ?? '';
            const nomeLimpo = nome.replace(/\s+/g, ' ').trim();
            let brinde = payloadBrindes.find(produto => produto.nomeBrinde.includes(nomeLimpo));

            expect(brinde, "Validando que o brinde está na lista").not.toBeFalsy();
            await expect(el.locator("..").locator(".conteiner-qtd"), 'Validando se a quantidade unitaria do brinde esta correta').toContainText(brinde?.qtd.toString() ?? "0");
            await expect(el.locator("..").locator(".preco-produto"), 'Validando o preço do brinde').toContainText(brinde?.preco ?? '')

        }
    }

    async validarInformacoesEnvio(valor: string, prazo: string, nome: string) {
        for (const el of await this.page.locator('#formas-envio-wrapper .forma-envio').all()) {
            let nomeEnvio = await el.locator('.envio-nome').textContent();
            if (nomeEnvio?.includes(nome)) {
                await expect(el.locator('.envio-preco')).toContainText(valor);
                await expect(el.locator('.envio-prazo-entrega')).toContainText(prazo);
                await expect(el.locator('.envio-nome')).toContainText(nome);
            }
        }
    }
    
    async validarValorDescontoCupom(){
        let valorCupomAplicadoCheckout = await this.txtValorCupomAplicado.textContent() ?? '';
        let valor = getData('valorDescontoCalculado');
        let descontoAplicado = parseFloat(valorCupomAplicadoCheckout.replace(/[^0-9,-]+/g, "").replace(",", "."));
        expect(descontoAplicado).toEqual(valor);
    }
}
import { expect, Locator, Page } from '@playwright/test';
import { getData, saveData } from '../utils/storageDataHelper';

export class Produto {
    readonly page: Page;
    private btnComprar: Locator;
    private filterOptionByColorRed: Locator;
    private filterOptionByColorBlack: Locator;
    private filterOptionByColorWhite: Locator;
    private chooseVariationColor: Locator;
    private opsWarnMe: Locator;
    private idImage: Locator;
    private adicionarCompreJunto: Locator;
    private flagDescontoCompreJunto: Locator;
    private divCompreJunto: Locator;
    private cardCompreJunto: Locator;
    private nomeProdutoCompreJunto: Locator;
    private precoRegularCompreJunto: Locator;
    private precoPromocionalCompreJunto: Locator;
    private valorTotalRegular: Locator;
    private valorTotalPromocional: Locator;
    private valorProduto: Locator;
    private inputCep: Locator;
    private btnCepOk: Locator;


    constructor(page: Page) {
        this.page = page
        this.btnComprar = page.getByRole('link', { name: ' Comprar' });
        this.filterOptionByColorRed = page.locator('span[style*="FF0000"]');
        this.filterOptionByColorBlack = page.locator('span[style*="000000"]');
        this.filterOptionByColorWhite = page.locator('span[style*="FAFAFA"]');
        this.chooseVariationColor = page.locator('.atributos ul li .atributo-item');
        this.opsWarnMe = page.locator('.preco-produto > .avise-me > .avise-me-form > .avise-tit');
        this.idImage = page.locator('#imagemProduto');
        this.adicionarCompreJunto = page.locator('.compre-junto__comprar > button');
        this.flagDescontoCompreJunto = page.locator('.compre-junto__desconto');
        this.divCompreJunto = page.locator('.compre-junto');
        this.cardCompreJunto = page.locator('.compre-junto__produto');
        this.nomeProdutoCompreJunto = page.locator('.compre-junto__nome > a');
        this.precoRegularCompreJunto = page.locator('.compre-junto__preco--regular');
        this.precoPromocionalCompreJunto = page.locator('.compre-junto__preco--promocional');
        this.valorTotalRegular = page.locator('.compre-junto__preco-total--regular');
        this.valorTotalPromocional = page.locator('.compre-junto__preco-total--promocional');
        this.valorProduto = page.locator('.principal strong.preco-promocional.cor-principal');
        this.inputCep = page.locator('input[name="cep"]');
        this.btnCepOk = page.locator('button[type="submit"]');

    }

    /**
     * Método responsavel por realizar o clique em comprar na tela do produto
     */
    async clickComprar() {
        await this.btnComprar.first().click();
        await this.page.waitForLoadState('load')
    }

    /**
     * Método responsavel por selecionar a variação de um produto
     * @param args 
     */
    async selecionarVariacao(...args: (string | number)[]) {
        const array = args.join("").split("");
        for (const [i, num] of array.entries()) {
            const index = parseInt(num, 10);
            await this.page.locator("div[class='atributos']").locator("> div > ul li > a").nth(index).click();
        }
    }

    async validaOpcaoFiltroProdutoPorCor(cor: string) {
        switch (cor.toLowerCase()) {
            case "vermelha":
            case "vermelho":
                await expect(this.filterOptionByColorRed).toBeVisible();
                break;
            case "preta":
            case "preto":
                await expect(this.filterOptionByColorBlack).toBeVisible();
                break;
            case "branca":
            case "branco":
                await expect(this.filterOptionByColorWhite).toBeVisible();
                break;
            default:
                console.log(`A cor ${cor} não está disponível`)
        }
    }

    async validaOpcaoFiltroProdutoPorTamanho(tamanho: string) {
        expect(this.page.locator('.atributo-item').filter({ hasText: tamanho })).toBeVisible();
    }

    async selecionarVariacaoIndisponivel(num: number) {
        let locator = this.chooseVariationColor.nth(num);
        await expect(locator).toHaveClass('atributo-item indisponivel');
        await locator.click();
    }

    async validarFormAviseme() {
        await expect(this.opsWarnMe).toBeVisible();
    }

    async validarImagem(idProduct: string, refImg: string, nameProduct: string) {
        const enviroment = "https://cdn.awsli.com.br/600x450/2515/2515621/produto/";
        let src = await this.idImage.getAttribute('src')
        let alt = await this.idImage.getAttribute('alt')
        expect(src).toBe(enviroment + idProduct + refImg)
        expect(alt).toBe(nameProduct)
    }

    async adicionaCompreJunto() {
        await this.adicionarCompreJunto.click();
        await this.page.waitForLoadState('load');
    }

    async validarCompreJunto(buytogether: {nome:string;regular:string;promocional:string}[]) {
        const existePromocional = await this.flagDescontoCompreJunto.getAttribute('style');
        saveData('existePromocional', existePromocional);
        await expect(this.divCompreJunto).toBeVisible();
        let totalRegular = 0;
        let totalPromocional = 0;
        let index = 0;
        for (const el of await this.cardCompreJunto.all()) {
            await expect(el.locator(this.nomeProdutoCompreJunto)).toContainText(buytogether[index].nome);
            //regular
            totalRegular = await this.#validaValorRegularCompreJunto(
                totalRegular,
                buytogether,
                index
            );
            saveData('totalRegular', totalRegular);
            //promocional
            totalPromocional = await this.#validaValorPromocionalCompreJunto(
                totalPromocional,
                buytogether,
                index
            );
            saveData('totalPromocional', totalPromocional);
            index++
        }
        await this.#validaTotalCompreJunto("@totalRegular");
        await this.#validaTotalCompreJunto("@totalPromocional");
    }

    async #validaValorRegularCompreJunto(totalRegular:number, buytogether: {nome:string;regular:string;promocional:string}[], index: number) {
        let regular = buytogether[index].regular.replace(".", "").replace(",", ".");
        await expect(this.precoRegularCompreJunto.nth(index)).toContainText(buytogether[index].regular);
        totalRegular += parseFloat(regular);
        return totalRegular;
    }

    async #validaValorPromocionalCompreJunto(totalPromocional:number, buytogether: {nome:string;regular:string;promocional:string}[], index: number) {
        let existePromocional = getData('existePromocional');
        if (existePromocional === 'display: block') {
            let promocional = buytogether[index].promocional
                .replace(".", "")
                .replace(",", ".");
            await expect(this.precoPromocionalCompreJunto).toContainText(buytogether[index].promocional);
            totalPromocional += parseFloat(promocional);
        }
        return totalPromocional;
    }

    async #validaTotalCompreJunto(tipoTotal: string) {
        if ((tipoTotal === "@totalRegular")) {
            let totalRegular: number = getData('totalRegular');
            const regularFormatado = totalRegular
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                .replace(/\.(?=[^.]*$)/, ",");
            await expect(this.valorTotalRegular).toContainText(regularFormatado);
        } else {
            let precoPromocional = getData('existePromocional');
            if (precoPromocional === "display: block") {
                let totalPromocional: number = getData('totalPromocional');
                const promocionalFormatado = totalPromocional
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    .replace(/\.(?=[^.]*$)/, ",");
                await expect(this.valorTotalPromocional).toContainText(promocionalFormatado)
            }
        }
    }

    async validarPrecoExibido(valor: string) {
        await expect(this.valorProduto).toContainText(valor);
    }

    async calcularFrete(cep: string) {
        await this.inputCep.fill(cep);
        await this.btnCepOk.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validarInformacoesEnvio(valor: string, prazo: string, tipoEnvio: string) {
        for (const el of await this.page.locator('.cep ul li').all()) {
            let nome = await el.locator('.nome.cor-secundaria').textContent();
            if (nome?.includes(tipoEnvio)) {
                await expect(el.locator('.valor.cor-principal')).toContainText(valor);
                await expect(el.locator('.prazo')).toContainText(prazo);
                await expect(el.locator('.nome.cor-secundaria')).toContainText(tipoEnvio);
            }
        }
    }

    async adicionarProdutoMinicart() {
        let locator = this.page.getByRole('link', { name: ' Loja Teste, Não Comprar' });
        locator.scrollIntoViewIfNeeded();
        locator.click();
        await expect (this.page.locator('.fancybox-skin')).toBeVisible();
    }

    async finalizarCompraMinicart() {
        
    }

}

import { expect, Locator, Page } from '@playwright/test';

export class Busca {

    readonly page: Page;
    private filterOptionByColorRed: Locator;
    private filterOptionByColorBlack: Locator;
    private filterOptionByColorWhite: Locator;
    private firstReturnedProduct: Locator;
    private filterOptionBySize: Locator;
    private productList: Locator;
    private qtdProducts: Locator;
    private breadcumbMenu: Locator;
    private textSearchResultSuccess: Locator;
    private sortButton: Locator;
    private sortList: Locator; 

    constructor(page: Page) {
        this.page = page
        this.filterOptionByColorRed = page.locator('a[href$="FF0000"]');
        this.filterOptionByColorBlack = page.locator('a[href$="000000"]');
        this.filterOptionByColorWhite = page.locator('a[href$="FAFAFA"]');
        this.firstReturnedProduct = page.locator(":nth-child(1) > .row-fluid > :nth-child(1) > .listagem-item > .produto-sobrepor");
        this.filterOptionBySize = page.locator('.atributo-comum span');
        this.productList = page.locator('.listagem-item .info-produto');
        this.qtdProducts = page.locator('ul[class=row-fluid] > li');
        this.breadcumbMenu = page.locator('.breadcrumbs');
        this.textSearchResultSuccess = page.locator('.conteudo > :nth-child(2) > .titulo.cor-secundaria');
        this.sortButton = page.locator('#botaoOrdenar');
        this.sortList = page.locator('.dropdown-menu.pull-right li a');          
    }



    async filtrarProdutoPorCor(cor: string) {
        switch (cor.toLowerCase()) {
            case "vermelha":
            case "vermelho":
                await this.filterOptionByColorRed.click()
                break;
            case "preta":
            case "preto":
                await this.filterOptionByColorBlack.click()
                break;
            case "branca":
            case "branco":
                await this.filterOptionByColorWhite.click()
                break;
            default:
                console.log(`A cor ${cor} não está disponível`)
        }
    }

    async clicarNoPrimeiroProdutoRetornado(){
        await this.firstReturnedProduct.click();
    }

    async filtrarProdutoPorTamanho(size:string){
        await this.filterOptionBySize.filter({ hasText: size }).click()
    }
    
    async validarCardNomeProduto(nome:string){
        await expect(this.productList).toContainText([nome]);
    }

    async validarQtdProdutos(qtd:number){
        await expect(this.qtdProducts, 'Validando a quantidade de produtos filtrados exibidos').toHaveCount(qtd);
    }

    async validarTermoBuscadoEncontrado(termo:string){
        await expect(this.breadcumbMenu).toContainText('Resultado de busca');
        await expect(this.textSearchResultSuccess).toContainText([termo]);
    }

    async ordenarProdutosPor(tipo:string) {
        await this.sortButton.click();
        await this.sortList.filter({hasText: tipo}).click()
        await this.page.waitForLoadState('networkidle');
    }

    async validarOrdenacaoMaiorDesconto() {
        let discounts: number[] = [];

        for (const el of await this.page.locator('.bandeiras-produto .bandeira-promocao').all()){
            let result = await el.textContent()
            let xpto  = parseInt(result?.replace(/[^0-9]/g, "") ?? '0')
            discounts.push(xpto)
        }

        expect(this.#isSortedDesc(discounts), "Valida ordenação de Maior Desconto").toBeTruthy();
            
    }

    #isSortedDesc(list:number[]){
        for (let i = 0; i < list.length - 1; i++) {
            if (list[i] < list[i + 1]) {
              return false;
            }
          }
          return true;        
    }

}
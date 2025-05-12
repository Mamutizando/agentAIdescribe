import { Locator, Page, expect } from '@playwright/test';
import { getData } from '../utils/storageDataHelper';
import { formatString } from '../utils/common';
import { StoreFixture } from '../fixtures/storeFixture';


export class Finalizacao extends StoreFixture {
    
    readonly page: Page;
    private txtNumPedido: Locator;
    private label_msg_entrega: Locator;
    private label_msg_status: Locator;

    constructor(page: Page) {
        super(page)
        this.page = page
        this.txtNumPedido = page.locator('.caixa-info h2.cor-principal.numero-pedido');
        this.label_msg_entrega = page.locator('[id="mensagemEntrega"] > p');
        this.label_msg_status = page.locator('ul.caixa-info:nth-of-type(1) > li:nth-of-type(3) > span > b');

    }


    async validarRetirada(){
        await expect(this.label_msg_entrega).toContainText('O pagamento deve ser feito na retirada do produto.')
        await expect(this.label_msg_status).toContainText('Pagamento em análise');
    }

    async validarNumPedido(){
        expect(this.txtNumPedido.textContent()).toBeTruthy();

        await this.#validarResumoPedido();
    }
    



    async #validarResumoPedido(){
        type Produto = {
            nomeProd: string;
            qtdUnit: string;
            precoSub: string;
        };
        const arrayProd: Produto[] = [];
       //Salva todo o resumo do pedido em uma lista
        let qtd = getData('qtdProd')
        for(let index = 1; index <= qtd; index++){
            let produto = await this.getNomeProduto(index);
            let qtdUnitaria = await this.#getQtdUnitProduto(index);
            let precoSubTotalUnit = await this.getPrecoSubtotalProduto(index);

            let prd = {
                nomeProd: produto,
                qtdUnit: qtdUnitaria,
                precoSub: "R$ " + precoSubTotalUnit
            };
            arrayProd.push(prd);            
        }

        arrayProd.forEach((prod) => {
            let obj = getData('produtos').find((o: Produto) => o.nomeProd === prod.nomeProd);
            expect(obj.nomeProd, "Validando o nome do produto").toContain(prod.nomeProd);
            expect(obj.qtdUnit, "Validando a qtd unitaria de cada produto").toEqual(prod.qtdUnit);
            expect(prod.precoSub, "Validando o valor subTotal de cada produto não esta vazio").toBeTruthy()

        });

        //validar frete
        let valFrete = await this.page.locator('div.frete-preco.text-right > strong').textContent();
        expect(getData('valFrete'),'Validando o valor do frete').toContain(valFrete);

        //validando o sub-Total compra
        let valSubTotCompra = await this.page.locator('div.subtotal > strong').textContent();
        expect(getData('subTotalCompra'),'Validando o valor sub total da compra').toContain(valSubTotCompra);

        //validar Total Compra
        let totCompra = await this.page.locator('div.total > strong').textContent();
        expect(getData('totalCompra'),'Validando o valor total da compra').toContain(totCompra);

        //validar cupom
        if(getData('existCupom')){
            console.log('cupom encontrado');
            let cupom = getData('cupom');
            await expect(this.page.locator(".text-right:not([class*=' ']) > strong"),'Validando se o cupom foi aplicado').toContainText(cupom);

            if (cupom != 'FRETE'){
                //valida o desconto aplicado
                expect(await this.page.locator("div.desconto-preco.text-right > strong").textContent(),'Validando o desconto do cupom').not.toBeFalsy();
            }

        } else {
            console.log('cupom não encontrado');
            expect(await this.page.locator(".text-right:not([class*=' ']) > strong").count(),"Validando se não tem informação de cupom exibida").toEqual(0);
        }


    } 
    
    async #getQtdUnitProduto(index:number){
        let text = await this.page.locator("tbody > :nth-child(" + index + ") > :nth-child(3)").textContent();
        let texts = text?.split("\n") ?? [];
        texts = texts?.map((text) => text.trim());
        texts = texts?.filter((text) => text); 
        let qtdUnit = texts[0]       
        return qtdUnit
    }
   
    
}
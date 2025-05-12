import { test } from '../fixtures/fixturesBase';
import store from '../test-data/fretegratisautomation.json';
import global from '../test-data/global.json';

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.fretegratisautomation.urlStore);
})

test.describe('Frete grátis Por Região ', { tag: ['@cart'] }, () => {

    test('Produto simples região personalizada - CEP de região ativa', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[0].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
    })

    test("Produto com variação região personalizada - CEP de região ativa", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[1].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
    });
    
    test("Produto simples região personalizada - CEP de região ativa + cupom valor fixo", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[0].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[0].code);  
        await carrinho.validarDescontoCupom("10,00");
    });
    
    test("Produto com variação região personalizada - CEP de região ativa + cupom valor fixo", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[1].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[0].code);  
        await carrinho.validarDescontoCupom("10,00");
    });
    
    test("Produto simples região personalizada - CEP de região ativa + cupom de porcentagem", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[0].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[1].code);  
        await carrinho.validarDescontoCupom("10 %");
    });
})
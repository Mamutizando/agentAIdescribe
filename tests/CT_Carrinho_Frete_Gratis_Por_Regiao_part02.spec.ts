import { test } from '../fixtures/fixturesBase';
import store from '../test-data/fretegratisautomation02.json';
import global from '../test-data/global.json';

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.fretegratisautomation.urlStore);
})

test.describe('Frete grátis Por Região ', { tag: ['@cart'] }, () => {

    test('Produto com variação região personalizada - CEP de região ativa + cupom de porcentagem', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[1].idProduct,
            "1");  
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[1].code);  
        await carrinho.validarDescontoCupom("10 %");
    })

    test("Produto simples região personalizada - CEP de região ativa + cupom frete gratis", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[0].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[2].code);    
        await carrinho.validarDescontoCupom("Frete Grátis");
    });

    test("Produto com variação região personalizada - CEP de região ativa + cupom frete gratis", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[1].idProduct,
            "1");  
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
        await carrinho.informarCupom(store.fretegratisautomation.cupons[2].code);  
        await carrinho.validarDescontoCupom("Frete Grátis");
    });

    test("Frete grátis por região personalizada - CEP de região ativa + por produto offers", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[2].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
    });

    test("Frete grátis por região personalizada - CEP de região ativa + por produto de uma categoria offers", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[3].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.activeRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping);
    });

    test("Frete grátis por região personalizada- CEP de região desativada", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[3].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.disabledRegionZipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.freeShipping, false);
    });
});
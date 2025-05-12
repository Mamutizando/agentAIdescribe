import { test } from '../fixtures/fixturesBase';
import store from '../test-data/fretegratisautomation02.json';
import global from '../test-data/global.json';

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.fretegratisautomation.urlStore);
})

test.describe('Frete grátis Por Categoria', { tag: ['@cart', '@smoke'] }, () => {

    test('Com 1 produto ativo + por produto de uma categoria offers', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[3].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[7].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.correios);

    })

    test('Com 1 produto ativo e 1 produto não ativo + cupom valor fixo', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[6].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[7].idProduct,
            "1");
        await carrinho.informarCupom(store.fretegratisautomation.cupons[0].code);
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.correios);
        await carrinho.validarDescontoCupom("10,00");

    })

    test('Com 1 produto ativo e 1 produto não ativo + cupom de porcentagem', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[6].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[7].idProduct,
            "1");
        await carrinho.informarCupom(store.fretegratisautomation.cupons[1].code);
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.correios);
        await carrinho.validarDescontoCupom("10 %");

    })

    test('Com 1 produto ativo e 1 produto não ativo + cupom frete gratis', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[6].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[7].idProduct,
            "1");
        await carrinho.informarCupom(store.fretegratisautomation.cupons[2].code);
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
        await carrinho.validarDescontoCupom("Frete Grátis");

    })

    test('Com 1 produto ativo e 1 produto não ativo + por produto offers', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[2].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[6].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[8].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.correios);

    })

    test('Com 1 produto ativo e 1 produto não ativo + por produto de uma categoria offers', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[3].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[6].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.fretegratisautomation.urlStore,
            store.fretegratisautomation.product[8].idProduct,
            "1");
        await carrinho.inserirCep(store.fretegratisautomation.zipCode);
        await carrinho.validarLabelFrete(store.fretegratisautomation.correios);

    })


})
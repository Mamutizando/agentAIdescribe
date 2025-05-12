import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[1].idProduct, quantidade: "1" },
];

test.describe('Suite Cupom simples que deve retornar sucesso', { tag: ['@cart', '@smoke'] }, () => {

    test('Valor fixo - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.fixedValueCoupon);
        await carrinho.validarDescontoCupom("2");
    })

    test('Cupom acumulativo - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.cumulativeCoupon);
        await carrinho.inserirQuantidade("10");
        await carrinho.validarDescontoCupom("18");
    })

    test('Cupom para zerar carrinho - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponZeroCart);
        await carrinho.validarDescontoCupom("100");
    })

    test('Cupom especifico por cliente - Retornar sucesso quando cliente correto - cliente logado', async ({ home,carrinho }) => {
        await home.carregarSite(store.loja.nameStore);
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithExclusiveCoupon,
            store.user.passwordWithExclusiveCoupon
        )
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomer);
        await carrinho.validarDescontoCupom("12");
    })

    test('Cupom especifico por cliente - Retornar sucesso quando cliente correto - cliente deslogado', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomer);
        await carrinho.clickFinalizarCompra();
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithExclusiveCoupon,
            store.user.passwordWithExclusiveCoupon
        ) 
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponPerCustomer);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);       
        await carrinho.validarDescontoCupom("12");
    })


})
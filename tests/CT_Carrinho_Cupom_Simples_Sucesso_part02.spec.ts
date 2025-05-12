import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.beforeEach(async ({ carrinho },) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.loja.nameStore,
        store.product[1].idProduct,
        "1");
    await carrinho.inserirCep("69900-010");
})

test.describe('Suite Cupom simples que deve retornar sucesso', { tag: ['@cart', '@smoke']}, () => {

    test('Cupom para zerar carrinho - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponZeroCart);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("100");
    })

    test('Cupom especifico por cliente - Retornar sucesso quando cliente correto', async ({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.couponPerCustomer);
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponPerCustomer);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("12");
    })

    test('Cupom especifico por produto - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponPerProduct);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom especifico por categoria - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[2].idProduct,
            "1");
        await carrinho.informarCupom(store.coupon.couponPerCategory);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom especifico por grupo de clientes - Retornar sucesso quando produto correto', async ({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.couponPerCustomerGroup);
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponPerCustomerGroup);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("50");
    })

    test('Cupom especifico mais de um produto - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[3].idProduct,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[4].idProduct,
            "1");
        await carrinho.informarCupom(store.coupon.couponMoreThanOneProduct);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("30");
    })
})
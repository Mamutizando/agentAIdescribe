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

test.describe('Suite Cupom simples que deve retornar sucesso', { tag: ['@cart', '@smoke'] }, () => {

    test('Cupom simples 10% off - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponWithPercentage);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("10");
    })

    test('Aplicar cupom no total - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponInTotal);
        await carrinho.inserirQuantidade("10");
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom com valor mínimo do carrinho - Retornar sucesso quando valor correspondente', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.minimumValueCoupon);
        await carrinho.validarMsgErro("Valor mínimo para uso do cupom não foi atingido: R$ 29.00.");
        await carrinho.inserirQuantidade("15");
        await carrinho.informarCupom(store.coupon.minimumValueCoupon);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("10");
    })

    test('Frete grátis - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.freeShippingCoupon);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.calcularTotalFreteGratis();
        await carrinho.validarLabelFrete("Frete Grátis");
    })

    test('Valor fixo - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.fixedValueCoupon);
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("2");
    })

    test('Cupom acumulativo - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.cumulativeCoupon);
        await carrinho.inserirQuantidade("10");
        await carrinho.calcularTotal();
        await carrinho.validarDescontoCupom("18");
    })

})
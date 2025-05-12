import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[1].idProduct, quantidade: "1" },
];

test.describe('Suite Cupom simples que deve retornar sucesso', { tag: ['@cart', '@smoke'] }, () => {

    test('Cupom inserido com sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponWithPercentage);
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom simples 10% off - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponWithPercentage);
        await carrinho.validarDescontoCupom("10");
    })

    test('Aplicar cupom no total - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponInTotal);
        await carrinho.inserirQuantidade("10");
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom com valor mínimo do carrinho - Retornar sucesso quando valor correspondente', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.minimumValueCoupon);
        await carrinho.validarMsgErro("Valor mínimo para uso do cupom não foi atingido: R$ 29.00.");    
        await carrinho.inserirQuantidade("15");
        await carrinho.informarCupom(store.coupon.minimumValueCoupon);
        await carrinho.validarDescontoCupom("10");
    })
    
    test('Frete grátis - Retornar sucesso', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.freeShippingCoupon);
        await carrinho.validarDescontoCupom("Frete Grátis");   
        await carrinho.inserirCep(store.user.zipCode);    
        await carrinho.validarLabelFrete("Frete Grátis");
    })    


})
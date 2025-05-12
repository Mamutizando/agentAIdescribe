import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[1].idProduct, quantidade: "1" },
];

test.describe('Suite Cupom simples que deve retornar sucesso', { tag: ['@cart', '@smoke'] }, () => {

    test('Cupom especifico por produto - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerProduct);
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom especifico por categoria - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        const produtos = [
            { id: store.product[1].idProduct, quantidade: "1" },
            { id: store.product[2].idProduct, quantidade: "1" },
        ];
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCategory);
        await carrinho.validarDescontoCupom("10");
    })

    test('Cupom especifico por grupo de clientes - Retornar sucesso quando produto correto - cliente logado', async ({ carrinho, home }) => {
        await home.carregarSite(store.loja.nameStore);
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithGroupCoupon,
            store.user.passwordWithGroupCoupon
        )
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomerGroup);
        await carrinho.validarDescontoCupom("50");
    })

    test('Cupom especifico por grupo de clientes - Retornar sucesso quando produto correto - cliente deslogado', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomerGroup);
        await carrinho.clickFinalizarCompra();
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithGroupCoupon,
            store.user.passwordWithGroupCoupon
        )
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponPerCustomerGroup);                
        await carrinho.validarDescontoCupom("50");
    })

    test('Cupom especifico mais de um produto - Retornar sucesso quando produto correto', async ({ carrinho }) => {
        const produtos = [
            { id: store.product[1].idProduct, quantidade: "1" },
            { id: store.product[3].idProduct, quantidade: "1" },
            { id: store.product[4].idProduct, quantidade: "1" },
          ];        
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponMoreThanOneProduct);                
        await carrinho.validarDescontoCupom("30");
    })    


})
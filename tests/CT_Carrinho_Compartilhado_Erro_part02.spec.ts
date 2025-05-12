import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[0].idProduct, quantidade: "1" },
  ];


  test.describe('Suite Cupom simples que deve retornar ERRO', { tag: ['@cart', '@smoke'] }, () => {
    
    test('Cupom por cliente - Retornar erro quando não logado', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomer);
        await carrinho.validarMsgErro("Você deve estar logado.");    
    })
    
    test('Cupom com limite utilizado - Retornar erro', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponWithLimitUsed);
        await carrinho.validarMsgErro("Esse cupom já chegou ao limite de uso");    
    })
    
    test('Cupom exclusivo por categoria - Retornar erro quando produto pertencer a outra categoria', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCategory);
        await carrinho.validarMsgErro("Este cupom é válido apenas para alguns produtos. Verifique os produtos aceitos e tente novamente.");    
    })
    
    test('Cupom exclusivo por grupo de clientes - Retornar erro quando não logado', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerCustomerGroup);
        await carrinho.validarMsgErro("Você deve estar logado.");    
    })
    
    test('Cupom com quantidade por cliente ultrapassada - Retornar erro', async ({ carrinho, home }) => {
        await home.carregarSite(store.loja.nameStore);
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithoutCoupon,
            store.user.passwordWithoutCoupon
        )        
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponQuantityExceeded);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");    
    })    


  })
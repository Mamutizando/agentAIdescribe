import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[0].idProduct, quantidade: "1" },
  ];

  test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
})  

  test.describe('Suite Cupom simples que deve retornar ERRO', { tag: ['@cart', '@smoke'] }, () => {
       
    test('Cupom com OUTRO cliente logado - Retornar erro', async ({ carrinho }) => {
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
            store.coupon.couponPerCustomer);
        await carrinho.validarMsgErro("Você não possui permissão para utilizar este cupom");    
    })
    
    test('Cupom com limite por CPF cliente já utilizou - Retornar erro', async ({ carrinho }) => {
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
            store.coupon.limitedPerCPFCNPJ);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");    
    })
    
    test('Cupom com limite por CNPJ cliente realizando duas compras - Retornar erro', async ({ carrinho }) => {
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithoutCouponCNPJ,
            store.user.passwordWithoutCoupon
        )        
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.limitedPerCPFCNPJ);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");    
    })
    
    test('Cupom com limite por CNPJ usuário com CNPJ existente na base - Retornar erro', async ({ carrinho }) => {
        await carrinho.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            store.user.loginWithoutCouponSameCNPJ,
            store.user.passwordWithoutCoupon
        )        
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.limitedPerCPFCNPJ);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");    
    })    


  })
import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

const produtos = [
    { id: store.product[0].idProduct, quantidade: "1" },
  ];


  test.describe('Suite Cupom simples que deve retornar ERRO', { tag: ['@cart', '@smoke'] }, () => {

    test('Cupom sem valor mínimo do carrinho - Retornar erro para valor abaixo', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.minimumValueCoupon);
        await carrinho.validarMsgErro("Valor mínimo para uso do cupom não foi atingido: R$ 29.00.");    
    })
    
    test('Cupom inativo - Retornar erro', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.inactiveCoupon);
        await carrinho.validarMsgErro("Cupom não encontrado.");    
    })
    
    test('Cupom vencido - Retornar erro', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.expiredCoupon);
        await carrinho.validarMsgErro("O cupom não é válido.");    
    })
    
    test('Cupom inexistente - Retornar erro', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.nonExistentCoupon);
        await carrinho.validarMsgErro("Cupom não encontrado.");    
    })
    
    test('Cupom por produto - Retornar erro para produto diferente', async ({ carrinho }) => {
        await carrinho.montarCarrinhoCompartilhadoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            produtos,
            store.coupon.couponPerProduct);
        await carrinho.validarMsgErro("Este cupom é válido apenas para alguns produtos. Verifique os produtos aceitos e tente novamente.");    
    })    


  })
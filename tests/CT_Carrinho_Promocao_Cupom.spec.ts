import { test } from '../fixtures/fixturesBase';
import global from '../test-data/global.json';
import store from '../test-data/qaprincipal.json';

test.describe('Carrinho com Promoção e Cupom ', { tag: ['@cart'] }, () => {

    test('Produto desconto 20% no produto e cupom 10% não acumulativo - Remove desconto do produto', { tag: ['@smoke'] }, async ({ carrinho, checkout, login }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, store.loja.offerProductTShirt, "1");
        await carrinho.inserirCep("20521060");
        await carrinho.informarCupom(store.coupon.couponNonCumulativeFloat);
        await carrinho.validarDescontoCupom('12,56%');
        await carrinho.validarPrecoPromocional('');
        await carrinho.calcularTotal();
        await carrinho.validarCalculoDeCupom();
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('lalalal2@mailinator.com');
        await checkout.validarValorDescontoCupom();

    })

    test('Produto desconto 20% no produto e cupom 10%  acumulativo - Mantém os dois descontos', { tag: ['@smoke'] }, async ({ carrinho, checkout, login }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, store.loja.offerProductTShirt, "1");
        await carrinho.inserirCep("20521060");
        await carrinho.informarCupom(store.coupon.couponWithPercentageCumulative);
        await carrinho.validarDescontoCupom('10%');
        await carrinho.validarPrecoPromocional('40');
        await carrinho.calcularTotal();
        await carrinho.validarCalculoDeCupom();
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('lalalal2@mailinator.com');
        await checkout.validarValorDescontoCupom();

    })    

    test('Categoria com desconto 20%  e cupom 10%  acumulativo - Mantém os dois descontos', { tag: ['@smoke'] }, async ({ carrinho, checkout, login }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, store.loja.offerProductCategory, "1");
        await carrinho.informarCupom(store.coupon.couponInTotal);
        await carrinho.validarDescontoCupom('10%');
        await carrinho.validarPrecoPromocional('49');
        await carrinho.validarCalculoDeCupom();
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('lalalal2@mailinator.com');
        await checkout.validarValorDescontoCupom();

    })
    
    test.skip('Produto desconto fixo 10,00 e cupom 10%  acumulativo - Mantém os dois descontos', { tag: ['@smoke'] }, async ({ carrinho, checkout, login }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, store.loja.offerProductCategory, "1");
        await carrinho.informarCupom(store.coupon.couponInTotal);
        await carrinho.validarDescontoCupom('10%');
        await carrinho.validarPrecoPromocional('49');
        await carrinho.validarCalculoDeCupom();
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('lalalal2@mailinator.com');
        await checkout.validarValorDescontoCupom();

    })
    
    test('Produto desconto 15% marca e cupom R$18,00 acumulativo - Mantém os dois descontos', { tag: ['@smoke'] }, async ({ carrinho, checkout, login }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, store.loja.offerProductBrand, "1");
        await carrinho.informarCupom(store.coupon.cumulativeCoupon);
        await carrinho.validarDescontoCupom('18');
        await carrinho.validarPrecoPromocional('25,50');
        await carrinho.validarCalculoDeCupom();
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('lalalal2@mailinator.com');
        await checkout.validarValorDescontoCupom();

    })    

})
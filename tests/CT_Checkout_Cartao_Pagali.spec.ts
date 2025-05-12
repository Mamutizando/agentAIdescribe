import { test } from '../fixtures/fixturesBase';
import store from "../test-data/checkoutlia.json";
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';


test.beforeEach(async({ carrinho, login, checkout }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.checkoutlia.nameStore,
        "226676833",
        "1"
    );
    await carrinho.clickFinalizarCompra();
    await login.loginSemSenha("pf_pagali@mailinator.com");
    await checkout.selecionarPagamento(FormasPag.CARTAOPAGALI);

})

test.describe('Suite fluxo de compra - Cartão transparente Pagali', { tag: ['@dontRunProd'] }, () => {

    test('Pagali - Utiliza cartão salvo e só solicita o cvv para poder finalizar compra',{ tag: ['@smoke'] }, async ({ checkout }) => {
        await checkout.cartaoSalvoLia(store.checkoutlia.cartaoSalvoLia, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();
    })


})
import { test } from '../fixtures/fixturesBase';
import store from "../test-data/qastoremercadopago.json";
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';

test.beforeEach(async({ carrinho, login, checkout }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.mercadopago.nameStore,
        "57793960",
        "1"
    );
    await carrinho.clickFinalizarCompra();
    await login.loginSemSenha("teste@teste.com");
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.CARTAOMP);

})

test.describe('Suite fluxo de compra - Cartão transparente Mercado Pago', { tag: ['@dontRunProd'] }, () => {

    test('MercadoPago - Utiliza cartão salvo e só solicita o cvv para poder finalizar compra',{ tag: ['@smoke'] }, async ({ checkout }) => {

        await checkout.cartaoSalvoLia(store.mercadopago.cartaoSalvoLia, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();

    })


})
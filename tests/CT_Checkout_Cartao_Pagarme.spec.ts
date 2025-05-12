import { test } from '../fixtures/fixturesBase';
import store from "../test-data/qastorepagarme.json";
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';

test.beforeEach(async({ carrinho, login, checkout }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.pagarme.nameStore,
        "57895920",
        "1"
    );
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin("pf_pagarme@mailinator.com","QAli2023");
    await checkout.selecionarEnvio(FormasEnvio.MOTOBOY);
    await checkout.selecionarPagamento(FormasPag.CARTAOPAGARME);

})



test.skip('Suite fluxo de compra - Cartão transparente Pagarme', { tag: ['@dontRunProd'] }, () => {

    test('Pagarme - Utiliza cartão salvo e só solicita o cvv para poder finalizar compra',{ tag: ['@smoke'] }, async ({ checkout }) => {
        await checkout.cartaoSalvoLia(store.pagarme.cartaoSalvoLia, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();
    })


})
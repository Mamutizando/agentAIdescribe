import { test } from '../fixtures/fixturesBase';
import store from '../test-data/minicart.json';
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.minicart.nameStore);
})

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.minicart.nameStore);
})

test.describe('Suite para validar casos de sucesso do minicart', () => {

    test('Fluxo de compra - com pessoa juridica', { tag: ['@smoke'] }, async ({ home, produto, carrinho, checkout }) => {
        await home.realizarLoginAPI(
            global.path.login,
            store.minicart.nameStore,
            "novousuariopj@mailinator.com",
            "QAli2023");
        await home.selecionarProdutoNome("Mini ursinho 1");
        await produto.adicionarProdutoMinicart();
        await carrinho.clickFinalizarCompraMiniCart();
        await checkout.validarTotal('100,31'); 
    })

    test('Fluxo de compra - com pessoa fisica', { tag: ['@smoke'] }, async ({ home, produto, carrinho, checkout }) => {
        await home.realizarLoginAPI(
            global.path.login,
            store.minicart.nameStore,
            "novousuariopf3@mailinator.com",
            "QAli2023");
        await home.selecionarProdutoNome("Mini ursinho 1");
        await produto.adicionarProdutoMinicart();
        await carrinho.clickFinalizarCompraMiniCart();
        await checkout.validarTotal('100,31');
 
    })    

})
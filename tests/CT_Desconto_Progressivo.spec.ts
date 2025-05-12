import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qastoredescontoprogressivo.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.descontoProgressivo.nameStore);
})


test.describe('Desconto Progressivo',  () => {

    test('Atinge a primeira faixa de preço', { tag: ['@smoke'] },  async ({ home, produto, carrinho, login, checkout }) => {
        await home.selecionarProdutoNome('Desconto Progressivo 60');
        await produto.validarPrecoExibido('60');
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho('57');
        await carrinho.validarTiersDescontoProgressivo(1, 2);
        await carrinho.validarDescontoProgressivo('3');
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('qastore_asvc_as_qastore@mailss.com');
        await checkout.validarTotal('57');

    })

    test('Atinge a primeira faixa de preço por item', { tag: ['@smoke'] },  async ({ home, produto, carrinho, login, checkout }) => {
        await home.selecionarProdutoNome('Desconto Progressivo 60');
        await produto.validarPrecoExibido('60');
        await produto.clickComprar();
        await carrinho.inserirQuantidade('2');
        await carrinho.validarTiersDescontoProgressivo(1, 2);
        await carrinho.validarDescontoProgressivo('12');
        await carrinho.validaTotalCarrinho('108');
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha('qastore_asvc_as_qastore@mailss.com');
        await checkout.validarTotal('108');

    })    


})
import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.beforeEach(async({ home }, ) => {
    await home.carregarSite(store.loja.nameStore);
})

test.afterEach(async({ home }, ) => {
    await home.limparCarrinho(store.loja.nameStore);
})

test.describe('Suite que valida fluxos para recuperar um carrinho', { tag: ['@cart'] }, () => {

    test('Adiciona 1 produto logado, realiza novo login e recupera carrinho', { tag: ['@smoke'] }, async ({ minhaConta, carrinho }) => {
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginUmProdutoLogado, "QAli@2023");
        await carrinho.validarCarrinhoVazio("Carrinho vazio");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "220809953",
            "1"
        );
        await carrinho.validarqtdMiniCart("1");
        await minhaConta.deslogar();
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginUmProdutoLogado, "QAli@2023");  
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.validarqtdMiniCart("1");
    })

    test('Adiciona n produtos logado, realiza novo login e recupera carrinho', async({ carrinho, minhaConta }) => {
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNProdutoLogado, "QAli@2023");
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "220809953", "1");
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "225370587", "1");
        await carrinho.validaTotalCarrinho("R$ 830,00");
        await minhaConta.deslogar();
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNProdutoLogado, "QAli@2023");
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore)
        await carrinho.validaTotalCarrinho("R$ 830,00");
    });

    test('Adiciona 1 produto deslogado, loga para guardar carrinho, realiza login e recupera carrinho', async({ carrinho, minhaConta }) => {
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore)
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "220809953", "1");
        await carrinho.validarQuantidadeProduto("1")
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNovoCarrinho, store.user.passwordWithoutCoupon);
        await minhaConta.deslogar();
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNovoCarrinho, store.user.passwordWithoutCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore)
        await carrinho.validarQuantidadeProduto("1");
    });

    test('Adiciona n produtos deslogado, loga para guardar carrinho, realiza login e recupera carrinho', async({ carrinho, minhaConta }) => {
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore)
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "220809953", "1");
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "225370587", "1");
        await carrinho.validaTotalCarrinho("R$ 830,00");
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNProdutoLogado, "QAli@2023");
        await minhaConta.deslogar();
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.user.loginNProdutoLogado, "QAli@2023");
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore)
        await carrinho.validaTotalCarrinho("R$ 830,00");  
    });
})
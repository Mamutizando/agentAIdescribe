import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import desconto from '../test-data/qastoredescontoprogressivo.json';

test.beforeEach(async({ home }, ) => {
    await home.carregarSite(desconto.descontoProgressivo.nameStore);
})

test.describe("Desconto Progressivo", { tag: ['@cart'] }, () => {

    test('Atinge a primeira faixa de preço', { tag: ['@smoke'] }, async({ home, carrinho, produto, login }) => {
        await home.buscarProduto("Desconto Progressivo 60");
        await home.selecionarProdutoNome("Desconto Progressivo 60");
        await produto.validarPrecoExibido("60")
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho("57");
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.user.loginNovoEmail);
        await carrinho.validaTotalCarrinho("57")
    });

    test('Atinge a segunda faixa de preço', async({ carrinho, home, produto, login }) => {
        await home.buscarProduto("Desconto Progressivo 160");
        await home.selecionarProdutoNome("Desconto Progressivo 160");
        await produto.validarPrecoExibido("160")
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho("144")
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.user.loginNovoEmail);
        await carrinho.validaTotalCarrinho("144")
    });

    test('Atinge a terceira faixa de preço', async({ carrinho, home, produto, login }) => {
        await home.buscarProduto("Desconto Progressivo 210");
        await home.selecionarProdutoNome("Desconto Progressivo 210");
        await produto.validarPrecoExibido("210")
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho("178,50")
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.user.loginNovoEmail);
        await carrinho.validaTotalCarrinho("178,50")
    });

    test('Não atinge a faixa de preço', async({ carrinho, home, produto, login }) => {
        await home.buscarProduto("Desconto Progressivo 40");
        await home.selecionarProdutoNome("Desconto Progressivo 40");
        await produto.validarPrecoExibido("40")
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho("40")
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.user.loginNovoEmail);
        await carrinho.validaTotalCarrinho("40")
    });
})
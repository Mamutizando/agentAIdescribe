import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from '../test-data/lojatstautomation.json';

test.beforeEach(async ({ home },) => {
  await home.carregarSite(store.loja.nameStore);
})

test.describe('Suite fluxo de compra - Pagamento Entrega', { tag: ['@smoke'] }, () => {

  test('Pagar na retirada - Usuario registrado', async ({ home, produto, carrinho, login, checkout, finalizacao }) => {

    await home.selecionarProdutoNome('[CATEGORIA] Produto com categoria principal - 1 Nível');
    await produto.clickComprar();
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga, store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra()
    await finalizacao.validarRetirada()
  });

  test('Dinheiro com cupom produto ( categoria especifica )', async ({ home, produto, carrinho, login, checkout, finalizacao }) => {

    await home.selecionarCategoria('Categoria Nível 1 Categoria N');
    await home.selecionarProdutoNome('teste categoria');
    await produto.clickComprar();
    await carrinho.informarCupom("2X4448NQJ");
    await carrinho.validarDescontoCupom("22 %");
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga03, store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

  });

  test('Dinheiro com cupom ( cliente especifico )', async ({ minhaConta, home, produto, carrinho, checkout, finalizacao }) => {

    await minhaConta.acessarLink();
    await minhaConta.realizarLogin(store.users.userMadruga03, store.users.senhaMadruga);
    await home.buscarProduto(store.loja.products.nameProductDefaultLoadTest)
    await home.selecionarProdutoNome(store.loja.products.nameProductDefaultLoadTest);
    await produto.clickComprar();
    await carrinho.informarCupom("N4XK9J94R");
    await carrinho.validarDescontoCupom("42 %");
    await carrinho.clickFinalizarCompra();
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

  });


})
import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from "../test-data/lojatstautomation.json";
import global from '../test-data/global.json';

test.beforeEach(async ({ carrinho },) => {
  await carrinho.montarCarrinhoUrl(
    global.path.cartAdd,
    store.loja.nameStore,
    store.loja.products.idProductDefaultLoadTest,
    "1"
  );


})

test.describe('Suite fluxo de compra - Pagamento Entrega', { tag: ['@smoke'] }, () => {

  test('Pagar na Retirada - Usuario Registrado', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga, store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });

  test('Dinheiro com com cupom percentual no carrinho - Usuario Registrado', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("33OFF");
    await carrinho.validarDescontoCupom("33,33 %")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });

  test('Dinheiro com com cupom valor fixo no carrinho - Usuario Registrado', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("FIXO10");
    await carrinho.validarDescontoCupom("- R$ 10,00")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });  

  test('Dinheiro com cupom inativo (CRITICA) no carrinho', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("YUZYD3XAK");
    await carrinho.validarDescontoCupom("ERRO")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga02,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });

})
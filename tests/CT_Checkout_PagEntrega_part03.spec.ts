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

  test('Dinheiro com cupom expirado (CRITICA) no carrinho', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("U9TEE5K3E");
    await carrinho.validarDescontoCupom("ERRO")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga02,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });

  test('Dinheiro com cupom valor minimo (R$100) no carrinho', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("15OFFCAR");
    await carrinho.validarDescontoCupom("15 %")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga02,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });
  
  test('Dinheiro com cupom desconto valor total no carrinho', async ({ carrinho, login, checkout, finalizacao }) => {

    await carrinho.informarCupom("ALLCUPOM");
    await carrinho.validarDescontoCupom("45 %")
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga02,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA)
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarRetirada();
    await finalizacao.validarNumPedido();

  });  

})
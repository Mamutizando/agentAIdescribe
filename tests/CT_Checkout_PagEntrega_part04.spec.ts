import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from "../test-data/lojatstautomation.json";
import global from '../test-data/global.json';

test.describe('Suite fluxo de compra - Pagamento Entrega', () => {

  test.beforeEach(async ({ carrinho, home, minhaConta },) => {

    await home.carregarSite(store.loja.nameStore);
    await minhaConta.acessarLink();
    await minhaConta.realizarLogin(store.users.userMadruga11, store.users.senhaMadruga);

    await carrinho.montarCarrinhoUrl(
      global.path.cartAdd,
      store.loja.nameStore,
      store.loja.products.idProductDefaultLoadTest,
      "1"
    );
  })

  test('Usuario Registrado - Novo Endereço', { tag: ['@smoke'] }, async ({ carrinho, checkout, finalizacao, minhaConta }) => {

    await carrinho.clickFinalizarCompra();
    await checkout.clickCadastrarEndereco();

    const cep = () => {
      return new Promise<string>((resolve, reject) => {
        var arrayCep = ["08780720", "37704210", "29909022", "61941010", "85813650"];
        var randomIndex = Math.floor(Math.random() * arrayCep.length);
        var randomElement = arrayCep[randomIndex];
        console.log('CEP Selecionadi ' + randomElement);
        resolve(randomElement)
      });
    };
    const resultCep = await cep();
    await checkout.informarCep(resultCep);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.informarNome();
    await checkout.informarNumResidencia();
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

    await minhaConta.acessarLink();
    await minhaConta.excluirEndAdicional();
  });


});

test.describe('Outros cenários', () => {

  test('Dinheiro com cupom ( grupo cliente especifico )', { tag: ['@smoke'] }, async ({ home, minhaConta, carrinho, checkout, finalizacao }) => {


    await home.carregarSite(store.loja.nameStore);
    await minhaConta.acessarLink();
    await minhaConta.realizarLogin(store.users.userMadruga04, store.users.senhaMadruga);

    await carrinho.montarCarrinhoUrl(
      global.path.cartAdd,
      store.loja.nameStore,
      store.loja.products.idProductDefaultLoadTest,
      "1"
    );

    await carrinho.informarCupom('JPUBMDK88');
    await carrinho.validarDescontoCupom('- R$ 35,00');
    await carrinho.clickFinalizarCompra();
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();
  });

})
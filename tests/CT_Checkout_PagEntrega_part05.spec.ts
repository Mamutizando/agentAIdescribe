import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from "../test-data/lojatstautomation.json";
import global from '../test-data/global.json';

test.describe('Suite fluxo de compra - Pagamento Entrega',  () => {

  test.beforeEach(async ({ home },) => {
    home.carregarSite(store.loja.nameStore)
  })  

  test('Produto com variação ligada a imagem',{ tag: ['@smoke'] }, async ({ home, produto, carrinho, login, checkout, finalizacao }) => {

    await home.selecionarProdutoNome('[ VARIACAO ] Variações ligadas a imagem');
    await produto.selecionarVariacao("0","");
    await produto.clickComprar();
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga07,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

  });

  test('Produto com variação ligada a imagem - segunda variacao',{ tag: ['@smoke'] }, async ({ home, produto, carrinho, login, checkout, finalizacao }) => {

    await home.selecionarProdutoNome('[ VARIACAO ] Variações ligadas a imagem');
    await produto.selecionarVariacao("1","");
    await produto.clickComprar();
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga07,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

  }); 
  
  test('Produto com preço promocional',{ tag: ['@smoke'] }, async ({ home, produto, carrinho, login, checkout, finalizacao }) => {

    await home.buscarProduto(store.loja.products.nameProductDefault);
    await home.selecionarProdutoNome(store.loja.products.nameProductDefault);
    await produto.clickComprar();
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga09,store.users.senhaMadruga);
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

  }); 
  
  test('Usuario Registrado - Novo Endereço - CEP Geral',{ tag: ['@smoke'] }, async ({ home, produto, carrinho, login, checkout, finalizacao, minhaConta }) => {

    await home.buscarProduto(store.loja.products.nameProductDefault);
    await home.selecionarProdutoNome(store.loja.products.nameProductDefault);
    await produto.clickComprar();
    await carrinho.clickFinalizarCompra();
    await login.realizarLogin(store.users.userMadruga09,store.users.senhaMadruga);
    await checkout.clickCadastrarEndereco();
    await checkout.informarCep(await getRandomCep());
    await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
    await checkout.informarNome();
    await checkout.informarNumResidencia();
    await checkout.informarLogradouro();
    await checkout.informarBairro();
    await checkout.informarCidade();
    await checkout.selecionarPagamento(FormasPag.ENTREGA);
    await checkout.finalizarCompra();
    await finalizacao.validarNumPedido();
    await finalizacao.validarRetirada();

    await minhaConta.acessarLink();
    await minhaConta.excluirEndAdicional();    

  });  


});


async function getRandomCep(){
    return new Promise<string>((resolve, reject) => {
      var arrayCep =  ["28999999", "87999999", "88000000", "01000000"];
      var randomIndex = Math.floor(Math.random() * arrayCep.length);
      var randomElement = arrayCep[randomIndex];
      console.log('CEP Selecionado ' + randomElement);
      resolve(randomElement)
    });
  
}
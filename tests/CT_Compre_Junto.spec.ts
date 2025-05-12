import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import bt from '../test-data/buytogether.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
    await home.selecionarCategoria('Consoles');
})

test.describe('Compre Junto',  () => {

    test('Realizar compra de um BT sem desconto', { tag: ['@smoke'] },  async ({ home, produto, carrinho, login, checkout, finalizacao }) => {
        await home.selecionarProdutoNome(bt.BT2[0].nome);
        await produto.validarCompreJunto(bt.BT2);
        await produto.adicionaCompreJunto();
        await carrinho.validaCompreJuntoCarrinho(bt.BT2);
        await carrinho.inserirCep('11250-970');
        await carrinho.calcularTotal();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);        
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();
    })

    test('Realizar compra de um BT com desconto', { tag: ['@smoke'] },  async ({ home, produto, carrinho, login, checkout, finalizacao }) => {
        await home.selecionarProdutoNome(bt.BT1[0].nome);
        await produto.validarCompreJunto(bt.BT1);
        await produto.adicionaCompreJunto();
        await carrinho.validaCompreJuntoCarrinho(bt.BT1);
        await carrinho.inserirCep('11250-970');
        await carrinho.calcularTotal();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);        
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();
    })    

})
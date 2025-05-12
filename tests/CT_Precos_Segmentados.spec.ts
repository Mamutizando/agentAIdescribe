import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import global from '../test-data/global.json'
import store from '../test-data/precosegmentado.json';


test.describe('Fluxo de Compra - Pagamento Entrega', { tag: ['@smoke'] }, () => {

    test('Fechar compra com um produto com desconto por faixa e outro sem o desconto', async ({ home, produto, carrinho, login, checkout, finalizacao }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.precosegmentado.nameStore,
            store.precosegmentado.product.productFreeShippingForProduct,
        "1");
        await home.carregarSite(store.precosegmentado.nameStore);
        await home.inserirCepModal('69900-010');
        await home.selecionarProdutoNome(store.precosegmentado.product.nameProductDefault);
        await produto.validarPrecoExibido('150,00');
        await produto.clickComprar();
        await carrinho.validarPrecoPromocional('150,00');
        await carrinho.validarPrecoPromocional('179,00');
        await carrinho.calcularTotal();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.precosegmentado.user.userMadruga08, store.precosegmentado.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarTotal('329,00'); 
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();
        

    })

    test('Trocar o CEP por um que não possui desconto, deve voltar ao valor original', async ({ home, produto, carrinho, login, checkout, finalizacao }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.precosegmentado.nameStore,
            store.precosegmentado.product.productFreeShippingForProduct,
        "1");
        await home.carregarSite(store.precosegmentado.nameStore);
        await home.inserirCepModal('08770-020');
        await home.selecionarProdutoNome(store.precosegmentado.product.nameProductDefault);
        await produto.validarPrecoExibido('200,00');
        await produto.clickComprar();
        await carrinho.validarPrecoPromocional('200,00');
        await carrinho.validarPrecoPromocional('179,00');
        await carrinho.calcularTotal();
    })
    
    test('Validar desconto dado acessando direto pelo o carrinho', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.precosegmentado.nameStore,
            store.precosegmentado.product.idProductDefault,
        "1");
        await carrinho.validarPrecoPromocional('200,00');
        await carrinho.inserirCep('69900-010');
        await carrinho.validarPrecoPromocional('150,00');
    })    


})
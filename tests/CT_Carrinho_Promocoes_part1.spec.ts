import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
    await home.selecionarCategoria('Promoção');
})

test.describe('Promoções ', { tag: ['@cart'] }, () => {

    test('Para um produto especifico com percentual', { tag: ['@smoke'] }, async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.validarDescontoCardProduto(store.loja.nameProductCamisetaPromocao, "20%");
        await home.selecionarProdutoNome(store.loja.nameProductCamisetaPromocao);
        await produto.validarPrecoExibido("40");
        await produto.clickComprar();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);        
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();        
    })

    test("Para um produto especifico valor fixo", async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.validarDescontoCardProduto(store.loja.nameProductCalcaPromocao, "25%");
        await home.selecionarProdutoNome(store.loja.nameProductCalcaPromocao);
        await produto.selecionarVariacao("1");
        await produto.clickComprar();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.SEDEX);
        await checkout.selecionarPagamento(FormasPag.BOLETO); 
        await checkout.validarTotal("93,90");       
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();   
    }); 
    
    test("Para uma categoria especifica", async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.validarDescontoCardProduto(store.loja.nameProductBotaPromocao, "10%");
        await home.selecionarProdutoNome(store.loja.nameProductBotaPromocao);
        await produto.selecionarVariacao("0");
        await produto.clickComprar();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);         
        await checkout.validarTotal("45");
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();   
    });
    
    test("Para uma marca especifica", async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.validarDescontoCardProduto(store.loja.nameProductFallout4, "15%");
        await home.selecionarProdutoNome(store.loja.nameProductFallout4);
        await produto.validarPrecoExibido("25,50");
        await produto.clickComprar();
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.userMadruga01,store.user.password);
        await checkout.selecionarEnvio(FormasEnvio.SEDEX);
        await checkout.selecionarPagamento(FormasPag.BOLETO);        
        await checkout.validarTotal("89,40");
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();   
    });
})
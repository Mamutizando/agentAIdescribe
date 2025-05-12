import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qastorebrinde.json';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.brinde.nameStore);
})

test.afterEach(async ({ home }) => {
    await home.limparCarrinho(store.brinde.nameStore);
})


test.describe('Brinde part4 ', { tag: ['@smoke'] }, () => {

    test('Brinde e compre junto', async ({ home, produto, carrinho, checkout, login }) => {
        await home.selecionarProdutoNome('Produto que gera Brinde dele mesmo');
        await produto.adicionaCompreJunto();


        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por produto",
              qtd: "1",
              preco: "R$ 0,01",
            },
            {
              nomeBrinde: "Produto que gera Brinde dele mesmo",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,02');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('53,82');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga03, store.brinde.user.password);
        await checkout.validarDescontoCheckout("- R$ 0,02");

        await checkout.validarTotal("53,82");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })

    test('Brinde e desconto progressivo', async ({ home, produto, carrinho, checkout, login }) => {
        await home.selecionarProdutoNome('Produto que gera brinde - por produto');
        await produto.clickComprar();
        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por produto",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.inserirQuantidade('4');
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 11,97');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('107,64');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga03, store.brinde.user.password);
        await checkout.validarDescontoCheckout("- R$ 11,97");

        await checkout.validarTotal("107,64");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })

    test('Brinde e cupom', async ({ home, produto, carrinho, checkout, login }) => {
        await home.selecionarProdutoNome('Produto que gera brinde - por produto');
        await produto.clickComprar();
        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por produto",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.informarCupom('10OFF');
        await carrinho.validarDescontoCupom('10%');
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('26,91');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga03, store.brinde.user.password);
        await checkout.validarDescontoCheckout("- R$ 0,01");

        await checkout.validarTotal("26,91");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })    


})
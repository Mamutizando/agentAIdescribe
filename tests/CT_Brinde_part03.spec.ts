import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qastorebrinde.json';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.brinde.nameStore);
})

test.afterEach(async ({ home }) => {
    await home.limparCarrinho(store.brinde.nameStore);
})


test.describe('Brinde part3 ', { tag: ['@smoke'] }, () => {

    test('Brinde por grupo de clientes e valor', async ({ minhaConta, home, produto, carrinho, checkout }) => {
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.brinde.user.userMadruga02, store.brinde.user.password);
        await home.buscarProduto('Produto Comum 02');
        await home.selecionarProdutoNome('Produto Comum 02');
        await produto.clickComprar();
        await home.buscarProduto('Produto Comum 03');
        await home.selecionarProdutoNome('Produto Comum 03');
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por grupo cliente",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('74340025');
        await carrinho.validaTotalCarrinho('440,88');
        await carrinho.clickFinalizarCompra();

        await checkout.validarTotal("440,88");
        await checkout.validarProdutosBrinde(payloadBrindes);


    })

    test('Brinde por grupo de clientes e produto', async ({ minhaConta, home, produto, carrinho, checkout }) => {
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.brinde.user.userMadruga02, store.brinde.user.password);
        await home.buscarProduto('Produto que gera Brinde - grupo cliente');
        await home.selecionarProdutoNome('Produto que gera Brinde - grupo cliente');
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por grupo cliente",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('74340025');
        await carrinho.validaTotalCarrinho('102,56');
        await carrinho.clickFinalizarCompra();

        await checkout.validarTotal("102,56");
        await checkout.validarProdutosBrinde(payloadBrindes);


    })

    test('Brinde por grupo de clientes e marca', async ({ minhaConta, home, produto, carrinho, checkout }) => {
        await minhaConta.acessarLink();
        await minhaConta.realizarLogin(store.brinde.user.userMadruga02, store.brinde.user.password);
        await home.irParaHome();
        await home.selecionarMarca('marca gera brinde 2');
        await home.selecionarProdutoNome('Produto que gera Brinde - grupo cliente/marca');
        await produto.clickComprar();
        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por grupo cliente",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('74340025');
        await carrinho.validaTotalCarrinho('78,46');
        await carrinho.clickFinalizarCompra();

        await checkout.validarTotal("78,46");
        await checkout.validarProdutosBrinde(payloadBrindes);


    })


})
import { test } from '../fixtures/fixturesBase';
import { FormasEnvio, FormasPag } from '../pages/checkout';
import store from '../test-data/qastorebrinde.json';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.brinde.nameStore);

})


test.describe('Brinde ', { tag: ['@smoke'] }, () => {

    test('Brinde por produto',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.buscarProduto("Produto que gera brinde - por produto");
        await home.selecionarProdutoNome("Produto que gera brinde - por produto");
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por produto",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('29,90');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,01");
        await checkout.validarTotal("29,90");
        await checkout.validarProdutosBrinde(payloadBrindes);
        await checkout.finalizarCompra();
        await finalizacao.validarNumPedido();

    })

    test('Brinde por produto II - produto com valor R$0,01',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.buscarProduto("Produto que gera brinde II - por produto");
        await home.selecionarProdutoNome("Produto que gera brinde II - por produto");
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por produto",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('0,01');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,01");
        await checkout.validarTotal("0,01");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })

    test('Brinde por categoria',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarCategoria("Categoria Brinde")
        await home.selecionarProdutoNome("Produto que gera brinde - por categoria");
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por categoria",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('45,89');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,01");
        await checkout.validarTotal("45,89");
        await checkout.validarProdutosBrinde(payloadBrindes);
        await checkout.finalizarCompra();

        await finalizacao.validarNumPedido();

    })
    
    test('Brinde por marca',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarMarca("marca gera brinde")
        await home.selecionarProdutoNome("Produto que gera brinde - por marca");
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por marca",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('99,90');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,01");
        await checkout.validarTotal("99,90");
        await checkout.validarProdutosBrinde(payloadBrindes);
        await checkout.finalizarCompra();

        await finalizacao.validarNumPedido();

    })
    
    test('Brinde por valor - mil',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarProdutoNome("Produto Comum 02");
        await produto.clickComprar();
        let payloadBrindes = [
            {
                nomeBrinde: "Brinde por valor - mil",
                qtd: "1",
                preco: "R$ 0,01",
            },
        ];
        await carrinho.inserirQuantidade("3")
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,01');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('1.094,94');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,01");
        await checkout.validarTotal("1.094,94");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })
    
    test('2 produtos 2 brindes diferentes - produto e marca',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarMarca("marca gera brinde");
        await home.selecionarProdutoNome("Produto que gera brinde - por marca");
        await produto.clickComprar();
        await home.buscarProduto("Produto que gera brinde - por produto");
        await home.selecionarProdutoNome("Produto que gera brinde - por produto");
        await produto.clickComprar();
        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por marca",
              qtd: "1",
              preco: "R$ 0,01",
            },
            {
              nomeBrinde: "Brinde por produto",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,02');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('129,80');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,02");
        await checkout.validarTotal("129,80");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })
    
    test('1 produto 2 brindes diferentes por valor',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarProdutoNome("Produto Comum 01");
        await produto.clickComprar();
        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por valor - mil",
              qtd: "1",
              preco: "R$ 0,01",
            },
            {
              nomeBrinde: "Brinde por valor - 2mil",
              qtd: "1",
              preco: "R$ 0,01",
            },
          ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,02');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('2.590,00');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,02");
        await checkout.validarTotal("2.590,00");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })
    
    test('2 produtos distintos com o mesmo brinde',  async ({ home, produto, carrinho, checkout, login, finalizacao }) => {
        await home.selecionarMarca("marca gera brinde");
        await home.selecionarProdutoNome("Produto que gera brinde - por marca");
        await produto.clickComprar();
        await home.buscarProduto("Produto que gera brinde II - por marca");
        await home.selecionarProdutoNome("Produto que gera brinde II - por marca");
        await produto.clickComprar();

        let payloadBrindes = [
            {
              nomeBrinde: "Brinde por marca",
              qtd: "2",
              preco: "R$ 0,02",
            },
          ];
        await carrinho.validaProdutosBrinde(payloadBrindes);
        await carrinho.validaDescontoCarrinho('- R$ 0,02');
        await carrinho.inserirCep('32240070');
        await carrinho.validaTotalCarrinho('123,89');
        await carrinho.clickFinalizarCompra();

        await login.realizarLogin(store.brinde.user.userMadruga01,store.brinde.user.password);
        await checkout.selecionarEnvio(FormasEnvio.RETIRADA);
        await checkout.selecionarPagamento(FormasPag.ENTREGA);
        await checkout.validarDescontoCheckout("- R$ 0,02");
        await checkout.validarTotal("123,89");
        await checkout.validarProdutosBrinde(payloadBrindes);

    })    

})
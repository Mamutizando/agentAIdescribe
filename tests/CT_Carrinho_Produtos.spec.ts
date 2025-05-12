import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.describe('Suite que valida manipulação de produtos no carrinho', { tag: ['@cart'] }, () => {

    test('Aumentar quantidade de um produto - Inserindo número', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "181598972",
            "1");
        await carrinho.inserirQuantidade("8");
        await carrinho.validarQuantidadeProduto("8");
    })

    test('Aumentar a quantidade do produto  - Usando botão', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "181598972",
            "1");
        await carrinho.aumentarQuantidadeBotao(3);
        await carrinho.validarQuantidadeProduto("4");
    })

    test('Diminuir a quantidade do produto  - Usando botão', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "181598972",
            "10");
        await carrinho.diminuirQuantidadeBotao(3);
        await carrinho.validarQuantidadeProduto("7");
    })

    test('Excluir todos os produtos - Usando botão', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "181598972",
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "214225127",
            "1");
        await carrinho.deletarProdutoCarrinho();
        await carrinho.validarMsgSucesso("Produto removido no carrinho.");
    })

    test('Adicionar produto com variação', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "220782495",
            "1");
        await carrinho.inserirQuantidade("3");
        await carrinho.diminuirQuantidadeBotao(1);
        await carrinho.validarQuantidadeProduto("2");
        await carrinho.clickFinalizarCompra();    
    })
    
    test('Adicionar produto usado', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "220809953",
            "1");
        await carrinho.clickFinalizarCompra();    
    }) 
    
    test('Adicionar produto com grade customizada', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "214331958",
            "1");
        await carrinho.clickFinalizarCompra();    
    }) 
    
    test('Validar produto adicionado com preço promocional', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "222936112",
            "1");
        await carrinho.validarPrecoPromocional("1.000,00");   
    })    

    test("Adicionar quantidade maior do que o estoque - Deve retornar erro", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "217670302", "1")
        await carrinho.inserirQuantidade("8")
        await carrinho.validarMsgErro("Quantidade desejada não disponível em estoque");
    });

    test("Criar carrinho com quantidade !=1", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "181598972", "20")
        await carrinho.validarQuantidadeProduto("20")
    });

    test("Zerar quantidade de um produto", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "181598972", "1")
        await carrinho.diminuirQuantidadeBotao(1);
        await carrinho.validaElementoNaoExiste("data-produto-id");
    });

    test("Carrinho sem atingir valor mínimo", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214144534", "1")
        await carrinho.validaElementoNaoExiste("Finalizar compra")
    });

    test("Adicionar produto com duas grades - Cor e Tamanho", async ({ carrinho, checkout }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "220820188", "1")
        await carrinho.clickFinalizarCompra()
        await carrinho.validaElementoNaoExiste("Forma de entrega")
    });

    test("Validar inexistencia do texto a partir de", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "220782495", "1")
        await carrinho.clickFinalizarCompra()
        await carrinho.validaElementoNaoExiste("A partir de")
    });
})
import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
})

test.describe('Promoções ', { tag: ['@cart'] }, () => {

    test('Valor da promoção em uma pesquisa com o termo parcial', async ({ home }) => {
        await home.buscarProduto("[AUTOMACAO] Calça Promo");
        await home.validarDescontoCardProduto(store.loja.nameProductCalcaPromocao, "25%");
    })

    test("Valor da promoção em uma pesquisa com o termo total", async ({ home }) => {
        await home.buscarProduto(store.loja.nameProductCamisetaPromocao);
        await home.validarDescontoCardProduto(store.loja.nameProductCamisetaPromocao, "20%");
    }); 

    test("Validar o carrinho com multiplos produtos com promoção ativa (Categoria)", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "247656039", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214444484", "1")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validarPrecoPromocional("18,00");
    }); 
    
    test("Validar o carrinho com multiplos produtos com promoção ativa (Produto)", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "246532076", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214144697", "1")
        await carrinho.validarPrecoPromocional("30,00")
        await carrinho.validarPrecoPromocional("40,00"); 
    });
    
    test("Validar o carrinho com um produto com promoção ativa e outro sem promoção (Categoria)", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "247656039", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "181598972", "1")
        await carrinho.validarPrecoPromocional("190,90")
        await carrinho.validarPrecoPromocional("45,00"); 
    });

    test("Validar o carrinho com um produto com promoção ativa e outro sem promoção (Produto)", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214144697", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "181598972", "1")
        await carrinho.validarPrecoPromocional("190,90")
        await carrinho.validarPrecoPromocional("40,00"); 
    });

    test("Validar o carrinho com um produto com promoção ativa e outro sem promoção (Marca)", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "269501601", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "181598972", "1")
        await carrinho.validarPrecoPromocional("190,90")
        await carrinho.validarPrecoPromocional("25,50"); 
    });

    test("Validar o carrinho multiplos produtos com promoção diferente", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214144697", "1")
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "247656039", "1")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validarPrecoPromocional("40,00");
    });

    test("Validar o carrinho com uma promoção maior que o valor do produto", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "214225127", "1")
        await carrinho.validarPrecoPromocional("2,00")
    });
})

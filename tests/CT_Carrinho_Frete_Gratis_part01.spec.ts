import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.describe('Aplicar Frete Grátis', { tag: ['@cart'] }, () => {

    test('Por categoria', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippinByCategory,
            "1");
        await carrinho.inserirCep("20521060");
        await carrinho.validarLabelFrete("Frete Grátis");
    })

    test('Por categoria com variação', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippinByCategoryVariation,
            "1");
        await carrinho.inserirCep("20521060");
        await carrinho.validarLabelFrete("Frete Grátis");    
    })
    
    test('Por produto', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByProduct,
            "1");
        await carrinho.inserirCep("20521060");
        await carrinho.validarLabelFrete("Frete Grátis");    
    })
    
    test('Por região', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByRegion,
            "1");
        await carrinho.inserirCep("01310-999");
        await carrinho.validarLabelFrete("Frete Grátis");    
    })
    
    test('Por região + categoria + produto - CEP', { tag: ['@smoke'] }, async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByProductCategAndRegion,
            "1");
        await carrinho.inserirCep("01310-999");
        await carrinho.validarLabelFrete("Frete Grátis");    
    })   
    
    test("Por região - Região inválida", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByRegion,
            "1");
        await carrinho.inserirCep("74550165");
        await carrinho.validarLabelFrete("Frete Grátis", false); 
    });
    
    test("Por região - Remover quando região mudar", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByRegion,
            "3");
        await carrinho.inserirCep("01310999");
        await carrinho.validarLabelFrete("Frete Grátis"); 
        await carrinho.inserirCep("74550165");
        await carrinho.validarLabelFrete("Frete Grátis", false); 
    });
    
    test("Por região + categoria + produto - Manter quando região inválida", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByProductCategAndRegion,
            "1");
        await carrinho.inserirCep("29010004");
        await carrinho.validarLabelFrete("Frete Grátis"); 
        await carrinho.inserirQuantidade("4");
        await carrinho.validarLabelFrete("Frete Grátis"); 
    });
    
    test("Alterar produto com quantidade > 1", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippingByProduct,
            "1");
        await carrinho.inserirCep("25575610");
        await carrinho.validarLabelFrete("Frete Grátis"); 
        await carrinho.inserirQuantidade("2");
        await carrinho.validarLabelFrete("Frete Grátis"); 
    });
    
    test("Mais de um produto - Deve aplicar apenas no que possuir a condição", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.simpleProduct,
            "1");
        await carrinho.inserirCep("29020300");
        await carrinho.validarLabelFrete("Frete Grátis", false); 

        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.freeShippinByCategory,
            "1")
        await carrinho.validarLabelFrete("Frete Grátis", false); 
    });
})
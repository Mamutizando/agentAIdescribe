import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';


test.describe('Aplicar Frete com Valor Minimo', { tag: ['@cart'] }, () => {
    test('Valida frete de produto com offers e atingindo o valor', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "292205489",
            "2");
        await carrinho.inserirCep("08770010");
        await carrinho.validarLabelFrete("Teste Frete Valor Minimo");
    });
    
    test("Valida frete de produto com offers não atingindo o valor", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "292205489",
            "1");
        await carrinho.inserirCep("08770010");
        await carrinho.validarLabelFrete("Teste Frete Valor Minimo", false);
    });
    
    test("Valida frete de produto com offers e cupom não atingindo o valor", async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            "292205489",
            "2");
        await carrinho.inserirCep("08770010");
        await carrinho.informarCupom("CUPOMACUMULATIVO");
        await carrinho.validarLabelFrete("Teste Frete Valor Minimo");
    });
})
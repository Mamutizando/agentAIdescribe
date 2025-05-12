import { test } from '../fixtures/fixturesBase';
import store from "../test-data/lojatstautomation.json";
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';


test.beforeEach(async({ carrinho }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.loja.nameStore,
        "215760998",
        "1"
    );

})

test.describe('Suite de teste para validar itens que devem vir pré selecionados no checkout', () => {

    test('Endereço principal vem pré selecionado no checkout',{ tag: ['@smoke'] }, async ({ checkout, carrinho, login  }) => {
        await carrinho.inserirCep("08820310");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin("usuarioumendereco@mailinator.com","QAli2023");
        await checkout.validarEnderecoPrincipal("Jardim São Pedro ");
    })

})
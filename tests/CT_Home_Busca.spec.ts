import { test } from '../fixtures/fixturesBase';
import store from '../test-data/lojatstautomation.json';


test.beforeEach(async({ home }) => {
    await home.carregarSite(store.loja.nameStore);
})

test.describe('Cenários de busca da loja', () => {

    test('Busca termo com click no botão', { tag: ['@smoke'] }, async ({ home, busca }) => {
        await home.buscarProduto(store.loja.products.nameProductDefault);
        await busca.validarTermoBuscadoEncontrado(store.loja.products.nameProductDefault);
    });

    test('Busca termo com tecla Enter', { tag: ['@smoke'] }, async ({ home, busca }) => {
        await home.buscarProduto(store.loja.products.nameProductDefault,true);
        await busca.validarTermoBuscadoEncontrado(store.loja.products.nameProductDefault);
    });    

})
import { test } from '../fixtures/fixturesBase';
import global from '../test-data/global.json';
import store from '../test-data/lojatstautomation.json';


test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
    await home.realizarLoginAPI(
        global.path.login,
        store.loja.nameStore,
        store.users.userMadruga08,
        store.users.senhaMadruga);

})


test.describe('Validação do link de rastreio ', { tag: ['@smoke'] }, () => {

    test('Validar exibição link dos Correios no código de rastreamento no PAC',  async ({ minhaConta }) => {
        await minhaConta.acessarPedido(store.loja.nameStore, store.order.pacMadruga);
        await minhaConta.validarLinkNumeroRastreamento();
    })

    test('Validar exibição link dos Correios no código de rastreamento SEDEX',  async ({ minhaConta }) => {
        await minhaConta.acessarPedido(store.loja.nameStore, store.order.sedexMadruga);
        await minhaConta.validarLinkNumeroRastreamento();
    }) 
    
    test('Validar ausência link dos Correios no código de rastreamento no Enviali PAC',  async ({ minhaConta }) => {
        await minhaConta.acessarPedido(store.loja.nameStore, store.order.envialiPacMadruga);
        await minhaConta.validarAusenciaLinkNumeroRastreamento();
    })
    
    test('Validar ausência link dos Correios no código de rastreamento no Enviali SEDEX',  async ({ minhaConta }) => {
        await minhaConta.acessarPedido(store.loja.nameStore, store.order.envialiSedexMadruga);
        await minhaConta.validarAusenciaLinkNumeroRastreamento();
    })    


})
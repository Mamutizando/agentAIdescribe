import { test } from '../fixtures/fixturesBase';
import store from '../test-data/enviopersonalizado.json';
import global from '../test-data/global.json';

test.beforeEach(async ({ home, minhaConta, carrinho },) => {
    await home.carregarSite(store.enviopersonalizado.nameStore);
    await minhaConta.acessarLink();
    await minhaConta.realizarLogin(store.enviopersonalizado.loginNovoUsuario, "QAli2023");
    await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.enviopersonalizado.nameStore, "237666013", "1");
    await carrinho.inserirCep('08820310');
    await carrinho.clickFinalizarCompra();
})


test.describe('Envio Personalizado - usuario logado', { tag: ['@smoke'] }, () => {

    test('Exibe envio personalizado em 0 dias no checkout', async ({ checkout }) => {
        await checkout.validarInformacoesEnvio("60,00", "0 dias", "Drone - 0 dias");
    })

    test('Exibe envio personalizado em 20 dias no checkout', async ({ checkout }) => {
        await checkout.validarInformacoesEnvio("60,00", "20 dias", "Drone - 20 dias");
    })

})
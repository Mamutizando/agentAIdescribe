import { test } from '../fixtures/fixturesBase';
import store from '../test-data/enviopersonalizado.json';
import global from '../test-data/global.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.enviopersonalizado.nameStore);
})


test.describe('Envio Personalizado - usuario deslogado', { tag: ['@smoke'] }, () => {

    test('Exibe envio personalizado em 0 dias na pagina de produtos', async ({ home, produto }) => {
        await home.buscarProduto("Pelucia");
        await home.selecionarProdutoNome("[Mostros SA] - Pelucia");
        await produto.calcularFrete('08820310');
        await produto.validarInformacoesEnvio("60,00", "0 dias úteis", "Drone - 0 dias");
    })

    test('Exibe envio personalizado em 0 dias no carrinho', async ({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.enviopersonalizado.nameStore, "237666013", "1");
        await carrinho.inserirCep("08820310");
        await carrinho.validarInformacoesEnvio("60,00", "0 dias úteis", "Drone - 0 dias");
    })

    test('Exibe envio personalizado em 20 dias na pagina de produtos', async ({ home, produto }) => {
        await home.buscarProduto("Pelucia");
        await home.selecionarProdutoNome("[Mostros SA] - Pelucia");
        await produto.calcularFrete('08820310');
        await produto.validarInformacoesEnvio("60,00", "0 dias úteis", "Drone - 0 dias");
    })

    test('Exibe envio personalizado em 20 dias no carrinho', async ({ carrinho, }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.enviopersonalizado.nameStore, "237666013", "1");
        await carrinho.inserirCep("08820310");
        await carrinho.validarInformacoesEnvio("60,00", "20 dias úteis", "Drone - 20 dias");
    })

})
import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async({ home }) => {
    await home.carregarSite(store.loja.nameStore);
})

test.describe('Cenários de filtros da loja',{ tag: ['@smoke'] }, () => {

    const colors = ["vermelha", "branca", "preta"];
    const sizes = ["30", "37", "41", "46"];

    colors.forEach((color) => {
        test(`Filtro por cor ${color}`, async({ home, busca, produto }) => {
            await home.buscarProduto("variação", true);
            await busca.filtrarProdutoPorCor(color);
            await busca.clicarNoPrimeiroProdutoRetornado();
            await produto.validaOpcaoFiltroProdutoPorCor(color);

        });
    });

    sizes.forEach((size) => {
        test(`Filtro por tamanho ${size}`, async({ home, busca, produto }) => {
            await home.buscarProduto("variação", true);
            await busca.filtrarProdutoPorTamanho(size);
            await busca.clicarNoPrimeiroProdutoRetornado();
            await produto.validaOpcaoFiltroProdutoPorTamanho(size);

        })

    })

})
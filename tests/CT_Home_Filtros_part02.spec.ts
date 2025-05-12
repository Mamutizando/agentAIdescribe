import { test } from '../fixtures/fixturesBase';
import store1 from '../test-data/qaprincipal.json';


test.describe('Cenários de filtros da loja pela categoria',  () => {

    test('Mostrar produtos com variações indisponíveis pelo filtro', { tag: ['@smoke'] }, async ({ home, busca, produto }) => {
        await home.carregarSite(store1.loja.nameStore);
        await home.selecionarCategoria(store1.category.electronicsCategory);
        await busca.filtrarProdutoPorCor('preto');
        await busca.validarCardNomeProduto(store1.loja.nameProductFilterDisable);
        await busca.clicarNoPrimeiroProdutoRetornado();
        await produto.selecionarVariacaoIndisponivel(0);
        await produto.validarFormAviseme();

    });

});


test.describe('Cenários de filtros da loja',  () => {

    test('Filtro por tamanho - filtro com virgula', { tag: ['@smoke'] }, async ({ home, busca }) => {
        await home.carregarSite(store1.loja.nameStore);
        await home.selecionarCategoria(store1.category.carpet);
        await busca.filtrarProdutoPorTamanho('1,90x2,50m');
        await busca.validarQtdProdutos(2);

    })

})
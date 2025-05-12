import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qastorebrinde.json';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.brinde.nameStore);
})

test.describe('Brinde part2 ', { tag: ['@smoke'] }, () => {

    test('buscar brinde que não é visivel e não esta a venda',  async ({ home }) => {
        await home.buscarProduto('Brinde por categoria');
        await home.validarProdutoNaoVisivel('Brinde por categoria');
    })

    test('buscar brinde que é visivel e compravel',  async ({ home, produto, carrinho }) => {
        await home.buscarProduto('Produto que é brinde compravel');
        await home.selecionarProdutoNome('Produto que é brinde compravel');
        await produto.clickComprar();
        await carrinho.validaTotalCarrinho('85,49');
    })
    
    test('buscar brinde que é visivel mas não é compravel',  async ({ home, produto, carrinho }) => {
        await home.buscarProduto('Brinde por produto');
        await home.selecionarProdutoNome('Brinde por produto');
        await produto.clickComprar();
        await carrinho.validarMsgErro('O item está marcado como não comprável.')
    })    


})
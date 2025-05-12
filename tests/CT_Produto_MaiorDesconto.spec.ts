import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async({ home }) => {
    await home.carregarSite(store.loja.nameStore);
})

test.describe('Filtro de desconto respeitando as flags', () => {

    test('Maior desconto apresentado nas flags navegando pela categoria', { tag: ['@smoke'] },  async ({ home, busca }) => {
        await home.selecionarCategoria("Maior desconto");
        await busca.ordenarProdutosPor('Maior desconto')
        await busca.validarOrdenacaoMaiorDesconto()

    })

    test('Maior desconto apresentado nas flags navegando pela busca', { tag: ['@smoke'] },  async ({ home, busca }) => {
        await home.buscarProduto("Maior desconto");
        await busca.ordenarProdutosPor('Maior desconto')
        await busca.validarOrdenacaoMaiorDesconto()

    })

    test('Maior desconto apresentado nas flags filtrando por menor preço', { tag: ['@smoke'] },  async ({ home, busca }) => {
        await home.buscarProduto("Maior desconto");
        await busca.validarTermoBuscadoEncontrado("Maior desconto")
        await busca.ordenarProdutosPor('Menor preço')
        await busca.validarOrdenacaoMaiorDesconto()

    })    


})
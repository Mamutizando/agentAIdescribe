import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async({ home }) => {
    await home.carregarSite(store.loja.nameStore);
})


test.describe('Suite para validação a vinculação de imagem em grade nativa', { tag: ['@smoke'] }, () => {

    test('Verificar imagem vinculada a grade nativa: Produto com uma cor',  async ({ home, produto }) => {
        await home.buscarProduto("Produto com uma cor");
        await home.selecionarProdutoNome("[Grade Nativa] - Produto com uma cor");
        await produto.validarImagem("236893405",
            "/orig_1638388284652-82hbc6534o.jpg",
            "[Grade Nativa] - Produto com uma cor");
    });

    test('Verificar imagem vinculada a grade nativa: Produto com duas cores',  async ({ home, produto }) => {
        await home.buscarProduto("Produto com duas cores");
        await home.selecionarProdutoNome("[Grade Nativa] - Produto com duas cores");
        await produto.validarImagem("236893649",
            "/boneca-barbie-fashion-ref-t7439-d65-r08uw04nh0.jpg",
            "[Grade Nativa] - Produto com duas cores");

    });

    test('Verificar imagem vinculada a grade nativa: Tamanho de anel/aliança',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho de anel/aliança");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho de anel/aliança");
        await produto.validarImagem("236894482",
            "/20220927_113145-yafig5915y.jpg",
            "[Grade Nativa] - Tamanho de anel/aliança");

    });
    
    test('Verificar imagem vinculada a grade nativa: Tamanho de calça',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho de calça");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho de calça");
        await produto.validarImagem("236896341",
            "/whatsapp-image-2022-07-06-at-13-26-58-aony7mqvzg.jpeg",
            "[Grade Nativa] - Tamanho de calça");

    });
    
    test('Verificar imagem vinculada a grade nativa: Tamanho de camisa/camiseta',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho de camisa/camiseta");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho de camisa/camiseta");
        await produto.validarImagem("236897533",
            "/456_1-6fmxmrbimt.jpg",
            "[Grade Nativa] - Tamanho de camisa/camiseta");

    });    
   

})
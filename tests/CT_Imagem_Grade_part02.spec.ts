import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async({ home }) => {
    await home.carregarSite(store.loja.nameStore);
})

test.describe('Suite para validação a vinculação de imagem em grades nativa e personalizada', { tag: ['@smoke'] }, () => {

    test('Verificar imagem vinculada a grade nativa: Tamanho de capacete',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho de capacete");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho de capacete");
        await produto.validarImagem("236898367",
            "/download-52663zcq3s.jpg",
            "[Grade Nativa] - Tamanho de capacete");
    });

    test('Verificar imagem vinculada a grade nativa: Tamanho de tênis',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho de tênis");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho de tênis");
        await produto.validarImagem("236899555",
            "/img-1982-ilhos-85qwh4vhfj.jpg",
            "[Grade Nativa] - Tamanho de tênis");
    });
    
    test('Verificar imagem vinculada a grade nativa: Voltagem',  async ({ home, produto }) => {
        await home.buscarProduto("Voltagem");
        await home.selecionarProdutoNome("[Grade Nativa] - Voltagem");
        await produto.validarImagem("236900079",
            "/lampada-bulbo-milky-filamento-7w-20215-stella---3-f7y1wjl00h.png",
            "[Grade Nativa] - Voltagem");
    });
    
    test('Verificar imagem vinculada a grade nativa: Tamanho juvenil-infantil',  async ({ home, produto }) => {
        await home.buscarProduto("Tamanho juvenil-infantil");
        await home.selecionarProdutoNome("[Grade Nativa] - Tamanho juvenil-infantil");
        await produto.validarImagem("236900211",
            "/61hzvwlw62l-_ac_sr175-263_ql70_-kbmhe3l5bf.jpg",
            "[Grade Nativa] - Tamanho juvenil-infantil");
    });
    
    test('Verificar imagem vinculada a grade personalizada: Ursinho amiguru',  async ({ home, produto }) => {
        await home.buscarProduto("Ursinho amiguru");
        await home.selecionarProdutoNome("[Grade Personalizada] - Ursinho amiguru");
        await produto.validarImagem("236900748",
            "/b189a9821121e3d65d100df13ce28a27-lequ74dt0p.jpg",
            "[Grade Personalizada] - Ursinho amiguru");
    });    


})
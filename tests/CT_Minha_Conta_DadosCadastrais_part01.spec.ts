import { test } from '../fixtures/fixturesBase';
import global from '../test-data/global.json';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
})

test.afterEach(async ({ minhaConta }) => {
    await minhaConta.acessarEditarDadosCadastrais();
    await minhaConta.editarDadosCadastrais(
        "email@mailinator.com",
        "Email Editado",
        "88812540937",
        "11912345678")
        await minhaConta.salvarDadosCadastrais();
        await minhaConta.validarMensagem("Dados da conta alterada com sucesso.");            
})


test.describe('Validar a alteração de e-mail com sucesso', () => {

    test('Alteração do email com sucesso', { tag: ['@smoke'] }, async ({ home, minhaConta }) => {
        await home.realizarLoginAPI(
            global.path.login,
            store.loja.nameStore,
            'email@mailinator.com',
            store.user.passwordNProdutoRecuperado);

        await minhaConta.acessarLink();
        await minhaConta.acessarEditarDadosCadastrais();
        await minhaConta.editarDadosCadastrais(
            "emaileditado@mailinator.com",
            "Email Editado",
            "88812540937",
            "11912345678")
        await minhaConta.salvarDadosCadastrais();
        await minhaConta.validarMensagem("Dados da conta alterada com sucesso.");
    })


})
import { test } from '../fixtures/fixturesBase';
import global from '../test-data/global.json';
import store from '../test-data/qaprincipal.json';


test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
    await home.realizarLoginAPI(
        global.path.login,
        store.loja.nameStore,
        "validaccep@mailinator.com",
        store.user.passwordNProdutoRecuperado);

})


test.describe('Suite para validar alteração e remoção do complemento do endereço',  () => {

    test('Adiciona endereço principal e campo estado não permite edição e vem autopreenchido', { tag: ['@smoke'] }, async ({ minhaConta }) => {
        await minhaConta.acessarLink();
        await minhaConta.acessarEditarEndereco();
        await minhaConta.editarEndereco("69314-382", "", "123", "Conjunto Bosque", "", "");
        await minhaConta.validarAutoPreenchimentoEstado("Roraima");
        await minhaConta.validaInputReadonly("#id_endereco");
        await minhaConta.validaInputReadonly("#id_estado");
        await minhaConta.validaInputReadonly("#id_bairro");
        await minhaConta.validaInputReadonly("#id_cidade");
    })


})
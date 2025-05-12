import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';

test.beforeEach(async ({ home },) => {
    await home.carregarSite(store.loja.nameStore);
    await home.clicarFaleConosco();
})


test.describe("Suite Formulario Fale Conosco", () => {

    test('Formulario de fale conosco preenchido com sucesso', { tag: ['@smoke'] }, async ({ home }) => {
        await home.inserirDadosFaleConosco(
            store.formTalkWithUS.name,
            store.formTalkWithUS.email,
            store.formTalkWithUS.celphone,
            store.formTalkWithUS.orderNumber,
            store.formTalkWithUS.message
        )
        await home.validaMensagemFormularioFaleConosco(store.formTalkWithUS.alertRecaptch);
          
    })

})
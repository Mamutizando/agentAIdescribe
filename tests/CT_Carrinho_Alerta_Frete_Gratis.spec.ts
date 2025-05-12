import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json'

test.beforeEach(async({ carrinho }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.loja.nameStore,
        store.product[0].idProduct,
        "1"
    );

})

test.describe('Suite Alerta de frete grátis', { tag: ['@cart'] }, () => {

    test('Validar a mensagem de alerta de frete grátis aplicado', async({ carrinho }) => {
        await carrinho.inserirCep("25575610");
        await carrinho.validarAlertaFreteGratis("Parabéns! O frete é por nossa conta. Escolha esta opção.");
    })

    test('Validar a mensagem de alerta de frete grátis não atingindo o valor minimo para frete grátis', async({ carrinho }) => {
        await carrinho.inserirCep("01310930");
        await carrinho.validarAlertaFreteGratis("Com mais R$ 80,00 o frete é por nossa conta. Aproveite!");
    });

    test('Validar a menagem de alerta de frete grátis antes de inserir o CEP', async({ carrinho }) => {
        await carrinho.validarAlertaFreteGratis("Quer FRETE GRÁTIS? Digite o seu CEP e saiba quanto falta!");
    });

    test('Validar a mensagem de alerta de frete grátis quando a região não está habilitada', async({ carrinho }) => {
        await carrinho.inserirCep("49000120");
        await carrinho.validarAlertaFreteGratis("Não há frete grátis para esta região.");
    });
})
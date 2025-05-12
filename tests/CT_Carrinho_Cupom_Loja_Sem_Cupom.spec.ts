import { test } from '../fixtures/fixturesBase';
import global from '../test-data/global.json'

test.describe("Suite para validar que lojas sem cupom não devem exibir campo cupom no carrinho", { tag: ['@cart','@smoke'] }, () => {

    test('Loja sem cupom cadastrado - Não deve exibir campo cupom no carrinho', async({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,
            "qastore-automation-gratis", "245691749", "1");
        await carrinho.validaElementoNaoExiste("#usarCupom");
    })

    test('Loja com cupom desativado - Não deve exibir campo cupom no carrinho', async({ carrinho }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,
            "qastore-automation-enviopersonal", "237666013", "1");
        await carrinho.validaElementoNaoExiste("#usarCupom");
    });
})
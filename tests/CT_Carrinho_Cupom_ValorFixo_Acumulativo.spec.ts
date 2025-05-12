import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json'
import { FormasEnvio } from '../pages/checkout';
import { FormasEnvioCarrinho } from '../pages/carrinho';

test.beforeEach(async({ carrinho }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.loja.nameStore,
        store.loja.productFixedValueAcumulation,
        "1"
    );
    await carrinho.inserirCep(store.user.zipCode);
})

test.describe("Suite Cupom valor fixo com valor limite e total acumulativo", { tag: ['@cart'] }, () => {

  test('Valor minimo do cupom não é atingido', async({ carrinho }) => {
    await carrinho.informarCupom(store.coupon.fixedValueCouponAcumulative);
    await carrinho.validarMsgErro(store.formTalkWithUS.valueNotReached);
  });

  test('Valor minimo é atingido no carrinho ao acrescentar forma de envio', async({ carrinho }) => {
    await carrinho.selecionaFormaEnvio(FormasEnvioCarrinho.SEDEX);
    await carrinho.informarCupom(store.coupon.fixedValueCouponAcumulative);
    await carrinho.validarDescontoCupom("10")
  });

  test('Ao ir para o checkout o cupom permanece aplicado', async({ carrinho, login, checkout }) => {
    await carrinho.selecionaFormaEnvio(FormasEnvioCarrinho.SEDEX);
    await carrinho.informarCupom(store.coupon.fixedValueCouponAcumulative)
    await carrinho.validarDescontoCupom("10")
    await carrinho.clickFinalizarCompra();
    await login.loginSemSenha(store.formTalkWithUS.email);
    await checkout.validarTotal("62,20");
  });
})
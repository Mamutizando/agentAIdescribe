import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json'
import user from '../test-data/lojatstautomation.json';

test.beforeEach(async({ carrinho }, ) => {
    await carrinho.montarCarrinhoUrl(
        global.path.cartAdd,
        store.loja.nameStore,
        store.product[0].idProduct,
        "1"
    );
})

test.describe("Suite Cupom que deve retornar erro", { tag: ['@cart'] }, () => {

    test('Cupom sem valor mínimo do carrinho - Retornar erro para valor abaixo', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.minimumValueCoupon);
        await carrinho.validarMsgErro("Valor mínimo para uso do cupom não foi atingido: R$ 29.00.");
    })

    test('Cupom inativo - Retornar erro', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.inactiveCoupon);
        await carrinho.validarMsgErro("Cupom não encontrado.");
    });

    test('Cupom vencido - Retornar erro', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.expiredCoupon);
        await carrinho.validarMsgErro("O cupom não é válido.");
    });

    test('Cupom inexistente - Retornar erro', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.nonExistentCoupon);
        await carrinho.validarMsgErro("Cupom não encontrado.");
    });

    test('Cupom por produto - Retornar erro para produto diferente', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponPerProduct);
        await carrinho.validarMsgErro("Este cupom é válido apenas para alguns produtos. Verifique os produtos aceitos e tente novamente.");
    });

    test('Cupom por cliente - Retornar erro quando não logado', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponPerCustomer);
        await carrinho.validarMsgErro("Você deve estar logado.");
    });

    test('Cupom com limite utilizado - Retornar erro', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponWithLimitUsed);
        await carrinho.validarMsgErro("Esse cupom já chegou ao limite de uso");
    });

    test('Cupom exclusivo por categoria - Retornar erro quando produto pertencer a outra categoria', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponPerCategory);
        await carrinho.validarMsgErro("Este cupom é válido apenas para alguns produtos. Verifique os produtos aceitos e tente novamente.");
    });

    test('Cupom exclusivo por grupo de clientes - Retornar erro quando não logado', async({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponPerCustomerGroup);
        await carrinho.validarMsgErro("Você deve estar logado.");
    });

    test('Cupom com quantidade por cliente ultrapassada - Retornar erro', async({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.couponQuantityExceeded)
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(user.users.loginWithoutCoupon, user.users.passwordWithoutCoupon);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");
    });

    test('Cupom com OUTRO cliente logado - Retornar erro', async({ carrinho, login }) => {
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(user.users.loginWithoutCoupon, user.users.passwordWithoutCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponPerCustomer)
        await carrinho.validarMsgErro("Você não possui permissão para utilizar este cupom");
    });

    test('Cupom com limite por CPF cliente já utilizou - Retornar erro', async({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.limitedPerCPFCNPJ)
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(user.users.loginWithoutCoupon, user.users.passwordWithoutCoupon);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");
    });

    test('Cupom com limite por CNPJ cliente realizando duas compras - Retornar erro', async({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.limitedPerCPFCNPJ)
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(user.users.loginWithoutCouponCNPJ, user.users.passwordWithoutCoupon);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");
    });

    test('Cupom com limite por CNPJ usuário com CNPJ existente na base - Retornar erro', async({ carrinho, login }) => {
        await carrinho.informarCupom(store.coupon.limitedPerCPFCNPJ)
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(user.users.loginWithoutCouponSameCNPJ, user.users.passwordWithoutCoupon);
        await carrinho.validarMsgErro("O limite máximo de uso por cliente deste cupom foi excedido.");
    });
})
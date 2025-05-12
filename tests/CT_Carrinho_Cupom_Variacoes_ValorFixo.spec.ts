import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.loja.nameStore);
})

test.describe('Suite cupom de valor fixo com variação', { tag: ['@cart'] }, () => {

    test('Valor Fixo para todos os produtos e cliente específico', { tag: ['@smoke'] }, async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[0].idProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon4, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponAllProductsCustomerMinimumValue4);
        await carrinho.validarDescontoCupom("20,00");
    })

    test("Valor Fixo para todos os produtos e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon4, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponAllProductsCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("99,99");
    });

    test("Valor Fixo para um ou mais produtos e cliente específico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFixedValueForProductAndCustomerMinimumValue2,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon4, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponForProductAndCustomerMinimumValue4);
        await carrinho.validarDescontoCupom("12,39");
    });

    test("Valor Fixo para um ou mais produtos e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFixedValueForProductAndCustomerMinimumValue2,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFixedValueForProductAndCustomerMinimumValue,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon4, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponForProductAndGroupCustomerMinimumValue);
        await carrinho.validarDescontoCupom("25,34");
    });

    test("Valor Fixo para uma ou mais categorias e cliente específico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon4, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponForCategoryAndCustomerMinimumValue4);
        await carrinho.validarDescontoCupom("10,00");
    });

    test("Valor Fixo para uma ou mais categorias e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon4, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCouponForCategoryAndCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("2,38");
    });

    test("Validar recuperação de cupom ao deletar o produto com valor fixo", async ({ carrinho, login, home, produto }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon4, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.fixedValueCoupon);
        await carrinho.validarDescontoCupom("19,90");
        await carrinho.deletarProdutoCarrinho();
        await home.irParaHome();
        await home.selecionarProdutoNome("[AUTOMACAO] - Casaco de Tricô");
        await produto.clickComprar();
        await carrinho.validarDescontoCupom("20,00");
    });
})
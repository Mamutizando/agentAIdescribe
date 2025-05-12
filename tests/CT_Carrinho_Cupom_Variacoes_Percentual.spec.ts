import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.loja.nameStore);
})


test.describe('Suite cupom de percentual com variação', { tag: ['@cart'] }, () => {

    test('Percentual para todos os produtos e cliente específico', { tag: ['@smoke'] }, async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[0].idProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon3, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponAllProductsCustomerMinimumValue3);
        await carrinho.validarDescontoCupom("10");
    })

    test("Percentual para todos os produtos e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon3, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponAllProductsCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("50");
    });

    test("Percentual para um ou mais produtos e cliente específico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productPercentageValueForProductAndCustomerMinimumValue,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon3, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponForProductAndCustomerMinimumValue3);
        await carrinho.validarDescontoCupom("45");
    });

    test("Percentual para um ou mais produtos e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productPercentageValueForProductAndCustomerMinimumValue,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon3, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponForProductAndGroupCustomerMinimumValue);
        await carrinho.validarDescontoCupom("34,5");
    });

    test("Percentual para uma ou mais categorias e cliente específico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon3, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponForCategoryAndCustomerMinimumValue3);
        await carrinho.validarDescontoCupom("11");
    });

    test("Percentual para uma ou mais categorias e grupo de cliente especifico", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon3, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.percentageCouponForCategoryAndCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("89");
    });

    test("Validar recuperação de cupom ao deletar o produto com percentual", async ({ carrinho, login, home, produto }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon3, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.couponWithPercentage);
        await carrinho.validarDescontoCupom("10");
        await carrinho.deletarProdutoCarrinho();
        await home.irParaHome();
        await home.buscarProduto("[AUTOMACAO] [NAO ALTERAR] - Produto com cupom FRETE GRÁTIS CATEGORIA e GRUPO DE CLIENTES");
        await home.selecionarProdutoNome("[AUTOMACAO] [NAO ALTERAR] - Produto com cupom FRETE GRÁTIS CATEGORIA e GRUPO DE CLIENTES");
        await produto.clickComprar();
        await carrinho.validarDescontoCupom("10");
    });
})
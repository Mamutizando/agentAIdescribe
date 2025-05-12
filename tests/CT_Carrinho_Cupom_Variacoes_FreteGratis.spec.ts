import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';
import { Produto } from '../pages/produto';


test.afterEach(async ({ home },) => {
    await home.limparCarrinho(store.loja.nameStore);
})

test.describe('Suite cupom de frete grátis com variação', { tag: ['@cart'] }, () => {

    test('Frete Grátis para todos os produtos e cliente especifico limitando valor minimo', { tag: ['@smoke'] }, async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.product[0].idProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon2, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingAllProductsCustomerMinimumValue2);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    })

    test("Frete Grátis para todos os produtos e grupo de cliente especifico limitando valor minimo", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForProduct,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon2, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingAllProductsCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });

    test("Frete grátis para um ou mais produtos com cliente específico limitando valor minimo", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForProductAndCustomerMinimumValue,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon2, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingCouponForProductAndCustomerMinimumValue2);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });

    test("Frete Grátis para um ou mais produtos e grupo de cliente especifico limitando valor minimo", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCustomerGroupMinimumValue1,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCustomerGroupMinimumValue2,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCustomerGroupMinimumValue3,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon2, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingCouponForProductAndGroupCustomerMinimumValue);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });

    test("Frete Grátis para uma ou mais categorias e cliente especifico limitando valor minimo", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue2,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithExclusiveCoupon2, store.user.passwordWithExclusiveCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingCouponForCategoryAndCustomerMinimumValue2);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });

    test("Frete Grátis para uma ou mais categorias e grupo de cliente especifico limitando valor minimo", async ({ carrinho, login }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue2,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon2, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingCouponForCategoryAndCustomerGroupMinimumValue);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });

    test("Validar recuperação de cupom ao deletar o produto com frete grátis", async ({ carrinho, login, home, produto }) => {
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue1,
            "1");
        await carrinho.montarCarrinhoUrl(
            global.path.cartAdd,
            store.loja.nameStore,
            store.loja.productFreeShippingForCategoryAndCustomerMinimumValue2,
            "1");
        await carrinho.clickFinalizarCompra();
        await login.realizarLogin(store.user.loginWithGroupCoupon2, store.user.passwordWithGroupCoupon);
        await carrinho.acessarHomeCarrinho(global.path.base, store.loja.nameStore);
        await carrinho.informarCupom(store.coupon.freeShippingCoupon);
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");

        await carrinho.deletarProdutoCarrinho();
        await home.irParaHome();
        await home.selecionarProdutoNome("[AUTOMACAO] - Casaco de Tricô");
        await produto.clickComprar();
        await carrinho.validarDescontoCupom("Frete Grátis");
        await carrinho.inserirCep(store.user.zipCode);
        await carrinho.validarLabelFrete("Frete Grátis");
    });   
})
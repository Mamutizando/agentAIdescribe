import { test } from '../fixtures/fixturesBase';
import store from '../test-data/qaprincipal.json';
import global from '../test-data/global.json';

test.beforeEach(async ({ carrinho },) => {
    await carrinho.montarCarrinhoUrl(global.path.cartAdd, store.loja.nameStore, "247656039", "1")
    await carrinho.validarPrecoPromocional("45,00")
})

test.describe('Promoções ', { tag: ['@cart'] }, () => {

    test('Validar o carrinho com promoção ativa e cupom de desconto percentual não cumulativo', async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponWithPercentage)
        await carrinho.validarDescontoCupom("10 %")
        await carrinho.validarPrecoPromocional("49,00")
        await carrinho.validaTotalCarrinho("44,10");
    })

    test("Validar o carrinho com promoção ativa e cupom de desconto valor frete grátis não cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.freeShippingCoupon)
        await carrinho.validarDescontoCupom("Frete Grátis")
        await carrinho.validarPrecoPromocional("49,00")
        await carrinho.validaTotalCarrinho("49,00");
    }); 

    test("Validar o carrinho com promoção ativa e cupom de desconto e limite de valor no cupom não cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.minimunValueCoupon2)
        await carrinho.validarDescontoCupom("10 %")
        await carrinho.validarPrecoPromocional("49,00")
        await carrinho.validaTotalCarrinho("44,10");
    }); 
    
    test("Validar o carrinho com promoção ativa e cupom de desconto valor fixo cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.fixedValueCouponCumulative)
        await carrinho.validarDescontoCupom("20,00")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validaTotalCarrinho("25,00");
    });
    
    test("Validar o carrinho com promoção ativa e cupom de desconto percentual cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.couponWithPercentageCumulative)
        await carrinho.validarDescontoCupom("10 %")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validaTotalCarrinho("40,50");
    });

    test("Validar o carrinho com promoção ativa e cupom de desconto valor frete grátis cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.freeShippingCouponCumulative)
        await carrinho.validarDescontoCupom("Frete Grátis")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validaTotalCarrinho("45,00");
    });

    test("Validar o carrinho com promoção ativa e cupom de desconto e limite de valor no cupom cumulativo", async ({ carrinho }) => {
        await carrinho.informarCupom(store.coupon.minimumValueCoupon3)
        await carrinho.validarDescontoCupom("10 %")
        await carrinho.validarPrecoPromocional("45,00")
        await carrinho.validaTotalCarrinho("40,50");
    });
})
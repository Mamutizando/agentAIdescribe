import { test } from '../fixtures/fixturesBase';
import store from "../test-data/checkoutlia.json";
import global from '../test-data/global.json';
import { FormasEnvio, FormasPag } from '../pages/checkout';


test.describe('Suite de teste checkout lia validando fluxo de compras frequentes', { tag: ['@dontRunProd'] }, () => {

    test('Nova compra - Realiza novo pedido e não solicita senha',{ tag: ['@smoke'] }, async ({ carrinho, login, checkout }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,store.checkoutlia.nameStore,"226676535", "1");
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.checkoutlia.user.loginClienteFrequente);
        await checkout.selecionarPagamento(FormasPag.CARTAOPAGALI);
        await checkout.cartaoSalvoLia(store.checkoutlia.cartaoSalvoLia2, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();

    });

    test('Nova compra - Realiza novo pedido com cartão salvo e só solicita o cvv para poder finalizar compra',{ tag: ['@smoke'] }, async ({ carrinho, login, checkout }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,store.checkoutlia.nameStore,"226676833", "1");
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.checkoutlia.user.loginClienteFrequente);
        await checkout.selecionarPagamento(FormasPag.CARTAOPAGALI);
        await checkout.cartaoSalvoLia(store.checkoutlia.cartaoSalvoLia2, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();

    });
     
    test('Nova compra - Realiza novo pedido e solicita autenticação para adicionar um novo endereço',{ tag: ['@smoke'] }, async ({ carrinho, login, checkout }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,store.checkoutlia.nameStore,"226676833", "1");
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.checkoutlia.user.loginClienteFrequente);
        await checkout.clickCadastrarEndereco();
        await checkout.validarMsgAutNaEntrega('Deseja utilizar outro endereço? Acesse sua conta:');
        await checkout.validarBtnAutenticacao();
        await checkout.validarBtnFinalizarDesabilitado();
        await login.realizarLoginCheckout(store.checkoutlia.user.loginClienteFrequente, store.checkoutlia.user.senhaClienteFrequente);
        await checkout.selecionarPagamento(FormasPag.CARTAOPAGALI);
        await checkout.cartaoSalvoLia(store.checkoutlia.cartaoSalvoLia2, "123", "1");
        await checkout.validarBtnFinalizarHabilitado();

    });    

    test('Nova compra - Realiza novo pedido e utiliza pix',{ tag: ['@smoke'] }, async ({ carrinho, login, checkout }) => {
        await carrinho.montarCarrinhoUrl(global.path.cartAdd,store.checkoutlia.nameStore,"226676535", "1");
        await carrinho.clickFinalizarCompra();
        await login.loginSemSenha(store.checkoutlia.user.loginContaExistenteSecundaria);
        await checkout.selecionarPagamento(FormasPag.PIXPAGALI);
        await checkout.validarBtnFinalizarHabilitado();

    });

})
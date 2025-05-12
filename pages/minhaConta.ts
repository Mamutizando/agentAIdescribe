import { Locator, Page, expect } from '@playwright/test';
import { buildUrl } from '../utils/urlHelper';


export class MinhaConta {

    readonly page: Page;
    private inputEmail: Locator;
    private inputSenha: Locator;
    private btnEcluirEnd: Locator;
    private inputCep: Locator;
    private inputNumero: Locator;
    private inputComplemento: Locator;
    private inputBairro: Locator;
    private inputEndereco: Locator;
    private inputReferencia: Locator;
    private inputEstado: Locator;
    private inputNome: Locator;
    private inputCpf: Locator;
    private inputCelular: Locator;
    private txtMenuUser: Locator;
    private txtMenuUserSair: Locator;


    constructor(page: Page) {
        this.page = page
        this.inputEmail = page.getByLabel('Digite o email que deseja');
        this.inputSenha = page.getByLabel('Senha:');
        this.btnEcluirEnd = page.getByRole('link', { name: ' Excluir' });
        this.inputCep = page.locator('#id_cep');
        this.inputNumero = page.locator('#id_numero');
        this.inputEndereco = page.locator('#id_endereco');
        this.inputComplemento = page.locator('#id_complemento');
        this.inputReferencia = page.locator('#id_referencia');
        this.inputBairro = page.locator('#id_bairro');
        this.inputEstado = page.locator('#id_estado');
        this.inputNome = page.locator('#id_nome');
        this.inputCpf = page.locator('#id_cpf');
        this.inputCelular = page.locator('#id_telefone_celular');
        this.txtMenuUser = page.locator('.btn-group > .botao');
        this.txtMenuUserSair = page.locator(".menu-user-logout[title='Sair']");
    

    }

    /**
     * Acessa o link "Minha Conta".
     */
    async acessarLink() {
        await this.page.getByRole('link', { name: 'Minha Conta' }).click();
    }

    /**
     * Realiza login na área "Minha Conta".
     * @param email - Email do usuário.
     * @param senha - Senha do usuário.
     */
    async realizarLogin(email: string, senha: string) {
        await this.inputEmail.fill(email);
        await this.inputSenha.fill(senha);
        await this.page.getByRole('button', { name: 'Prosseguir' }).click();
    }

    /**
     * Exclui o primeiro endereço adicional na área logada.
     */
    async excluirEndAdicional() {
        await this.btnEcluirEnd.first().click();
    }

    /**
     * Acessa os detalhes de um pedido específico.
     * @param loja - Nome da loja.
     * @param pedidoID - ID do pedido.
     */
    async acessarPedido(loja: string, pedidoID: string) {
        const base = await buildUrl(loja);
        const urlFinal = `${base}conta/pedido/${pedidoID}/listar_reduzido`;
        await this.page.goto(urlFinal);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Valida a presença do link de rastreamento do pedido.
     */
    async validarLinkNumeroRastreamento() {
        let rest = this.page.getByText('Rastreamento do pedido:').locator('..');

        expect(await rest.locator('> *').count(), 'Validando a quantidade de elementos no rastreamento').toBe(2);
        expect(await rest.locator('a').getAttribute('href'), 'Validando o link de rastreio').toContain('https://rastreamento.correios.com.br/app/index.php?objetos=');
    }

    /**
     * Valida a ausência do link de rastreamento do pedido.
     */
    async validarAusenciaLinkNumeroRastreamento() {
        let locator = await this.page.getByText('Rastreamento do pedido:').locator('..').locator('> *').count();
        expect(locator, 'Validando a ausência do link de rastreio').toBe(1);
    }

    /**
     * Acessa a página de edição do endereço principal.
     */
    async acessarEditarEndereco() {
        await this.page.getByRole('link', { name: 'Editar endereço principal' }).click();
    }

    /**
     * Edita os detalhes do endereço.
     * @param cep - CEP do endereço.
     * @param endereco - Endereço.
     * @param num - Número do endereço.
     * @param comp - Complemento do endereço.
     * @param refe - Referência do endereço.
     * @param bairro - Bairro do endereço.
     */
    async editarEndereco(cep:string, endereco:string, num:string, comp:string, refe:string, bairro:string) {
        let cepLocator = this.inputCep;
        await expect(cepLocator).toBeVisible();
        await cepLocator.clear();
        await cepLocator.pressSequentially(cep, { delay: 100 });
        await this.page.waitForLoadState('load');

        if(endereco == "-"){
            let endLocator = this.inputEndereco;
            await expect(endLocator).toBeVisible();
            await endLocator.clear();
        }else if (endereco != null && endereco != "") {
            let endLocator = this.inputEndereco;
            await expect(endLocator).toBeVisible();
            await endLocator.clear();
            await endLocator.fill(endereco);            
        }

        if(num == "-"){
            let numLocator = this.inputNumero;
            await expect(numLocator).toBeVisible();
            await numLocator.clear();
        }else if (num != null && num != "") {
            let numLocator = this.inputNumero;
            await expect(numLocator).toBeVisible();
            await numLocator.clear();
            await numLocator.fill(num);            
        }

        if(comp == "-"){
            let compLocator = this.inputComplemento;
            await expect(compLocator).toBeVisible();
            await compLocator.clear();
        }else if (comp != null && comp != "") {         
            let compLocator = this.inputComplemento;
            await expect(compLocator).toBeVisible();
            await compLocator.clear();
            await compLocator.fill(comp);            
        }

        if(refe == "-"){
            let refeLocator = this.inputReferencia;
            await expect(refeLocator).toBeVisible();
            await refeLocator.clear();
        }else if (refe != null && refe != "") {
            let refeLocator = this.inputReferencia;
            await expect(refeLocator).toBeVisible();
            await refeLocator.clear();
            await refeLocator.fill(refe);            
        }

        if(bairro == "-"){
            let bairroLocator = this.inputBairro;
            await expect(bairroLocator).toBeVisible();
            await bairroLocator.clear();
        }else if (bairro != null && bairro != "") {
            let bairroLocator = this.inputBairro;
            await expect(bairroLocator).toBeVisible();
            await bairroLocator.clear();
            await bairroLocator.fill(bairro);            
        }
    }

    /**
     * Valida o auto preenchimento do estado.
     * @param texto - Texto esperado no campo de estado.
     */
    async validarAutoPreenchimentoEstado(texto: string) {
         await expect(this.page.locator('#id_estado > option[selected]'), 'Validando o auto preenchimento do estado').toHaveText(texto);
    }

    /**
     * Valida se o input é readonly.
     * @param input - Seletor do input.
     */
    async validaInputReadonly(input: string) {
        await expect(this.page.locator(input), 'Validando se o input é readonly').toHaveAttribute('readonly');
    }

    /**
     * Acessa a página de edição de dados cadastrais.
     */
    async acessarEditarDadosCadastrais() {
        await this.page.getByRole('link', { name: 'Editar dados cadastrais' }).click();
    }

    /**
     * Edita os dados cadastrais do usuário.
     * @param email - Novo email do usuário.
     * @param nome - Novo nome do usuário.
     * @param cpf - Novo CPF do usuário.
     * @param celular - Novo número de celular do usuário.
     */
    async editarDadosCadastrais(email: string, nome: string, cpf:string, celular: string) {
        if (email != null && email != "") {
            let emailLocator = this.page.locator('#id_email');
            await expect(emailLocator).toBeVisible();
            await emailLocator.clear();
            await emailLocator.fill(email);
        } else {
            let emailLocator = this.page.locator('#id_email');
            await expect(emailLocator).toBeVisible();
            await emailLocator.clear();
        }

        if (nome != null && nome != "") {
            let nomeLocator = this.inputNome;
            await expect(nomeLocator).toBeVisible();
            await nomeLocator.clear();
            await nomeLocator.fill(nome);
        } else {
            let nomeLocator = this.inputNome;
            await expect(nomeLocator).toBeVisible();
            await nomeLocator.clear();
        }

        if (cpf != null && cpf != "") {
            let cpfLocator = this.inputCpf;
            await expect(cpfLocator).toBeVisible();
            await cpfLocator.clear();
            await cpfLocator.fill(cpf);
        } else {
            let cpfLocator = this.inputCpf;
            await expect(cpfLocator).toBeVisible();
            await cpfLocator.clear();
        }

        if (celular != null && celular != "") {
            let celularLocator = this.inputCelular;
            await expect(celularLocator).toBeVisible();
            await celularLocator.clear();
            await celularLocator.fill(celular);
        } else {
            let celularLocator = this.inputCelular;
            await expect(celularLocator).toBeVisible();
            await celularLocator.clear();
        }

    }

    /**
     * Salva as alterações feitas nos dados cadastrais.
     */
    async salvarDadosCadastrais() {
        await this.page.getByRole('button', { name: 'Salvar alterações' }).click();
    }

    /**
     * Valida a exibição de uma mensagem específica na página.
     * @param mensagem - Mensagem esperada.
     */
    async validarMensagem(mensagem: string) {
        await expect(this.page.getByText(mensagem)).toBeVisible();
    }
    /**
     * Realiza o logout do usuário.
     */
    async deslogar(){
        await this.txtMenuUser.click();
        let locator = this.txtMenuUserSair;
        await expect(locator).toBeVisible();
        await locator.click();
    }
}
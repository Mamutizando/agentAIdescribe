import { expect, Locator, Page } from '@playwright/test';
import { buildUrl } from '../utils/urlHelper';
import { StoreFixture } from '../fixtures/storeFixture';

export class Home extends StoreFixture {
    readonly page: Page;
    private inputBuscarProduto: Locator
    private btnBuscarProduto: Locator
    private home: Locator
    private inputCepSegmentado: Locator;
    private btnConfirmaCepSegmentado: Locator;
    private btnFaleConosco: Locator;
    private modalFaleConosco: Locator;
    private fcNome: Locator;
    private fcEmail: Locator;
    private fcTelefone: Locator;
    private fcNPedido: Locator;
    private fcMensagem: Locator;
    private fcEnviar: Locator;
    private fcAlert: Locator;


    constructor(page: Page) {
        super(page)
        this.page = page
        this.inputBuscarProduto = page.locator('#auto-complete');
        this.btnBuscarProduto = page.locator('#form-buscar > .botao');
        this.home = page.locator('.logo > a');
        this.inputCepSegmentado = page.locator('.input-cep');
        this.btnConfirmaCepSegmentado = page.locator('.modal-regiao-cep-submit');
        this.btnFaleConosco = page.locator('ul > .hidden-phone > a');
        this.modalFaleConosco = page.locator('.form-horizontal > .modal-body');
        this.fcAlert = page.locator('.alert');
        this.fcNome = page.locator('#id_nome');
        this.fcEmail = page.locator('#id_email');
        this.fcTelefone = page.locator('#id_telefone');
        this.fcNPedido = page.locator('#id_numero_pedido');
        this.fcMensagem = page.locator('#id_mensagem');
        this.fcEnviar = page.getByRole('button', { name: 'Enviar' });


    }

    /**
     * Método responsavel por acessar a home da loja
     * @param store - nome da loja
     * 
     */
    async carregarSite(store: string) {
        await this.page.goto(await buildUrl(store))
    }

    /**
     * Método responsavel por selecionar um produto pelo nome na HOME
     * @param nameProd - Nome exato do produto
     */
    async selecionarProdutoNome(nameProd: string) {
        const requestPromise = this.page.waitForRequest('**/compre_junto/**');
        await this.page.getByTitle(nameProd, { exact: true }).click();
        await requestPromise;
    }

    /**
     * Metodo responsavel por clicar na categoria PELO HEADER da PAGINA
     * @param nomeCateg 
     */
    async selecionarCategoria(nomeCateg: string) {
        await this.page.locator('#cabecalho').getByText(nomeCateg).click()
    }

    /**
     * Método responsavel por realizar a busca
     * @param nome - nome / termo a ser buscado
     * @param pressEnter - Se False , usa o click, se True usa o enter na busca
     */
    async buscarProduto(nome: string, pressEnter = false) {
        const requestPromise = this.page.waitForRequest('**/buscar?q**');
        if (pressEnter) {
            await this.#preencherCampoBusca(nome);
            await this.page.keyboard.press('Enter');
            await requestPromise;
        } else {
            await this.#preencherCampoBusca(nome);
            await this.btnBuscarProduto.click();
            await requestPromise;
        }
    }

    async #preencherCampoBusca(termo: string) {
        await this.inputBuscarProduto.fill(termo);
    }

    /**
     * Método responsável por selecionar uma marca pelo nome.
     * @param nome - Nome da marca a ser selecionada.
     */
    async selecionarMarca(nome: string) {
        await this.page.locator(`img[alt="${nome}"]`).click();
        await this.page.waitForLoadState('load');
    }

    /**
     * Método responsável por validar que um produto não está visível na página.
     * @param nomeProduto - Nome do produto a ser validado.
     */
    async validarProdutoNaoVisivel(nomeProduto: string) {
        await expect(this.page.locator(`a[title="${nomeProduto}"]`), 'Validando que o produto não está visível').not.toBeVisible();
    }

    /**
     * Método responsável por retornar à página inicial da loja.
     */
    async irParaHome() {
        await this.home.click();
    }

    /**
     * Método responsavel por preencher o cep no modal de segmentação
     * @param cep - CEP a ser inserido no modal de segmentação
     */
    async inserirCepModal(cep: string) {
        await this.inputCepSegmentado.fill(cep);
        await this.btnConfirmaCepSegmentado.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validarDescontoCardProduto(nome: string, porcentagem: string) {
        await expect(
            this.page.locator(`[title="${nome}"] ~ .bandeiras-produto .bandeira-promocao`),
            'Validando que o desconto no card do produto está correto'
        ).toContainText(porcentagem);
    }

    /**
     * Método responsável por clicar no botão "Fale Conosco".
     */
    async clicarFaleConosco() {
        await this.btnFaleConosco.click();
        await this.page.waitForLoadState('networkidle');
        await (this.modalFaleConosco).isVisible();
    }

    /**
     * Método responsável por preencher os dados no formulário de "Fale Conosco".
     * @param nome - Nome do usuário.
     * @param email - Email do usuário.
     * @param telefone - Telefone do usuário.
     * @param nPedido - Número do pedido.
     * @param mensagem - Mensagem a ser enviada.
     */
    async inserirDadosFaleConosco(nome: string, email: string, telefone: string, nPedido: string, mensagem: string) {
        if (nome != "") {
            let locator = this.fcNome;
            await locator.isVisible();
            await locator.fill(nome);
        }

        if (email != "") {
            let locator = this.fcEmail;
            await locator.isVisible();
            await locator.fill(email);
        }

        if (telefone != "") {
            let locator = this.fcTelefone;
            await locator.isVisible();
            await locator.fill(telefone);
        }

        if (nPedido != "") {
            let locator = this.fcNPedido;
            await locator.isVisible();
            await locator.fill(nPedido);
        }

        if (mensagem != "") {
            let locator = this.fcMensagem;
            await locator.isVisible();
            await locator.fill(mensagem);
        }

        await this.fcEnviar.click();

    }

    /**
     * Método responsável por validar a mensagem exibida no formulário de "Fale Conosco".
     * @param mensagem - Mensagem esperada no alerta.
     */
    async validaMensagemFormularioFaleConosco(mensagem: string) {
        await expect(this.fcAlert, 'Validando a mensagem exibida no formulário de Fale Conosco').toContainText(mensagem);
    }


}
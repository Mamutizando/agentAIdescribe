import { Locator, Page } from '@playwright/test';


export class Login {

    private page: Page;
    private emailLoginCheckout: Locator;
    private btnContinuarLoginCheckout: Locator;
    private btn_login: Locator;    

    constructor(page: Page) {
        this.page = page
        this.emailLoginCheckout = page.locator('#id_email_login');
        this.btnContinuarLoginCheckout = page.locator('.submit-email');
        this.btn_login = page.locator('[id="id_botao_login"]');                
    }

    /**
     * Método reponsavel por fazer o login sem a senha
     * @param email 
     * 
     */
    async loginSemSenha(email:string) {
        await this.emailLoginCheckout.fill(email);
        await this.btnContinuarLoginCheckout.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Método responsavel por realizar o login apos o finalizar do carrinho
     * @param email - email
     * @param psw - senha
     */
    async realizarLogin(email:string,psw:string) {
        await this.page.getByPlaceholder('meu@email.com.br').fill(email)
        await this.page.getByRole('link', { name: 'Continuar' }).click()
        await this.page.getByPlaceholder('Senha').fill(psw);
        await this.btn_login.isVisible();
        await this.btn_login.click();
        await this.page.waitForLoadState('networkidle');        
    }
    
    /**
     * Método responsavel por realizar o login DENTRO do checkout
     * @param email 
     * @param psw 
     */
    async realizarLoginCheckout(email:string,psw:string) {
        await this.page.getByPlaceholder('meu@email.com.br').fill(email)
        await this.page.getByPlaceholder('Senha').fill(psw);
        await this.btn_login.isVisible();
        await this.btn_login.click();
        await this.page.waitForLoadState('networkidle');        
    }     


}
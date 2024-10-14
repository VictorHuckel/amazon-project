// pages/AmazonHomePage.ts
import { Page } from '@playwright/test';

class AmazonHomePage {
    private page: Page;
    private cookieAcceptButton = '#sp-cc-accept';
    private searchInput = 'input[name="field-keywords"]';
    private searchButton = 'input[type="submit"]';
    private loginButton = '#nav-link-accountList';


    constructor(page: Page) {
        this.page = page;
    }

    async acceptCookies() {
        await this.page.click(this.cookieAcceptButton);
    }

    async searchForProduct(product: string) {
        await this.page.fill(this.searchInput, product);
        await this.page.click(this.searchButton);
    }

    async gologin(){
        await this.page.click(this.loginButton);
    }
}

export default AmazonHomePage;

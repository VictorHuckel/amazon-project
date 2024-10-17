// pages/AmazonHomePage.ts
import { Page } from '@playwright/test';

class AmazonHomePage {
    private page: Page;
    private cookieAcceptButton = '#sp-cc-accept';
    private searchInput = 'input[name="field-keywords"]';
    private searchButton = 'input[type="submit"]';
    private loginButton = '#nav-link-accountList';
    private adressButton = '#nav-global-location-popover-link';
    private postalCodeInput = '#GLUXZipUpdateInput'
    private actualiserButton = 'input.a-button-input[aria-labelledby="GLUXZipUpdate-announce"]';
    private menuButton = '#nav-hamburger-menu';
    


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

    async Changeadress(postalCode: string){
        await this.page.click(this.adressButton);
        await this.page.fill(this.postalCodeInput, postalCode);
        await this.page.click(this.actualiserButton);

    }

    async MenuButton(){
        await this.page.click(this.menuButton);
    }
}

export default AmazonHomePage;

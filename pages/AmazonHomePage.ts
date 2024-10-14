// pages/AmazonHomePage.ts
import { Page } from '@playwright/test';

class AmazonHomePage {
    private page: Page;
    private cookieAcceptButton = '#sp-cc-accept';
    private searchInput = 'input[name="field-keywords"]';
    private searchButton = 'input[type="submit"]';

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
}

export default AmazonHomePage;

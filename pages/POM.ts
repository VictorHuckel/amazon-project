import { Page, Locator } from '@playwright/test';

export class AmazonHomePage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#twotabsearchtextbox');
        this.searchButton = page.locator('input[type="submit"][value="Go"]');
        this.cartButton = page.locator('#nav-cart');
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com');
    }

    async searchForItem(item: string) {
        await this.searchInput.fill(item);
        await this.searchButton.click();
    }

    async goToCart() {
        await this.cartButton.click();
    }
}
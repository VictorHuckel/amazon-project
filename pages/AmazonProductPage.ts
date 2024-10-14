// pages/AmazonProductPage.ts
import { Page } from '@playwright/test';

class AmazonProductPage {
    private page: Page;
    private buyNowButton = '#buy-now-button';
    private addToCartButton = '#add-to-cart-button';

    constructor(page: Page) {
        this.page = page;
    }

    async clickBuyNow() {
        await this.page.click(this.buyNowButton);
    }

    async addToCart() {
        await this.page.click(this.addToCartButton);
    }
}

export default AmazonProductPage;

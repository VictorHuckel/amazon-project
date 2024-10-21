// pages/AmazonCheckoutPage.ts
import { Page, Locator, expect } from '@playwright/test';

class AmazonCheckoutPage {
    private page: Page;
    private emailInput = 'input[name="email"]';
    private continueButton = 'text=Continuer';
    private passwordInput = 'input[name="password"]';
    private loginButton = 'input[type="submit"]';

    constructor(page: Page) {
        this.page = page;
    }

    async enterEmail(email: string) {
        await this.page.fill(this.emailInput, email);
    }

    async clickContinue() {
        await this.page.click(this.continueButton);
    }

    async enterPassword(password: string) {
        await this.page.fill(this.passwordInput, password);
    }

    async clickLogin() {
        await this.page.click(this.loginButton);
    }
}

export default AmazonCheckoutPage;

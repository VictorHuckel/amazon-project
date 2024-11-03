import { Page, Locator, expect } from '@playwright/test';

export class AmazonSignInPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com/ap/signin');
    }

    async enterEmail(email: string, p0: { timeout: number; }) {
        await this.page.fill('#ap_email', email);
    }

    async clickContinue() {
        await this.page.click('#continue');
    }

    async enterPassword(password: string, p0: { timeout: number; }) {
        await this.page.fill('#ap_password', password);
    }

    async clickSignIn() {
        await this.page.click('#signInSubmit');
    }

    async signIn(email: string, password: string) {
        await this.enterEmail(email, { timeout: 5000 });
        await this.clickContinue();
        await this.enterPassword(password, { timeout: 5000 });
        await this.clickSignIn();
    }
}
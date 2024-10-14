import { Page } from '@playwright/test';

export class AmazonSignUpPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.amazon.com/ap/register');
    }

    async fillSignUpForm(name: string, email: string, password: string) {
        await this.page.fill('input[name="customerName"]', name);
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="password"]', password);
        await this.page.fill('input[name="passwordCheck"]', password);
    }

    async submitForm() {
        await this.page.click('input#continue');
    }

    async signUp(name: string, email: string, password: string) {
        await this.navigate();
        await this.fillSignUpForm(name, email, password);
        await this.submitForm();
    }
}
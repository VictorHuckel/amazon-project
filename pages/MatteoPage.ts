// pages/amazon.page.ts

import { Page } from '@playwright/test';

export class AmazonPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('https://www.amazon.fr');
        
        // Attendre et accepter les cookies si le bandeau apparaît
        const acceptCookiesButton = this.page.locator('button[data-a-button-type="accept"]');
        if (await acceptCookiesButton.isVisible()) {
            await acceptCookiesButton.click();
        }
    }

    async searchProduct(productName: string) {
        await this.page.fill('input[name="field-keywords"]', productName);
        await this.page.click('#nav-search-submit-button'); // ID du bouton de recherche
    }

    async selectProduct() {
        await this.page.click('.s-main-slot .s-result-item h2 a'); // Sélectionne le premier produit
    }

    async addToCart() {
        await this.page.click('#add-to-cart-button');
    }

    async goToCart() {
        await this.page.click('#nav-cart');
    }

    async removeProductFromCart() {
        // Attendre que le bouton pour supprimer le produit soit visible
        const deleteButton = this.page.locator('input[name="submit.delete"], .sc-action-delete'); // Vérifier le sélecteur
        await deleteButton.waitFor({ state: 'visible' }); // Attendre que le bouton soit visible
        
        // Cliquez sur le bouton de suppression, en utilisant un clic forcé si nécessaire
        await deleteButton.click({ force: true });
        
        // Attendre que la modal de confirmation apparaisse (ajuste le sélecteur si nécessaire)
        const confirmButton = this.page.locator('.a-popover-footer .a-button-input'); // Vérifier le sélecteur pour le bouton de confirmation
        await confirmButton.waitFor({ state: 'visible' });
        
        // Cliquer sur le bouton de confirmation
        await confirmButton.click();
    }

    async navigateToCategory(category: string) {
        await this.page.click(`text=${category}`); // Clique sur la catégorie
    }

    async changeProductQuantity(quantity: number) {
        await this.page.selectOption('select[name="quantity"]', String(quantity));
    }
}

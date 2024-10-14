// pages/AmazonPanier.ts
import { Page } from '@playwright/test';

class AmazonPanier {
    private page: Page;
    private cartIcon = '.nav-cart-icon'; // Sélecteur pour l'icône du panier
    private removeButton = '.sc-action-delete'; // Sélecteur pour le bouton de suppression du produit
    private cartCountSelector = '#nav-cart-count'; // Sélecteur pour le nombre d'articles dans le panier

    constructor(page: Page) {
        this.page = page;
    }

    async goToCart() {
        await this.page.click(this.cartIcon); // Cliquer sur l'icône du panier pour accéder au panier
    }

    async removeProductFromCart() {
        await this.page.waitForSelector(this.removeButton); // Attendre que le bouton soit visible
        await this.page.click(this.removeButton); // Cliquer sur le bouton de suppression
    }

    async isProductRemoved() {
        // Vérifier que le produit a été retiré avec succès
        await this.page.waitForSelector('.a-size-medium.a-color-base.sc-product-title', { state: 'hidden' });
    }

    async getCartCount() {
        // Obtenir le nombre d'articles dans le panier
        const countText = await this.page.textContent(this.cartCountSelector);
        return parseInt(countText) || 0; // Retourner 0 si le texte ne peut pas être converti en nombre
    }

    async waitForCartCount(expectedCount: number) {
        // Attendre que le nombre d'articles dans le panier atteigne le nombre attendu
        await this.page.waitForFunction(
            (expected) => document.querySelector('#nav-cart-count')?.textContent === expected.toString(),
            expectedCount
        );
    }
}

export default AmazonPanier;

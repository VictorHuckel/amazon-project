// pages/AmazonPanier.ts
import { Page } from '@playwright/test';

class AmazonPanier {
    private page: Page;
    private cartIcon = '.nav-cart-icon'; // Sélecteur pour l'icône du panier
    private removeButton = '.sc-action-delete'; // Sélecteur pour le bouton de suppression du produit
    private emptyCartMessageSelector = 'h2.a-size-extra-large.a-spacing-mini.a-spacing-top-base.a-text-normal'; // Sélecteur pour le message panier vide

    constructor(page: Page) {
        this.page = page;
    }

    async goToCart() {
       
        await this.page.click(this.cartIcon); // Cliquer sur l'icône du panier pour accéder au panier
    }
    
    async removeProductFromCart() {
        await this.page.waitForSelector('input.a-color-link[data-action="delete"]', { state: 'visible' }); // Attendre que le bouton soit visible
        await this.page.click('input.a-color-link[data-action="delete"]', { force: true }); // Cliquer sur le bouton de suppression
    }
    
    async isProductRemoved() {
        // Attendre que le produit soit masqué
        await this.page.waitForSelector('.a-size-medium.a-color-base.sc-product-title', { state: 'hidden' });
    }

    async isCartEmpty() {
        // Vérifier que le message "Votre panier Amazon est vide." s'affiche
        const emptyMessage = 'Votre panier Amazon est vide.';
        await this.page.waitForSelector(this.emptyCartMessageSelector);
        const messageText = await this.page.textContent(this.emptyCartMessageSelector);
        return messageText?.trim() === emptyMessage;
    }
}

export default AmazonPanier;

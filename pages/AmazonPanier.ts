// pages/AmazonPanier.ts
import { Page, Locator, expect } from '@playwright/test';

class AmazonPanier {
    removeAllProductsFromCart() {
        throw new Error('Method not implemented.');
    }
    async changeProductQuantity(quantity: number) {
        await this.page.selectOption('select[name="quantity"]', quantity.toString());
    }

    getSelectedQuantity() {
        throw new Error('Method not implemented.');
    }
    
    getCartItems() {
        throw new Error('Method not implemented.');
    }
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
        // Sélecteur pour le message qui s'affiche lorsque le panier est vide
        const emptyCartMessageSelector = 'h2.a-size-extra-large.a-spacing-mini.a-spacing-top-base.a-text-normal';
    
        // Attendre que l'élément soit visible
        try {
            await this.page.waitForSelector(emptyCartMessageSelector, { timeout: 5000 });
            const messageText = await this.page.textContent(emptyCartMessageSelector);
    
            // Vérifier si le texte correspond au message indiquant que le panier est vide
            return messageText?.trim() === 'Votre panier Amazon est vide.';
        } catch (e) {
            // Si le sélecteur n'est pas trouvé, cela signifie que le panier n'est pas vide
            return false;
        }
    }
    
}

export default AmazonPanier;

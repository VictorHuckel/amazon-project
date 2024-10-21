// pages/AmazonPanier.ts
import { Page, Locator, expect } from '@playwright/test';

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
        // Sélecteur du sous-total des articles dans le panier
        const cartSubtotalSelector = '#sc-subtotal-label-activecart';
    
        // Attendre que l'élément du sous-total soit visible
        await this.page.waitForSelector(cartSubtotalSelector);
    
        // Récupérer le texte du sous-total
        const subtotalText = await this.page.textContent(cartSubtotalSelector);
    
        // Vérifier si le sous-total indique "0 articles"
        const isEmpty = subtotalText?.includes('Sous-total (0 articles)');
        
        return isEmpty;
    }
}

export default AmazonPanier;

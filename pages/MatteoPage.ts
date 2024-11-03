// pages/amazon.page.ts

import { Page } from '@playwright/test';

export class AmazonPage {
    acceptCookies() {
        throw new Error('Method not implemented.');
    }
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('https://www.amazon.fr');

        // Attendre que le bouton d'acceptation des cookies soit présent
        const acceptCookiesButton = this.page.locator('button[data-a-button-type="accept"]');
        
        try {
            // Attendre que le bouton d'acceptation des cookies soit visible (maximum 5 secondes)
            await acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });

            // Faire défiler la page pour s'assurer que le bouton est dans le champ de vision
            await acceptCookiesButton.scrollIntoViewIfNeeded();


            // Vérifier si le bouton est visible avant de cliquer
            if (await acceptCookiesButton.isVisible()) {
                await acceptCookiesButton.click({ force: true });
            }
        } catch (error) {
            console.log("Le bouton d'acceptation des cookies n'est pas visible ou a déjà été accepté.");

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
        // Attendre que la page du panier se charge
        await this.page.waitForTimeout(2000); // Ajuster le délai si nécessaire
    }

    async removeProductFromCart() {
        // Attendre que les produits du panier soient visibles
        const cartItem = this.page.locator('.sc-product-title');
        await cartItem.waitFor({ state: 'visible', timeout: 5000 });
        
        // Cliquer sur le bouton de suppression
        const deleteButton = this.page.locator('.sc-action-delete');
        await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
        
        // Si le bouton est visible, le cliquer
        if (await deleteButton.isVisible()) {
            await deleteButton.click({ force: true });
        }

        // Vérifier si une modal de confirmation apparaît
        const confirmButton = this.page.locator('.a-button-input[name="submit.delete"]');
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            console.log("Aucune modal de confirmation trouvée.");
        });

        // Si la modal est visible, cliquer sur le bouton de confirmation
        if (await confirmButton.isVisible()) {
            await confirmButton.click();
        }
    }
    async navigateToCategory(category: string) {
        await this.page.click(`text=${category}`); // Clique sur la catégorie
    }

    async changeProductQuantity(quantity: number) {
        await this.page.selectOption('select[name="quantity"]', String(quantity));
    }

    async removeAllProductsFromCart() {
        await this.goToCart();
        
        // Sélecteur pour les éléments du panier
        const cartItems = this.page.locator('.sc-product-title');

        // Vérifier s'il y a des produits dans le panier
        const count = await cartItems.count();
        if (count === 0) {
            console.log("Le panier est déjà vide.");
            return;
        }

        // Boucle pour supprimer tous les produits du panier
        for (let i = 0; i < count; i++) {
            // Attendre que l'élément soit visible
            await cartItems.nth(i).waitFor({ state: 'visible', timeout: 5000 });

            // Trouver le bouton de suppression
            const deleteButton = this.page.locator('.sc-action-delete').nth(i);
            await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
            
            // Cliquer sur le bouton de suppression
            if (await deleteButton.isVisible()) {
                await deleteButton.click({ force: true });
                console.log(`Produit ${i + 1} supprimé du panier.`);
            }

            // Attendre que la modal de confirmation soit visible (si elle apparaît)
            const confirmButton = this.page.locator('.a-button-input[name="submit.delete"]');
            await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
                console.log("Aucune modal de confirmation trouvée pour le produit.");
            });

            // Cliquer sur le bouton de confirmation si visible
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
                console.log(`Confirmation de la suppression du produit ${i + 1}.`);
            }

            // Attendre que le panier se mette à jour
            await this.page.waitForTimeout(2000); // Ajuster le délai si nécessaire
        }

        console.log("Tous les produits ont été supprimés du panier.");
    }
}


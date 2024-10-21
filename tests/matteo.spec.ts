// tests/amazon.test.ts

import { test, expect } from '@playwright/test';
import { AmazonPage } from '../pages/MatteoPage';

test.describe('Tests Amazon', () => {
    let amazonPage: AmazonPage;

    test.beforeEach(async ({ page }) => {
        // Initialiser la page Amazon
        amazonPage = new AmazonPage(page);
        await amazonPage.goto();
    });

    test('Rechercher un produit dans le moteur de recherche puis l’acheter', async ({ page }) => {
        // Given Je suis sur la page d'accueil
        // (Déjà fait dans beforeEach)

        // When Je saisis le nom d'un produit dans le moteur de recherche
        await amazonPage.searchProduct('lego');

        // Then Je vois les résultats de recherche
        await expect(page).toHaveURL(/.*field-keywords/);

        // When Je clique sur un produit
        await amazonPage.selectProduct();

        // When Je l'ajoute au panier
        await amazonPage.addToCart();

        // Then Le produit est dans mon panier
        await amazonPage.goToCart();
    });

    test('Rechercher un produit par catégorie', async ({ page }) => {
        // Given Je suis sur la page d'accueil
        // (Déjà fait dans beforeEach)

        // When Je navigue vers une catégorie de produits
        await amazonPage.navigateToCategory('Électronique');

        // Then Les produits de cette catégorie sont affichés
        const productsDisplayed = await page.locator('.s-main-slot .s-result-item').count();
        expect(productsDisplayed).toBeGreaterThan(0); // Vérifie qu'il y a des produits affichés
    });

    test('Mettre un produit dans le panier', async ({ page }) => {
        // Given Je suis sur la page d'un produit
        await amazonPage.goto();
        await amazonPage.searchProduct('lego');
        await amazonPage.selectProduct();

        // When Je clique sur "Ajouter au panier"
        await amazonPage.addToCart();

        // Then Le produit est ajouté dans mon panier
        await amazonPage.goToCart();
        // Vérifie que le produit est dans le panier
        const cartItems = await page.locator('.sc-product-title').allTextContents();
        expect(cartItems).toContain('lego');
    });

    test('Vérifier les quantités de produit dans le panier', async ({ page }) => {
        // Given J'ai un produit dans mon panier
        await amazonPage.goto();
        await amazonPage.searchProduct('lego');
        await amazonPage.selectProduct();
        await amazonPage.addToCart();
        await amazonPage.goToCart();

        // When Je vais sur la page du panier
        // (Déjà fait)

        // Then Je peux modifier la quantité du produit
        await amazonPage.changeProductQuantity(2);
        const selectedQuantity = await page.locator('select[name="quantity"]').inputValue();
        expect(selectedQuantity).toBe('2'); // Vérifie que la quantité a été mise à jour
    });
    
    test('Supprimer un produit du panier', async ({ page }) => {
      // Given Je suis sur la page d'accueil
      // (Déjà fait dans beforeEach)

      // When Je recherche un produit
      await amazonPage.searchProduct('ordinateur portable');
      await amazonPage.selectProduct();

      // When Je l'ajoute au panier
      await amazonPage.addToCart();

      // Then Le produit est dans mon panier
      await amazonPage.goToCart();
      const cartItemsBeforeRemoval = await page.locator('.sc-product-title').count();
      expect(cartItemsBeforeRemoval).toBeGreaterThan(0); // Vérifie qu'il y a au moins un produit

      // When Je supprime le produit du panier
      await amazonPage.removeProductFromCart();

      // Then Le panier est vide ou ne contient pas le produit
      const cartItemsAfterRemoval = await page.locator('.sc-product-title').count();
      expect(cartItemsAfterRemoval).toBe(0); // Vérifie que le panier est vide
  });
});












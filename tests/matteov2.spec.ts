// tests/amazon.test.ts

import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import AmazonPanier from '../pages/AmazonPanier';
import AmazonCategoryPage from '../pages/AmazonCategoryPage';
import { AmazonSignInPage } from '../pages/AmazonSignInPage';

test.describe('Tests Amazon', () => {

    test('Rechercher un produit et l’acheter', async ({ page }) => {
        const homePage = new AmazonHomePage(page);
        const searchResultsPage = new AmazonSearchResultsPage(page);
        const productPage = new AmazonProductPage(page);
        const checkoutPage = new AmazonCheckoutPage(page);
        const signInPage = new AmazonSignInPage(page);

        await page.goto('https://www.amazon.fr/');
        await homePage.acceptCookies();

        await homePage.searchForProduct('iphone 16');
        await searchResultsPage.selectFirstProduct();
        await productPage.clickBuyNow();

        await signInPage.enterEmail('votre.email@example.com', { timeout: 5000 });
        await signInPage.clickContinue();
        await signInPage.enterPassword('votreMotDePasse', { timeout: 5000 }); // ou attendez avant de remplir

        await signInPage.clickSignIn();

        await checkoutPage.verifyCheckoutPage();
    });

    test('Rechercher un produit par catégorie', async ({ page }) => {
        const homePage = new AmazonHomePage(page);
        const categoryPage = new AmazonCategoryPage(page);

        await page.goto('https://www.amazon.fr/');
        await homePage.acceptCookies();

        await homePage.navigateToCategory('Électronique');

        const productsDisplayed = await categoryPage.getProductCount();
        expect(productsDisplayed).toBeGreaterThan(0);
    });

    test('Ajouter un produit au panier', async ({ page }) => {
        const homePage = new AmazonHomePage(page);
        const searchResultsPage = new AmazonSearchResultsPage(page);
        const productPage = new AmazonProductPage(page);
        const panier = new AmazonPanier(page);

        await page.goto('https://www.amazon.fr/');
        await homePage.acceptCookies();

        await homePage.searchForProduct('iphone 16');
        await searchResultsPage.selectFirstProduct();
        await productPage.addToCart();

        await panier.goToCart();
        const cartItems = await panier.getCartItems();
        expect(cartItems).toContain('iphone 16');
    });

    test('Vérifier les quantités de produit dans le panier', async ({ page }) => {
        const homePage = new AmazonHomePage(page);
        const searchResultsPage = new AmazonSearchResultsPage(page);
        const productPage = new AmazonProductPage(page);
        const panier = new AmazonPanier(page);

        await page.goto('https://www.amazon.fr/');
        await homePage.acceptCookies();

        await homePage.searchForProduct('iphone 16');
        await searchResultsPage.selectFirstProduct();
        await productPage.addToCart();
        await panier.goToCart();

        await panier.changeProductQuantity(2);
        const selectedQuantity = await panier.getSelectedQuantity();
        expect(selectedQuantity).toBe('2');
    });

    test('Supprimer un produit du panier', async ({ page }) => {
        const homePage = new AmazonHomePage(page);
        const searchResultsPage = new AmazonSearchResultsPage(page);
        const productPage = new AmazonProductPage(page);
        const panier = new AmazonPanier(page);

        await page.goto('https://www.amazon.fr/');
        await homePage.acceptCookies();

        await homePage.searchForProduct('iphone 16');
        await searchResultsPage.selectFirstProduct();
        await productPage.addToCart();
        await panier.goToCart();

        await panier.removeProductFromCart();
        const cartItemsAfterRemoval = await panier.getCartItems();
        expect(cartItemsAfterRemoval).toBe(0);
    });

   
});

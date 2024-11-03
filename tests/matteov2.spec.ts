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

        await signInPage.enterEmail('augustinf59@gmail.com');
        await signInPage.clickContinue();
        await signInPage.enterPassword('Bertille1;'); // ou attendez avant de remplir

    
    });

    test('Mettre un produit de côté', async ({ page }) => {
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
        await page.locator('input[value="Mettre de côté"]').click();


        
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
        
    });

    test('Changer les quantités du panier', async ({ page }) => {
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

        await panier.changeProductQuantity(5);
        
    });

    

   
});

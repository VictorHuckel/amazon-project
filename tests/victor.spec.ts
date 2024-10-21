import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import AmazonPanier from '../pages/AmazonPanier';
import AmazonCategoryPage from '../pages/AmazonCategoryPage'; // Adjust the path if necessary
import { AmazonSignInPage } from '../pages/AmazonSignInPage'; // Add this import

test('Passer une commande avec un login pendant le checkout', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const checkoutPage = new AmazonCheckoutPage(page);
    const signInPage = new AmazonSignInPage(page); // Ajouter la page de connexion
    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await homePage.searchForProduct('iphone 16');
    await searchResultsPage.selectFirstProduct();
    await productPage.clickBuyNow(); // Utiliser la méthode pour cliquer sur "Acheter"

    // Se connecter pendant le processus de checkout
    await signInPage.enterEmail('augustinf59@gmail.com');
    await signInPage.clickContinue();
    await signInPage.enterPassword('Bertille1;');
    await signInPage.clickSignIn();


});


test('Ajouter un produit au panierle supprimer et vérifier que le panier est vide', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const panier = new AmazonPanier(page);

    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await homePage.searchForProduct('iphone 16');
    await searchResultsPage.selectFirstProduct();
    await productPage.addToCart(); // On suppose que vous avez une méthode pour ajouter au panier

    // Aller au panier
    await panier.goToCart();

    // Supprimer un produit du panier
    await panier.removeProductFromCart();
    

    // Vérifier que le produit a été supprimé avec succès
    await panier.isProductRemoved();

    // Vérifier que le message "Votre panier Amazon est vide." s'affiche
    const isCartEmpty = await panier.isCartEmpty();

});

test('Filtrer les PC portables sur Amazon avec des critères spécifiques', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const categoryPage = new AmazonCategoryPage(page); // Utiliser la page de catégorie pour appliquer les filtres

    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Rechercher "PC portable"
    await homePage.searchForProduct('PC portable');

    // Attendre que les résultats de recherche apparaissent
    await searchResultsPage.waitForResults();
    await page.waitForTimeout(5000); // Ajustez le temps d'attente selon le besoin

    // Appliquer les filtres spécifiques :
    await categoryPage.applyFilterByLabel('Marques', 'Lenovo');  // Filtrer par Marque: Lenovo
    await page.waitForLoadState('networkidle'); // Attendre que les résultats se mettent à jour
});

test('acheter les produits fréquemment achetés ensemble', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    
    
    await page.goto('https://www.amazon.fr');
    await homePage.acceptCookies();
    await homePage.searchForProduct('souris');
    await searchResultsPage.selectFirstProduct();
    await page.locator('#similarities-product-bundle-widget-title').scrollIntoViewIfNeeded();
    await page.click('input[name="submit.addToCart"]');
    await page.click('input[name="proceedToRetailCheckout"]');
    
    





});

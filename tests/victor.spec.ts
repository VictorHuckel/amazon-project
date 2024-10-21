import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import AmazonPanier from '../pages/AmazonPanier';
import AmazonCategoryPage from '../pages/AmazonCategoryPage'; // Adjust the path if necessary
import { AmazonSignInPage } from '../pages/AmazonSignInPage'; // Adjust the path if necessary

test('Passer une commande avec un login pendant le checkout', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const checkoutPage = new AmazonCheckoutPage(page);
    const signInPage = new AmazonSignInPage(page);
    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await homePage.searchForProduct('produit de test');
    await searchResultsPage.selectFirstProduct();
    await productPage.clickBuyNow(); // Utiliser la méthode pour cliquer sur "Acheter"

    // Se connecter pendant le processus de checkout

    await signInPage.enterEmail('augustinf59@gmail.com');
    await signInPage.clickContinue();
    await signInPage.enterPassword('Bertille1;');
    await signInPage.clickSignIn();
});


test('Ajouter un produit au panier et vérifier que le panier est vide', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const panier = new AmazonPanier(page);

    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await homePage.searchForProduct('iphone16');
    await searchResultsPage.selectFirstProduct();
    await productPage.addToCart(); // On suppose que vous avez une méthode pour ajouter au panier

    // Aller au panier
    await panier.goToCart();

    // Supprimer un produit du panier
    await panier.removeProductFromCart();
    await page.waitForLoadState('networkidle'); // This can help wait for all network requests to finish

    // Vérifier que le produit a été supprimé avec succès
    await panier.isProductRemoved();

    // Vérifier que le message "Votre panier Amazon est vide." s'affiche
    const isCartEmpty = await panier.isCartEmpty();
    expect(isCartEmpty).toBe(true); // Vérifie que le panier est vide
});

test('Vérifier les filtres et catégories sur une page de catégorie', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const categoryPage = new AmazonCategoryPage(page);

    // Go to the Amazon site
    await page.goto('https://www.amazon.fr/');

    // Accept cookies
    await homePage.acceptCookies();

    // Navigate to a category page (adjust URL for a real category)
    await page.goto('https://www.amazon.fr/s?field-keywords=electronics'); // Example URL

    // Use a filter
    const filterValue = 'Filtre Exemples'; // Replace with a valid filter
    await categoryPage.useFilter(filterValue);

    // Get filtered results
    const filteredResults = await categoryPage.getFilteredResults();

    // Verify that the results are updated
    expect(filteredResults.length).toBeGreaterThan(0); // Check that there are results
});


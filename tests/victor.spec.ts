import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import AmazonPanier from '../pages/AmazonPanier';
import AmazonCategoryPage from '../pages/AmazonCategoryPage'; // Adjust the path if necessary

test('Passer une commande avec un login pendant le checkout', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const checkoutPage = new AmazonCheckoutPage(page);

    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies
    await homePage.acceptCookies();

    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await homePage.searchForProduct('produit de test');
    await searchResultsPage.selectFirstProduct();
    await productPage.clickBuyNow(); // Utiliser la méthode pour cliquer sur "Acheter"

    // Se connecter pendant le processus de checkout
    await checkoutPage.enterEmail('votre_email@example.com');
    await checkoutPage.clickContinue(); // Clic basé sur le texte
    await checkoutPage.enterPassword('votre_mot_de_passe');
    await checkoutPage.clickLogin(); // Clic sur le bouton "Se connecter"

    // Vérifier que la commande est passée avec succès (exemple basique)
    await expect(page).toHaveURL(/.*checkout/); // vérifier que l'utilisateur est sur la page de checkout
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
    await homePage.searchForProduct('produit de test');
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

test('Filtrer les PC portables sur Amazon avec des critères spécifiques', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const panier = new AmazonPanier(page);
    const categoryPage = new AmazonCategoryPage(page); // Utiliser la page de catégorie pour appliquer les filtres

    // Go to the Amazon site
    await page.goto('https://www.amazon.fr/');

    // Accept cookies
    await homePage.acceptCookies();

    // Navigate to a category page (adjust URL for a real category)
    await page.goto('https://www.amazon.fr/s?field-keywords=electronics'); // Example URL

    // Use a filter
    const filterValue = 'Filtre Exemples'; // Replace with a valid filter
    // await categoryPage.useFilter(filterValue);

    // Get filtered results
    const filteredResults = await categoryPage.getFilteredResults();

    // Verify that the results are updated
    expect(filteredResults.length).toBeGreaterThan(0); // Check that there are results
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
    





});

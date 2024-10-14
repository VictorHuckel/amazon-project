import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';

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
import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';

test('Rechercher un produit dans le moteur de recherche puis l’acheter sur Amazon', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const searchResultsPage = new AmazonSearchResultsPage(page);
  const productPage = new AmazonProductPage(page);
  const checkoutPage = new AmazonCheckoutPage(page);
  // Aller sur le site Amazon
  await page.goto('https://www.amazon.fr/');
  // Accepter les cookies
  await homePage.acceptCookies();

  // When: Je saisis le nom d'un produit dans le moteur de recherche
  await page.fill('input#twotabsearchtextbox', 'ordinateur portable'); // Remplacez par le nom du produit

  // And: Je clique sur le bouton "Rechercher"
  await page.click('input#nav-search-submit-button');

  // Then: Je vois les résultats de recherche
  await expect(page).toHaveURL(/s/); // Vérifie si la page des résultats de recherche est affichée

  // When: Je clique sur un produit (prend le premier produit de la liste)
  await page.click('span.a-size-medium.a-color-base.a-text-normal'); // Sélecteur pour le titre du produit

  // Then: J'attends que la page du produit soit visible
  await page.waitForSelector('#productTitle');
  
  // And: Je l'ajoute au panier
  await page.click('#add-to-cart-button'); // Bouton pour ajouter au panier

  // Then: Le produit est dans mon panier
  await page.click('a#nav-cart'); // Clic sur le panier
  const cartProduct = await page.textContent('.sc-list-item-content span.a-truncate-cut'); // Vérifie le nom du produit dans le panier
  expect(cartProduct).toContain('ordinateur'); // Vérifie que le bon produit est dans le panier
});


test('Rechercher un produit par catégorie sur Amazon', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const searchResultsPage = new AmazonSearchResultsPage(page);
  const productPage = new AmazonProductPage(page);
  const checkoutPage = new AmazonCheckoutPage(page);
  // Aller sur le site Amazon
  await page.goto('https://www.amazon.fr/');
  // Accepter les cookies
  await homePage.acceptCookies();

  // When: Je navigue vers une catégorie de produits
  await page.click('a#nav-hamburger-menu'); // Sélecteur pour ouvrir le menu "Toutes les catégories"
  
  // Attendre que le menu soit visible
  await page.waitForSelector('ul.hmenu-visible'); // Attendre que le menu des catégories soit visible

  // Clic sur la section "Informatique" (data-menu-id peut changer en fonction de la région)
  await page.click('a[data-menu-id="5"]'); 

  // Attendre que le sous-menu de la catégorie soit visible
  await page.waitForSelector('ul.hmenu-visible');

  // Then: Je clique sur une sous-catégorie, ici "Ordinateurs portables"
  await page.click('a[href*="b?node=429882031"]'); // Vérifie et ajuste ce sélecteur si nécessaire

  // Then: Les produits de cette catégorie sont affichés
  await expect(page).toHaveURL(/node=429882031/); // Vérifie que la page de la sous-catégorie est bien chargée

  // Vérification que la liste des produits est affichée
  const categoryTitle = await page.textContent('span[class*="a-size-base a-color-base"]');
  expect(categoryTitle).toContain('Ordinateurs portables'); // Vérifie que le bon titre de catégorie est affiché
});




test('Mettre un produit dans le panier sur Amazon avec gestion des cookies', async ({ page }) => {
  // Given: Je suis sur la page d'un produit
  await page.goto('https://www.amazon.fr/dp/B08CFSZLQ4'); // Remplace par l'URL d'un produit spécifique

  // Vérifie si la demande d'activation des cookies apparaît, et la gère
  const acceptCookiesPopup = await page.$('h4.a-alert-heading');
  if (acceptCookiesPopup) {
    // Attendre que le bouton "Continuer" soit visible et cliquer dessus pour activer les cookies
    await page.waitForSelector('input[name="accept"]');
    await page.click('input[name="accept"]');
  }

  // When: Je clique sur "Ajouter au panier"
  await page.waitForSelector('#add-to-cart-button'); // Attendre que le bouton soit visible
  await page.click('#add-to-cart-button'); // Sélecteur du bouton "Ajouter au panier"

  // Then: Le produit est ajouté dans mon panier
  await page.waitForSelector('#nav-cart-count'); // Attendre que l'icône du panier soit mise à jour
  const cartCount = await page.textContent('#nav-cart-count'); // Obtenir le nombre d'articles dans le panier
  expect(parseInt(cartCount)).toBeGreaterThan(0); // Vérifie que le produit a bien été ajouté
});



test('Supprimer un produit du panier sur Amazon avec gestion des fenêtres modales et clic forcé', async ({ page }) => {
  // Given: Mon panier contient des produits
  await page.goto('https://www.amazon.fr'); 

  // Acceptation des cookies (si la bannière des cookies apparaît)
  const acceptCookiesButton = await page.$('input#sp-cc-accept'); // Sélecteur du bouton "Accepter les cookies"
  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }

  // Naviguer vers la page d'un produit et l'ajouter au panier
  await page.goto('https://www.amazon.fr/dp/B08CFSZLQ4'); // URL d'un produit spécifique
  await page.click('#add-to-cart-button'); // Ajouter au panier
  await page.waitForSelector('#nav-cart-count'); // Vérifier que l'icône du panier est mise à jour

  // Gérer toutes les fenêtres modales possibles après l'ajout au panier
  const modalSelectors = [
    'input[name="proceedToRetailCheckout"]', // "Continuer sans protection"
    'input[name="attachSiNoCoverage"]', // "Non merci"
    'button[data-action="a-popover-close"]' // Bouton pour fermer les popovers
  ];

  for (const selector of modalSelectors) {
    const modal = await page.$(selector);
    if (modal) {
      await modal.click(); // Fermer la modale si elle est présente
    }
  }

  // When: Je navigue vers le panier
  try {
    await page.click('a#nav-cart'); // Clic sur l'icône du panier
  } catch (e) {
    // Forcer le clic sur le panier si la fenêtre modale bloque encore l'accès
    await page.evaluate(() => {
      document.querySelector('a#nav-cart').click();
    });
  }

  // Vérifier qu'il y a bien des produits dans le panier
  const cartCountBefore = await page.textContent('#nav-cart-count');
  expect(parseInt(cartCountBefore)).toBeGreaterThan(0); // Le panier ne doit pas être vide

  // When: Je supprime un produit du panier
  await page.click('input[value="Supprimer"]'); // Sélecteur pour le bouton "Supprimer" du produit

  // Then: Le produit est supprimé avec succès
  await page.waitForTimeout(1000); // Attendre un peu pour la mise à jour
  const cartCountAfter = await page.textContent('#nav-cart-count');
  expect(parseInt(cartCountAfter)).toBeLessThan(parseInt(cartCountBefore)); // Le nombre de produits doit diminuer
});

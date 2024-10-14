import { test, expect } from '@playwright/test';

test('Rechercher un produit dans le moteur de recherche puis l’acheter sur Amazon', async ({ page }) => {
  // Given: Je suis sur la page d'accueil d'Amazon
  await page.goto('https://www.amazon.fr'); 
    // Acceptation des cookies (si la bannière des cookies apparaît)
  const acceptCookiesButton = await page.$('input#sp-cc-accept'); // Sélecteur du bouton "Accepter les cookies"
  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }

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
  // Given: Je suis sur la page d'accueil d'Amazon
  await page.goto('https://www.amazon.fr'); 

  // Acceptation des cookies (si la bannière des cookies apparaît)
  const acceptCookiesButton = await page.$('input#sp-cc-accept'); // Sélecteur du bouton "Accepter les cookies"
  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
  }

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

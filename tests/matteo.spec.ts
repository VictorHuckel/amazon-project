import { test, expect } from '@playwright/test';

//  Scenario: Rechercher un produit dans le moteur de recherche puis l’acheter
//    Given Je suis sur la page d'accueil
//When Je saisis le nom d'un produit dans le moteur de recherche
//And Je clique sur le bouton "Rechercher"
//Then Je vois les résultats de recherche
//When Je clique sur un produit
//And Je l'ajoute au panier
//Then Le produit est dans mon panier

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

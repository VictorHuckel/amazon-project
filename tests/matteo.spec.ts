import { test, expect } from './fixture';
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

/*test('Recherche un produit par catégorie sur Amazon', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  await page.goto('https://www.amazon.fr');
  // Accepter les cookies
  await homePage.acceptCookies();
  
  // Remplacez 'Electronics' et 'headphones' par la catégorie et le produit de votre choix
  await homePage.searchProductByCategory('Electronics', 'headphones');

  // Vérifiez que des résultats sont affichés
  const resultsSelector = 'div.s-main-slot';
  await page.waitForSelector(resultsSelector);
  const results = await page.locator(resultsSelector).count();
  console.log(`Nombre de résultats trouvés: ${results}`);
  
  // Ajoutez des assertions selon vos besoins
});
*/



test('Mettre un produit dans le panier sur Amazon avec gestion des cookies', async ({ page }) => {
  // Given: Je suis sur la page d'un produit
  await page.goto('https://www.amazon.fr/SKYJO-Magilano-divertir-amusantes-famille/dp/B06XZ9K244/ref=zg_bs_c_boost_d_sccl_1/259-8320578-2294812?pd_rd_w=7ZLt4&content-id=amzn1.sym.dd85b726-57e2-4c6c-b501-f81d1824a55a&pf_rd_p=dd85b726-57e2-4c6c-b501-f81d1824a55a&pf_rd_r=D61ZNEZ2F29N6QJFR3W9&pd_rd_wg=VLmgZ&pd_rd_r=f30a0512-76e7-4b82-ae5b-55498100d3d9&pd_rd_i=B06XZ9K244&th=1'); // Remplace par l'URL d'un produit spécifique

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
  const homePage = new AmazonHomePage(page);
  await page.goto('https://www.amazon.fr');
  // Accepter les cookies
  await homePage.acceptCookies();

  // When: Je saisis le nom d'un produit dans le moteur de recherche
  await page.fill('input#twotabsearchtextbox', 'ordinateur portable'); // Remplacez par le nom du produit

  // And: Je clique sur le bouton "Rechercher"
  await page.click('input#nav-search-submit-button');
  
  // Then: Je vois les résultats de recherche
  await expect(page).toHaveURL(/s/); // Vérifie si la page des résultats de recherche est affichée

  // Sélectionner le premier produit de la liste
  const firstProduct = page.locator('.s-main-slot .s-result-item').first();
  await firstProduct.click();
  
  // Ajouter le produit au panier
  await homePage.addToCart();

  // Aller au panier
  await homePage.goToCart();

  // Supprimer le produit du panier
  await homePage.removeProductFromCart();

  // Vérifiez que le panier est vide ou affiche le message approprié
  const emptyCartMessage = await page.locator('.a-row.a-spacing-base .a-size-medium').innerText();
  console.log(`Message affiché : ${emptyCartMessage}`);
  if (emptyCartMessage.includes('Your Amazon Cart is empty')) {
      console.log('Le produit a été supprimé avec succès du panier.');
  } else {
      console.log('Erreur lors de la suppression du produit du panier.');
  }
});







test('Connexion à un compte Amazon', async ({ pageWithCookiesAccepted }) => {
  // Naviguer vers la page de connexion
  await pageWithCookiesAccepted.goto('https://www.amazon.fr/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.fr%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=frflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');

  // Saisir l'email ou numéro de téléphone
  await pageWithCookiesAccepted.fill('input[name="email"]', 'matteo.dugue@student.junia.com');

  // Cliquer sur "Continuer"
  await pageWithCookiesAccepted.click('input#continue');

  // Saisir le mot de passe
  await pageWithCookiesAccepted.fill('input[name="password"]', 'testtest');

  // Cliquer sur "Connexion"
  await pageWithCookiesAccepted.click('input#signInSubmit');

  // Attendre que l'utilisateur soit redirigé et vérifier la connexion réussie
  await pageWithCookiesAccepted.waitForSelector('#nav-link-accountList'); // Sélecteur d'un élément spécifique après connexion
  const accountText = await pageWithCookiesAccepted.textContent('#nav-link-accountList');
  
  // Vérifier que le texte contient une indication que l'utilisateur est connecté (par exemple, "Bonjour, Nom")
  expect(accountText).toContain('Bonjour,'); // Remplace par le texte attendu après connexion

  // Test supplémentaire : vérifier que le bouton "Déconnexion" est présent
  await pageWithCookiesAccepted.hover('#nav-link-accountList'); // Survoler le menu de compte
  await pageWithCookiesAccepted.waitForSelector('a#nav-item-signout'); // Sélecteur du bouton "Déconnexion"
  expect(await pageWithCookiesAccepted.isVisible('a#nav-item-signout')).toBeTruthy();
});




/*test('Test Amazon Search and Add to Cart', async ({ page }) => {

  // Créer une instance de la classe AmazonHomePage
  const amazonHomePage = new AmazonHomePage(page);

  // Naviguer vers Amazon
  await amazonHomePage.navigate();
  // Accepter les cookies
  await amazonHomePage.acceptCookies();

  // Rechercher un produit spécifique
  await amazonHomePage.searchForItem('livre');

  // Cliquer sur le premier produit dans la liste des résultats
  await amazonHomePage.clickOnFirstProduct();

  // Ajouter le produit au panier
  await amazonHomePage.addToCart();

  // Aller au panier et vérifier que l'URL est correcte
  await amazonHomePage.goToCart();
  await expect(page).toHaveURL('https://www.amazon.com/gp/cart/view.html');
});*/
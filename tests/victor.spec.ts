import { test, expect } from '@playwright/test';

test('Passer une commande avec un login pendant le checkout', async ({ page }) => {
    // Aller sur le site Amazon
    await page.goto('https://www.amazon.fr/');

    // Accepter les cookies (ou toute autre modalité présente)
    await page.click('#sp-cc-accept');
    // Ajouter un produit au panier (rechercher un produit et l'ajouter)
    await page.fill('input[name="field-keywords"]', 'produit de test');
    await page.click('input[type="submit"]'); // cliquer sur le bouton "Rechercher"
    await page.waitForSelector('.s-result-item'); // attendre l'apparition des résultats de recherche
    await page.click('.s-result-item'); // cliquer sur un produit dans les résultats
    
    await page.click('#buy-now-button'); // cliquer sur "Acheter"
    

    // Se connecter pendant le processus de checkout
    await page.fill('input[name="email"]', 'votre_email@example.com');
    await page.click('text=Continuer'); // Clic basé sur le texte
    await page.fill('input[name="password"]', 'votre_mot_de_passe');
    await page.click('input[type="submit"]'); // cliquer sur le bouton "Se connecter"

    // Vérifier que la commande est passée avec succès (exemple basique)
    await expect(page).toHaveURL(/.*checkout/); // vérifier que l'utilisateur est sur la page de checkout
});

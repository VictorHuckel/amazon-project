import { test as baseTest, expect, Page, BrowserContext } from '@playwright/test';

// Définition d'une fixture personnalisée
type MyFixtures = {
  pageWithCookiesAccepted: Page;
  context: BrowserContext;
};

// Utilisation de 'baseTest.extend' pour étendre la fonctionnalité de test
export const test = baseTest.extend<MyFixtures>({
  // Créer un contexte avec la gestion des cookies avant chaque test
  context: async ({ browser }, use) => {
    const context = await browser.newContext(); // Crée un nouveau contexte de navigateur
    await use(context);
    await context.close(); // Ferme le contexte après chaque test
  },

  // Créer une page où les cookies sont automatiquement acceptés
  pageWithCookiesAccepted: async ({ context }, use) => {
    const page = await context.newPage();
    // Navigue vers la page d'accueil et accepte les cookies
    await page.goto('https://www.amazon.fr');
    const acceptCookiesButton = await page.$('input#sp-cc-accept'); // Sélecteur du bouton "Accepter les cookies"
    if (acceptCookiesButton) {
      await acceptCookiesButton.click();
    }
    await use(page);
    await page.close(); // Ferme la page après le test
  }
});

// Exporter expect pour l'utiliser dans les tests
export { expect };

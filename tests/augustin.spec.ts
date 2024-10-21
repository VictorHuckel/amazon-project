import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import { AmazonSignUpPage } from '../pages/AmazonSignUpPage';
import { AmazonSignInPage } from '../pages/AmazonSignInPage';






test('Créez un compte', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const searchResultsPage = new AmazonSearchResultsPage(page);
  const productPage = new AmazonProductPage(page);
  const checkoutPage = new AmazonCheckoutPage(page);
  const signUpPage = new AmazonSignUpPage(page);

  await page.goto('https://www.amazon.fr/');
  await homePage.acceptCookies();
  await homePage.gologin();
  await page.getByText('Créer votre compte Amazon').click();
  await signUpPage.fillSignUpForm('Augustin','augustin.fernandes@student.junia.com','Legroscaca');
});

test('Se connecter', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const searchResultsPage = new AmazonSearchResultsPage(page);
  const productPage = new AmazonProductPage(page);
  const checkoutPage = new AmazonCheckoutPage(page);
  const signUpPage = new AmazonSignUpPage(page);
  const signInPage = new AmazonSignInPage(page);

  await page.goto('https://www.amazon.fr/');
  await homePage.acceptCookies();
  await homePage.gologin();
  await signInPage.enterEmail('augustinf59@gmail.com');
  await signInPage.clickContinue();
  await signInPage.enterPassword('Bertille1;');
  await signInPage.clickSignIn();








});

test('Mettre à jour les adresses de livraison', async ({ page }) => {
  const homePage = new AmazonHomePage(page);


  await page.goto('https://www.amazon.fr/');
  await homePage.acceptCookies();
  await homePage.Changeadress('59310');




});

test('Service client', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const serviceClientOption = page.locator('a.hmenu-item:has-text("Service client")').nth(0);

  await page.goto('https://www.amazon.fr');
  await homePage.acceptCookies();

  await homePage.MenuButton();
  await page.waitForSelector('.hmenu-visible');

  await serviceClientOption.click();
  await expect(page).toHaveURL(/.*help\/customer\/display.html/);
});

test('Changer la langue du site', async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const langue = page.locator('#icp-nav-flyout');

  await page.goto('https://www.amazon.fr/');
  await homePage.acceptCookies();
  await langue.click();
  await page.waitForSelector('#icp-nav-flyout', { state: 'visible' }); // Remplacez '.some-selector' par le sélecteur approprié
  await page.getByRole('radio',{name:'English - EN' }).check({force:true});
  await page.locator('input[type="submit"][aria-labelledby="icp-save-button-announce"]').click();
  await expect(page).toHaveURL('https://www.amazon.fr/?language=en_GB');


});


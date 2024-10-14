import { test, expect } from '@playwright/test';
import AmazonHomePage from '../pages/AmazonHomePage';
import AmazonSearchResultsPage from '../pages/AmazonSearchResultsPage';
import AmazonProductPage from '../pages/AmazonProductPage';
import AmazonCheckoutPage from '../pages/AmazonCheckoutPage';
import { AmazonSignUpPage } from '../pages/AmazonSignUpPage';






test('Créez un compte', async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const searchResultsPage = new AmazonSearchResultsPage(page);
    const productPage = new AmazonProductPage(page);
    const checkoutPage = new AmazonCheckoutPage(page);
    const signUpPage = new AmazonSignUpPage(page);



    await page.goto('https://www.amazon.fr/');
    await homePage.acceptCookies();
    await homePage.gologin();
    await page.getByText('Commencer ici.');
    await page.getByText('Créer votre compte Amazon').click();
    await signUpPage.fillSignUpForm('Augustin','augustin.fernandes@student.junia.com','Legroscaca');
    





    
});

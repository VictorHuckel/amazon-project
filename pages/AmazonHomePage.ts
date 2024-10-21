// pages/AmazonHomePage.ts
import { Page, Locator, expect } from '@playwright/test';

class AmazonHomePage {
    private page: Page;
    private cookieAcceptButton = '#sp-cc-accept';
    //private searchInput = 'input[name="field-keywords"]';
    //private searchButton = 'input[type="submit"]';
    private loginButton = '#nav-link-accountList';
    private adressButton = '#nav-global-location-popover-link';
    private postalCodeInput = '#GLUXZipUpdateInput'
    private actualiserButton = 'input.a-button-input[aria-labelledby="GLUXZipUpdate-announce"]';
    private menuButton = '#nav-hamburger-menu';
    readonly productTitle: Locator;
    readonly addToCartButton: Locator;
    //private cartButton: '#nav-cart';
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;
    


    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#twotabsearchtextbox'); // Champ de recherche
        this.searchButton = page.locator('input[type="submit"][value="Go"]'); // Bouton de recherche
        this.cartButton = page.locator('#nav-cart'); // Bouton du panier
        this.productTitle = page.locator('.s-title-instructions-style'); // Titre du produit dans la page de résultats
        // Sélecteur par ID (habituellement utilisé)
        this.addToCartButton = page.locator('#add-to-cart-button');
        // Sélecteur basé sur un attribut aria-label (accessibilité)
        this.addToCartButton = page.locator('button[aria-label="Add to Shopping Cart"]');
        // Sélecteur basé sur un texte (si le texte est en clair dans le bouton)
        this.addToCartButton = page.locator('button:has-text("Add to Cart")');
   
    }

    // Méthode pour naviguer vers la page d'accueil d'Amazon
    async navigate() {
        await this.page.goto('https://www.amazon.com');
    }

    async addToCart() {
        // Attendre que la page soit chargée et que le bouton soit visible
        await this.page.waitForLoadState('domcontentloaded');
        // Sélectionner un sélecteur alternatif si nécessaire
        await this.page.waitForSelector('#add-to-cart-button', { state: 'visible', timeout: 10000 });
        // S'assurer que l'élément est visible à l'écran
        await this.addToCartButton.scrollIntoViewIfNeeded(); 
        // Cliquer sur le bouton ajouter au panier
        await this.addToCartButton.click();
    }

    async clickOnFirstProduct() {
        await expect(this.productTitle.first()).toBeVisible();
        await this.productTitle.first().click(); // Cliquer sur le premier produit
    }

    // Méthode pour rechercher un élément avec vérifications d'existence
    async searchForItem(item: string) {
        // Attendre que le champ de recherche soit visible
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(item); // Remplir le champ de recherche
        // Attendre que le bouton soit visible avant de cliquer
        await expect(this.searchButton).toBeVisible();
        await this.searchButton.click();   // Cliquer sur le bouton de recherche
    }

    // Méthode pour accéder au panier avec vérification d'existence
    async goToCart() {
        // Attendre que le bouton du panier soit visible
        await expect(this.cartButton).toBeVisible();
        await this.cartButton.click();     // Cliquer sur le bouton du panier
    }
    

    async acceptCookies() {
        await this.page.click(this.cookieAcceptButton);
    }

    async searchForProduct(product: string) {
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(product); // Remplir le champ de recherche
        await expect(this.searchButton).toBeVisible();
        await this.searchButton.click();   // Cliquer sur le bouton de recherche
    }

    async gologin(){
        await this.page.click(this.loginButton);
    }

    async Changeadress(postalCode: string){
        await this.page.click(this.adressButton);
        await this.page.fill(this.postalCodeInput, postalCode);
        await this.page.click(this.actualiserButton);

    }

    async MenuButton(){
        await this.page.click(this.menuButton);
    }
    
}

export default AmazonHomePage;

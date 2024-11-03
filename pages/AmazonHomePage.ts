// pages/AmazonHomePage.ts
import { Page, Locator, expect } from '@playwright/test';

class AmazonHomePage {
    goto() {
        throw new Error('Method not implemented.');
    }
    navigateToCategory // Sélecteur basé sur un texte (si le texte est en clair dans le bouton)
        (arg0: string) {
            throw new Error('Method not implemented.');
    }
    private page: Page;
    private cookieAcceptButton = '#sp-cc-accept';
    //private searchInput = 'input[name="field-keywords"]';
    //private searchButton = 'input[type="submit"]';
    private loginButton = '#nav-link-accountList';
    private adressButton = '#nav-global-location-popover-link';
    private postalCodeInput = '#GLUXZipUpdateInput'
    private actualiserButton = 'input.a-button-input[aria-labelledby="GLUXZipUpdate-announce"]';
    private menuButton = '#nav-hamburger-menu';
    readonly categoryDropdown: Locator;
    readonly productTitle: Locator;
    readonly addToCartButton: Locator;
    //private cartButton: '#nav-cart';
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;
    readonly deleteButton: Locator;
    readonly productInCart: Locator;
    


    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#twotabsearchtextbox'); // Champ de recherche
        this.searchInput = page.locator('input#twotabsearchtextbox');
        this.searchButton = page.locator('input[type="submit"][value="Go"]'); // Bouton de recherche
        this.searchButton = page.locator('input#nav-search-submit-button');
        this.cartButton = page.locator('#nav-cart'); // Bouton du panier
        this.categoryDropdown = page.locator('select#searchDropdownBox');
        this.productTitle = page.locator('.s-title-instructions-style'); // Titre du produit dans la page de résultats
        this.addToCartButton = page.locator('#add-to-cart-button');        // Sélecteur par ID (habituellement utilisé)
        this.addToCartButton = page.locator('button[aria-label="Add to Shopping Cart"]');        // Sélecteur basé sur un attribut aria-label (accessibilité)
        this.addToCartButton = page.locator('button:has-text("Add to Cart")');        // Sélecteur basé sur un texte (si le texte est en clair dans le bouton)
        this.deleteButton = page.locator('.a-declarative .a-button-link'); // Adapté pour le bouton de suppression
        this.productInCart = page.locator('.sc-product-title'); // Sélecteur pour le titre du produit dans le panier
    }

    // Méthode pour naviguer vers la page d'accueil d'Amazon
    async navigate() {
        await this.page.goto('https://www.amazon.fr');
    }

    async searchProductByCategory(category, product) {
        await this.categoryDropdown.selectOption(category); // Sélectionner la catégorie
        await this.searchInput.fill(product); // Remplir le champ de recherche
        await this.searchButton.click(); // Cliquer sur le bouton de recherche
    }
    async addToCart() {
        // Attendre que la page soit chargée et que le bouton soit visible
        //await this.page.waitForLoadState('domcontentloaded');
        // Sélectionner un sélecteur alternatif si nécessaire
        await this.page.waitForSelector('#add-to-cart-button');
        // S'assurer que l'élément est visible à l'écran
        await this.addToCartButton.scrollIntoViewIfNeeded(); 
        // Cliquer sur le bouton ajouter au panier
        await this.addToCartButton.click();
    }
    async removeProductFromCart() {
        await this.deleteButton.click();
        await this.page.waitForTimeout(2000); // Attendre que le modal apparaisse pour la confirmation
        // Clic forcé si le modal est affiché
        const confirmDeleteButton = this.page.locator('input[value="Delete"]');
        await confirmDeleteButton.click();
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

    async isProductInCart(productTitle) {
        await this.page.waitForSelector('.sc-product-title'); // Attendre que le produit apparaisse dans le panier
        const titles = await this.productInCart.allTextContents();
        return titles.some(title => title.includes(productTitle)); // Vérifie si le titre du produit est dans le panier
    }
    
}

export default AmazonHomePage;

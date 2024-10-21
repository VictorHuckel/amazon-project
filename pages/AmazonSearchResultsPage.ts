import { Page, Locator } from 'playwright';

class AmazonSearchResultsPage {
    private page: Page;
    private searchResultsSelector = '.s-search-results'; // Sélecteur pour les résultats de recherche

    constructor(page: Page) {
        this.page = page;
    }

    // Attendre que les résultats de recherche soient chargés
    async waitForResults() {
        await this.page.waitForSelector(this.searchResultsSelector);
    }

    // Récupérer les résultats filtrés (par exemple après avoir appliqué un filtre)
    async getFilteredResults() {
        // S'assurer que les résultats de recherche sont visibles
        await this.page.waitForSelector(this.searchResultsSelector);

        // Récupérer et retourner les éléments de la liste de résultats
        return await this.page.$$eval(`${this.searchResultsSelector} .s-result-item`, items =>
            items.map(item => {
                const titleElement = item.querySelector('h2 a span');
                const priceElement = item.querySelector('.a-price-whole');
                return {
                    title: titleElement && titleElement.textContent ? titleElement.textContent.trim() : null,
                    price: priceElement && priceElement.textContent ? priceElement.textContent.trim() : 'Non disponible',
                };
            })
        );
    }

    // Sélectionner le premier produit dans les résultats de recherche
    async selectFirstProduct() {
        await this.page.click(`${this.searchResultsSelector} .s-result-item h2 a`);
    }
}

export default AmazonSearchResultsPage;

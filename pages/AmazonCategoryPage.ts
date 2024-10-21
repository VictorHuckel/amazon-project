import { Page, Locator } from 'playwright';

class AmazonCategoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async applyFilterByLabel(filterType: string, filterValue: string) {
        // Chercher le filtre correspondant
        const filterSelector = `//span[contains(text(), '${filterType}')]/following::span[contains(text(), '${filterValue}')]/ancestor::li//input[@type='checkbox']`;

        // S'assurer que le filtre est visible avant de cliquer
        const filterElement = await this.page.waitForSelector(filterSelector, { state: 'visible' });

        // Vérifier si l'élément a été trouvé et faire défiler vers lui si nécessaire
        await filterElement.scrollIntoViewIfNeeded();

        // Cochez la case du filtre
        await filterElement.check();

        // Attendre que la page se recharge ou que les résultats soient filtrés
        await this.page.waitForTimeout(5000); // Ajuster selon les temps de chargement
    }

    async applyPriceFilter(minPrice: number, maxPrice: number) {
        await this.page.fill('#low-price', minPrice.toString());
        await this.page.fill('#high-price', maxPrice.toString());
        await this.page.click('input[type="submit"][aria-labelledby="a-autoid-1-announce"]'); // Bouton pour appliquer le filtre de prix
    }

    async getFilteredResults() {
        await this.page.waitForSelector('.s-search-results');
        return await this.page.$$eval('.s-search-results .s-result-item', items => items.map(item => (item as HTMLElement).innerText));
    }
}

export default AmazonCategoryPage;

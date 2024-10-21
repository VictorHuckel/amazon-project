import { Page, Locator } from 'playwright';

class AmazonCategoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async applyFilterByLabel(filterType: string, filterValue: string) {
        await this.page.click(`span[aria-label="${filterType}"]`);
        await this.page.click(`li[aria-label="${filterValue}"]`);
        
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

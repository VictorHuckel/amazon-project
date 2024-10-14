// pages/AmazonCategoryPage.ts
import { Page } from '@playwright/test';

class AmazonCategoryPage {
    private page: Page;
    private filterSelector = 'div[data-component-type="s-search-result"]'; // Selector for search results
    private categoryFilter = '.filter-class-name'; // Replace with the actual filter selector

    constructor(page: Page) {
        this.page = page;
    }

    async useFilter(filterValue: string) {
        // Click on a given filter
        await this.page.click(`${this.categoryFilter}[data-value="${filterValue}"]`); // Adjust selector
        await this.page.waitForTimeout(2000); // Wait for results to update
    }

    async getFilteredResults() {
        // Wait for the results to be visible
        await this.page.waitForSelector(this.filterSelector);

        // Check if the selector matches any elements
        const results = await this.page.$$(this.filterSelector);
        if (results.length === 0) {
            throw new Error('No filtered results found for the given selector.');
        }

        // Extract and return the inner text of the matched elements
        return await this.page.evaluate(elements => 
            elements.map(el => {
                if (el instanceof HTMLElement) {
                    return el.innerText;
                }
                return ''; // Return an empty string for non-HTMLElement
            })
        , results);
    }
}

export default AmazonCategoryPage;

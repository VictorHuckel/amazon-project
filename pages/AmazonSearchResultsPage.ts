// pages/AmazonSearchResultsPage.ts
import { Page } from '@playwright/test';

class AmazonSearchResultsPage {
    private page: Page;
    private firstResultItem = '.s-result-item';

    constructor(page: Page) {
        this.page = page;
    }

    async selectFirstProduct() {
        await this.page.waitForSelector(this.firstResultItem);
        await this.page.click(this.firstResultItem);
 
    }
    
}

export default AmazonSearchResultsPage;

import { Page, Locator } from 'playwright';

class AmazonCategoryPage {
    
    private page: Page;
    



    constructor(page: Page) {
        this.page = page;
    }
    async Filtres(marque: string ) {
        await this.page.getByText(marque,{ exact: true }).click();
    }
  
}

export default AmazonCategoryPage;

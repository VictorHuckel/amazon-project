import { Page, Locator } from 'playwright';

class AmazonCategoryPage {
    applyFilterByLabel(arg0: string, arg1: string) {
        throw new Error('Method not implemented.');
    }
    getProductCount() {
        throw new Error('Method not implemented.');
    }
    
    private page: Page;
    



    constructor(page: Page) {
        this.page = page;
    }
    async Filtres(marque: string ) {
        await this.page.getByText(marque,{ exact: true }).click();
    }
  
}

export default AmazonCategoryPage;

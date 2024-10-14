import { test as base } from '@playwright/test';
import { FormLayoutsPage } from './FormLayoutsPage';
const test = base.extend({
 FormLayouts: async ({ page }, use) => {
 await use(new FormLayoutsPage(page));
 },
});
const expect = base.expect;
export { test, expect };

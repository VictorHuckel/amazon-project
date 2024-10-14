import { test, expect } from '@playwright/test';

test('Lancer la page', async ({ page }) => {
    await page.goto('https://www.amazon.fr/');
    await page.getByText('Accepter').click();
    
  

    
  });
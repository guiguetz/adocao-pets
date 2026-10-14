import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Adoção de Pets/);
});

test('homepage has heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Adoção de Pets' })).toBeVisible();
});

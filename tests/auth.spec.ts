import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle(/Modelly/);
  });

  test('should load signup page', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await expect(page).toHaveTitle(/Modelly/);
  });

  test('should load find-id page', async ({ page }) => {
    await page.goto('http://localhost:3000/find-id');
    await expect(page).toHaveTitle(/Modelly/);
  });

  test('should load find-password page', async ({ page }) => {
    await page.goto('http://localhost:3000/find-password');
    await expect(page).toHaveTitle(/Modelly/);
  });
});

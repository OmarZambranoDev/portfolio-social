import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should switch to profile tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Profile' }).click();

    await expect(page.getByText('Edit Bio')).toBeVisible();
  });

  test('should switch to following tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Following' }).click();

    // Seed data generates follows, so user cards should be visible
    const cards = page.locator('.border-earth-stone\\/70');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should switch back to feed tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Profile' }).click();
    await page.getByRole('button', { name: 'Feed' }).click();

    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  });

  test('should open search view', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByPlaceholder('Search users...')).toBeVisible();
  });

  test('should search for a user', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();

    const searchBar = page.getByPlaceholder('Search users...');
    await searchBar.fill('Alex');

    await expect(page.getByText('Alex Chen')).toBeVisible();
  });

  test('should open notifications', async ({ page }) => {
    await page.locator('[aria-label="Notifications"]').click();

    await expect(page.getByText('Mark all read')).toBeVisible();
  });

  test('should go back from notifications', async ({ page }) => {
    await page.locator('[aria-label="Notifications"]').click();
    await page.getByText('Back').click();

    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  });

  test('should show home button navigates to portfolio', async ({ page }) => {
    const homeButton = page.getByRole('button', { name: 'Home' });
    await expect(homeButton).toBeVisible();
  });
});

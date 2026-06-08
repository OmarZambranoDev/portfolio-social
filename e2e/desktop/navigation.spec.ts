import { test, expect } from '@playwright/test';

test.describe('Desktop Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
  });

  test('should switch to profile tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Profile' }).click();

    await expect(page.getByText('Edit Bio')).toBeVisible();
  });

  test('should switch to following tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Following' }).click();

    // Seed data generates follows, so user cards should be visible
    await page.waitForSelector(
      '[id^="post-"], [data-testid^="user-card"], .border-earth-stone\\/70'
    );
    const cards = page.locator('.border-earth-stone\\/70');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should switch back to feed tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Profile' }).click();
    await page.getByRole('tab', { name: 'Feed' }).click();

    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  });

  test('should open search', async ({ page }) => {
    await page.getByLabel('Search').click();

    await expect(page.getByPlaceholder('Search users...')).toBeVisible();
  });

  test('should search for a user', async ({ page }) => {
    await page.getByLabel('Search').click();

    const searchBar = page.getByPlaceholder('Search users...');
    await searchBar.fill('Alex');

    await expect(page.getByText('Alex Chen')).toBeVisible();
  });

  test('should navigate to user profile from search', async ({ page }) => {
    await page.getByLabel('Search').click();

    const searchBar = page.getByPlaceholder('Search users...');
    await searchBar.fill('Alex');

    // Click the user card for Alex Chen
    await page.locator('text=Alex Chen').first().click();

    // Should show profile with the user's name in the header
    await expect(page.getByRole('heading', { name: 'Alex Chen' })).toBeVisible({ timeout: 5000 });
  });

  test('should close search with back button', async ({ page }) => {
    await page.getByLabel('Search').click();
    await page.getByText('Back').click();

    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  });
});

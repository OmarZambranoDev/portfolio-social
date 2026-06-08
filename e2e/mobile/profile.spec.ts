import { test, expect } from '@playwright/test';

test.describe('Mobile Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should show own profile with edit bio', async ({ page }) => {
    await page.getByRole('button', { name: 'Profile' }).click();

    await expect(page.getByText('Edit Bio')).toBeVisible();
    await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  });

  test('should show profile links for current user', async ({ page }) => {
    await page.getByRole('button', { name: 'Profile' }).click();

    await expect(page.getByText('Links')).toBeVisible();
    await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('omarzambrano.dev')).toBeVisible();
  });

  test('should navigate to user profile from following tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Following' }).click();

    const userCard = page.locator('.border-earth-stone\\/70').first();
    await userCard.click();

    // Should show profile content with the user's name as heading
    await expect(page.getByRole('heading')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to own profile from You post', async ({ page }) => {
    const youButton = page.locator('button:has-text("You")').first();
    await youButton.click();

    await expect(page.getByText('Edit Bio')).toBeVisible();
  });
});

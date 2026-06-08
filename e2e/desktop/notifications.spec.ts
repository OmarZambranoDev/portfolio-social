import { test, expect } from '@playwright/test';

test.describe('Desktop Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
  });

  test('should show notification bell', async ({ page }) => {
    const bell = page.locator('[aria-label="Notifications"]');
    await expect(bell).toBeVisible();
  });

  test('should open notification dropdown', async ({ page }) => {
    const bell = page.locator('[aria-label="Notifications"]');
    await bell.click();

    // The NotificationCenter renders a heading
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });
});

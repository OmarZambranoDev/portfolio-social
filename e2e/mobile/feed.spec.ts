import { test, expect } from '@playwright/test';

test.describe('Mobile Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should load feed with posts', async ({ page }) => {
    await page.waitForSelector('[id^="post-"]');
    const posts = await page.locator('[id^="post-"]').count();
    expect(posts).toBeGreaterThan(0);
  });

  test('should show new post input', async ({ page }) => {
    const textarea = page.getByPlaceholder("What's on your mind?");
    await expect(textarea).toBeVisible();
  });

  test('should create a new post', async ({ page }) => {
    const textarea = page.getByPlaceholder("What's on your mind?");
    await textarea.fill('Hello from mobile!');
    await page.getByRole('button', { name: 'Post' }).click();

    await expect(page.getByText('Hello from mobile!')).toBeVisible();
  });

  test('should have bottom nav bar', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Following' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
  });

  test('should show mobile header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Social' })).toBeVisible();
  });

  test('should show notification bell in header', async ({ page }) => {
    const bell = page.locator('[aria-label="Notifications"]');
    await expect(bell).toBeVisible();
  });
});

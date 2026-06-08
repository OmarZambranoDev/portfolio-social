import { test, expect } from '@playwright/test';

test.describe('Desktop Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
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
    await textarea.fill('Hello from Playwright!');
    await page.getByRole('button', { name: 'Post' }).click();

    await expect(page.getByText('Hello from Playwright!')).toBeVisible();
  });

  test('should like a post', async ({ page }) => {
    await page.waitForSelector('[id^="post-"]');

    const likeButton = page
      .locator('[id^="post-"] button')
      .filter({ has: page.locator('svg.lucide-heart') })
      .first();

    await likeButton.click();

    await expect(likeButton).toHaveClass(/text-earth-rose/);
  });

  test('should expand comments', async ({ page }) => {
    await page.waitForSelector('[id^="post-"]');

    const commentButton = page
      .locator('[id^="post-"] button')
      .filter({ has: page.locator('svg.lucide-message-circle') })
      .first();

    await commentButton.click();

    await expect(page.getByPlaceholder('Write a comment...')).toBeVisible();
  });

  test('should add a comment', async ({ page }) => {
    await page.waitForSelector('[id^="post-"]');

    const commentButton = page
      .locator('[id^="post-"] button')
      .filter({ has: page.locator('svg.lucide-message-circle') })
      .first();
    await commentButton.click();

    const commentInput = page.getByPlaceholder('Write a comment...');
    await commentInput.fill('Test comment from Playwright!');
    await commentInput.press('Enter');

    await expect(page.getByText('Test comment from Playwright!')).toBeVisible();
  });

  test('should have visible tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Feed' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Following' })).toBeVisible();
  });

  test('should have visible header with search', async ({ page }) => {
    await expect(page.getByLabel('Search')).toBeVisible();
  });
});

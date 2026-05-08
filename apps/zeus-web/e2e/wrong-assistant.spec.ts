import { test, expect } from '@playwright/test';

test.describe('Wrong assistant switch', () => {
  test('switch to Defense assistant shows Guard chat and banner', async ({ page }) => {
    await page.goto('/chat');
    await expect(
      page.getByRole('main').getByRole('heading', { name: /Growth coach/i, level: 2 })
    ).toBeVisible();

    await page.getByRole('button', { name: /Switch to Defense assistant/ }).click();

    await expect(
      page.getByRole('main').getByRole('heading', { name: /Defense assistant/i, level: 2 })
    ).toBeVisible();

    await expect(page.getByRole('status').filter({ hasText: /Switched to Guard/i })).toBeVisible();
  });

  test('Defense stub mentions dashboard telemetry', async ({ page }) => {
    await page.goto('/chat');
    await page.getByRole('button', { name: /Switch to Defense assistant/ }).click();
    await page.getByPlaceholder(/Ask Defense assistant/).fill('Summarize this week');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByRole('main').locator('.glass-panel').filter({ hasText: /calls intercepted/i })
    ).toBeVisible({ timeout: 8000 });
  });
});

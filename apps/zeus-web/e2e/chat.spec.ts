import { test, expect } from '@playwright/test';

test.describe('Assistant chat', () => {
  test('Growth coach loads and accepts a message', async ({ page }) => {
    await page.goto('/chat');
    await expect(
      page.getByRole('main').getByRole('heading', { name: /Growth coach/i, level: 2 })
    ).toBeVisible();
    await page.getByPlaceholder(/Ask Growth coach/).fill('Test outbound hook');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByRole('main').locator('.max-w-lg').filter({ hasText: /^Test outbound hook$/ })
    ).toBeVisible();
    await expect(
      page.getByRole('main').locator('.glass-panel').filter({ hasText: /Great question about/ })
    ).toBeVisible({ timeout: 5000 });
  });

  test('breadcrumb links to Mission home', async ({ page }) => {
    await page.goto('/chat');
    await page.locator('[aria-label="Breadcrumb"]').getByRole('link', { name: 'Mission' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Mission Control' })).toBeVisible();
  });

  /**
   * Two Growth coach chips in sequence — each prompt appears as a user bubble.
   * Chips hide after the first exchange; reload restores the welcome thread so the second chip is available.
   */
  test('second Mission chip seeds a new prompt after the first', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Cold email draft' }).click();
    await expect(
      page.getByRole('main').locator('.max-w-lg').filter({ hasText: /^Draft a cold email for a SaaS prospect$/ })
    ).toBeVisible({ timeout: 8000 });

    await page.reload();
    await expect(page.getByRole('button', { name: 'Objection handling' })).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: 'Objection handling' }).click();
    await expect(
      page.getByRole('main').locator('.max-w-lg').filter({
        hasText: /^Handle the "we already have a solution" objection$/,
      })
    ).toBeVisible({ timeout: 8000 });
  });
});

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
    await expect(
      page.getByRole('main').getByRole('heading', { name: 'Mission Control', level: 2 })
    ).toBeVisible();
  });

  /**
   * Regression: `?q=` seeding must run when `q` changes, not block all future seeds after the first.
   * Two Mission chips in sequence assert a second distinct query is applied after the first is stripped.
   */
  test('second Mission chip seeds a new prompt after the first', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Cold email draft' }).click();
    await expect(
      page.getByRole('main').locator('.max-w-lg').filter({ hasText: /^Draft a cold email for a SaaS prospect$/ })
    ).toBeVisible({ timeout: 8000 });
    await page.locator('[aria-label="Breadcrumb"]').getByRole('link', { name: 'Mission' }).click();
    await expect(
      page.getByRole('main').getByRole('heading', { name: 'Mission Control', level: 2 })
    ).toBeVisible();
    await page.getByRole('link', { name: 'Objection handling' }).click();
    await expect(
      page.getByRole('main').locator('.max-w-lg').filter({
        hasText: /^Handle the "we already have a solution" objection$/,
      })
    ).toBeVisible({ timeout: 8000 });
  });
});

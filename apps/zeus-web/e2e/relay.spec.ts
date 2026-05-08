import { test, expect } from '@playwright/test';

test.describe('Relay inbox', () => {
  test('loads Relay hero (sales mode)', async ({ page }) => {
    await page.goto('/relay');
    await expect(
      page.getByRole('main').getByRole('heading', { name: 'Relay', exact: true, level: 1 })
    ).toBeVisible();
    await expect(page.getByText(/AI resolution engine/i)).toBeVisible();
  });
});

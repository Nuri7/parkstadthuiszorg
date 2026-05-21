import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Authentication Flow using DevQuickLogin', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ 
      page,
      options: { frontendApiUrl: 'clerk.parkstadthuiszorg.nl' }
    });
  });

  test('Admin quick login redirects to Admin Dashboard', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Make sure we see the Dev Mode banner
    await expect(page.locator('text=Dev Mode').first()).toBeVisible();

    // Click the Admin button inside the DevQuickLogin box
    const adminBtn = page.getByRole('button', { name: 'Admin' });
    await adminBtn.click();

    // Wait for the URL to change to the admin page
    // Clerk handles the auto-login via API, so this might take a couple seconds
    await page.waitForURL('**/admin', { timeout: 20000 });

    // Assert that we are on the admin dashboard and it loaded successfully
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Check if the dashboard table is rendered
    await expect(page.locator('table')).toBeVisible();
  });

  test('Customer quick login redirects to Customer Portal (mijn-zorg)', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Click the Customer button inside the DevQuickLogin box
    const customerBtn = page.getByRole('button', { name: 'Customer' });
    await customerBtn.click();

    // Wait for the URL to change to the mijn-zorg page
    await page.waitForURL('**/mijn-zorg', { timeout: 20000 });

    // We verify the URL (the page itself might be a 404 since we haven't built it yet, 
    // but the authentication routing works!)
    await expect(page).toHaveURL(/.*\/mijn-zorg/);
  });
});

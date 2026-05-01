import { test, expect } from "@playwright/test";

const expectedLinks = {
  basic: "https://buy.stripe.com/fZu7sL2KxdTgbJCeMibAs0B",
  proMonthly: "https://buy.stripe.com/00w3cvetfg1o00U9rYbAs0C",
  proSixMonth: "https://buy.stripe.com/14AeVdacZ16u3d60VsbAs0D",
};

test.describe("Pro subscription checkout", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://buy.stripe.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>Stripe Checkout</title><h1>Stripe Checkout</h1>",
      });
    });
  });

  test("Basic opens the Basic Stripe subscription", async ({ page }) => {
    await page.goto("/pro", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Choose Basic" }).click();
    await expect(page).toHaveURL(expectedLinks.basic);
  });

  test("Pro monthly opens the monthly Pro Stripe subscription", async ({ page }) => {
    await page.goto("/pro", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Join Pro Access" }).click();
    await expect(page).toHaveURL(expectedLinks.proMonthly);
  });

  test("Pro savings pack opens the six-month Pro Stripe subscription", async ({ page }) => {
    await page.goto("/pro", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Choose 6-Month Savings Pack" }).click();
    await expect(page).toHaveURL(expectedLinks.proSixMonth);
  });
});

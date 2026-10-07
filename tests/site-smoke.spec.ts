import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/read",
  "/read/commitment",
  "/read/ivys-league",
  "/read/the-fall",
  "/read/the-broken",
  "/serial",
  "/community",
  "/events",
  "/academy",
  "/membership",
  "/contact",
  "/signin",
  "/signup",
  "/reset",
  "/dashboard",
  "/privacy",
  "/terms",
  "/accessibility",
];

for (const route of publicRoutes) {
  test(`${route} renders without a framework error`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(message.text());
      }
    });

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.locator(
        "[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay",
      ),
    ).toHaveCount(0);
    expect(browserErrors).toEqual([]);
  });
}

for (const viewport of [
  { label: "compact phone", width: 320, height: 700 },
  { label: "phone", width: 390, height: 844 },
  { label: "tablet", width: 768, height: 1024 },
]) {
  for (const route of publicRoutes) {
    test(`${route} fits a ${viewport.label} viewport`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("h1").first()).toBeVisible();
      const widths = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
    });
  }
}

test("mobile navigation opens, navigates, and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  const menuButton = page.getByRole("button", {
    name: "Open navigation menu",
  });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Events" }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toBeVisible();
});

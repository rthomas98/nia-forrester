import { expect, test } from "@playwright/test";

test.skip(!process.env.PLAYWRIGHT_BASE_URL, "Requires the connected local catalog preview");

for (const width of [390, 1280]) {
  test(`catalog covers and details at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/read");
    const links = page.locator('a[href^="/read/"]');
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThanOrEqual(48);
    await expect(page.getByText("The library isn’t connected yet")).toHaveCount(0);
    const covers = page.locator('img[src*="books"]');
    expect(await covers.count()).toBeGreaterThanOrEqual(48);
    for (const cover of await covers.all()) {
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toHaveJSProperty("complete", true);
      expect(await cover.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    }
    await page.goto("/read/ivys-league-b015n7gnx2");
    await expect(page).toHaveURL(/ivy-s-league-b015n7gnx2$/);
    await expect(page.getByRole("heading", { name: "Ivy's League", exact: true })).toBeVisible();
    await expect(page.locator('a[href="https://www.amazon.com/dp/B015N7GNX2"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}

test("missing books return 404", async ({ page }) => {
  const response = await page.goto("/read/nonexistent-catalog-book");
  expect(response?.status()).toBe(404);
});

test("reader saves progress and sees it after reload", async ({ page, baseURL }) => {
  const signup = await page.request.post("/api/auth/sign-up/email", {
    headers: { Origin: baseURL! },
    data: {
      name: "Local Browser Reader",
      email: `browser-reader-${Date.now()}@example.test`,
      password: `Local-test-${crypto.randomUUID()}`,
    },
  });
  expect(signup.ok()).toBeTruthy();
  await page.goto("/read/ivy-s-league-b015n7gnx2");
  const slider = page.getByRole("slider");
  await expect(slider).toBeVisible();
  await slider.fill("35");
  await page.getByRole("button", { name: "Save progress", exact: true }).click();
  await expect(page.getByText("35% read", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("35% read", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark as finished", exact: true }).click();
  await expect(page.getByText("Finished", { exact: true })).toBeVisible();
});

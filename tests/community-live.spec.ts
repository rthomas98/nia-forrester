import { expect, test } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_BASE_URL,
  "Requires a connected local preview",
);

for (const width of [390, 1280]) {
  test(`community shows real empty counts and a paid gate at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/community");
    await expect(
      page.getByRole("heading", { name: "A Space for Paid Members" }),
    ).toBeVisible();
    const stats = page.getByLabel("Community statistics");
    await expect(stats).toHaveText("0Members0Discussions0Book Clubs");
    await expect(page.getByText("1,240", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Tasha R.", { exact: false })).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Explore Paid Memberships" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Post Discussion" }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + 1);
  });
}

test("a free account cannot join and does not count as a member", async ({
  page,
  baseURL,
}) => {
  const response = await page.request.post("/api/auth/sign-up/email", {
    headers: { Origin: baseURL! },
    data: {
      name: "Community Test",
      email: `community-${Date.now()}@example.test`,
      password: `Community-${crypto.randomUUID()}`,
    },
  });
  expect(response.ok()).toBeTruthy();
  await page.goto("/community");
  await expect(
    page.getByRole("heading", { name: "A Space for Paid Members" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Already a Member? Sign In" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Join the Circle", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Community statistics")).toHaveText(
    "0Members0Discussions0Book Clubs",
  );
});

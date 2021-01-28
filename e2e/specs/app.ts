test("Shows the correct filtered data", async () => {
  await page.goto("http://localhost:3000/?range=200%2C526", {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await expect(page).toMatch("200,526 sizes shown");
});

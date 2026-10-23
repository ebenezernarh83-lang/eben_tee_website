import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:4184";
if (!["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname)) throw new Error("These tests submit enquiries. Use an isolated local preview only.");
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ baseURL });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/gallery", "/contact", "/real-estate"]) {
      const response = await page.goto(route);
      assert.equal(response.status(), 200);
      await page.waitForFunction(() => document.querySelectorAll('#galleryGrid img, #pageContactForm, #pagePropertyGrid .property-card, #portfolioGrid button').length > 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route} overflow at ${width}px`);
      if (route === "/contact" && width < 700) {
        const form = await page.locator("#pageContactForm").boundingBox();
        assert.ok(form.y < 440, `Contact form is too far down: ${form.y}`);
      }
      if (route === "/gallery") {
        await page.locator("#galleryGrid button").first().scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('#galleryGrid img')].slice(0, 2).every((img) => img.complete && img.naturalWidth));
        await page.locator("#galleryGrid button").first().click();
        assert.equal(await page.getByRole("dialog").isVisible(), true);
        await page.getByRole("button", { name: "Close image viewer" }).click();
      }
      if (route === "/real-estate") {
        await page.locator("#pagePropertyMaxPrice").fill("0");
        await page.getByText("No property matches that search yet.", { exact: true }).waitFor();
        await page.locator("#pagePropertyMaxPrice").fill("");
        assert.ok(await page.locator("#pagePropertyGrid .property-card").count() > 0);
      }
      await page.screenshot({ path: `test-results/${route.replaceAll("/", "") || "home"}-${width}.png` });
    }
  }

  await page.goto("/contact?service=Book%20a%20drone%20shoot&property=Local%20test%20property");
  const form = page.locator("#pageContactForm");
  await form.waitFor();
  assert.equal(await form.locator('[name="service"]').inputValue(), "Book a drone shoot");
  assert.match(await form.locator('[name="message"]').inputValue(), /Local test property/);
  await form.locator('[name="name"]').fill("Local browser test");
  await form.locator('[name="email"]').fill("browser@example.test");
  await form.locator('[name="message"]').fill("Local browser test: upload and submission recovery.");
  await page.route("**/api/leads", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Test service unavailable" }) }));
  await form.locator('[type="submit"]').click();
  await page.getByText("Test service unavailable", { exact: true }).waitFor();
  assert.equal(await form.locator('[name="name"]').inputValue(), "Local browser test");
  await page.unroute("**/api/leads");
  await form.locator('[type="file"]').setInputFiles({ name: "test-photo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=", "base64") });
  await form.locator('[type="submit"]').click();
  await page.getByText("Thank you. Your enquiry and photo have been received.", { exact: false }).waitFor();
  assert.equal(await form.locator('[name="name"]').inputValue(), "");
  assert.equal(await page.getByRole("link", { name: "Continue on WhatsApp" }).count(), 1);

  const login = await context.request.post("/api/login", { data: { pin: process.env.TEST_ADMIN_PIN || "123456" } });
  assert.equal(login.status(), 200);
  await page.goto("/admin.html");
  await page.locator('[data-admin-tab="gallery"]').click();
  await page.locator('#galleryList [data-gallery-action="edit"]').first().click();
  const oldTitle = await page.locator("#galleryTitle").inputValue();
  assert.match(await page.locator("#galleryImageUrl").inputValue(), /^\/assets\//);
  const originalImage = await page.locator("#galleryImageUrl").inputValue();
  await page.locator("#galleryImageUrl").fill("javascript:alert(1)");
  assert.equal(await page.locator("#galleryImageUrl").evaluate((input) => input.checkValidity()), false);
  await page.locator("#galleryImageUrl").fill(originalImage);
  await page.locator("#galleryTitle").fill(`${oldTitle} test`);
  assert.equal(await page.locator("#galleryForm").evaluate((form) => form.checkValidity()), true);
  const savedGallery = page.waitForResponse((response) => response.url().endsWith("/api/admin/content") && response.request().method() === "PUT");
  await page.locator('#galleryForm [type="submit"]').click();
  assert.equal((await savedGallery).status(), 200);
  await page.reload();
  await page.locator('[data-admin-tab="gallery"]').click();
  await page.locator("#galleryList").getByText(`${oldTitle} test`, { exact: true }).waitFor();
  const before = await (await context.request.get("/api/admin/analytics?days=1")).json();
  const visits = await Promise.all(Array.from({ length: 5 }, () => context.request.post("/api/track", { data: { path: "/gallery", source: "Local browser test", medium: "test" } })));
  assert.deepEqual(visits.map((r) => r.status()), [204, 204, 204, 204, 204]);
  const after = await (await context.request.get("/api/admin/analytics?days=1")).json();
  assert.equal(after.totals.views - before.totals.views, 5);

  // Restore only the records this local test changed.
  const current = await (await context.request.get("/api/admin/content")).json();
  await context.request.put("/api/admin/content", { data: { ...current, gallery: current.gallery.map((item) => item.title === `${oldTitle} test` ? { ...item, title: oldTitle } : item) } });
  for (const lead of current.leads.filter((lead) => lead.name === "Local browser test" && lead.email === "browser@example.test")) {
    await context.request.delete(`/api/admin/leads/${lead.id}`, { data: { revision: lead.revision } });
  }
  assert.deepEqual(errors, []);
  console.log("Passed: desktop/mobile layouts, visible gallery/lightbox, early contact form, error recovery, private photo submission, gallery editor save and reload.");
} catch (error) {
  await page.screenshot({ path: "test-results/failure.png", fullPage: true });
  console.error("Browser errors:", errors);
  throw error;
} finally {
  await browser.close();
}

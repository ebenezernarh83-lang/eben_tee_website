import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/api/[[path]].js";
import { createEnv } from "./helpers.mjs";
import { onRequestGet as robots } from "../functions/robots.txt.js";
import { readPublicContent } from "../functions/_seo.js";
import { onRequest as middleware } from "../functions/_middleware.js";

function client(env) {
  let cookie = "";
  const call = (path, method = "GET", body) => onRequest({ env, request: new Request(`https://ebentee.test/api/${path}`, {
    method, headers: { "Content-Type": "application/json", Origin: "https://ebentee.test", "User-Agent": "Mozilla/5.0", Cookie: cookie, "CF-Connecting-IP": "192.0.2.1" },
    body: body ? JSON.stringify(body) : undefined
  }) });
  return { call, async login() { const r = await call("login", "POST", { pin: "123456" }); cookie = r.headers.get("set-cookie").split(";")[0]; } };
}
const enquiry = (extra = {}) => ({ submissionId: crypto.randomUUID(), name: "Review test", email: "test@example.test", message: "Local test only", service: "Book a drone shoot", ...extra });

test("stale Admin content saves cannot remove new enquiries", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const snapshot = await (await c.call("admin/content")).json();
  assert.equal((await c.call("leads", "POST", enquiry())).status, 200);
  const save = await c.call("admin/content", "PUT", { ...snapshot, leads: [] });
  assert.equal(save.status, 200);
  assert.equal((await save.json()).leads.length, 1);
});

test("simultaneous enquiries survive independently; retrying a submission does not duplicate it", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const payloads = Array.from({ length: 5 }, () => enquiry());
  const responses = await Promise.all(payloads.map((body) => c.call("leads", "POST", body)));
  assert.deepEqual(responses.map((r) => r.status), [200, 200, 200, 200, 200]);
  assert.equal((await c.call("leads", "POST", payloads[0])).status, 200);
  assert.equal((await (await c.call("admin/content")).json()).leads.length, 5);
});

test("five concurrent visits record five views and keep source totals", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const responses = await Promise.all(Array.from({ length: 5 }, () => c.call("track", "POST", {
    path: "/gallery", eventType: "page_view", referrer: "https://www.google.com/", source: "google", medium: "organic"
  })));
  assert.deepEqual(responses.map((r) => r.status), [204, 204, 204, 204, 204]);
  const stats = await (await c.call("admin/analytics?days=1")).json();
  assert.equal(stats.totals.views, 5);
  assert.equal(stats.totals.searchVisits, 5);
});

test("photos are stored privately and require an Admin session to open", async () => {
  const env = createEnv(); const c = client(env);
  const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=";
  const r = await c.call("leads", "POST", enquiry({ attachmentName: "site.png", attachmentData: photo }));
  const receipt = await r.json(); assert.equal(r.status, 200); assert.equal(receipt.attachmentReceived, true);
  const path = `admin/leads/${receipt.id}/attachment`;
  assert.equal((await c.call(path)).status, 401);
  await c.login();
  const image = await c.call(path); assert.equal(image.status, 200);
  assert.equal(image.headers.get("Content-Type"), "image/png");
  assert.ok((await image.arrayBuffer()).byteLength > 8);
  assert.equal((await c.call("leads", "POST", enquiry({ attachmentData: "data:image/svg+xml;base64,PHN2Zz4=" }))).status, 400);
  const pub = await (await c.call("content")).json();
  assert.equal(pub.leads, undefined);
  assert.ok(!JSON.stringify(pub).includes("site.png"));
});

test("status changes detect conflicts and a deleted legacy enquiry stays deleted", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const id = (await (await c.call("leads", "POST", enquiry())).json()).id;
  assert.equal((await c.call(`admin/leads/${id}`, "PATCH", { revision: 1, status: "contacted" })).status, 200);
  assert.equal((await c.call(`admin/leads/${id}`, "PATCH", { revision: 1, status: "won" })).status, 409);
  assert.equal((await c.call(`admin/leads/${id}`, "DELETE", { revision: 2 })).status, 200);
  assert.equal((await (await c.call("admin/content")).json()).leads.length, 0);
});

test("invalid contact details and oversized files are rejected", async () => {
  const c = client(createEnv());
  assert.equal((await c.call("leads", "POST", enquiry({ email: "broken" }))).status, 400);
  assert.equal((await c.call("leads", "POST", enquiry({ email: "", phone: "" }))).status, 400);
  assert.equal((await c.call("leads", "POST", enquiry({ attachmentData: "x".repeat(3600001) }))).status, 413);
});

test("public content is crawlable while private endpoints remain disallowed", async () => {
  const rules = await robots().text();
  assert.match(rules, /Disallow: \/api\//);
  assert.match(rules, /Allow: \/api\/content\$/);
});

test("property facts survive saving and reviews stay private without permission", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const content = await (await c.call("admin/content")).json();
  const property = { ...content.properties[0], priceAmount: 15000, priceCurrency: "USD", verifiedAt: "2026-09-04", exactLocation: true };
  await c.call("admin/content", "PUT", { ...content, properties: [property], testimonials: [
    { id: "private", name: "Private client", quote: "Not approved", status: "published" },
    { id: "approved", name: "Named client", quote: "Approved", status: "published", consentToPublish: true }
  ] });
  const pub = await (await c.call("content")).json();
  assert.equal(pub.properties[0].priceAmount, 15000);
  assert.equal(pub.properties[0].verifiedAt, "2026-09-04");
  assert.deepEqual(pub.testimonials.map((r) => r.id), ["approved"]);
  assert.equal(pub.settings.whatsapp, "+233558616942");
});

test("legacy enquiries migrate without losing edits or resurrecting deletions", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const stored = await env.EBENTEE_CONTENT.get("site-content-v1", "json");
  stored.leads = [{ id: "legacy-lead", name: "Legacy", email: "legacy@example.test", message: "Existing record", status: "new", createdAt: "2026-08-01" }];
  await env.EBENTEE_CONTENT.put("site-content-v1", JSON.stringify(stored));
  const migrated = await (await c.call("admin/content")).json();
  assert.equal(migrated.leads[0].id, "legacy-lead");
  assert.equal((await c.call("admin/leads/legacy-lead", "DELETE", { revision: 1 })).status, 200);
  assert.equal((await (await c.call("admin/content")).json()).leads.length, 0);
});

test("historical analytics remain visible alongside new counts", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  const date = new Date().toISOString().slice(0, 10);
  await env.EBENTEE_CONTENT.put(`analytics-v1:${date}`, JSON.stringify({ date, views: 9, paths: { "/": 9 }, visitors: ["legacy-visitor"] }));
  await c.call("track", "POST", { path: "/gallery" });
  const data = await (await c.call("admin/analytics?days=1")).json();
  assert.equal(data.totals.views, 10);
});

test("SEO pages never replace intentionally empty collections with sample listings", async () => {
  const env = createEnv();
  await env.EBENTEE_CONTENT.put("site-content-v1", JSON.stringify({ settings: {}, posts: [], portfolio: [], properties: [], testimonials: [] }));
  const publicContent = await readPublicContent(env);
  assert.deepEqual(publicContent.properties, []);
  assert.deepEqual(publicContent.portfolio, []);
  assert.deepEqual(publicContent.testimonials, []);
});

const post = (env, path, body, headers = {}) => onRequest({ env, request: new Request(`https://ebentee.test/api/${path}`, {
  method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", ...headers }, body: JSON.stringify(body)
}) });

test("parallel PIN guesses cannot slip past the per-address lockout", async () => {
  const env = createEnv();
  const guesses = await Promise.all(Array.from({ length: 12 }, () => post(env, "login", { pin: "000000" }, { "CF-Connecting-IP": "192.0.2.9" })));
  assert.equal(guesses.filter((r) => r.status === 401).length, 8);
  assert.equal(guesses.filter((r) => r.status === 429).length, 4);
  assert.equal((await post(env, "login", { pin: "123456" }, { "CF-Connecting-IP": "192.0.2.9" })).status, 429);
  assert.equal((await post(env, "login", { pin: "123456" }, { "CF-Connecting-IP": "192.0.2.10" })).status, 200);
});

test("guesses spread across many addresses hit the site-wide limit", async () => {
  const env = createEnv();
  for (let i = 0; i < 40; i += 1) await post(env, "login", { pin: "000000" }, { "CF-Connecting-IP": `198.51.100.${i}` });
  assert.equal((await post(env, "login", { pin: "123456" }, { "CF-Connecting-IP": "203.0.113.1" })).status, 429);
});

test("logging out retires the session cookie", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  assert.equal((await c.call("admin/content")).status, 200);
  assert.equal((await c.call("logout", "POST")).status, 200);
  assert.equal((await c.call("admin/content")).status, 401);
});

test("scripted analytics posts and floods are not counted", async () => {
  const env = createEnv(); const c = client(env); await c.login();
  assert.equal((await post(env, "track", { path: "/" })).status, 403);
  for (let i = 0; i < 70; i += 1) await c.call("track", "POST", { path: "/gallery" });
  const stats = await (await c.call("admin/analytics?days=1")).json();
  assert.equal(stats.totals.views, 60);
});

test("the www host redirects to the canonical domain", async () => {
  const next = () => new Response("ok");
  const redirect = await middleware({ request: new Request("https://www.ebentee.com/about?x=1"), next });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("Location"), "https://ebentee.com/about?x=1");
  assert.equal(await (await middleware({ request: new Request("https://ebentee.com/"), next })).text(), "ok");
});

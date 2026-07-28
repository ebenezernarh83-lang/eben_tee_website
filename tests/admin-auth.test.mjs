import assert from "node:assert/strict";
import test from "node:test";

import { onRequest } from "../functions/api/[[path]].js";

class MemoryKv {
  constructor() {
    this.values = new Map();
  }

  async get(key, type) {
    const value = this.values.get(key);
    if (value === undefined) return null;
    return type === "json" ? JSON.parse(value) : value;
  }

  async put(key, value) {
    this.values.set(key, String(value));
  }

  async delete(key) {
    this.values.delete(key);
  }
}

function createEnv() {
  return {
    EBENTEE_CONTENT: new MemoryKv(),
    ADMIN_PIN: "123456",
    SESSION_SECRET: "test-session-secret-with-enough-entropy",
    ADMIN_RECOVERY_KEY: "TEST-RECOVERY-CODE"
  };
}

function request(path, { method = "GET", body, cookie = "" } = {}) {
  return new Request(`https://ebentee.test${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
}

function sessionCookie(response) {
  return String(response.headers.get("set-cookie") || "").split(";")[0];
}

test("the recovery code resets the PIN and invalidates older sessions", async () => {
  const env = createEnv();

  const firstLogin = await onRequest({
    request: request("/api/login", { method: "POST", body: { pin: "123456" } }),
    env
  });
  assert.equal(firstLogin.status, 200);
  const oldCookie = sessionCookie(firstLogin);
  assert.match(oldCookie, /^ebentee_session=/);

  const wrongRecovery = await onRequest({
    request: request("/api/admin/recover", {
      method: "POST",
      body: { recoveryCode: "WRONG-CODE", pin: "654321" }
    }),
    env
  });
  assert.equal(wrongRecovery.status, 401);

  const recovery = await onRequest({
    request: request("/api/admin/recover", {
      method: "POST",
      body: { recoveryCode: "TEST-RECOVERY-CODE", pin: "654321" }
    }),
    env
  });
  assert.equal(recovery.status, 200);
  const newCookie = sessionCookie(recovery);

  const oldSession = await onRequest({
    request: request("/api/session", { cookie: oldCookie }),
    env
  });
  assert.deepEqual(await oldSession.json(), { authenticated: false });

  const newSession = await onRequest({
    request: request("/api/session", { cookie: newCookie }),
    env
  });
  assert.deepEqual(await newSession.json(), { authenticated: true });

  const oldPinLogin = await onRequest({
    request: request("/api/login", { method: "POST", body: { pin: "123456" } }),
    env
  });
  assert.equal(oldPinLogin.status, 401);

  const newPinLogin = await onRequest({
    request: request("/api/login", { method: "POST", body: { pin: "654321" } }),
    env
  });
  assert.equal(newPinLogin.status, 200);
});

test("new PINs must contain 6 to 12 digits", async () => {
  const env = createEnv();
  const response = await onRequest({
    request: request("/api/admin/recover", {
      method: "POST",
      body: { recoveryCode: "TEST-RECOVERY-CODE", pin: "12ab" }
    }),
    env
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Use a PIN containing 6 to 12 digits." });
});

test("published admin gallery images are returned to the public gallery", async () => {
  const env = createEnv();
  const login = await onRequest({
    request: request("/api/login", { method: "POST", body: { pin: "123456" } }),
    env
  });
  const cookie = sessionCookie(login);

  const currentResponse = await onRequest({
    request: request("/api/admin/content", { cookie }),
    env
  });
  const current = await currentResponse.json();
  const galleryItem = {
    id: "gallery-test-1",
    status: "published",
    title: "Test aerial field work",
    description: "A gallery integration test.",
    label: "Drone views",
    image: "https://images.example.com/drone-test.jpg",
    categories: ["drone", "places"],
    size: "wide",
    publishedAt: "2026-07-28"
  };

  const saveResponse = await onRequest({
    request: request("/api/admin/content", {
      method: "PUT",
      cookie,
      body: { ...current, gallery: [galleryItem, ...current.gallery] }
    }),
    env
  });
  assert.equal(saveResponse.status, 200);

  const publicResponse = await onRequest({
    request: request("/api/content"),
    env
  });
  const publicContent = await publicResponse.json();

  const savedItem = publicContent.gallery.find((item) => item.id === galleryItem.id);
  assert.equal(publicContent.gallery.length, 24);
  assert.equal(savedItem.title, galleryItem.title);
  assert.deepEqual(savedItem.categories, ["drone", "places"]);
});

test("the original gallery is imported once and remains fully editable", async () => {
  const env = createEnv();
  const login = await onRequest({
    request: request("/api/login", { method: "POST", body: { pin: "123456" } }),
    env
  });
  const cookie = sessionCookie(login);

  const firstAdminResponse = await onRequest({
    request: request("/api/admin/content", { cookie }),
    env
  });
  const firstAdmin = await firstAdminResponse.json();
  assert.equal(firstAdmin.gallery.length, 23);

  const original = firstAdmin.gallery[0];
  const edited = {
    ...original,
    status: "draft",
    title: "Edited and unlisted gallery image"
  };
  const saveEditResponse = await onRequest({
    request: request("/api/admin/content", {
      method: "PUT",
      cookie,
      body: {
        ...firstAdmin,
        gallery: firstAdmin.gallery.map((item) => (item.id === original.id ? edited : item))
      }
    }),
    env
  });
  assert.equal(saveEditResponse.status, 200);

  const editedAdmin = await saveEditResponse.json();
  const savedEdit = editedAdmin.gallery.find((item) => item.id === original.id);
  assert.equal(savedEdit.title, edited.title);
  assert.equal(savedEdit.status, "draft");

  const publicResponse = await onRequest({
    request: request("/api/content"),
    env
  });
  const publicContent = await publicResponse.json();
  assert.equal(publicContent.gallery.length, 22);
  assert.equal(publicContent.gallery.some((item) => item.id === original.id), false);

  const deleteResponse = await onRequest({
    request: request("/api/admin/content", {
      method: "PUT",
      cookie,
      body: {
        ...editedAdmin,
        gallery: editedAdmin.gallery.filter((item) => item.id !== original.id)
      }
    }),
    env
  });
  assert.equal(deleteResponse.status, 200);

  const afterDeleteResponse = await onRequest({
    request: request("/api/admin/content", { cookie }),
    env
  });
  const afterDelete = await afterDeleteResponse.json();
  assert.equal(afterDelete.gallery.length, 22);
  assert.equal(afterDelete.gallery.some((item) => item.id === original.id), false);
});

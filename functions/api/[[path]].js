const CONTENT_KEY = "site-content-v1";
const SESSION_COOKIE = "ebentee_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const categories = new Set(["video", "construction-news", "building-project", "service-update", "personal"]);

const defaultSettings = {
  brandName: "Eben Tee",
  ownerName: "Eben Tee",
  tagline: "Drone visuals, construction stories, and project updates.",
  about:
    "I share practical updates from the work I do: building projects, construction lessons, site walkthroughs, client progress, and useful video content from the field.",
  phone: "+233 000 000 000",
  whatsapp: "233000000000",
  email: "hello@example.com",
  location: "Accra, Ghana",
  youtube: "https://www.youtube.com/@ebentee",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
  services: [
    "Building project updates",
    "Site progress reporting",
    "Construction news and field notes",
    "YouTube walkthroughs and education",
    "Project consultation"
  ]
};

const samplePosts = [
  {
    id: "sample-1",
    title: "Roofing progress at the duplex project",
    category: "building-project",
    status: "published",
    publishedAt: "2026-06-20",
    location: "Accra site",
    summary:
      "A clean project update covering roof framing, timber treatment, fascia alignment, and the next work items before installation.",
    body:
      "The roofing team moved from layout into active framing this week. The focus was keeping the ridge line straight, checking timber treatment, and making sure the fascia edges line up before sheets go on.\n\nThe next work package is roof covering, rainwater detailing, and a short quality check before ceiling work starts.",
    tags: ["roofing", "project update", "duplex"],
    featured: true,
    projectStage: "Roofing",
    progress: 64,
    createdAt: "2026-06-20T08:00:00.000Z"
  },
  {
    id: "sample-2",
    title: "Site walkthrough: foundation checklist before concrete",
    category: "video",
    status: "published",
    publishedAt: "2026-06-18",
    location: "Field video",
    summary:
      "A video-style update on the checks to make before concrete goes into a foundation trench.",
    body:
      "Before concrete is poured, the team should check trench depth, setting-out lines, reinforcement position, concrete cover, formwork stability, and access for workers.\n\nThis type of checklist helps avoid expensive mistakes that are hard to correct once the concrete has set.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["foundation", "video", "checklist"],
    projectStage: "Foundation",
    progress: 35,
    createdAt: "2026-06-18T08:00:00.000Z"
  },
  {
    id: "sample-3",
    title: "Blockwork quality notes from the ongoing site",
    category: "construction-news",
    status: "published",
    publishedAt: "2026-06-16",
    location: "Ongoing construction",
    summary:
      "A quick construction note on block alignment, mortar joints, openings, and supervision during walling.",
    body:
      "Good blockwork is not only about speed. Alignment, mortar consistency, clean corners, lintel preparation, and opening sizes all matter.\n\nFor this site, the biggest improvement came from checking the first two courses carefully before allowing the team to move fast.",
    tags: ["blockwork", "site news", "quality"],
    createdAt: "2026-06-16T08:00:00.000Z"
  },
  {
    id: "sample-4",
    title: "Finishing plan: tiles, ceiling, doors, and lighting",
    category: "service-update",
    status: "published",
    publishedAt: "2026-06-12",
    location: "Client planning",
    summary:
      "A practical update on how finishing decisions are grouped so a project does not stall at the last stage.",
    body:
      "Finishing is where many projects lose time because decisions arrive too late. Tiles, ceiling details, door types, paint colors, sanitary fittings, and lighting should be grouped early.\n\nA simple finishing schedule keeps the client, supplier, and site team moving together.",
    tags: ["finishing", "planning", "services"],
    projectStage: "Finishing",
    progress: 78,
    createdAt: "2026-06-12T08:00:00.000Z"
  }
];

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return jsonResponse({});
  }

  try {
    if (!env.EBENTEE_CONTENT) {
      return jsonResponse({ error: "Missing EBENTEE_CONTENT binding." }, 500);
    }

    const path = new URL(request.url).pathname.replace(/^\/api\/?/, "");

    if (path === "content" && request.method === "GET") {
      const content = await readContent(env);
      return jsonResponse(publicContent(content));
    }

    if (path === "session" && request.method === "GET") {
      return jsonResponse({ authenticated: await isAuthenticated(request, env) });
    }

    if (path === "login" && request.method === "POST") {
      return login(request, env);
    }

    if (path === "logout" && request.method === "POST") {
      return jsonResponse(
        { ok: true },
        200,
        { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureCookie(request)}` }
      );
    }

    if (path === "admin/content" && request.method === "GET") {
      if (!(await isAuthenticated(request, env))) return jsonResponse({ error: "Unauthorized" }, 401);
      const content = await readContent(env);
      return jsonResponse(adminContent(content));
    }

    if (path === "admin/content" && request.method === "PUT") {
      if (!(await isAuthenticated(request, env))) return jsonResponse({ error: "Unauthorized" }, 401);
      return saveAdminContent(request, env);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (error) {
    return jsonResponse({ error: "Server error", detail: String(error && error.message ? error.message : error) }, 500);
  }
}

async function login(request, env) {
  const payload = await request.json().catch(() => ({}));
  const pin = String(payload.pin || "").trim();
  const content = await readContent(env);
  const ok = await verifyPin(pin, content, env);

  if (!ok) {
    return jsonResponse({ error: "PIN did not match." }, 401);
  }

  if (!content.admin.pin) {
    content.admin.pin = await makePinRecord(pin);
    await writeContent(env, content);
  }

  const token = await createSessionToken(env);
  return jsonResponse(
    { ok: true },
    200,
    {
      "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secureCookie(
        request
      )}`
    }
  );
}

async function saveAdminContent(request, env) {
  const payload = await request.json();
  const current = await readContent(env);
  const next = sanitizeContent({
    posts: payload.posts,
    settings: payload.settings,
    admin: current.admin
  });

  const pin = String(payload.pin || "").trim();
  if (pin) {
    if (pin.length < 4 || pin.length > 64) {
      return jsonResponse({ error: "Use a PIN between 4 and 64 characters." }, 400);
    }
    next.admin.pin = await makePinRecord(pin);
  }

  await writeContent(env, next);
  return jsonResponse(adminContent(next));
}

async function readContent(env) {
  const stored = await env.EBENTEE_CONTENT.get(CONTENT_KEY, "json");

  if (stored && Array.isArray(stored.posts)) {
    return sanitizeContent(stored);
  }

  const seeded = sanitizeContent({
    settings: defaultSettings,
    posts: samplePosts,
    admin: {}
  });
  await writeContent(env, seeded);
  return seeded;
}

async function writeContent(env, content) {
  await env.EBENTEE_CONTENT.put(CONTENT_KEY, JSON.stringify(sanitizeContent(content)));
}

function sanitizeContent(content) {
  const settings = sanitizeSettings(content.settings || {});
  const posts = Array.isArray(content.posts) ? content.posts.map(sanitizePost).sort(sortByDateDesc) : [];
  const admin = content.admin && typeof content.admin === "object" ? { ...content.admin } : {};

  return { version: 1, updatedAt: new Date().toISOString(), settings, posts, admin };
}

function sanitizeSettings(settings) {
  return {
    ...defaultSettings,
    ...settings,
    brandName: cleanText(settings.brandName || defaultSettings.brandName, 80),
    ownerName: cleanText(settings.ownerName || defaultSettings.ownerName, 80),
    tagline: cleanText(settings.tagline || defaultSettings.tagline, 160),
    about: cleanText(settings.about || defaultSettings.about, 1200),
    phone: cleanText(settings.phone || "", 60),
    whatsapp: cleanText(settings.whatsapp || "", 60),
    email: cleanText(settings.email || "", 120),
    location: cleanText(settings.location || "", 120),
    youtube: cleanUrl(settings.youtube),
    facebook: cleanUrl(settings.facebook),
    instagram: cleanUrl(settings.instagram),
    tiktok: cleanUrl(settings.tiktok),
    services: Array.isArray(settings.services)
      ? settings.services.map((service) => cleanText(service, 100)).filter(Boolean).slice(0, 12)
      : defaultSettings.services
  };
}

function sanitizePost(post) {
  const category = categories.has(post.category) ? post.category : "personal";
  return {
    id: cleanText(post.id || crypto.randomUUID(), 90),
    title: cleanText(post.title || "Untitled update", 120),
    category,
    status: post.status === "draft" ? "draft" : "published",
    publishedAt: cleanText(post.publishedAt || today(), 20),
    location: cleanText(post.location || "", 120),
    summary: cleanText(post.summary || "", 320),
    body: cleanText(post.body || "", 8000),
    coverImage: cleanCover(post.coverImage),
    videoUrl: cleanUrl(post.videoUrl),
    tags: Array.isArray(post.tags) ? post.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(post.featured),
    projectStage: cleanText(post.projectStage || "", 80),
    progress: Math.max(0, Math.min(100, Number(post.progress) || 0)),
    createdAt: cleanText(post.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function publicContent(content) {
  return {
    settings: content.settings,
    posts: content.posts.filter((post) => post.status === "published").sort(sortByDateDesc)
  };
}

function adminContent(content) {
  return {
    settings: content.settings,
    posts: content.posts.sort(sortByDateDesc)
  };
}

async function verifyPin(pin, content, env) {
  if (!pin) return false;

  if (content.admin && content.admin.pin && content.admin.pin.salt && content.admin.pin.hash) {
    const hash = await hashPin(pin, content.admin.pin.salt);
    return timingSafeEqual(hash, content.admin.pin.hash);
  }

  return pin === String(env.ADMIN_PIN || "1234");
}

async function makePinRecord(pin) {
  const salt = base64Url(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await hashPin(pin, salt), updatedAt: new Date().toISOString() };
}

async function hashPin(pin, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return base64Url(new Uint8Array(digest));
}

async function createSessionToken(env) {
  const payload = base64Url(
    new TextEncoder().encode(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
        nonce: crypto.randomUUID()
      })
    )
  );
  const signature = await signValue(payload, sessionSecret(env));
  return `${payload}.${signature}`;
}

async function isAuthenticated(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");
  const expected = await signValue(payload, sessionSecret(env));
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    return Number(parsed.exp) > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
}

async function signValue(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64Url(new Uint8Array(signature));
}

function sessionSecret(env) {
  return String(env.SESSION_SECRET || env.ADMIN_PIN || "ebentee-local-session-secret");
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers
    }
  });
}

function secureCookie(request) {
  return new URL(request.url).protocol === "https:" ? "; Secure" : "";
}

function cleanText(value, limit) {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, limit);
}

function cleanUrl(value) {
  const text = cleanText(value, 500);
  if (!text) return "";

  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch (error) {
    return "";
  }
}

function cleanCover(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 2_500_000) return "";
  if (text.startsWith("data:image/") || text.startsWith("https://") || text.startsWith("http://")) return text;
  return "";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function sortByDateDesc(a, b) {
  return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""));
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a, b) {
  const first = String(a || "");
  const second = String(b || "");
  if (first.length !== second.length) return false;

  let result = 0;
  for (let index = 0; index < first.length; index += 1) {
    result |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return result === 0;
}

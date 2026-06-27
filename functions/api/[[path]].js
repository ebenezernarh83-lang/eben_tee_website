const CONTENT_KEY = "site-content-v1";
const ANALYTICS_PREFIX = "analytics-v1";
const SESSION_COOKIE = "ebentee_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const categories = new Set(["video", "construction-news", "building-project", "service-update", "personal"]);

const defaultSettings = {
  brandName: "Eben Tee",
  ownerName: "Eben Tee",
  tagline: "Ghana drone videos, real estate tours, construction news, and project stories.",
  about:
    "Eben Tee documents Ghana's beauty, progress, and culture through drone visuals, estate tours, construction walkthroughs, road trips, and simple project updates. This site brings the videos, services, ebook, and Ghana project stories together in one professional home.",
  phone: "",
  whatsapp: "",
  email: "",
  location: "Accra, Ghana",
  youtube: "https://www.youtube.com/@ebentee",
  facebook: "https://www.facebook.com/ebentee83/",
  instagram: "https://www.instagram.com/ebentee_yt/",
  tiktok: "",
  services: [
    "Drone services and aerial video for projects",
    "Real estate, land, and community tour videos",
    "Construction site walkthroughs",
    "Building project progress reporting",
    "Ghana infrastructure and development news",
    "YouTube storytelling and social media content"
  ]
};

const samplePosts = [
  {
    id: "sample-1",
    title: "Drone services for Ghana real estate and construction projects",
    category: "service-update",
    status: "published",
    publishedAt: "2026-06-27",
    location: "Accra, Ghana",
    summary:
      "Book Eben Tee for clean aerial footage, estate visuals, project progress clips, and social media-ready walkthroughs.",
    body:
      "Eben Tee is built around visual stories from Ghana: drone views, road trips, estate tours, construction progress, and practical updates that help people see places clearly before they visit, buy, build, or invest.\n\nFor real estate developers, builders, land sellers, businesses, and project teams, the focus is simple: capture the location, show the access roads and surroundings, reveal the project progress, and turn the footage into content that can work on YouTube, TikTok, Instagram, and Facebook.\n\nBest fit: land and estate tours, construction progress videos, building project documentation, site walkthroughs, business promo videos, and Ghana travel or development stories.\n\nWatch Eben Tee on YouTube: https://www.youtube.com/@ebentee",
    tags: ["drone services", "real estate", "construction", "Ghana", "video"],
    featured: true,
    projectStage: "Drone services",
    progress: 100,
    createdAt: "2026-06-27T08:00:00.000Z"
  },
  {
    id: "sample-2",
    title: "East Legon Hills is growing fast - what the drone view shows",
    category: "video",
    status: "published",
    publishedAt: "2026-06-24",
    location: "East Legon Hills, Ghana",
    summary:
      "A realistic Eben Tee-style look at land, estates, access roads, and the fast growth around East Legon Hills.",
    body:
      "East Legon Hills continues to attract attention from land buyers, builders, estate developers, and people watching Accra's expansion. Aerial footage helps viewers understand the roads, neighbourhood layout, nearby activity, and how fast the area is changing.\n\nThis is the type of content Eben Tee creates: practical visual storytelling that helps people see Ghana's progress with their own eyes.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zl6poa0trhk",
    videoUrl: "https://www.youtube.com/watch?v=zl6poa0trhk",
    tags: ["East Legon Hills", "land", "real estate", "drone video", "Accra"],
    projectStage: "Area tour",
    progress: 100,
    createdAt: "2026-06-24T08:00:00.000Z"
  },
  {
    id: "sample-3",
    title: "Ghana Big Push road works affected by heavy rains in Ajumako",
    category: "construction-news",
    status: "published",
    publishedAt: "2026-06-26",
    location: "Ajumako-Enyan-Essiam District, Central Region",
    summary:
      "Recent reporting shows how rains have slowed parts of Ghana's Big Push road works, including the Ajumako road rehabilitation package.",
    body:
      "Recent Ghana project reporting says heavy rains have disrupted sections of the Big Push road works in the Ajumako-Enyan-Essiam District. The road package includes rehabilitation and upgrading works around routes such as Mankessim-Ajumako-Agona Swedru, with contractors dealing with muddy conditions, drainage challenges, and delayed earthworks.\n\nFor people who follow building and land development, this kind of road project matters because access roads influence travel time, material delivery, property value, and how quickly communities can grow.\n\nSource: https://www.modernghana.com/news/1502115/cr-heavy-rains-disruptbig-push-projects-inajum.html",
    tags: ["Big Push", "roads", "Central Region", "infrastructure", "Ghana projects"],
    projectStage: "Road works",
    progress: 55,
    createdAt: "2026-06-26T08:00:00.000Z"
  },
  {
    id: "sample-4",
    title: "Assin Bereku 24-hour economy market project gets sod cut",
    category: "construction-news",
    status: "published",
    publishedAt: "2026-06-26",
    location: "Assin Bereku, Central Region",
    summary:
      "GNA reports that sod has been cut for a 24-hour economy market at Assin Bereku, a project expected to support trade and local jobs.",
    body:
      "The Ghana News Agency reported on June 26, 2026 that President John Dramani Mahama cut sod for the construction of a 24-hour economy market at Assin Bereku in the Assin North District of the Central Region.\n\nThe project was described as an intervention to boost trade and economic activity. For local communities, modern markets can improve trading conditions, support jobs, and create stronger commercial centres around transport, food, retail, and services.\n\nSource: https://gna.org.gh/2026/06/president-mahama-cuts-sod-for-construction-of-24-hour-economy-market/",
    tags: ["market project", "Assin Bereku", "Central Region", "24-hour economy", "Ghana news"],
    projectStage: "Sod cutting",
    progress: 10,
    createdAt: "2026-06-26T09:00:00.000Z"
  },
  {
    id: "sample-5",
    title: "Why aerial video helps buyers understand a project before visiting",
    category: "building-project",
    status: "published",
    publishedAt: "2026-06-21",
    location: "Ghana project sites",
    summary:
      "A short project note on how drone footage makes land, estates, and construction progress easier to understand.",
    body:
      "A normal photo can show one corner of a site, but aerial video shows the full story: the road network, nearby buildings, drainage path, surrounding land, distance to busy areas, and the real scale of the project.\n\nThat is why drone visuals are useful for land sellers, estate developers, builders, contractors, and people in the diaspora who want to inspect progress from afar. Eben Tee uses that view to make Ghana projects easier to understand and easier to share.",
    tags: ["aerial video", "project update", "land", "construction", "Ghana"],
    projectStage: "Visual inspection",
    progress: 100,
    createdAt: "2026-06-21T08:00:00.000Z"
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

    if (path === "track" && request.method === "POST") {
      return trackVisit(request, env);
    }

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

    if (path === "admin/analytics" && request.method === "GET") {
      if (!(await isAuthenticated(request, env))) return jsonResponse({ error: "Unauthorized" }, 401);
      return getAnalytics(request, env);
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

async function trackVisit(request, env) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ ok: false }, 403);
  }

  const userAgent = request.headers.get("User-Agent") || "";
  if (isBot(userAgent)) {
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }

  const payload = await request.json().catch(() => ({}));
  const path = cleanAnalyticsPath(payload.path);
  if (!path) {
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }

  const todayKey = today();
  const key = analyticsKey(todayKey);
  const record = normalizeAnalyticsRecord((await env.EBENTEE_CONTENT.get(key, "json").catch(() => null)) || {
    date: todayKey
  });
  const visitor = await visitorHash(request, env);
  const referrer = cleanReferrer(payload.referrer, request);
  const device = deviceType(userAgent);

  record.views += 1;
  record.updatedAt = new Date().toISOString();
  record.paths[path] = (record.paths[path] || 0) + 1;
  record.referrers[referrer] = (record.referrers[referrer] || 0) + 1;
  record.devices[device] = (record.devices[device] || 0) + 1;

  if (visitor && !record.visitors.includes(visitor)) {
    record.visitors.push(visitor);
  }

  if (record.visitors.length > 5000) {
    record.visitors = record.visitors.slice(-5000);
  }

  await env.EBENTEE_CONTENT.put(key, JSON.stringify(record));
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

async function getAnalytics(request, env) {
  const url = new URL(request.url);
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days")) || 30));
  const dates = dateRange(days);
  const records = await Promise.all(
    dates.map(async (date) => normalizeAnalyticsRecord((await env.EBENTEE_CONTENT.get(analyticsKey(date), "json")) || { date }))
  );
  const visitors = new Set();
  const paths = {};
  const referrers = {};
  const devices = {};

  records.forEach((record) => {
    record.visitors.forEach((visitor) => visitors.add(visitor));
    mergeCounts(paths, record.paths);
    mergeCounts(referrers, record.referrers);
    mergeCounts(devices, record.devices);
  });

  const todayRecord = records[records.length - 1] || normalizeAnalyticsRecord({ date: today() });
  const views = records.reduce((total, record) => total + record.views, 0);

  return jsonResponse({
    days,
    totals: {
      views,
      uniqueVisitors: visitors.size,
      todayViews: todayRecord.views,
      todayUniqueVisitors: todayRecord.visitors.length
    },
    daily: records.map((record) => ({
      date: record.date,
      views: record.views,
      uniqueVisitors: record.visitors.length
    })),
    topPaths: topCounts(paths, 10),
    topReferrers: topCounts(referrers, 8),
    devices: topCounts(devices, 5),
    updatedAt: new Date().toISOString()
  });
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

function analyticsKey(date) {
  return `${ANALYTICS_PREFIX}:${date}`;
}

function normalizeAnalyticsRecord(record) {
  return {
    date: cleanText(record.date || today(), 20),
    views: Math.max(0, Number(record.views) || 0),
    visitors: Array.isArray(record.visitors) ? record.visitors.map((visitor) => cleanText(visitor, 96)).filter(Boolean) : [],
    paths: cleanCountMap(record.paths),
    referrers: cleanCountMap(record.referrers),
    devices: cleanCountMap(record.devices),
    updatedAt: cleanText(record.updatedAt || "", 40)
  };
}

function cleanCountMap(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, count]) => [cleanText(key, 180), Math.max(0, Number(count) || 0)])
      .filter(([key, count]) => key && count > 0)
      .slice(0, 100)
  );
}

function mergeCounts(target, source) {
  Object.entries(source || {}).forEach(([key, count]) => {
    target[key] = (target[key] || 0) + count;
  });
}

function topCounts(source, limit) {
  return Object.entries(source || {})
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function dateRange(days) {
  const dates = [];
  const now = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - offset);
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}

function isSameOriginRequest(request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  const secFetchSite = request.headers.get("Sec-Fetch-Site");

  if (secFetchSite && !["same-origin", "none", "same-site"].includes(secFetchSite)) {
    return false;
  }

  if (!origin) return true;

  try {
    return new URL(origin).host === requestUrl.host;
  } catch (error) {
    return false;
  }
}

function cleanAnalyticsPath(value) {
  const text = cleanText(value || "/", 500);

  try {
    const url = new URL(text, "https://ebentee.com");
    let path = url.pathname || "/";

    if (path === "/index.html") path = "/";
    if (path === "/book.html") path = "/book";
    if (path.startsWith("/admin") || path.startsWith("/api")) return "";

    return path.slice(0, 180);
  } catch (error) {
    return "/";
  }
}

function cleanReferrer(value, request) {
  const text = cleanText(value || request.headers.get("Referer") || "", 500);
  if (!text) return "Direct";

  try {
    const referrer = new URL(text);
    const current = new URL(request.url);
    if (referrer.host === current.host) return "Internal";
    return referrer.hostname.replace(/^www\./, "");
  } catch (error) {
    return "Direct";
  }
}

async function visitorHash(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
  const userAgent = request.headers.get("User-Agent") || "";
  const seed = `${sessionSecret(env)}:${ip}:${userAgent}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  return base64Url(new Uint8Array(digest)).slice(0, 32);
}

function deviceType(userAgent) {
  const ua = String(userAgent || "");
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobi|android|iphone|ipod/i.test(ua)) return "Mobile";
  return "Desktop";
}

function isBot(userAgent) {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|linkedinbot|embedly|quora|pinterest/i.test(
    String(userAgent || "")
  );
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

const CONTENT_KEY = "site-content-v1";
const ANALYTICS_PREFIX = "analytics-v1";
const LOGIN_RATE_PREFIX = "login-rate-v1";
const SESSION_COOKIE = "ebentee_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const LOGIN_WINDOW_SECONDS = 15 * 60;
const LOGIN_MAX_ATTEMPTS = 8;
const LOGIN_LOCK_SECONDS = 30 * 60;

const categories = new Set(["video", "construction-news", "building-project", "service-update", "personal"]);
const leadStatuses = new Set(["new", "contacted", "quoted", "won", "lost", "follow-up"]);
const serviceOptions = [
  "Drone Services",
  "Media and Content Creation",
  "Real Estate and Land Marketing",
  "Construction and Project Management",
  "Property and Airbnb Management",
  "Digital Products and Software",
  "Ebook / Digital Product",
  "General Enquiry"
];

const defaultSettings = {
  brandName: "Eben Tee",
  ownerName: "Ebenezer Tetteh",
  tagline: "INSPIRE. EMPOWER. CREATE IMPACT.",
  about:
    "I am Ebenezer Tetteh, known professionally as Eben Tee. I am a Ghana-based entrepreneur, drone pilot, videographer, YouTuber, construction project manager, real estate marketer, property manager, and software/digital entrepreneur. I help people see, invest in, build, manage, and promote opportunities in Ghana with clear visual documentation and professional support.",
  phone: "",
  whatsapp: "",
  email: "ebenteeentertainment@gmail.com",
  location: "Accra, Ghana",
  youtube: "https://www.youtube.com/@ebentee",
  facebook: "https://www.facebook.com/ebentee83/",
  instagram: "https://www.instagram.com/ebentee_yt/",
  tiktok: "",
  x: "",
  services: [
    "Drone photography, videography, inspections, event coverage, and drone training",
    "Media production, YouTube documentaries, editing, and social content for Ghana brands",
    "Land, house, apartment, and real estate marketing for buyers and developers",
    "Construction supervision, progress reporting, materials tracking, and diaspora updates",
    "Airbnb, short-stay, furnished apartment, and property management support",
    "Websites, business systems, MoMo agent software, and digital products for Ghanaian businesses"
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

const samplePortfolio = [
  {
    id: "media-sample-1",
    title: "Estate approach road aerial view",
    type: "photo",
    status: "published",
    publishedAt: "2026-06-27",
    location: "Accra growth corridor",
    clientType: "Real estate developer",
    serviceCategory: "Drone Services",
    summary: "Clean aerial visuals that show access roads, nearby estates, land layout, and project surroundings.",
    tags: ["drone photo", "real estate", "land", "Accra"],
    featured: true,
    createdAt: "2026-06-25T08:00:00.000Z"
  },
  {
    id: "media-sample-2",
    title: "East Legon Hills drone walkthrough",
    type: "video",
    status: "published",
    publishedAt: "2026-06-24",
    location: "East Legon Hills, Ghana",
    clientType: "Area tour",
    serviceCategory: "Real Estate and Land Marketing",
    summary: "A client-ready video view of roads, estates, land activity, and the fast development around East Legon Hills.",
    mediaUrl: "https://www.youtube.com/watch?v=zl6poa0trhk",
    tags: ["drone video", "real estate", "East Legon Hills"],
    featured: true,
    createdAt: "2026-06-24T08:00:00.000Z"
  },
  {
    id: "media-sample-3",
    title: "Construction progress inspection",
    type: "photo",
    status: "published",
    publishedAt: "2026-06-21",
    location: "Ghana project site",
    clientType: "Builder / contractor",
    serviceCategory: "Construction and Project Management",
    summary: "Progress visuals for clients who need to see roof level, site access, surrounding buildings, and work progress.",
    tags: ["construction", "progress", "inspection"],
    featured: false,
    createdAt: "2026-06-23T08:00:00.000Z"
  }
];

const sampleProperties = [
  {
    id: "property-sample-1",
    title: "Diaspora-ready land inspection package",
    propertyType: "Land",
    status: "published",
    availability: "available",
    location: "Accra growth corridor",
    price: "Enquire for verified options",
    size: "Plots and serviced land",
    mapUrl: "https://www.google.com/maps/search/Accra%20growth%20corridor%20Ghana",
    verificationNotes: "Visual inspection package available before buyer commitment.",
    summary:
      "For buyers abroad who need clear drone footage, access-road checks, neighbourhood context, and video proof before making a decision.",
    tags: ["land", "diaspora", "inspection", "Accra"],
    featured: true,
    publishedAt: "2026-06-27",
    createdAt: "2026-06-27T08:00:00.000Z"
  },
  {
    id: "property-sample-2",
    title: "Real estate video tour for developers",
    propertyType: "House / Apartment",
    status: "published",
    availability: "marketing",
    location: "Greater Accra and nearby regions",
    price: "Marketing service",
    size: "Homes, estates, apartments",
    mapUrl: "https://www.google.com/maps/search/Greater%20Accra%20Ghana",
    verificationNotes: "Best for developers and property sellers who need stronger buyer enquiries.",
    summary:
      "Premium property walk-through and aerial visuals for developers, agents, landlords, and sellers who want stronger buyer enquiries.",
    tags: ["real estate", "property tour", "developer"],
    featured: true,
    publishedAt: "2026-06-26",
    createdAt: "2026-06-26T08:00:00.000Z"
  },
  {
    id: "property-sample-3",
    title: "Airbnb and furnished apartment promotion",
    propertyType: "Short stay",
    status: "published",
    availability: "management",
    location: "Accra, Tema, East Legon, Spintex",
    price: "Request management quote",
    size: "Rooms, studios, apartments",
    mapUrl: "https://www.google.com/maps/search/Accra%20Tema%20East%20Legon%20Spintex",
    verificationNotes: "Management support depends on property readiness and owner goals.",
    summary:
      "Promotion, guest-ready visuals, booking support, maintenance coordination, and income monitoring for short-stay property owners.",
    tags: ["airbnb", "short stay", "property management"],
    featured: false,
    publishedAt: "2026-06-25",
    createdAt: "2026-06-25T08:00:00.000Z"
  }
];

const sampleTestimonials = [
  {
    id: "testimonial-sample-1",
    name: "Diaspora building client",
    role: "Construction supervision",
    serviceCategory: "Construction and Project Management",
    status: "published",
    quote:
      "The video updates made it easier to understand the site progress from abroad. I could see the work clearly without being in Ghana.",
    rating: 5,
    createdAt: "2026-06-24T08:00:00.000Z"
  },
  {
    id: "testimonial-sample-2",
    name: "Real estate seller",
    role: "Drone marketing",
    serviceCategory: "Drone Services",
    status: "published",
    quote:
      "The aerial view showed the road access and surrounding area better than normal photos. It helped people understand the property quickly.",
    rating: 5,
    createdAt: "2026-06-23T08:00:00.000Z"
  },
  {
    id: "testimonial-sample-3",
    name: "Short-stay owner",
    role: "Property promotion",
    serviceCategory: "Property and Airbnb Management",
    status: "published",
    quote:
      "The content looked professional and gave the apartment a stronger online presence for guests and enquiries.",
    rating: 5,
    createdAt: "2026-06-22T08:00:00.000Z"
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

    if (request.method === "HEAD") {
      if (["content", "session"].includes(path)) return new Response(null, { status: 200, headers: jsonHeaders() });
      return new Response(null, { status: 404, headers: jsonHeaders() });
    }

    if (path === "track" && request.method === "POST") {
      return trackVisit(request, env);
    }

    if (path === "leads" && request.method === "POST") {
      return createLead(request, env);
    }

    if (path === "content" && request.method === "GET") {
      const content = await readContent(env);
      return jsonResponse(publicContent(content));
    }

    if (path === "session" && request.method === "GET") {
      return jsonResponse({ authenticated: await isAuthenticated(request, env) });
    }

    if (path === "login" && request.method === "POST") {
      if (!isSameOriginRequest(request)) return jsonResponse({ error: "Forbidden" }, 403);
      return login(request, env);
    }

    if (path === "logout" && request.method === "POST") {
      if (!isSameOriginRequest(request)) return jsonResponse({ error: "Forbidden" }, 403);
      return jsonResponse(
        { ok: true },
        200,
        { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureCookie(request)}` }
      );
    }

    if (path === "admin/content" && request.method === "GET") {
      if (!(await isAuthenticated(request, env))) return jsonResponse({ error: "Unauthorized" }, 401);
      const content = await readContent(env);
      return jsonResponse(adminContent(content));
    }

    if (path === "admin/content" && request.method === "PUT") {
      if (!isSameOriginRequest(request)) return jsonResponse({ error: "Forbidden" }, 403);
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
  const rateLimit = await checkLoginRateLimit(request, env);
  if (!rateLimit.allowed) {
    return jsonResponse({ error: "Too many login attempts. Try again later." }, 429, {
      "Retry-After": String(Math.ceil((rateLimit.retryAfterMs || 0) / 1000))
    });
  }

  const content = await readContent(env);
  const ok = await verifyPin(pin, content, env);

  if (!ok) {
    await recordFailedLogin(request, env);
    return jsonResponse({ error: "PIN did not match." }, 401);
  }

  await clearLoginRateLimit(request, env);

  if (!content.admin.pin) {
    content.admin.pin = await makePinRecord(pin);
    await writeContent(env, content);
  }

  const token = await createSessionToken(env);
  return jsonResponse(
    { ok: true },
    200,
    {
      "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secureCookie(
        request
      )}`
    }
  );
}

async function saveAdminContent(request, env) {
  const payload = await persistUploadedMedia(await request.json(), env);
  const current = await readContent(env);
  const next = sanitizeContent({
    posts: payload.posts,
    portfolio: payload.portfolio,
    properties: payload.properties,
    testimonials: payload.testimonials,
    leads: payload.leads,
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

async function createLead(request, env) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ ok: false }, 403);
  }

  const userAgent = request.headers.get("User-Agent") || "";
  if (isBot(userAgent)) {
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }

  const payload = await request.json().catch(() => ({}));
  const lead = sanitizeLead({
    ...payload,
    source: payload.source || "Website",
    page: payload.page || cleanAnalyticsPath(payload.page || new URL(request.url).pathname)
  });

  if (!lead.name || (!lead.phone && !lead.email) || !lead.message) {
    return jsonResponse({ error: "Name, contact, and message are required." }, 400);
  }

  const content = await readContent(env);
  content.leads = [lead, ...(content.leads || [])].slice(0, 1000);
  await writeContent(env, content);
  await trackConversion(env, request, "lead_submit", lead.service);

  return jsonResponse({ ok: true, lead });
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
  const referrer = cleanReferrer(payload.landingReferrer || payload.referrer, request);
  const device = deviceType(userAgent);
  const eventType = cleanEventType(payload.eventType || "page_view");
  const eventLabel = cleanText(payload.eventLabel || payload.label || "", 120);
  const service = normalizeServiceCategory(payload.service || "");
  const source = cleanAnalyticsSource(payload.source, referrer);
  const medium = cleanAnalyticsMedium(payload.medium, source);
  const campaign = cleanText(payload.campaign || "", 120);
  const landingPath = cleanAnalyticsPath(payload.landingPath || path) || path;
  const country = cleanCountry(request.cf && request.cf.country ? request.cf.country : request.headers.get("CF-IPCountry"));
  const isPageView = eventType === "page_view";

  record.updatedAt = new Date().toISOString();
  record.events[eventType] = (record.events[eventType] || 0) + 1;

  if (isPageView) {
    record.views += 1;
    record.paths[path] = (record.paths[path] || 0) + 1;
    record.landingPages[landingPath] = (record.landingPages[landingPath] || 0) + 1;
    record.referrers[referrer] = (record.referrers[referrer] || 0) + 1;
    record.sources[source] = (record.sources[source] || 0) + 1;
    record.mediums[medium] = (record.mediums[medium] || 0) + 1;
    record.devices[device] = (record.devices[device] || 0) + 1;
    if (campaign) record.campaigns[campaign] = (record.campaigns[campaign] || 0) + 1;
    if (country) record.countries[country] = (record.countries[country] || 0) + 1;
  }

  if (eventLabel) {
    record.eventLabels[eventLabel] = (record.eventLabels[eventLabel] || 0) + 1;
  }

  if (service) {
    record.services[service] = (record.services[service] || 0) + 1;
  }

  if (isPageView && visitor && !record.visitors.includes(visitor)) {
    record.visitors.push(visitor);
  }

  if (record.visitors.length > 5000) {
    record.visitors = record.visitors.slice(-5000);
  }

  await env.EBENTEE_CONTENT.put(key, JSON.stringify(record));
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

async function trackConversion(env, request, eventType, service) {
  const todayKey = today();
  const key = analyticsKey(todayKey);
  const record = normalizeAnalyticsRecord((await env.EBENTEE_CONTENT.get(key, "json").catch(() => null)) || {
    date: todayKey
  });

  record.events[eventType] = (record.events[eventType] || 0) + 1;
  if (service) {
    record.services[service] = (record.services[service] || 0) + 1;
  }
  record.updatedAt = new Date().toISOString();
  await env.EBENTEE_CONTENT.put(key, JSON.stringify(record));
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
  const landingPages = {};
  const referrers = {};
  const sources = {};
  const mediums = {};
  const campaigns = {};
  const countries = {};
  const devices = {};
  const events = {};
  const eventLabels = {};
  const services = {};

  records.forEach((record) => {
    record.visitors.forEach((visitor) => visitors.add(visitor));
    mergeCounts(paths, record.paths);
    mergeCounts(landingPages, record.landingPages);
    mergeCounts(referrers, record.referrers);
    const recordSources = completeCountMap(record.sources, sourcesFromReferrers(record.referrers), record.views);
    const recordMediums = completeCountMap(record.mediums, mediumsFromSources(recordSources), record.views);
    mergeCounts(sources, recordSources);
    mergeCounts(mediums, recordMediums);
    mergeCounts(campaigns, record.campaigns);
    mergeCounts(countries, record.countries);
    mergeCounts(devices, record.devices);
    mergeCounts(events, record.events);
    mergeCounts(eventLabels, record.eventLabels);
    mergeCounts(services, record.services);
  });

  const todayRecord = records[records.length - 1] || normalizeAnalyticsRecord({ date: today() });
  const views = records.reduce((total, record) => total + record.views, 0);
  const searchVisits = Number(mediums.organic) || 0;

  return jsonResponse({
    days,
    totals: {
      views,
      uniqueVisitors: visitors.size,
      todayViews: todayRecord.views,
      todayUniqueVisitors: todayRecord.visitors.length,
      searchVisits
    },
    daily: records.map((record) => ({
      date: record.date,
      views: record.views,
      uniqueVisitors: record.visitors.length
    })),
    topPaths: topCounts(paths, 10),
    topLandingPages: topCounts(landingPages, 8),
    topReferrers: topCounts(referrers, 8),
    topSources: topCounts(sources, 8),
    mediums: topCounts(mediums, 8),
    campaigns: topCounts(campaigns, 8),
    countries: topCounts(countries, 10),
    devices: topCounts(devices, 5),
    events: topCounts(events, 10),
    eventLabels: topCounts(eventLabels, 10),
    services: topCounts(services, 10),
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
    portfolio: samplePortfolio,
    properties: sampleProperties,
    testimonials: sampleTestimonials,
    leads: [],
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
  const portfolio = Array.isArray(content.portfolio)
    ? content.portfolio.map(sanitizePortfolioItem).sort(sortByDateDesc)
    : samplePortfolio.map(sanitizePortfolioItem).sort(sortByDateDesc);
  const properties = Array.isArray(content.properties)
    ? content.properties.map(sanitizeProperty).sort(sortByDateDesc)
    : sampleProperties.map(sanitizeProperty).sort(sortByDateDesc);
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials.map(sanitizeTestimonial)
    : sampleTestimonials.map(sanitizeTestimonial);
  const leads = Array.isArray(content.leads) ? content.leads.map(sanitizeLead).sort(sortLeadDesc) : [];
  const admin = content.admin && typeof content.admin === "object" ? { ...content.admin } : {};

  return { version: 1, updatedAt: new Date().toISOString(), settings, posts, portfolio, properties, testimonials, leads, admin };
}

function sanitizeSettings(settings) {
  const migrated = migrateSettings(settings);
  return {
    ...defaultSettings,
    ...migrated,
    brandName: cleanText(migrated.brandName || defaultSettings.brandName, 80),
    ownerName: cleanText(migrated.ownerName || defaultSettings.ownerName, 80),
    tagline: cleanText(migrated.tagline || defaultSettings.tagline, 160),
    about: cleanText(migrated.about || defaultSettings.about, 1200),
    phone: cleanText(migrated.phone || "", 60),
    whatsapp: cleanText(migrated.whatsapp || "", 60),
    email: cleanText(migrated.email || defaultSettings.email, 120),
    location: cleanText(migrated.location || "", 120),
    youtube: cleanUrl(migrated.youtube),
    facebook: cleanUrl(migrated.facebook),
    instagram: cleanUrl(migrated.instagram),
    tiktok: cleanUrl(migrated.tiktok),
    x: cleanUrl(migrated.x),
    services: Array.isArray(migrated.services)
      ? migrated.services.map((service) => cleanText(service, 100)).filter(Boolean).slice(0, 12)
      : defaultSettings.services
  };
}

function migrateSettings(settings) {
  const migrated = { ...(settings || {}) };
  const oldTaglines = [
    "Ghana drone videos, real estate tours, construction news, and project stories.",
    "Videos, news, and building project updates."
  ];

  if (!migrated.ownerName || migrated.ownerName === "Eben Tee" || migrated.ownerName === "Your Name") {
    migrated.ownerName = defaultSettings.ownerName;
  }

  if (!migrated.tagline || oldTaglines.includes(migrated.tagline)) {
    migrated.tagline = defaultSettings.tagline;
  }

  if (
    !migrated.about ||
    String(migrated.about).startsWith("Eben Tee documents Ghana's beauty") ||
    String(migrated.about).startsWith("Eben Tee is built around visual stories")
  ) {
    migrated.about = defaultSettings.about;
  }

  if (!Array.isArray(migrated.services) || migrated.services.length < 6) {
    migrated.services = defaultSettings.services;
  }

  return migrated;
}

function sanitizePost(post) {
  const category = categories.has(post.category) ? post.category : "personal";
  const videoUrl = cleanUrl(post.videoUrl);
  return {
    id: cleanText(post.id || crypto.randomUUID(), 90),
    title: cleanText(post.title || "Untitled update", 120),
    category,
    status: post.status === "draft" ? "draft" : "published",
    publishedAt: cleanText(post.publishedAt || today(), 20),
    location: cleanText(post.location || "", 120),
    summary: cleanText(post.summary || "", 320),
    body: cleanText(post.body || "", 8000),
    coverImage: cleanCover(post.coverImage) || getYouTubeThumbnailUrl(videoUrl),
    videoUrl,
    tags: Array.isArray(post.tags) ? post.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(post.featured),
    projectStage: cleanText(post.projectStage || "", 80),
    progress: Math.max(0, Math.min(100, Number(post.progress) || 0)),
    createdAt: cleanText(post.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function sanitizePortfolioItem(item) {
  const type = item.type === "video" ? "video" : "photo";
  const mediaUrl = cleanMediaUrl(item.mediaUrl, type);
  const thumbnail =
    cleanCover(item.thumbnail) ||
    getYouTubeThumbnailUrl(mediaUrl) ||
    (type === "photo" && mediaUrl.startsWith("data:image/") ? mediaUrl : "") ||
    "";

  return {
    id: cleanText(item.id || crypto.randomUUID(), 90),
    type,
    status: item.status === "draft" ? "draft" : "published",
    title: cleanText(item.title || "Untitled portfolio item", 120),
    summary: cleanText(item.summary || "", 360),
    location: cleanText(item.location || "", 120),
    clientType: cleanText(item.clientType || "", 90),
    serviceCategory: normalizeServiceCategory(item.serviceCategory || item.clientType || ""),
    mapUrl: cleanUrl(item.mapUrl),
    mediaUrl,
    thumbnail,
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(item.featured),
    publishedAt: cleanText(item.publishedAt || today(), 20),
    createdAt: cleanText(item.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function sanitizeProperty(item) {
  const mediaUrl = cleanMediaUrl(item.mediaUrl, "photo");
  return {
    id: cleanText(item.id || crypto.randomUUID(), 90),
    title: cleanText(item.title || "Untitled property", 120),
    propertyType: cleanText(item.propertyType || "Property", 80),
    status: item.status === "draft" ? "draft" : "published",
    availability: cleanText(item.availability || "available", 80),
    location: cleanText(item.location || "", 120),
    price: cleanText(item.price || "Enquire", 100),
    size: cleanText(item.size || "", 100),
    summary: cleanText(item.summary || "", 420),
    mapUrl: cleanUrl(item.mapUrl),
    verificationNotes: cleanText(item.verificationNotes || "", 320),
    mediaUrl,
    coverImage: cleanCover(item.coverImage) || getYouTubeThumbnailUrl(mediaUrl),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(item.featured),
    publishedAt: cleanText(item.publishedAt || today(), 20),
    createdAt: cleanText(item.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function sanitizeTestimonial(item) {
  return {
    id: cleanText(item.id || crypto.randomUUID(), 90),
    name: cleanText(item.name || "Client", 90),
    role: cleanText(item.role || "", 100),
    serviceCategory: normalizeServiceCategory(item.serviceCategory || item.role || ""),
    relatedTitle: cleanText(item.relatedTitle || "", 120),
    status: item.status === "draft" ? "draft" : "published",
    quote: cleanText(item.quote || "", 600),
    rating: Math.max(1, Math.min(5, Number(item.rating) || 5)),
    createdAt: cleanText(item.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function sanitizeLead(item) {
  const status = leadStatuses.has(item.status) ? item.status : "new";
  return {
    id: cleanText(item.id || crypto.randomUUID(), 90).replace(/^post-/, "lead-"),
    status,
    name: cleanText(item.name || "", 100),
    email: cleanText(item.email || "", 140),
    phone: cleanText(item.phone || item.contact || "", 80),
    service: normalizeServiceCategory(item.service || "General Enquiry"),
    location: cleanText(item.location || "", 120),
    message: cleanText(item.message || "", 1500),
    page: cleanText(item.page || "", 180),
    source: cleanText(item.source || "Website", 80),
    attachmentName: cleanText(item.attachmentName || "", 160),
    notes: cleanText(item.notes || "", 1200),
    createdAt: cleanText(item.createdAt || new Date().toISOString(), 40),
    updatedAt: new Date().toISOString()
  };
}

function publicContent(content) {
  return {
    settings: content.settings,
    posts: content.posts.filter((post) => post.status === "published").map(publicPost).sort(sortByDateDesc),
    portfolio: content.portfolio.filter((item) => item.status === "published").map(publicPortfolioItem).sort(sortByDateDesc),
    properties: content.properties.filter((item) => item.status === "published").map(publicProperty).sort(sortByDateDesc),
    testimonials: content.testimonials.filter((item) => item.status === "published")
  };
}

function publicPost(post) {
  const videoThumb = getYouTubeThumbnailUrl(post.videoUrl);
  return {
    ...post,
    coverImage: cleanPublicImage(post.coverImage) || videoThumb || ""
  };
}

function publicPortfolioItem(item) {
  const thumbnail = cleanPublicImage(item.thumbnail) || getYouTubeThumbnailUrl(item.mediaUrl) || "";
  return {
    ...item,
    mediaUrl: item.type === "photo" && item.mediaUrl.startsWith("data:image/") ? "" : item.mediaUrl,
    thumbnail
  };
}

function publicProperty(property) {
  const coverImage = cleanPublicImage(property.coverImage) || getYouTubeThumbnailUrl(property.mediaUrl) || "";
  return {
    ...property,
    mediaUrl: property.mediaUrl.startsWith("data:image/") ? "" : property.mediaUrl,
    coverImage
  };
}

function adminContent(content) {
  return {
    settings: content.settings,
    posts: content.posts.sort(sortByDateDesc),
    portfolio: content.portfolio.sort(sortByDateDesc),
    properties: content.properties.sort(sortByDateDesc),
    testimonials: content.testimonials,
    leads: content.leads.sort(sortLeadDesc)
  };
}

async function checkLoginRateLimit(request, env) {
  const record = await readLoginRateRecord(request, env);
  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    return { allowed: false, retryAfterMs: record.lockedUntil - now };
  }
  return { allowed: true, retryAfterMs: 0 };
}

async function recordFailedLogin(request, env) {
  const key = await loginRateKey(request, env);
  const now = Date.now();
  const record = await readLoginRateRecord(request, env);
  const resetAt = record.resetAt && record.resetAt > now ? record.resetAt : now + LOGIN_WINDOW_SECONDS * 1000;
  const attempts = resetAt === record.resetAt ? record.attempts + 1 : 1;
  const lockedUntil = attempts >= LOGIN_MAX_ATTEMPTS ? now + LOGIN_LOCK_SECONDS * 1000 : 0;
  await env.EBENTEE_CONTENT.put(
    key,
    JSON.stringify({ attempts, resetAt, lockedUntil, updatedAt: new Date().toISOString() }),
    { expirationTtl: Math.max(LOGIN_WINDOW_SECONDS, LOGIN_LOCK_SECONDS) }
  );
}

async function clearLoginRateLimit(request, env) {
  await env.EBENTEE_CONTENT.delete(await loginRateKey(request, env)).catch(() => {});
}

async function readLoginRateRecord(request, env) {
  const record = (await env.EBENTEE_CONTENT.get(await loginRateKey(request, env), "json").catch(() => null)) || {};
  return {
    attempts: Math.max(0, Number(record.attempts) || 0),
    resetAt: Math.max(0, Number(record.resetAt) || 0),
    lockedUntil: Math.max(0, Number(record.lockedUntil) || 0)
  };
}

async function loginRateKey(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${sessionSecret(env)}:${ip}`));
  return `${LOGIN_RATE_PREFIX}:${base64Url(new Uint8Array(digest)).slice(0, 24)}`;
}

async function verifyPin(pin, content, env) {
  if (!pin) return false;

  if (content.admin && content.admin.pin && content.admin.pin.salt && content.admin.pin.hash) {
    const hash = await hashPin(pin, content.admin.pin.salt);
    return timingSafeEqual(hash, content.admin.pin.hash);
  }

  return Boolean(env.ADMIN_PIN) && pin === String(env.ADMIN_PIN);
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
  const secret = String(env.SESSION_SECRET || env.ADMIN_PIN || "");
  if (!secret) throw new Error("Missing SESSION_SECRET or ADMIN_PIN.");
  return secret;
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
      ...jsonHeaders(),
      ...headers
    }
  });
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };
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

function getYouTubeThumbnailUrl(value) {
  const id = getYouTubeId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getYouTubeId(value) {
  const url = String(value || "").trim();
  if (!url) return "";

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/i,
    /youtu\.be\/([^?&]+)/i,
    /youtube\.com\/shorts\/([^?&]+)/i,
    /youtube\.com\/embed\/([^?&]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/[^a-zA-Z0-9_-]/g, "");
    }
  }

  return "";
}

function cleanCover(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 750_000) return "";
  if (text.startsWith("data:image/") || text.startsWith("https://") || text.startsWith("http://")) return text;
  return "";
}

function cleanPublicImage(value) {
  const text = String(value || "").trim();
  if (/^https?:\/\//i.test(text)) return text;
  if (text.startsWith("data:image/") && text.length <= 750_000) return text;
  return "";
}

function cleanMediaUrl(value, type) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 3_500_000) return "";
  if (text.startsWith("data:image/")) return text;
  if (type === "video" && text.startsWith("data:video/")) return text;
  return cleanUrl(text);
}

async function persistUploadedMedia(payload, env) {
  if (!payload || typeof payload !== "object" || !env.EBENTEE_CONTENT) return payload;

  const posts = Array.isArray(payload.posts) ? payload.posts : [];
  const portfolio = Array.isArray(payload.portfolio) ? payload.portfolio : [];
  const properties = Array.isArray(payload.properties) ? payload.properties : [];

  await Promise.all(
    posts.map(async (post) => {
      post.coverImage = await storeDataImage(env, post.coverImage, "posts", post.id, "cover");
    })
  );

  await Promise.all(
    portfolio.map(async (item) => {
      const originalMedia = item.mediaUrl;
      item.mediaUrl = await storeDataImage(env, item.mediaUrl, "portfolio", item.id, "media");
      item.thumbnail = originalMedia && item.thumbnail === originalMedia
        ? item.mediaUrl
        : await storeDataImage(env, item.thumbnail, "portfolio", item.id, "thumbnail");
    })
  );

  await Promise.all(
    properties.map(async (property) => {
      const originalMedia = property.mediaUrl;
      property.mediaUrl = await storeDataImage(env, property.mediaUrl, "properties", property.id, "media");
      property.coverImage = originalMedia && property.coverImage === originalMedia
        ? property.mediaUrl
        : await storeDataImage(env, property.coverImage, "properties", property.id, "cover");
    })
  );

  return payload;
}

async function storeDataImage(env, value, group, id, field) {
  const parsed = parseDataImage(value);
  if (!parsed) return value;

  const digest = await crypto.subtle.digest("SHA-256", parsed.bytes);
  const fingerprint = Array.from(new Uint8Array(digest).slice(0, 8), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const safeId = String(id || crypto.randomUUID()).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 90) || crypto.randomUUID();
  const key = `${group}/${safeId}/${field}-${fingerprint}.${parsed.extension}`;

  await env.EBENTEE_CONTENT.put(`media-v1:${key}`, parsed.bytes, {
    metadata: {
      contentType: parsed.contentType
    }
  });

  return `https://ebentee.com/media-files/${key}`;
}

function parseDataImage(value) {
  const text = String(value || "").trim();
  if (!text.startsWith("data:image/") || text.length > 3_500_000) return null;

  const match = text.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([a-zA-Z0-9+/=]+)$/);
  if (!match) return null;

  const binary = atob(match[2]);
  if (!binary || binary.length > 2_500_000) return null;

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const extension = match[1] === "image/jpeg" ? "jpg" : match[1].split("/")[1];
  return { bytes, contentType: match[1], extension };
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
    landingPages: cleanCountMap(record.landingPages),
    referrers: cleanCountMap(record.referrers),
    sources: cleanCountMap(record.sources),
    mediums: cleanCountMap(record.mediums),
    campaigns: cleanCountMap(record.campaigns),
    countries: cleanCountMap(record.countries),
    devices: cleanCountMap(record.devices),
    events: cleanCountMap(record.events),
    eventLabels: cleanCountMap(record.eventLabels),
    services: cleanCountMap(record.services),
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

function cleanEventType(value) {
  const text = cleanText(value || "page_view", 60)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return text || "page_view";
}

function normalizeServiceCategory(value) {
  const text = cleanText(value || "", 100);
  if (!text) return "";
  const match = serviceOptions.find((option) => option.toLowerCase() === text.toLowerCase());
  return match || text;
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

function cleanAnalyticsSource(value, referrer) {
  const explicit = cleanText(value || "", 120);
  if (explicit) return explicit;
  if (!referrer || referrer === "Direct" || referrer === "Internal") return referrer || "Direct";

  const host = String(referrer).toLowerCase();
  if (host.includes("google.")) return "Google Search";
  if (host.includes("bing.com")) return "Bing Search";
  if (host.includes("duckduckgo.com")) return "DuckDuckGo Search";
  if (host.includes("yahoo.")) return "Yahoo Search";
  if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
  if (host.includes("facebook.com") || host.includes("fb.com")) return "Facebook";
  if (host.includes("instagram.com")) return "Instagram";
  if (host.includes("tiktok.com")) return "TikTok";
  if (host.includes("twitter.com") || host === "x.com") return "X / Twitter";
  if (host.includes("linkedin.com")) return "LinkedIn";
  return referrer;
}

function cleanAnalyticsMedium(value, source) {
  const explicit = cleanText(value || "", 80).toLowerCase();
  if (explicit) return explicit;
  if (/search/i.test(source)) return "organic";
  if (/facebook|instagram|youtube|tiktok|twitter|linkedin/i.test(source)) return "social";
  if (source === "Direct") return "none";
  if (source === "Internal") return "internal";
  return "referral";
}

function sourcesFromReferrers(referrers) {
  const sources = {};
  Object.entries(referrers || {}).forEach(([referrer, count]) => {
    const source = cleanAnalyticsSource("", referrer);
    sources[source] = (sources[source] || 0) + (Number(count) || 0);
  });
  return sources;
}

function mediumsFromSources(sources) {
  const mediums = {};
  Object.entries(sources || {}).forEach(([source, count]) => {
    const medium = cleanAnalyticsMedium("", source);
    mediums[medium] = (mediums[medium] || 0) + (Number(count) || 0);
  });
  return mediums;
}

function completeCountMap(primary, fallback, targetTotal) {
  const completed = { ...(primary || {}) };
  let missing = Math.max(0, (Number(targetTotal) || 0) - countMapTotal(completed));
  if (!missing) return completed;

  Object.entries(fallback || {})
    .sort((left, right) => (Number(right[1]) || 0) - (Number(left[1]) || 0))
    .forEach(([label, count]) => {
      if (!missing) return;
      const addition = Math.min(missing, Math.max(0, (Number(count) || 0) - (Number(completed[label]) || 0)));
      if (!addition) return;
      completed[label] = (Number(completed[label]) || 0) + addition;
      missing -= addition;
    });

  if (missing) completed.Unknown = (Number(completed.Unknown) || 0) + missing;
  return completed;
}

function countMapTotal(value) {
  return Object.values(value || {}).reduce((total, count) => total + (Number(count) || 0), 0);
}

function cleanCountry(value) {
  const code = cleanText(value || "", 2).toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : "";
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

function sortLeadDesc(a, b) {
  return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
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

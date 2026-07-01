export const SITE_URL = "https://ebentee.com";
export const BRAND_LOGO_URL = `${SITE_URL}/assets/eben-tee-logo.png`;

const CONTENT_KEY = "site-content-v1";

const categoryLabels = {
  video: "YouTube video",
  "construction-news": "Construction news",
  "building-project": "Building project",
  "service-update": "Service update",
  personal: "Update"
};

const defaultSettings = {
  brandName: "Eben Tee",
  ownerName: "Ebenezer Tetteh",
  tagline: "INSPIRE. EMPOWER. CREATE IMPACT.",
  about:
    "I am Ebenezer Tetteh, known professionally as Eben Tee. I am a Ghana-based entrepreneur, drone pilot, videographer, YouTuber, construction project manager, real estate marketer, property manager, and software/digital entrepreneur. I help people see, invest in, build, manage, and promote opportunities in Ghana with clear visual documentation and professional support.",
  location: "Accra, Ghana",
  youtube: "https://www.youtube.com/@ebentee",
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
      "Eben Tee is built around visual stories from Ghana: drone views, road trips, estate tours, construction progress, and practical updates that help people see places clearly before they visit, buy, build, or invest.\n\nWatch Eben Tee on YouTube: https://www.youtube.com/@ebentee",
    tags: ["drone services", "real estate", "construction", "Ghana", "video"]
  },
  {
    id: "sample-2",
    title: "Assin Bereku 24-hour economy market project gets sod cut",
    category: "construction-news",
    status: "published",
    publishedAt: "2026-06-26",
    location: "Assin Bereku, Central Region",
    summary:
      "GNA reports that sod has been cut for a 24-hour economy market at Assin Bereku, a project expected to support trade and local jobs.",
    body:
      "The Ghana News Agency reported on June 26, 2026 that President John Dramani Mahama cut sod for the construction of a 24-hour economy market at Assin Bereku in the Assin North District of the Central Region.\n\nSource: https://gna.org.gh/2026/06/president-mahama-cuts-sod-for-construction-of-24-hour-economy-market/",
    tags: ["market project", "Assin Bereku", "Central Region", "Ghana news"]
  }
];

export async function readPublicContent(env) {
  const stored = await env.EBENTEE_CONTENT.get(CONTENT_KEY, "json").catch(() => null);
  const source = stored && Array.isArray(stored.posts) ? stored : { settings: defaultSettings, posts: samplePosts };
  const settings = normalizeSettings(source.settings || {});
  const posts = source.posts
    .map(normalizePost)
    .filter((post) => post.status === "published")
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));

  return {
    settings,
    posts,
    updatedAt: cleanText(source.updatedAt || new Date().toISOString(), 40)
  };
}

export function categoryLabel(slug) {
  return categoryLabels[slug] || "Update";
}

export function postSlug(post) {
  const id = cleanText((post && post.id) || "post", 90).replace(/[^a-zA-Z0-9_-]/g, "");
  return `${slugify(post && post.title)}-${id}`;
}

export function findPostBySlug(posts, slug) {
  const cleaned = decodeURIComponent(String(slug || "")).replace(/^\/+|\/+$/g, "");
  return posts.find((post) => postSlug(post) === cleaned || post.id === cleaned || cleaned.endsWith(`-${post.id}`));
}

export function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeXml(value) {
  return escapeHtml(value);
}

export function plainText(value, limit = 220) {
  return cleanText(String(value || "").replace(/\s+/g, " "), limit);
}

export function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function absolutePostUrl(post) {
  return `${SITE_URL}/post/${postSlug(post)}`;
}

export function isShareableImage(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function normalizeSettings(settings) {
  const migrated = migrateSettings(settings);
  return {
    ...defaultSettings,
    ...migrated,
    brandName: cleanText(migrated.brandName || defaultSettings.brandName, 80),
    ownerName: cleanText(migrated.ownerName || defaultSettings.ownerName, 80),
    tagline: cleanText(migrated.tagline || defaultSettings.tagline, 160),
    about: cleanText(migrated.about || defaultSettings.about, 1200),
    location: cleanText(migrated.location || defaultSettings.location, 120),
    youtube: cleanUrl(migrated.youtube || defaultSettings.youtube),
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

function normalizePost(post) {
  const videoUrl = cleanUrl(post.videoUrl);
  return {
    id: cleanText(post.id || "post", 90),
    title: cleanText(post.title || "Untitled update", 120),
    category: categoryLabels[post.category] ? post.category : "personal",
    status: post.status === "draft" ? "draft" : "published",
    publishedAt: cleanText(post.publishedAt || new Date().toISOString().slice(0, 10), 20),
    location: cleanText(post.location || "", 120),
    summary: cleanText(post.summary || "", 320),
    body: cleanText(post.body || "", 8000),
    coverImage: cleanCover(post.coverImage) || getYouTubeThumbnailUrl(videoUrl),
    videoUrl,
    tags: Array.isArray(post.tags) ? post.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    projectStage: cleanText(post.projectStage || "", 80),
    progress: Math.max(0, Math.min(100, Number(post.progress) || 0)),
    updatedAt: cleanText(post.updatedAt || post.createdAt || "", 40)
  };
}

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "post"
  );
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
  if (text.length > 2_500_000) return "";
  if (text.startsWith("data:image/") || text.startsWith("https://") || text.startsWith("http://")) return text;
  return "";
}

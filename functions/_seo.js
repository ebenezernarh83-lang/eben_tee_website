export const SITE_URL = "https://ebentee.com";

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
  ownerName: "Eben Tee",
  tagline: "Drone visuals, construction stories, and project updates.",
  about:
    "I share practical updates from the work I do: building projects, construction lessons, site walkthroughs, client progress, and useful video content from the field.",
  location: "Accra, Ghana",
  youtube: "https://www.youtube.com/@ebentee",
  services: [
    "Drone services and aerial video",
    "Building project updates",
    "Site progress reporting",
    "Construction news and field notes",
    "YouTube walkthroughs and education"
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
    tags: ["roofing", "project update", "duplex"]
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
  return {
    ...defaultSettings,
    ...settings,
    brandName: cleanText(settings.brandName || defaultSettings.brandName, 80),
    ownerName: cleanText(settings.ownerName || defaultSettings.ownerName, 80),
    tagline: cleanText(settings.tagline || defaultSettings.tagline, 160),
    about: cleanText(settings.about || defaultSettings.about, 1200),
    location: cleanText(settings.location || defaultSettings.location, 120),
    youtube: cleanUrl(settings.youtube || defaultSettings.youtube),
    services: Array.isArray(settings.services)
      ? settings.services.map((service) => cleanText(service, 100)).filter(Boolean).slice(0, 12)
      : defaultSettings.services
  };
}

function normalizePost(post) {
  return {
    id: cleanText(post.id || "post", 90),
    title: cleanText(post.title || "Untitled update", 120),
    category: categoryLabels[post.category] ? post.category : "personal",
    status: post.status === "draft" ? "draft" : "published",
    publishedAt: cleanText(post.publishedAt || new Date().toISOString().slice(0, 10), 20),
    location: cleanText(post.location || "", 120),
    summary: cleanText(post.summary || "", 320),
    body: cleanText(post.body || "", 8000),
    coverImage: cleanCover(post.coverImage),
    videoUrl: cleanUrl(post.videoUrl),
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

function cleanCover(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 2_500_000) return "";
  if (text.startsWith("data:image/") || text.startsWith("https://") || text.startsWith("http://")) return text;
  return "";
}

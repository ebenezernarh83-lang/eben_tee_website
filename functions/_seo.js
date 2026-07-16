export const SITE_URL = "https://ebentee.com";
export const BRAND_LOGO_URL = `${SITE_URL}/assets/eben-tee-logo.png`;

const CONTENT_KEY = "site-content-v1";
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
  email: "ebenteeentertainment@gmail.com",
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
    featured: true
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
    featured: true
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
    tags: ["construction", "progress", "inspection"]
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
    publishedAt: "2026-06-27"
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
    publishedAt: "2026-06-26"
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
    publishedAt: "2026-06-25"
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
    rating: 5
  },
  {
    id: "testimonial-sample-2",
    name: "Real estate seller",
    role: "Drone marketing",
    serviceCategory: "Drone Services",
    status: "published",
    quote:
      "The aerial view showed the road access and surrounding area better than normal photos. It helped people understand the property quickly.",
    rating: 5
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
  const portfolioSource = Array.isArray(source.portfolio) && source.portfolio.length ? source.portfolio : samplePortfolio;
  const propertySource = Array.isArray(source.properties) && source.properties.length ? source.properties : sampleProperties;
  const testimonialSource =
    Array.isArray(source.testimonials) && source.testimonials.length ? source.testimonials : sampleTestimonials;
  const portfolio = portfolioSource
    .map(normalizePortfolioItem)
    .filter((item) => item.status === "published")
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
  const properties = propertySource
    .map(normalizeProperty)
    .filter((property) => property.status === "published")
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
  const testimonials = testimonialSource.map(normalizeTestimonial).filter((item) => item.status === "published");

  return {
    settings,
    posts,
    portfolio,
    properties,
    testimonials,
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

export function itemSlug(item, fallback) {
  const id = cleanText((item && item.id) || fallback || "item", 90).replace(/[^a-zA-Z0-9_-]/g, "");
  return `${slugify((item && item.title) || fallback || "item")}-${id}`;
}

export function findPostBySlug(posts, slug) {
  const cleaned = decodeURIComponent(String(slug || "")).replace(/^\/+|\/+$/g, "");
  return posts.find((post) => postSlug(post) === cleaned || post.id === cleaned || cleaned.endsWith(`-${post.id}`));
}

export function findItemBySlug(items, slug, fallback) {
  const cleaned = decodeURIComponent(String(slug || "")).replace(/^\/+|\/+$/g, "");
  return items.find((item) => itemSlug(item, fallback) === cleaned || item.id === cleaned || cleaned.endsWith(`-${item.id}`));
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

export function absoluteProjectUrl(post) {
  return `${SITE_URL}/project/${postSlug(post)}`;
}

export function absolutePropertyUrl(property) {
  return `${SITE_URL}/property/${itemSlug(property, "ghana-property")}`;
}

export function absolutePortfolioUrl(item) {
  return `${SITE_URL}/portfolio/${itemSlug(item, "ghana-drone-portfolio")}`;
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
    email: cleanText(migrated.email || defaultSettings.email, 120),
    youtube: cleanUrl(migrated.youtube || defaultSettings.youtube),
    facebook: cleanUrl(migrated.facebook || defaultSettings.facebook),
    instagram: cleanUrl(migrated.instagram || defaultSettings.instagram),
    tiktok: cleanUrl(migrated.tiktok || defaultSettings.tiktok),
    x: cleanUrl(migrated.x || defaultSettings.x),
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

  if (!migrated.location) migrated.location = defaultSettings.location;
  if (!migrated.email) migrated.email = defaultSettings.email;
  if (!migrated.youtube) migrated.youtube = defaultSettings.youtube;
  if (!migrated.facebook) migrated.facebook = defaultSettings.facebook;
  if (!migrated.instagram) migrated.instagram = defaultSettings.instagram;

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
    coverImage: cleanShareableCover(post.coverImage) || getYouTubeThumbnailUrl(videoUrl),
    videoUrl,
    tags: Array.isArray(post.tags) ? post.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    projectStage: cleanText(post.projectStage || "", 80),
    progress: Math.max(0, Math.min(100, Number(post.progress) || 0)),
    updatedAt: cleanText(post.updatedAt || post.createdAt || "", 40)
  };
}

function normalizePortfolioItem(item) {
  const type = item.type === "video" ? "video" : "photo";
  const mediaUrl = cleanMediaUrl(item.mediaUrl, type);
  return {
    id: cleanText(item.id || "media", 90),
    type,
    status: item.status === "draft" ? "draft" : "published",
    title: cleanText(item.title || "Untitled portfolio item", 120),
    summary: cleanText(item.summary || "", 420),
    location: cleanText(item.location || "", 120),
    clientType: cleanText(item.clientType || "", 90),
    serviceCategory: normalizeServiceCategory(item.serviceCategory || item.clientType || ""),
    mapUrl: cleanUrl(item.mapUrl),
    mediaUrl,
    thumbnail: cleanShareableCover(item.thumbnail) || getYouTubeThumbnailUrl(mediaUrl) || (type === "photo" ? cleanShareableCover(mediaUrl) : ""),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(item.featured),
    publishedAt: cleanText(item.publishedAt || new Date().toISOString().slice(0, 10), 20),
    updatedAt: cleanText(item.updatedAt || item.createdAt || "", 40)
  };
}

function normalizeProperty(item) {
  const mediaUrl = cleanMediaUrl(item.mediaUrl, "photo");
  return {
    id: cleanText(item.id || "property", 90),
    title: cleanText(item.title || "Untitled property", 120),
    propertyType: cleanText(item.propertyType || "Property", 80),
    status: item.status === "draft" ? "draft" : "published",
    availability: cleanText(item.availability || "available", 80),
    location: cleanText(item.location || "", 120),
    price: cleanText(item.price || "Enquire", 100),
    size: cleanText(item.size || "", 100),
    summary: cleanText(item.summary || "", 520),
    mapUrl: cleanUrl(item.mapUrl),
    verificationNotes: cleanText(item.verificationNotes || "", 320),
    mediaUrl,
    coverImage: cleanShareableCover(item.coverImage) || getYouTubeThumbnailUrl(mediaUrl),
    tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 16) : [],
    featured: Boolean(item.featured),
    publishedAt: cleanText(item.publishedAt || new Date().toISOString().slice(0, 10), 20),
    updatedAt: cleanText(item.updatedAt || item.createdAt || "", 40)
  };
}

function normalizeTestimonial(item) {
  return {
    id: cleanText(item.id || "testimonial", 90),
    name: cleanText(item.name || "Client", 90),
    role: cleanText(item.role || "", 100),
    serviceCategory: normalizeServiceCategory(item.serviceCategory || item.role || ""),
    status: item.status === "draft" ? "draft" : "published",
    quote: cleanText(item.quote || "", 600),
    rating: Math.max(1, Math.min(5, Number(item.rating) || 5))
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

function cleanMediaUrl(value, type) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 3_500_000) return "";
  if (text.startsWith("data:image/")) return text;
  if (type === "video" && text.startsWith("data:video/")) return text;
  return cleanUrl(text);
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

function cleanShareableCover(value) {
  const text = cleanCover(value);
  return /^https?:\/\//i.test(text) ? text : "";
}

function normalizeServiceCategory(value) {
  const text = cleanText(value || "", 100);
  if (!text) return "";
  const match = serviceOptions.find((option) => option.toLowerCase() === text.toLowerCase());
  return match || text;
}

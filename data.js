(function (window) {
  "use strict";

  const STORAGE_KEY = "build-journal-posts-v1";
  const PORTFOLIO_KEY = "build-journal-portfolio-v1";
  const SETTINGS_KEY = "build-journal-settings-v1";
  const SESSION_KEY = "build-journal-admin-unlocked";
  const PIN_KEY = "build-journal-admin-pin";

  const categories = [
    { slug: "video", label: "YouTube video" },
    { slug: "construction-news", label: "Construction news" },
    { slug: "building-project", label: "Building project" },
    { slug: "service-update", label: "Service update" },
    { slug: "personal", label: "Other update" }
  ];

  const categoryColors = {
    video: ["#1d4ed8", "#0f766e", "#f2c94c"],
    "construction-news": ["#263238", "#2e7d32", "#f2c94c"],
    "building-project": ["#14532d", "#2563eb", "#f2c94c"],
    "service-update": ["#5b2c83", "#147d64", "#f2c94c"],
    personal: ["#334155", "#b45309", "#f2c94c"]
  };

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
      progress: 100
    },
    {
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
      progress: 100
    },
    {
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
      progress: 55
    },
    {
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
      progress: 10
    },
    {
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
      progress: 100
    }
  ];

  const samplePortfolio = [
    {
      title: "Estate approach road aerial view",
      type: "photo",
      status: "published",
      publishedAt: "2026-06-27",
      location: "Accra growth corridor",
      clientType: "Real estate developer",
      summary: "Clean aerial visuals that show access roads, nearby estates, land layout, and project surroundings.",
      mediaUrl: "",
      tags: ["drone photo", "real estate", "land", "Accra"],
      featured: true
    },
    {
      title: "East Legon Hills drone walkthrough",
      type: "video",
      status: "published",
      publishedAt: "2026-06-24",
      location: "East Legon Hills, Ghana",
      clientType: "Area tour",
      summary: "A client-ready video view of roads, estates, land activity, and the fast development around East Legon Hills.",
      mediaUrl: "https://www.youtube.com/watch?v=zl6poa0trhk",
      tags: ["drone video", "real estate", "East Legon Hills"],
      featured: true
    },
    {
      title: "Construction progress inspection",
      type: "photo",
      status: "published",
      publishedAt: "2026-06-21",
      location: "Ghana project site",
      clientType: "Builder / contractor",
      summary: "Progress visuals for clients who need to see roof level, site access, surrounding buildings, and work progress.",
      mediaUrl: "",
      tags: ["construction", "progress", "inspection"],
      featured: false
    }
  ];

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function makeId() {
    return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseTags(value) {
    if (Array.isArray(value)) {
      return value.map((tag) => String(tag).trim()).filter(Boolean);
    }

    return String(value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function categoryLabel(slug) {
    const match = categories.find((category) => category.slug === slug);
    return match ? match.label : "Update";
  }

  function getCategory(slug) {
    return categories.some((category) => category.slug === slug) ? slug : "personal";
  }

  function formatDate(value) {
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    if (Number.isNaN(date.getTime())) {
      return "No date";
    }

    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
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

  function postSlug(post) {
    const id = String((post && post.id) || makeId()).replace(/[^a-zA-Z0-9_-]/g, "");
    return `${slugify(post && post.title)}-${id}`;
  }

  function postUrl(post) {
    return `/post/${postSlug(post)}`;
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

  function getYouTubeEmbedUrl(value) {
    const id = getYouTubeId(value);
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }

  function getYouTubeThumbnailUrl(value) {
    const id = getYouTubeId(value);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text || "").split(" ");
    let line = "";
    let lineCount = 0;

    for (let index = 0; index < words.length; index += 1) {
      const testLine = line ? `${line} ${words[index]}` : words[index];
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth && index > 0) {
        context.fillText(line, x, y);
        line = words[index];
        y += lineHeight;
        lineCount += 1;

        if (lineCount >= maxLines - 1) {
          break;
        }
      } else {
        line = testLine;
      }
    }

    if (line && lineCount < maxLines) {
      context.fillText(line, x, y);
    }
  }

  function createGeneratedCover(category, title) {
    if (!window.document) return "";

    const canvas = window.document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const context = canvas.getContext("2d");
    const colors = categoryColors[getCategory(category)] || categoryColors.personal;
    const gradient = context.createLinearGradient(0, 0, 960, 540);

    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.58, colors[1]);
    gradient.addColorStop(1, "#101820");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 960, 540);

    context.strokeStyle = "rgba(255, 255, 255, 0.16)";
    context.lineWidth = 4;
    for (let x = 80; x < 940; x += 120) {
      context.beginPath();
      context.moveTo(x, 70);
      context.lineTo(x - 180, 540);
      context.stroke();
    }

    context.strokeStyle = "rgba(242, 201, 76, 0.58)";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(115, 390);
    context.lineTo(845, 390);
    context.stroke();
    context.lineWidth = 6;
    for (let x = 150; x <= 820; x += 92) {
      context.beginPath();
      context.moveTo(x, 390);
      context.lineTo(x + 45, 470);
      context.stroke();
    }

    context.fillStyle = "rgba(255, 255, 255, 0.92)";
    context.fillRect(70, 70, 500, 44);
    context.fillStyle = colors[0] === "#263238" ? "#263238" : "#16201b";
    context.font = "700 22px Arial";
    context.fillText(categoryLabel(category).toUpperCase(), 94, 100);

    context.fillStyle = "#ffffff";
    context.font = "700 52px Arial";
    wrapText(context, title || "Project update", 76, 205, 790, 60, 3);

    context.fillStyle = colors[2];
    context.fillRect(76, 440, 220, 18);
    context.fillStyle = "rgba(255, 255, 255, 0.86)";
    context.font = "700 20px Arial";
    context.fillText(defaultSettings.brandName.toUpperCase(), 76, 493);

    return canvas.toDataURL("image/jpeg", 0.78);
  }

  function createPortfolioCover(type, title) {
    return createGeneratedCover(type === "video" ? "video" : "service-update", title || "Drone portfolio");
  }

  function normalizePost(post) {
    const normalized = {
      id: String(post.id || makeId()),
      title: String(post.title || "Untitled update").trim(),
      category: getCategory(post.category),
      status: post.status === "draft" ? "draft" : "published",
      publishedAt: post.publishedAt || today(),
      location: String(post.location || "").trim(),
      summary: String(post.summary || "").trim(),
      body: String(post.body || "").trim(),
      coverImage: post.coverImage || "",
      videoUrl: String(post.videoUrl || "").trim(),
      tags: parseTags(post.tags),
      featured: Boolean(post.featured),
      projectStage: String(post.projectStage || "").trim(),
      progress: Math.max(0, Math.min(100, Number(post.progress) || 0)),
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!normalized.coverImage || (normalized.id.startsWith("sample-") && normalized.coverImage.startsWith("data:image"))) {
      normalized.coverImage =
        getYouTubeThumbnailUrl(normalized.videoUrl) || createGeneratedCover(normalized.category, normalized.title);
    }

    return normalized;
  }

  function normalizePortfolioItem(item) {
    const type = item.type === "video" ? "video" : "photo";
    const mediaUrl = String(item.mediaUrl || "").trim();
    const title = String(item.title || "Untitled portfolio item").trim();
    const thumbnail =
      String(item.thumbnail || "").trim() ||
      getYouTubeThumbnailUrl(mediaUrl) ||
      (type === "photo" && mediaUrl ? mediaUrl : "") ||
      createPortfolioCover(type, title);

    return {
      id: String(item.id || makeId()).replace(/^post-/, "media-"),
      type,
      status: item.status === "draft" ? "draft" : "published",
      title,
      summary: String(item.summary || "").trim(),
      location: String(item.location || "").trim(),
      clientType: String(item.clientType || "").trim(),
      mediaUrl,
      thumbnail,
      tags: parseTags(item.tags),
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt || today(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function seedPortfolio() {
    return samplePortfolio.map((item, index) =>
      normalizePortfolioItem({
        ...item,
        id: `media-sample-${index + 1}`,
        createdAt: `2026-06-${String(25 - index).padStart(2, "0")}T08:00:00.000Z`
      })
    );
  }

  function seedPosts() {
    return samplePosts.map((post, index) =>
      normalizePost({
        ...post,
        id: `sample-${index + 1}`,
        createdAt: `2026-06-${String(20 - index).padStart(2, "0")}T08:00:00.000Z`
      })
    );
  }

  function loadPosts() {
    const stored = readJson(STORAGE_KEY, null);
    if (Array.isArray(stored) && stored.length) {
      return stored.map(normalizePost).sort(sortByDateDesc);
    }

    const seeded = seedPosts();
    savePosts(seeded);
    return seeded;
  }

  function savePosts(posts) {
    const normalized = posts.map(normalizePost).sort(sortByDateDesc);
    writeJson(STORAGE_KEY, normalized);
    return normalized;
  }

  function resetPosts() {
    const seeded = seedPosts();
    savePosts(seeded);
    return seeded;
  }

  function loadPortfolio() {
    const stored = readJson(PORTFOLIO_KEY, null);
    if (Array.isArray(stored) && stored.length) {
      return stored.map(normalizePortfolioItem).sort(sortByDateDesc);
    }

    const seeded = seedPortfolio();
    savePortfolio(seeded);
    return seeded;
  }

  function savePortfolio(items) {
    const normalized = items.map(normalizePortfolioItem).sort(sortByDateDesc);
    writeJson(PORTFOLIO_KEY, normalized);
    return normalized;
  }

  function loadSettings() {
    const stored = readJson(SETTINGS_KEY, {});
    const migrated = { ...stored };

    if (!migrated.brandName || migrated.brandName === "Build Journal") {
      migrated.brandName = defaultSettings.brandName;
    }

    if (!migrated.ownerName || migrated.ownerName === "Your Name") {
      migrated.ownerName = defaultSettings.ownerName;
    }

    return {
      ...defaultSettings,
      ...migrated,
      services: Array.isArray(migrated.services) ? migrated.services : defaultSettings.services
    };
  }

  function saveSettings(settings) {
    const nextSettings = {
      ...defaultSettings,
      ...settings,
      services: Array.isArray(settings.services)
        ? settings.services.map((service) => String(service).trim()).filter(Boolean)
        : defaultSettings.services
    };
    writeJson(SETTINGS_KEY, nextSettings);
    return nextSettings;
  }

  function sortByDateDesc(a, b) {
    return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""));
  }

  function getPublishedPosts(posts) {
    return posts.filter((post) => post.status === "published").sort(sortByDateDesc);
  }

  function getPublishedPortfolio(items) {
    return items.filter((item) => item.status === "published").sort(sortByDateDesc);
  }

  function getAdminPin() {
    return window.localStorage.getItem(PIN_KEY) || "1234";
  }

  function setAdminPin(pin) {
    window.localStorage.setItem(PIN_KEY, String(pin));
  }

  function isApiError(error, status) {
    return error && error.status === status;
  }

  async function requestJson(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      },
      ...options
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || "Request failed");
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function localPublicContent() {
    return {
      posts: getPublishedPosts(loadPosts()),
      portfolio: getPublishedPortfolio(loadPortfolio()),
      settings: loadSettings(),
      offline: true
    };
  }

  function localAdminContent() {
    return {
      posts: loadPosts(),
      portfolio: loadPortfolio(),
      settings: loadSettings(),
      offline: true
    };
  }

  function normalizeContentPayload(payload, publishedOnly) {
    const loadedPosts = Array.isArray(payload.posts) ? payload.posts.map(normalizePost).sort(sortByDateDesc) : [];
    const loadedPortfolio = Array.isArray(payload.portfolio)
      ? payload.portfolio.map(normalizePortfolioItem).sort(sortByDateDesc)
      : loadPortfolio();
    const loadedSettings = saveSettings(payload.settings || {});

    return {
      posts: publishedOnly ? getPublishedPosts(loadedPosts) : loadedPosts,
      portfolio: publishedOnly ? getPublishedPortfolio(loadedPortfolio) : loadedPortfolio,
      settings: loadedSettings,
      offline: Boolean(payload.offline)
    };
  }

  async function loadPublicContent() {
    try {
      const payload = await requestJson("/api/content");
      return normalizeContentPayload(payload, true);
    } catch (error) {
      return localPublicContent();
    }
  }

  async function loadAdminContent() {
    try {
      const payload = await requestJson("/api/admin/content");
      return normalizeContentPayload(payload, false);
    } catch (error) {
      if (isApiError(error, 401)) throw error;
      return localAdminContent();
    }
  }

  async function loadAnalytics(days = 30) {
    const safeDays = Math.max(1, Math.min(90, Number(days) || 30));
    try {
      return await requestJson(`/api/admin/analytics?days=${safeDays}`);
    } catch (error) {
      if (isApiError(error, 401)) throw error;
      return emptyAnalytics(safeDays, true);
    }
  }

  function emptyAnalytics(days, offline) {
    return {
      days,
      offline,
      totals: {
        views: 0,
        uniqueVisitors: 0,
        todayViews: 0,
        todayUniqueVisitors: 0
      },
      daily: [],
      topPaths: [],
      topReferrers: [],
      devices: [],
      updatedAt: new Date().toISOString()
    };
  }

  async function saveAdminContent(content) {
    try {
      const payload = await requestJson("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify(content)
      });
      const normalized = normalizeContentPayload(payload, false);
      writeJson(STORAGE_KEY, normalized.posts);
      writeJson(PORTFOLIO_KEY, normalized.portfolio);
      writeJson(SETTINGS_KEY, normalized.settings);
      return normalized;
    } catch (error) {
      if (isApiError(error, 401)) throw error;
      if (error && error.status) throw error;

      if (content.pin) {
        setAdminPin(content.pin);
      }
      return {
        posts: savePosts(content.posts || []),
        portfolio: savePortfolio(content.portfolio || []),
        settings: saveSettings(content.settings || {}),
        offline: true
      };
    }
  }

  async function unlockAdmin(pin) {
    try {
      await requestJson("/api/login", {
        method: "POST",
        body: JSON.stringify({ pin })
      });
      window.sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    } catch (error) {
      if (isApiError(error, 401)) return false;
      const isMatch = String(pin) === getAdminPin();
      if (isMatch) {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      }
      return isMatch;
    }
  }

  async function lockAdmin() {
    await requestJson("/api/logout", { method: "POST" }).catch(() => {});
    window.sessionStorage.removeItem(SESSION_KEY);
  }

  async function isAdminUnlocked() {
    try {
      const payload = await requestJson("/api/session");
      return Boolean(payload.authenticated);
    } catch (error) {
      return window.sessionStorage.getItem(SESSION_KEY) === "true";
    }
  }

  window.BuildHubData = {
    categories,
    defaultSettings,
    makeId,
    today,
    escapeHtml,
    parseTags,
    categoryLabel,
    formatDate,
    postSlug,
    postUrl,
    getYouTubeEmbedUrl,
    getYouTubeThumbnailUrl,
    createGeneratedCover,
    normalizePortfolioItem,
    normalizePost,
    loadPosts,
    savePosts,
    loadPortfolio,
    savePortfolio,
    resetPosts,
    loadSettings,
    saveSettings,
    loadPublicContent,
    loadAdminContent,
    loadAnalytics,
    saveAdminContent,
    getPublishedPosts,
    getPublishedPortfolio,
    getAdminPin,
    setAdminPin,
    unlockAdmin,
    lockAdmin,
    isAdminUnlocked
  };
})(window);

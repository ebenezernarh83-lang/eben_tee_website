(function (window) {
  "use strict";

  const STORAGE_KEY = "build-journal-posts-v1";
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
    tagline: "Drone visuals, construction stories, and project updates.",
    about:
      "I share practical updates from the work I do: building projects, construction lessons, site walkthroughs, client progress, and useful video content from the field.",
    phone: "+233 000 000 000",
    whatsapp: "233000000000",
    email: "hello@example.com",
    location: "Accra, Ghana",
    youtube: "https://www.youtube.com/",
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
      progress: 64
    },
    {
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
      progress: 35
    },
    {
      title: "Blockwork quality notes from the ongoing site",
      category: "construction-news",
      status: "published",
      publishedAt: "2026-06-16",
      location: "Ongoing construction",
      summary:
        "A quick construction note on block alignment, mortar joints, openings, and supervision during walling.",
      body:
        "Good blockwork is not only about speed. Alignment, mortar consistency, clean corners, lintel preparation, and opening sizes all matter.\n\nFor this site, the biggest improvement came from checking the first two courses carefully before allowing the team to move fast.",
      tags: ["blockwork", "site news", "quality"]
    },
    {
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
      progress: 78
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
      normalized.coverImage = createGeneratedCover(normalized.category, normalized.title);
    }

    return normalized;
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
      settings: loadSettings(),
      offline: true
    };
  }

  function localAdminContent() {
    return {
      posts: loadPosts(),
      settings: loadSettings(),
      offline: true
    };
  }

  function normalizeContentPayload(payload, publishedOnly) {
    const loadedPosts = Array.isArray(payload.posts) ? payload.posts.map(normalizePost).sort(sortByDateDesc) : [];
    const loadedSettings = saveSettings(payload.settings || {});

    return {
      posts: publishedOnly ? getPublishedPosts(loadedPosts) : loadedPosts,
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

  async function saveAdminContent(content) {
    try {
      const payload = await requestJson("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify(content)
      });
      const normalized = normalizeContentPayload(payload, false);
      writeJson(STORAGE_KEY, normalized.posts);
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
    getYouTubeEmbedUrl,
    createGeneratedCover,
    normalizePost,
    loadPosts,
    savePosts,
    resetPosts,
    loadSettings,
    saveSettings,
    loadPublicContent,
    loadAdminContent,
    saveAdminContent,
    getPublishedPosts,
    getAdminPin,
    setAdminPin,
    unlockAdmin,
    lockAdmin,
    isAdminUnlocked
  };
})(window);

(function (window) {
  "use strict";

  const STORAGE_KEY = "build-journal-posts-v1";
  const PORTFOLIO_KEY = "build-journal-portfolio-v1";
  const PROPERTIES_KEY = "build-journal-properties-v1";
  const TESTIMONIALS_KEY = "build-journal-testimonials-v1";
  const LEADS_KEY = "build-journal-leads-v1";
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

  const leadStatuses = ["new", "contacted", "quoted", "won", "lost", "follow-up"];

  const serviceOptions = [
    "Drone Services",
    "Media and Content Creation",
    "Church and Event Media Coverage",
    "Real Estate and Land Marketing",
    "Construction and Project Management",
    "Property and Airbnb Management",
    "Digital Products and Software",
    "Ebook / Digital Product",
    "General Enquiry"
  ];

  const contentPlanPrompts = [
    "Drone services in Ghana for real estate sellers",
    "How diaspora clients can monitor construction progress in Ghana",
    "Land inspection checklist before buying property in Ghana",
    "Best areas to film property tours around Accra growth corridors",
    "Drone and video coverage for churches, events, schools, and Ghana businesses",
    "Airbnb management tips for Ghana property owners",
    "How small businesses in Ghana can use websites and simple software",
    "Ghana infrastructure update with what it means for property buyers"
  ];

  const defaultSettings = {
    brandName: "Eben Tee",
    ownerName: "Ebenezer Tetteh",
    tagline: "INSPIRE. EMPOWER. CREATE IMPACT.",
    about:
      "I am Ebenezer Tetteh, known professionally as Eben Tee. I am a Ghana-based entrepreneur, drone pilot, videographer, YouTuber, construction project manager, real estate marketer, property manager, and software/digital entrepreneur. I help people see, invest in, build, manage, and promote opportunities in Ghana with clear visual documentation and professional support.",
    phone: "",
    whatsapp: "",
    email: "",
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
      serviceCategory: "Drone Services",
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
      serviceCategory: "Real Estate and Land Marketing",
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
      serviceCategory: "Construction and Project Management",
      summary: "Progress visuals for clients who need to see roof level, site access, surrounding buildings, and work progress.",
      mediaUrl: "",
      tags: ["construction", "progress", "inspection"],
      featured: false
    }
  ];

  const sampleProperties = [
    {
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
      mediaUrl: "",
      tags: ["land", "diaspora", "inspection", "Accra"],
      featured: true
    },
    {
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
      mediaUrl: "",
      tags: ["real estate", "property tour", "developer"],
      featured: true
    },
    {
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
      mediaUrl: "",
      tags: ["airbnb", "short stay", "property management"],
      featured: false
    }
  ];

  const sampleTestimonials = [
    {
      name: "Diaspora building client",
      role: "Construction supervision",
      serviceCategory: "Construction and Project Management",
      status: "published",
      quote:
        "The video updates made it easier to understand the site progress from abroad. I could see the work clearly without being in Ghana.",
      rating: 5
    },
    {
      name: "Real estate seller",
      role: "Drone marketing",
      serviceCategory: "Drone Services",
      status: "published",
      quote:
        "The aerial view showed the road access and surrounding area better than normal photos. It helped people understand the property quickly.",
      rating: 5
    },
    {
      name: "Short-stay owner",
      role: "Property promotion",
      serviceCategory: "Property and Airbnb Management",
      status: "published",
      quote:
        "The content looked professional and gave the apartment a stronger online presence for guests and enquiries.",
      rating: 5
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

  function itemSlug(item, fallback) {
    const safeId = String((item && item.id) || makeId()).replace(/[^a-zA-Z0-9_-]/g, "");
    return `${slugify((item && item.title) || fallback || "item")}-${safeId}`;
  }

  function propertyUrl(property) {
    return `/property/${itemSlug(property, "ghana-property")}`;
  }

  function portfolioUrl(item) {
    return `/portfolio/${itemSlug(item, "ghana-drone-portfolio")}`;
  }

  function projectUrl(post) {
    return `/project/${postSlug(post)}`;
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

  function createPropertyCover(title) {
    return createGeneratedCover("building-project", title || "Ghana property opportunity");
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
      serviceCategory: normalizeServiceCategory(item.serviceCategory || item.clientType || ""),
      mapUrl: normalizeUrl(item.mapUrl),
      mediaUrl,
      thumbnail,
      tags: parseTags(item.tags),
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt || today(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeProperty(item) {
    const title = String(item.title || "Untitled property").trim();
    const mediaUrl = String(item.mediaUrl || "").trim();
    const coverImage =
      String(item.coverImage || "").trim() ||
      getYouTubeThumbnailUrl(mediaUrl) ||
      (mediaUrl.startsWith("data:image/") ? mediaUrl : "") ||
      createPropertyCover(title);

    return {
      id: String(item.id || makeId()).replace(/^post-/, "property-"),
      title,
      propertyType: String(item.propertyType || "Property").trim(),
      status: item.status === "draft" ? "draft" : "published",
      availability: String(item.availability || "available").trim(),
      location: String(item.location || "").trim(),
      price: String(item.price || "Enquire").trim(),
      size: String(item.size || "").trim(),
      summary: String(item.summary || "").trim(),
      mapUrl: normalizeUrl(item.mapUrl),
      verificationNotes: String(item.verificationNotes || "").trim(),
      mediaUrl,
      coverImage,
      tags: parseTags(item.tags),
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt || today(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeTestimonial(item) {
    return {
      id: String(item.id || makeId()).replace(/^post-/, "testimonial-"),
      name: String(item.name || "Client").trim(),
      role: String(item.role || "").trim(),
      serviceCategory: normalizeServiceCategory(item.serviceCategory || item.role || ""),
      relatedTitle: String(item.relatedTitle || "").trim(),
      status: item.status === "draft" ? "draft" : "published",
      quote: String(item.quote || "").trim(),
      rating: Math.max(1, Math.min(5, Number(item.rating) || 5)),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeLead(item) {
    const status = leadStatuses.includes(item.status) ? item.status : "new";
    return {
      id: String(item.id || makeId()).replace(/^post-/, "lead-"),
      status,
      name: String(item.name || "").trim(),
      email: String(item.email || "").trim(),
      phone: String(item.phone || item.contact || "").trim(),
      service: normalizeServiceCategory(item.service || "General Enquiry"),
      location: String(item.location || "").trim(),
      message: String(item.message || "").trim(),
      page: String(item.page || "").trim().slice(0, 180),
      source: String(item.source || "Website").trim(),
      attachmentName: String(item.attachmentName || "").trim(),
      notes: String(item.notes || "").trim(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function normalizeServiceCategory(value) {
    const text = String(value || "").trim();
    if (!text) return "General Enquiry";
    const match = serviceOptions.find((option) => option.toLowerCase() === text.toLowerCase());
    return match || text.slice(0, 90);
  }

  function normalizeUrl(value) {
    const text = String(value || "").trim();
    if (!text) return "";

    try {
      const url = new URL(text);
      return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
    } catch (error) {
      return "";
    }
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

  function seedProperties() {
    return sampleProperties.map((item, index) =>
      normalizeProperty({
        ...item,
        id: `property-sample-${index + 1}`,
        createdAt: `2026-06-${String(25 - index).padStart(2, "0")}T08:00:00.000Z`
      })
    );
  }

  function seedTestimonials() {
    return sampleTestimonials.map((item, index) =>
      normalizeTestimonial({
        ...item,
        id: `testimonial-sample-${index + 1}`,
        createdAt: `2026-06-${String(24 - index).padStart(2, "0")}T08:00:00.000Z`
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

  function loadProperties() {
    const stored = readJson(PROPERTIES_KEY, null);
    if (Array.isArray(stored) && stored.length) {
      return stored.map(normalizeProperty).sort(sortByDateDesc);
    }

    const seeded = seedProperties();
    saveProperties(seeded);
    return seeded;
  }

  function saveProperties(items) {
    const normalized = items.map(normalizeProperty).sort(sortByDateDesc);
    writeJson(PROPERTIES_KEY, normalized);
    return normalized;
  }

  function loadTestimonials() {
    const stored = readJson(TESTIMONIALS_KEY, null);
    if (Array.isArray(stored) && stored.length) {
      return stored.map(normalizeTestimonial);
    }

    const seeded = seedTestimonials();
    saveTestimonials(seeded);
    return seeded;
  }

  function saveTestimonials(items) {
    const normalized = items.map(normalizeTestimonial);
    writeJson(TESTIMONIALS_KEY, normalized);
    return normalized;
  }

  function loadLeads() {
    const stored = readJson(LEADS_KEY, []);
    return Array.isArray(stored) ? stored.map(normalizeLead).sort(sortLeadDesc) : [];
  }

  function saveLeads(items) {
    const normalized = items.map(normalizeLead).sort(sortLeadDesc);
    writeJson(LEADS_KEY, normalized);
    return normalized;
  }

  function loadSettings() {
    const stored = readJson(SETTINGS_KEY, {});
    const migrated = migrateSettings(stored);

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
    const migrated = migrateSettings(settings || {});
    const nextSettings = {
      ...defaultSettings,
      ...migrated,
      services: Array.isArray(migrated.services)
        ? migrated.services.map((service) => String(service).trim()).filter(Boolean)
        : defaultSettings.services
    };
    writeJson(SETTINGS_KEY, nextSettings);
    return nextSettings;
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

  function sortByDateDesc(a, b) {
    return String(b.publishedAt || "").localeCompare(String(a.publishedAt || ""));
  }

  function sortLeadDesc(a, b) {
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  }

  function getPublishedPosts(posts) {
    return posts.filter((post) => post.status === "published").sort(sortByDateDesc);
  }

  function getPublishedPortfolio(items) {
    return items.filter((item) => item.status === "published").sort(sortByDateDesc);
  }

  function getPublishedProperties(items) {
    return items.filter((item) => item.status === "published").sort(sortByDateDesc);
  }

  function getPublishedTestimonials(items) {
    return items.filter((item) => item.status === "published");
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

  function shouldUseLocalFallback(error) {
    const status = Number(error && error.status);
    return !status || status === 404 || status === 405 || status === 501;
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
      properties: getPublishedProperties(loadProperties()),
      testimonials: getPublishedTestimonials(loadTestimonials()),
      settings: loadSettings(),
      offline: true
    };
  }

  function localAdminContent() {
    return {
      posts: loadPosts(),
      portfolio: loadPortfolio(),
      properties: loadProperties(),
      testimonials: loadTestimonials(),
      leads: loadLeads(),
      settings: loadSettings(),
      offline: true
    };
  }

  function normalizeContentPayload(payload, publishedOnly) {
    const loadedPosts = Array.isArray(payload.posts) ? payload.posts.map(normalizePost).sort(sortByDateDesc) : [];
    const loadedPortfolio = Array.isArray(payload.portfolio)
      ? payload.portfolio.map(normalizePortfolioItem).sort(sortByDateDesc)
      : loadPortfolio();
    const loadedProperties = Array.isArray(payload.properties)
      ? payload.properties.map(normalizeProperty).sort(sortByDateDesc)
      : loadProperties();
    const loadedTestimonials = Array.isArray(payload.testimonials)
      ? payload.testimonials.map(normalizeTestimonial)
      : loadTestimonials();
    const loadedLeads = Array.isArray(payload.leads) ? payload.leads.map(normalizeLead).sort(sortLeadDesc) : loadLeads();
    const loadedSettings = saveSettings(payload.settings || {});

    return {
      posts: publishedOnly ? getPublishedPosts(loadedPosts) : loadedPosts,
      portfolio: publishedOnly ? getPublishedPortfolio(loadedPortfolio) : loadedPortfolio,
      properties: publishedOnly ? getPublishedProperties(loadedProperties) : loadedProperties,
      testimonials: publishedOnly ? getPublishedTestimonials(loadedTestimonials) : loadedTestimonials,
      leads: publishedOnly ? [] : loadedLeads,
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
      if (!shouldUseLocalFallback(error)) throw error;
      return localAdminContent();
    }
  }

  async function loadAnalytics(days = 30) {
    const safeDays = Math.max(1, Math.min(90, Number(days) || 30));
    try {
      return await requestJson(`/api/admin/analytics?days=${safeDays}`);
    } catch (error) {
      if (isApiError(error, 401)) throw error;
      if (!shouldUseLocalFallback(error)) throw error;
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
      events: [],
      services: [],
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
      writeJson(PROPERTIES_KEY, normalized.properties);
      writeJson(TESTIMONIALS_KEY, normalized.testimonials);
      writeJson(LEADS_KEY, normalized.leads);
      writeJson(SETTINGS_KEY, normalized.settings);
      return normalized;
    } catch (error) {
      if (isApiError(error, 401)) throw error;
      if (!shouldUseLocalFallback(error)) throw error;

      if (content.pin) {
        setAdminPin(content.pin);
      }
      return {
        posts: savePosts(content.posts || []),
        portfolio: savePortfolio(content.portfolio || []),
        properties: saveProperties(content.properties || []),
        testimonials: saveTestimonials(content.testimonials || []),
        leads: saveLeads(content.leads || []),
        settings: saveSettings(content.settings || {}),
        offline: true
      };
    }
  }

  async function submitLead(lead) {
    const normalized = normalizeLead(lead || {});

    try {
      const payload = await requestJson("/api/leads", {
        method: "POST",
        body: JSON.stringify(normalized)
      });
      return normalizeLead(payload.lead || normalized);
    } catch (error) {
      if (!shouldUseLocalFallback(error)) throw error;
      const leads = saveLeads([normalized, ...loadLeads()]);
      return leads[0];
    }
  }

  async function trackEvent(eventType, detail = {}) {
    try {
      await requestJson("/api/track", {
        method: "POST",
        body: JSON.stringify({
          path: window.location.pathname,
          title: window.document.title,
          referrer: window.document.referrer || "",
          eventType,
          ...detail
        })
      });
    } catch (error) {
      // Conversion analytics should never interrupt the public site.
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
      if (!shouldUseLocalFallback(error)) return false;
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
      return shouldUseLocalFallback(error) && window.sessionStorage.getItem(SESSION_KEY) === "true";
    }
  }

  window.BuildHubData = {
    categories,
    defaultSettings,
    leadStatuses,
    serviceOptions,
    contentPlanPrompts,
    makeId,
    today,
    escapeHtml,
    parseTags,
    categoryLabel,
    formatDate,
    postSlug,
    postUrl,
    itemSlug,
    propertyUrl,
    portfolioUrl,
    projectUrl,
    getYouTubeEmbedUrl,
    getYouTubeThumbnailUrl,
    createGeneratedCover,
    normalizePortfolioItem,
    normalizeProperty,
    normalizeTestimonial,
    normalizeLead,
    normalizePost,
    loadPosts,
    savePosts,
    loadPortfolio,
    savePortfolio,
    loadProperties,
    saveProperties,
    loadTestimonials,
    saveTestimonials,
    loadLeads,
    saveLeads,
    resetPosts,
    loadSettings,
    saveSettings,
    loadPublicContent,
    loadAdminContent,
    loadAnalytics,
    saveAdminContent,
    submitLead,
    trackEvent,
    getPublishedPosts,
    getPublishedPortfolio,
    getAdminPin,
    setAdminPin,
    unlockAdmin,
    lockAdmin,
    isAdminUnlocked
  };
})(window);

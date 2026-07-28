(function () {
  "use strict";

  const store = window.BuildHubData;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Curated stills extracted from Eben Tee's own Ghana drone and project footage.
  const galleryItems = [
    {
      src: "/assets/gallery/nzulezu-water-village.jpg",
      title: "Nzulezu from above",
      description: "A wide aerial view showing the wetland, forest edge, water community, and long approach into Nzulezu.",
      label: "Ghana places",
      categories: ["drone", "places"],
      size: "wide"
    },
    {
      src: "/assets/gallery/nzulezu-resort-aerial.jpg",
      title: "Coastal resort setting",
      description: "A top-down visual that presents the accommodation, pools, landscape design, and surrounding palm trees in one frame.",
      label: "Hospitality media",
      categories: ["drone", "property", "places"],
      size: "standard"
    },
    {
      src: "/assets/gallery/nzulezu-coastline.jpg",
      title: "Ghana's western coastline",
      description: "Aerial context showing the beachfront, ocean conditions, resort setting, and coastal vegetation.",
      label: "Ghana places",
      categories: ["drone", "places"],
      size: "standard"
    },
    {
      src: "/assets/gallery/fab-homes-interior.jpg",
      title: "Finished property interior",
      description: "A clean walkthrough frame showing a completed kitchen and the value of interior property presentation.",
      label: "Property tour",
      categories: ["property"],
      size: "standard"
    },
    {
      src: "/assets/gallery/kwahu-forest-curves.jpg",
      title: "The curves of Kwahu",
      description: "A top-down drone view of the winding red road through the forested Kwahu landscape.",
      label: "Travel and landscape",
      categories: ["drone", "places"],
      size: "wide"
    },
    {
      src: "/assets/gallery/kwahu-hillside-development.jpg",
      title: "Hillside development in Kwahu",
      description: "Aerial property context showing homes, access roads, terrain, and the surrounding green hills.",
      label: "Property context",
      categories: ["drone", "property", "places"],
      size: "standard"
    },
    {
      src: "/assets/gallery/kwahu-rock-forest.jpg",
      title: "Rock and forest landscape",
      description: "An elevated view documenting Kwahu's natural rock formations and dense vegetation.",
      label: "Ghana places",
      categories: ["drone", "places"],
      size: "standard"
    },
    {
      src: "/assets/gallery/kwahu-forest-road.jpg",
      title: "Forest access road",
      description: "Aerial location documentation showing road alignment, vegetation, and access through the landscape.",
      label: "Aerial inspection",
      categories: ["drone", "places"],
      size: "standard"
    },
    {
      src: "/assets/gallery/fab-homes-close.jpg",
      title: "Fab Homes construction progress",
      description: "A close aerial view of multiple homes at different building stages across the development.",
      label: "Property development",
      categories: ["drone", "property", "construction"],
      size: "wide"
    },
    {
      src: "/assets/gallery/fab-homes-landscape.jpg",
      title: "Estate scale and surroundings",
      description: "A wider view showing how the housing development sits within the surrounding Ghanaian landscape.",
      label: "Property development",
      categories: ["drone", "property"],
      size: "standard"
    },
    {
      src: "/assets/gallery/fab-homes-estate-grid.jpg",
      title: "Estate layout from above",
      description: "Aerial documentation makes the building pattern, access routes, and remaining development area easy to understand.",
      label: "Real estate media",
      categories: ["drone", "property", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/fab-homes-estate-wide.jpg",
      title: "Development corridor",
      description: "A high, wide frame showing project scale, completed roofs, road access, and surrounding land.",
      label: "Real estate media",
      categories: ["drone", "property"],
      size: "standard"
    },
    {
      src: "/assets/gallery/fab-homes-progress.jpg",
      title: "Homes at finishing stage",
      description: "A closer project update for owners, developers, and diaspora clients following work from a distance.",
      label: "Construction update",
      categories: ["drone", "property", "construction"],
      size: "wide"
    },
    {
      src: "/assets/gallery/fab-homes-access-road.jpg",
      title: "Estate access and boundary",
      description: "A practical inspection view showing the road condition, boundary wall, vegetation, and completed homes.",
      label: "Site inspection",
      categories: ["drone", "property", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/nzulezu-site-preparation.jpg",
      title: "Early site preparation",
      description: "Visual documentation of groundwork, boundary construction, materials, and the condition of an active site.",
      label: "Construction progress",
      categories: ["drone", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/ofori-apartment-masonry.jpg",
      title: "Apartment block work",
      description: "A close project record showing masonry, openings, structural elements, and work still in progress.",
      label: "Construction progress",
      categories: ["drone", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/ofori-apartment-site.jpg",
      title: "Apartment site overview",
      description: "An overhead update showing the building footprint, site access, neighbouring work, and material areas.",
      label: "Site supervision",
      categories: ["drone", "construction"],
      size: "wide"
    },
    {
      src: "/assets/gallery/ofori-apartment-structure.jpg",
      title: "Multi-storey structure progress",
      description: "A front aerial record of the structural and block-work stage for clear remote project reporting.",
      label: "Construction progress",
      categories: ["drone", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/residential-roof-progress.jpg",
      title: "Residential roofing progress",
      description: "A roof-level drone view documenting installation quality, building form, and surrounding site conditions.",
      label: "Roofing update",
      categories: ["drone", "construction", "property"],
      size: "standard"
    },
    {
      src: "/assets/gallery/roofing-team-progress.jpg",
      title: "Roof installation on site",
      description: "A close aerial progress frame showing the roofing team, access, and current installation stage.",
      label: "Construction progress",
      categories: ["drone", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/completed-roof-residence.jpg",
      title: "Residence after roofing",
      description: "A completed roof shown in its wider neighbourhood context for owners following construction remotely.",
      label: "Project milestone",
      categories: ["drone", "construction", "property"],
      size: "wide"
    },
    {
      src: "/assets/gallery/kumasi-highway.jpg",
      title: "Kumasi highway corridor",
      description: "Road and infrastructure documentation showing lanes, traffic conditions, nearby buildings, and changing development.",
      label: "Infrastructure",
      categories: ["places", "construction"],
      size: "standard"
    },
    {
      src: "/assets/gallery/santoe-streetscape.jpg",
      title: "Growing Ghana streetscape",
      description: "A ground-level progress view documenting road work, buildings, transport, and everyday movement.",
      label: "Ghana development",
      categories: ["places", "construction"],
      size: "standard"
    }
  ];

  let settings = {};
  let allGalleryItems = galleryItems;
  let visibleItems = allGalleryItems;
  let activeIndex = 0;

  // Load saved brand settings, then connect navigation, filters, and the image viewer.
  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    settings = content.settings || store.defaultSettings;
    const managedGalleryItems = (content.gallery || []).map(managedGalleryItem).filter((item) => item.src);
    allGalleryItems = [...managedGalleryItems, ...galleryItems];
    visibleItems = allGalleryItems;
    $("#galleryTotalCount").textContent = String(allGalleryItems.length);

    bindNavigation();
    renderSettings();
    bindFilters();
    bindLightbox();
    renderGallery();
  });

  // Convert admin-managed records into the same shape as the curated gallery stills.
  function managedGalleryItem(item) {
    return {
      src: item.image || "",
      title: item.title || "Gallery image",
      description: item.description || "Eben Tee field work and visual documentation in Ghana.",
      label: item.label || "Field work",
      categories: Array.isArray(item.categories) && item.categories.length ? item.categories : ["drone"],
      size: item.size === "wide" ? "wide" : "standard"
    };
  }

  // Mobile navigation follows the same open and close behavior as the main site.
  function bindNavigation() {
    const toggle = $(".nav-toggle");
    const nav = $("#mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    $$("#mainNav a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  // Apply admin-managed brand, contact, and social details.
  function renderSettings() {
    $$("[data-setting]").forEach((node) => {
      node.textContent = settings[node.dataset.setting] || "";
    });

    const links = [
      ["YouTube", settings.youtube],
      ["Facebook", settings.facebook],
      ["Instagram", settings.instagram],
      ["GitHub", settings.github],
      ["TikTok", settings.tiktok],
      ["X", settings.x]
    ].filter(([, href]) => href);
    const socialLinks = $("#socialLinks");
    if (socialLinks) {
      socialLinks.innerHTML = links
        .map(([label, href]) => `<a href="${store.escapeHtml(href)}" target="_blank" rel="noreferrer">${store.escapeHtml(label)}</a>`)
        .join("");
    }

    const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
    $$("[data-whatsapp-link]").forEach((node) => {
      const message = node.dataset.message || "Hello Eben Tee, I want to make an enquiry from your website.";
      node.href = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : "/contact";
      if (whatsapp) {
        node.target = "_blank";
        node.rel = "noreferrer";
      } else {
        node.textContent = "Enquire";
      }
    });

    $$("[data-call-link]").forEach((node) => {
      node.href = settings.phone ? `tel:${settings.phone}` : "/contact";
      node.classList.toggle("is-hidden-contact", !settings.phone);
    });
    $$(".floating-cta").forEach((node) => node.classList.toggle("is-hidden-contact", !whatsapp && !settings.phone));
  }

  // Filters update the gallery without moving the page or rebuilding unrelated sections.
  function bindFilters() {
    $$(".gallery-page-filter").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        visibleItems =
          filter === "all" ? allGalleryItems : allGalleryItems.filter((item) => item.categories.includes(filter));
        $$(".gallery-page-filter").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderGallery();
      });
    });
  }

  // The grid uses buttons so every image is keyboard accessible.
  function renderGallery() {
    const grid = $("#galleryGrid");
    grid.innerHTML = visibleItems
      .map(
        (item, index) => `
          <button class="gallery-image-card is-${item.size}" type="button" data-gallery-index="${index}" aria-label="Open ${store.escapeHtml(item.title)}">
            <img src="${store.escapeHtml(item.src)}" alt="${store.escapeHtml(item.title)}" loading="${index < 3 ? "eager" : "lazy"}" decoding="async">
            <span class="gallery-image-overlay">
              <small>${store.escapeHtml(item.label)}</small>
              <strong>${store.escapeHtml(item.title)}</strong>
              <em>View image</em>
            </span>
          </button>
        `
      )
      .join("");

    $("#galleryResultCount").textContent = `${visibleItems.length} ${visibleItems.length === 1 ? "image" : "images"}`;
    $$("[data-gallery-index]", grid).forEach((button) => {
      button.addEventListener("click", () => openLightbox(Number(button.dataset.galleryIndex)));
    });
  }

  // The native dialog provides Escape handling; arrow keys move through visible results.
  function bindLightbox() {
    const dialog = $("#galleryLightbox");
    $("[data-lightbox-close]").addEventListener("click", () => dialog.close());
    $("[data-lightbox-previous]").addEventListener("click", () => showAdjacent(-1));
    $("[data-lightbox-next]").addEventListener("click", () => showAdjacent(1));

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showAdjacent(-1);
      if (event.key === "ArrowRight") showAdjacent(1);
    });
  }

  function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    $("#galleryLightbox").showModal();
  }

  function showAdjacent(direction) {
    activeIndex = (activeIndex + direction + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = visibleItems[activeIndex];
    $("#lightboxImage").src = item.src;
    $("#lightboxImage").alt = item.title;
    $("#lightboxCategory").textContent = item.label;
    $("#lightboxTitle").textContent = item.title;
    $("#lightboxDescription").textContent = item.description;
    $("#lightboxCounter").textContent = `${activeIndex + 1} / ${visibleItems.length}`;

    const nextItem = visibleItems[(activeIndex + 1) % visibleItems.length];
    if (nextItem) new Image().src = nextItem.src;
  }
})();

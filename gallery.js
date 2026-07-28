(function () {
  "use strict";

  const store = window.BuildHubData;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  let settings = {};
  let allGalleryItems = [];
  let visibleItems = [];
  let activeIndex = 0;

  // Load the single admin-managed gallery, then connect its filters and viewer.
  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    settings = content.settings || store.defaultSettings;
    allGalleryItems = (content.gallery || []).map(managedGalleryItem).filter((item) => item.src);
    visibleItems = allGalleryItems;
    $("#galleryTotalCount").textContent = String(allGalleryItems.length);

    bindNavigation();
    renderSettings();
    bindFilters();
    bindLightbox();
    renderGallery();
  });

  // Convert stored records into the visual shape used by the gallery grid.
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

  // Filters update only the gallery instead of moving the whole page.
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

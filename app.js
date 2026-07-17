(function () {
  "use strict";

  const store = window.BuildHubData;
  let posts = [];
  let portfolio = [];
  let properties = [];
  let testimonials = [];
  let settings = {};
  let activeFilter = "all";
  let activeSearch = "";
  let propertySearch = "";
  let propertyType = "all";
  let propertyStatus = "all";

  const serviceCards = [
    {
      title: "Drone Services",
      href: "/drone-services",
      summary: "Drone photography, videography, land inspections, construction progress updates, churches, events, hotels, resorts, and drone training.",
      cta: "Book a drone shoot"
    },
    {
      title: "Media and Content Creation",
      href: "/media",
      summary: "YouTube documentaries, Ghana development videos, church and event coverage, real estate promos, editing, channel setup, and brand storytelling.",
      cta: "Start media project"
    },
    {
      title: "Real Estate and Land Marketing",
      href: "/real-estate",
      summary: "Land promotion, property tours, sourcing support, developer marketing, and investment opportunity presentation.",
      cta: "Find property"
    },
    {
      title: "Construction and Project Management",
      href: "/construction",
      summary: "Site supervision, weekly visual updates, labour and material tracking, cost monitoring, and diaspora progress reports.",
      cta: "Request site visit"
    },
    {
      title: "Property and Airbnb Management",
      href: "/property-management",
      summary: "Guest communication, check-in support, maintenance coordination, booking monitoring, and short-stay promotion.",
      cta: "Manage my Airbnb"
    },
    {
      title: "Digital Products and Software",
      href: "/digital-products",
      summary: "Websites, business systems, MoMo agent software, construction trackers, property tools, and digital products.",
      cta: "Build a system"
    }
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    posts = content.posts;
    portfolio = content.portfolio || [];
    properties = content.properties || [];
    testimonials = content.testimonials || [];
    settings = content.settings;

    bindNavigation();
    bindFilters();
    bindPropertyFilters();
    bindContactForm();
    bindNewsletterForm();
    bindDialog();
    renderAll();
  });

  function bindNavigation() {
    const toggle = $(".nav-toggle");
    const nav = $("#mainNav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    $$("#mainNav a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  function bindFilters() {
    $$(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        $$(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip === button));
        renderPostGrid();
      });
    });

    const search = $("#siteSearch");
    if (search) {
      search.addEventListener("input", () => {
        activeSearch = search.value.trim().toLowerCase();
        renderPostGrid();
      });
    }
  }

  function bindPropertyFilters() {
    const search = $("#propertySearch");
    const type = $("#propertyTypeFilter");
    const status = $("#propertyStatusFilter");

    if (search) {
      search.addEventListener("input", () => {
        propertySearch = search.value.trim().toLowerCase();
        renderProperties();
      });
    }

    if (type) {
      type.addEventListener("change", () => {
        propertyType = type.value || "all";
        renderProperties();
      });
    }

    if (status) {
      status.addEventListener("change", () => {
        propertyStatus = status.value || "all";
        renderProperties();
      });
    }
  }

  function bindContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const contact = String(formData.get("contact") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const location = String(formData.get("location") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const file = form.querySelector('input[type="file"]')?.files?.[0];
      await store.submitLead({
        name,
        phone: contact,
        email: contact.includes("@") ? contact : "",
        service,
        location,
        message,
        page: window.location.pathname,
        attachmentName: file ? file.name : ""
      }).catch(() => {});
      window.EbenTeeAnalytics?.track("lead_form_submit", { eventLabel: "Homepage contact form" });
      const text = [
        `Hello ${settings.ownerName || "Eben Tee"}, my name is ${name}.`,
        service ? `Service needed: ${service}.` : "",
        location ? `Location: ${location}.` : "",
        message,
        `My contact is ${contact}.`,
        file ? `I also have a site/property photo to share: ${file.name}.` : ""
      ]
        .filter(Boolean)
        .join("\n");
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

      if (cleanedWhatsapp) {
        window.open(`https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (settings.email) {
        window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(text)}`;
      }
      form.reset();
    });
  }

  function bindNewsletterForm() {
    const form = $("#newsletterForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = String(new FormData(form).get("email") || "").trim();
      const text = `Hello ${settings.ownerName || "Eben Tee"}, please add me to your Ghana property, construction, and investment updates list. My email is ${email}.`;
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
      if (cleanedWhatsapp) {
        window.EbenTeeAnalytics?.track("newsletter_signup", { service: "General Enquiry", eventLabel: "Diaspora investor updates" });
        window.open(`https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (settings.email) {
        window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Diaspora investor updates")}&body=${encodeURIComponent(text)}`;
      }
      form.reset();
    });
  }

  function bindDialog() {
    const dialog = $("#postDialog");
    if (!dialog) return;

    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open-post]");
      const mediaOpener = event.target.closest("[data-open-media]");
      const closer = event.target.closest("[data-close-dialog]");

      if (opener) {
        const post = posts.find((item) => item.id === opener.dataset.openPost);
        if (post) openPostDialog(post);
      }

      if (mediaOpener) {
        const item = portfolio.find((entry) => entry.id === mediaOpener.dataset.openMedia);
        if (item) openMediaDialog(item);
      }

      if (closer) {
        closeDialog();
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });
  }

  function renderAll() {
    renderSettings();
    renderServiceCards();
    renderHero();
    renderHeroUpdates();
    renderProperties();
    renderPortfolio();
    renderPostGrid();
    renderSectionGrids();
    renderTestimonials();
  }

  function renderSettings() {
    document.title = `${settings.brandName} | Ghana Real Estate, Drone, Construction, and Digital Services`;

    $$("[data-setting]").forEach((node) => {
      const key = node.dataset.setting;
      node.textContent = settings[key] || "";
    });

    $$("[data-setting-href]").forEach((node) => {
      const key = node.dataset.settingHref;
      const value = settings[key] || "#";
      node.href = value || "#";
      node.classList.toggle("is-disabled", !settings[key]);
    });

    $$("[data-whatsapp-link]").forEach((node) => {
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
      const text = node.dataset.serviceMessage || "Hello Eben Tee, I want to make an enquiry from your website.";
      node.href = cleanedWhatsapp
        ? `https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}`
        : "#contact";
      if (cleanedWhatsapp) {
        node.target = "_blank";
        node.rel = "noreferrer";
      } else {
        node.removeAttribute("target");
        node.removeAttribute("rel");
        const label = String(node.textContent || "").trim();
        if (/whatsapp/i.test(label)) {
          node.textContent = /talk|chat/i.test(label) ? "Send an enquiry" : "Enquire";
        }
      }
    });

    $$("[data-call-link]").forEach((node) => {
      node.href = settings.phone ? `tel:${settings.phone}` : "#contact";
      node.classList.toggle("is-hidden-contact", !settings.phone);
    });

    $$("[data-brand-initials]").forEach((node) => {
      node.textContent = getInitials(settings.brandName);
    });

    const serviceList = $("#serviceList");
    if (serviceList) {
      serviceList.innerHTML = settings.services
        .map((service) => `<span>${store.escapeHtml(service)}</span>`)
        .join("");
    }

    const contactCards = $("#contactCards");
    if (contactCards) {
      contactCards.innerHTML = [
        { label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
        { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
        { label: "Location", value: settings.location, href: "" }
      ]
        .filter((item) => item.value)
        .map(
          (item) => `
            <a class="contact-card" ${item.href ? `href="${store.escapeHtml(item.href)}"` : ""}>
              <span>${store.escapeHtml(item.label)}</span>
              <strong>${store.escapeHtml(item.value)}</strong>
            </a>
          `
        )
        .join("");
    }

    const socialLinks = $("#socialLinks");
    if (socialLinks) {
      const links = [
        ["YouTube", settings.youtube],
        ["Facebook", settings.facebook],
        ["Instagram", settings.instagram],
        ["TikTok", settings.tiktok],
        ["X", settings.x]
      ].filter(([, href]) => href);

      socialLinks.innerHTML = links
        .map(
          ([label, href]) =>
            `<a href="${store.escapeHtml(href)}" target="_blank" rel="noreferrer">${store.escapeHtml(label)}</a>`
        )
        .join("");
    }
  }

  function renderServiceCards() {
    const grid = $("#servicePlatformGrid");
    if (!grid) return;

    grid.innerHTML = serviceCards
      .map(
        (service, index) => `
          <a class="service-platform-card" href="${store.escapeHtml(service.href)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${store.escapeHtml(service.title)}</strong>
            <small>${store.escapeHtml(service.summary)}</small>
            <em>${store.escapeHtml(service.cta)}</em>
          </a>
        `
      )
      .join("");
  }

  function renderHero() {
    const feature = posts.find((post) => post.featured) || posts[0];
    const hero = $("#heroFeature");
    if (!hero || !feature) return;

    hero.innerHTML = `
      <a class="tour-device" href="${store.escapeHtml(store.postUrl(feature))}" aria-label="Read featured update">
        <span class="tour-topline">
          <span>Live project</span>
          <strong>4K Tour</strong>
        </span>
        <span class="tour-title">${store.escapeHtml(feature.location || "Accra Skyline")}</span>
        <span class="tour-screen">
          <img src="${store.escapeHtml(feature.coverImage)}" alt="${store.escapeHtml(feature.title)}" decoding="async">
          <span class="tour-caption">You know how we do am</span>
          <span class="skyline-bars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </span>
        <span class="tour-metrics" aria-hidden="true">
          <span><strong>${posts.length * 30}+</strong><small>Videos</small></span>
          <span><strong>4K</strong><small>Quality</small></span>
          <span><strong>GH</strong><small>Stories</small></span>
        </span>
      </a>
      <div class="tour-note">
        <span class="pill">${store.categoryLabel(feature.category)}</span>
        <strong>${store.escapeHtml(feature.title)}</strong>
        <small>${store.escapeHtml(feature.summary)}</small>
      </div>
    `;
  }

  function renderHeroUpdates() {
    const projectCount = posts.filter((post) => post.category === "building-project").length;
    setText("#projectCount", `${projectCount} active updates`);

    const carousel = $("#heroUpdates");
    if (!carousel) return;

    const latest = posts.slice(0, 6);
    if (!latest.length) {
      carousel.innerHTML = "";
      return;
    }

    const updateCards = renderHeroUpdateCards(latest);
    const duplicateCards = renderHeroUpdateCards(latest, true);

    carousel.innerHTML = `
      <div class="hero-update-head">
        <span>Latest updates</span>
        <small>Fresh from Eben Tee</small>
      </div>
      <div class="hero-update-viewport">
        <div class="hero-update-track" data-hero-update-track>
          <div class="hero-update-group">${updateCards}</div>
          <div class="hero-update-group" aria-hidden="true">${duplicateCards}</div>
        </div>
      </div>
    `;

  }

  function renderHeroUpdateCards(items, isDuplicate = false) {
    const tabAttribute = isDuplicate ? ' tabindex="-1"' : "";
    return items
      .map(
        (post) => `
          <a class="hero-update-card" href="${store.escapeHtml(store.postUrl(post))}"${tabAttribute}>
            <span>${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</span>
            <strong>${store.escapeHtml(post.title)}</strong>
            <small>${store.escapeHtml(post.summary)}</small>
          </a>
        `
      )
      .join("");
  }

  function renderPostGrid() {
    const grid = $("#postGrid");
    const empty = $("#emptyState");
    if (!grid || !empty) return;

    const filtered = posts.filter((post) => {
      const matchesFilter = activeFilter === "all" || post.category === activeFilter;
      const haystack = [
        post.title,
        post.summary,
        post.body,
        post.location,
        store.categoryLabel(post.category),
        post.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !activeSearch || haystack.includes(activeSearch);
      return matchesFilter && matchesSearch;
    });

    grid.innerHTML = filtered.map(renderPostCard).join("");
    empty.classList.toggle("is-hidden", filtered.length > 0);
  }

  function renderSectionGrids() {
    renderMiniGrid("#videoGrid", posts.filter((post) => post.category === "video").slice(0, 3));
    renderMiniGrid("#newsGrid", posts.filter((post) => post.category === "construction-news").slice(0, 3));
    renderProjectGrid(posts.filter((post) => post.category === "building-project").slice(0, 4));
  }

  function renderProperties() {
    const grid = $("#propertyGrid");
    const empty = $("#propertyEmptyState");
    if (!grid || !empty) return;

    const filtered = properties.filter((property) => {
      const haystack = [
        property.title,
        property.propertyType,
        property.availability,
        property.location,
        property.price,
        property.size,
        property.summary,
        property.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !propertySearch || haystack.includes(propertySearch);
      const typeText = String(property.propertyType || "").toLowerCase();
      const matchesType =
        propertyType === "all" ||
        (propertyType === "land" && typeText.includes("land")) ||
        (propertyType === "house" && /house|apartment|home|estate/.test(typeText)) ||
        (propertyType === "short" && /short|airbnb|stay/.test(typeText));
      const matchesStatus =
        propertyStatus === "all" || String(property.availability || "").toLowerCase().includes(propertyStatus);
      return matchesSearch && matchesType && matchesStatus;
    });

    grid.innerHTML = filtered.map(renderPropertyCard).join("");
    empty.classList.toggle("is-hidden", filtered.length > 0);
  }

  function renderPropertyCard(property) {
    const image = property.coverImage || store.createGeneratedCover("building-project", property.title);
    const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
    const message = `Hello Eben Tee, I want to enquire about: ${property.title} in ${property.location}.`;
    const href = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : "#contact";

    return `
      <article class="property-card">
        <img src="${store.escapeHtml(image)}" alt="${store.escapeHtml(property.title)}" loading="lazy" decoding="async">
        <div class="property-card-copy">
          <span>${store.escapeHtml(property.propertyType)} · ${store.escapeHtml(property.availability)}</span>
          <strong>${store.escapeHtml(property.title)}</strong>
          <small>${store.escapeHtml(property.location)}</small>
          <p>${store.escapeHtml(property.summary)}</p>
          <div class="property-facts">
            <span>${store.escapeHtml(property.price)}</span>
            <span>${store.escapeHtml(property.size || "Details on request")}</span>
          </div>
          <a class="text-link" href="${store.escapeHtml(store.propertyUrl(property))}">View details</a>
          <a class="button small" href="${store.escapeHtml(href)}" ${whatsapp ? 'target="_blank" rel="noreferrer"' : ""}>${whatsapp ? "WhatsApp enquiry" : "Enquire"}</a>
        </div>
      </article>
    `;
  }

  function renderTestimonials() {
    const grid = $("#testimonialGrid");
    if (!grid) return;

    grid.innerHTML = testimonials.length
      ? testimonials
          .slice(0, 6)
          .map(
            (item) => `
              <article class="testimonial-card">
                <span>${"*".repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)))}</span>
                <p>${store.escapeHtml(item.quote)}</p>
                <strong>${store.escapeHtml(item.name)}</strong>
                <small>${store.escapeHtml(item.role)}</small>
              </article>
            `
          )
          .join("")
      : `<p class="empty-state">Client reviews will appear here.</p>`;
  }

  function renderPortfolio() {
    const shell = $("#portfolioShowcase");
    const grid = $("#portfolioGrid");
    if (!shell || !grid) return;

    const items = portfolio.slice(0, 8);
    const featured = items.find((item) => item.featured) || items[0];
    setText("#portfolioCount", `${portfolio.length} media items`);

    if (!items.length || !featured) {
      shell.innerHTML = `<p class="empty-state">New client work is being prepared. Contact Eben Tee to discuss your own project coverage.</p>`;
      grid.innerHTML = "";
      return;
    }

    shell.innerHTML = `
      <button class="portfolio-feature" type="button" data-open-media="${store.escapeHtml(featured.id)}">
        <span class="portfolio-feature-media">${renderPortfolioPreview(featured, true)}</span>
        <span class="portfolio-feature-copy">
          <span class="pill">${featured.type === "video" ? "Drone video" : "Drone photo"}</span>
          <strong>${store.escapeHtml(featured.title)}</strong>
          <small>${store.escapeHtml(featured.summary || "Client-ready drone visuals by Eben Tee.")}</small>
          <span>${store.escapeHtml([featured.clientType, featured.location].filter(Boolean).join(" · "))}</span>
        </span>
      </button>
    `;

    grid.innerHTML = items
      .filter((item) => item.id !== featured.id)
      .slice(0, 6)
      .map(renderPortfolioCard)
      .join("");
  }

  function renderPortfolioCard(item) {
    return `
      <button class="portfolio-card" type="button" data-open-media="${store.escapeHtml(item.id)}">
        <span class="portfolio-card-media">
          ${renderPortfolioPreview(item, false)}
          ${item.type === "video" ? '<span class="play-badge">Play</span>' : ""}
        </span>
        <span class="portfolio-card-copy">
          <small>${store.escapeHtml(item.clientType || (item.type === "video" ? "Drone video" : "Drone photo"))}</small>
          <strong>${store.escapeHtml(item.title)}</strong>
          ${item.location ? `<span>${store.escapeHtml(item.location)}</span>` : ""}
        </span>
      </button>
    `;
  }

  function renderPortfolioPreview(item, large) {
    const image = portfolioImage(item);
    const label = store.escapeHtml(item.title);

    if (image) {
      return `<img src="${store.escapeHtml(image)}" alt="${label}" loading="lazy" decoding="async">`;
    }

    if (item.type === "video" && item.mediaUrl) {
      return `<video src="${store.escapeHtml(item.mediaUrl)}" muted playsinline preload="metadata"></video>`;
    }

    return `
      <span class="portfolio-placeholder ${large ? "is-large" : ""}" aria-hidden="true">
        <span>ET</span>
      </span>
    `;
  }

  function portfolioImage(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === "photo" && item.mediaUrl) return item.mediaUrl;
    return store.getYouTubeThumbnailUrl(item.mediaUrl);
  }

  function renderMiniGrid(selector, items) {
    const container = $(selector);
    if (!container) return;

    container.innerHTML = items.length
      ? items.map(renderPostCard).join("")
      : `<p class="empty-state">No updates in this section yet.</p>`;
  }

  function renderProjectGrid(items) {
    const container = $("#projectGrid");
    if (!container) return;

    container.innerHTML = items.length
      ? items
          .map(
            (post) => `
              <article class="project-card" data-category="${store.escapeHtml(post.category)}">
                <a class="card-button" href="${store.escapeHtml(store.projectUrl(post))}" aria-label="Read ${store.escapeHtml(post.title)}">
                  <img src="${store.escapeHtml(post.coverImage)}" alt="${store.escapeHtml(post.title)}" loading="lazy" decoding="async">
                  <span class="pill">${store.escapeHtml(post.projectStage || store.categoryLabel(post.category))}</span>
                  <h3>${store.escapeHtml(post.title)}</h3>
                  <p>${store.escapeHtml(post.summary)}</p>
                  <span class="progress-track" aria-label="${post.progress} percent complete">
                    <span style="width: ${post.progress}%"></span>
                  </span>
                  <small>${post.progress}% complete</small>
                </a>
              </article>
            `
          )
          .join("")
      : `<p class="empty-state">No project updates yet.</p>`;
  }

  function renderPostCard(post) {
    const embed = store.getYouTubeEmbedUrl(post.videoUrl);
    return `
      <article class="post-card" data-category="${store.escapeHtml(post.category)}">
        <a class="card-button" href="${store.escapeHtml(store.postUrl(post))}" aria-label="Read ${store.escapeHtml(post.title)}">
          <span class="media-frame">
            <img src="${store.escapeHtml(post.coverImage)}" alt="${store.escapeHtml(post.title)}" loading="lazy" decoding="async">
            ${embed ? '<span class="play-badge">Play</span>' : ""}
          </span>
          <span class="card-content">
            <span class="card-meta">${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</span>
            <strong>${store.escapeHtml(post.title)}</strong>
            <span>${store.escapeHtml(post.summary)}</span>
            ${post.location ? `<small>${store.escapeHtml(post.location)}</small>` : ""}
          </span>
        </a>
      </article>
    `;
  }

  function openPostDialog(post) {
    const dialog = $("#postDialog");
    const content = $("#dialogContent");
    const embed = store.getYouTubeEmbedUrl(post.videoUrl);
    if (!dialog || !content) return;

    content.innerHTML = `
      <article class="dialog-article">
        <div class="dialog-media">
          ${
            embed
              ? `<iframe src="${store.escapeHtml(embed)}" title="${store.escapeHtml(post.title)}" allowfullscreen></iframe>`
              : `<img src="${store.escapeHtml(post.coverImage)}" alt="${store.escapeHtml(post.title)}">`
          }
        </div>
        <div class="dialog-body">
          <span class="pill">${store.categoryLabel(post.category)}</span>
          <h2 id="dialogTitle">${store.escapeHtml(post.title)}</h2>
          <p class="card-meta">${store.formatDate(post.publishedAt)}${post.location ? ` · ${store.escapeHtml(post.location)}` : ""}</p>
          ${renderBody(post.body)}
          ${renderTags(post.tags)}
        </div>
      </article>
    `;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "open");
    }
  }

  function openMediaDialog(item) {
    const dialog = $("#postDialog");
    const content = $("#dialogContent");
    if (!dialog || !content) return;

    content.innerHTML = `
      <article class="dialog-article portfolio-dialog-article">
        <div class="dialog-media">
          ${renderPortfolioDialogMedia(item)}
        </div>
        <div class="dialog-body">
          <span class="pill">${item.type === "video" ? "Drone video" : "Drone photo"}</span>
          <h2 id="dialogTitle">${store.escapeHtml(item.title)}</h2>
          <p class="card-meta">${store.formatDate(item.publishedAt)}${item.location ? ` · ${store.escapeHtml(item.location)}` : ""}</p>
          ${item.summary ? `<p>${store.escapeHtml(item.summary)}</p>` : ""}
          ${item.clientType ? `<p><strong>Best for:</strong> ${store.escapeHtml(item.clientType)}</p>` : ""}
          ${renderTags(item.tags)}
          <a class="button" href="#contact" data-close-dialog>Talk about a project</a>
        </div>
      </article>
    `;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "open");
    }
  }

  function renderPortfolioDialogMedia(item) {
    const embed = store.getYouTubeEmbedUrl(item.mediaUrl);
    const image = portfolioImage(item);

    if (embed) {
      return `<iframe src="${store.escapeHtml(embed)}" title="${store.escapeHtml(item.title)}" allowfullscreen></iframe>`;
    }

    if (item.type === "video" && item.mediaUrl) {
      return `<video src="${store.escapeHtml(item.mediaUrl)}" poster="${store.escapeHtml(image)}" controls playsinline></video>`;
    }

    if (image) {
      return `<img src="${store.escapeHtml(image)}" alt="${store.escapeHtml(item.title)}">`;
    }

    return `<div class="portfolio-placeholder is-large"><span>ET</span></div>`;
  }

  function closeDialog() {
    const dialog = $("#postDialog");
    if (!dialog) return;

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function renderBody(text) {
    return String(text || "")
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((paragraph) => `<p>${store.escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function renderTags(tags) {
    if (!tags.length) return "";
    return `<div class="tag-row">${tags.map((tag) => `<span>${store.escapeHtml(tag)}</span>`).join("")}</div>`;
  }

  function getInitials(value) {
    const parts = String(value || "Eben Tee").trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0] || "").join("").toUpperCase() || "ET";
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }
})();

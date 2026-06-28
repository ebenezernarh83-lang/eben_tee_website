(function () {
  "use strict";

  const store = window.BuildHubData;
  let posts = [];
  let settings = {};
  let activeFilter = "all";
  let activeSearch = "";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    posts = content.posts;
    settings = content.settings;

    bindNavigation();
    bindFilters();
    bindContactForm();
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

  function bindContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const contact = String(formData.get("contact") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const text = `Hello ${settings.ownerName}, my name is ${name}. ${message} My contact is ${contact}.`;
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

      if (cleanedWhatsapp) {
        window.open(`https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (settings.email) {
        window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(text)}`;
      }
    });
  }

  function bindDialog() {
    const dialog = $("#postDialog");
    if (!dialog) return;

    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open-post]");
      const closer = event.target.closest("[data-close-dialog]");

      if (opener) {
        const post = posts.find((item) => item.id === opener.dataset.openPost);
        if (post) openPostDialog(post);
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
    renderHero();
    renderHeroUpdates();
    renderPostGrid();
    renderSectionGrids();
  }

  function renderSettings() {
    document.title = `${settings.brandName} | Videos, News, and Projects`;

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
        ["TikTok", settings.tiktok]
      ].filter(([, href]) => href);

      socialLinks.innerHTML = links
        .map(
          ([label, href]) =>
            `<a href="${store.escapeHtml(href)}" target="_blank" rel="noreferrer">${store.escapeHtml(label)}</a>`
        )
        .join("");
    }
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
          <img src="${store.escapeHtml(feature.coverImage)}" alt="">
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
                <a class="card-button" href="${store.escapeHtml(store.postUrl(post))}" aria-label="Read ${store.escapeHtml(post.title)}">
                  <img src="${store.escapeHtml(post.coverImage)}" alt="">
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
            <img src="${store.escapeHtml(post.coverImage)}" alt="">
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
              : `<img src="${store.escapeHtml(post.coverImage)}" alt="">`
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

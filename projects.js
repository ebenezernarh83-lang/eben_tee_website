(function () {
  "use strict";

  const store = window.BuildHubData;
  let posts = [];
  let portfolio = [];
  let settings = {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    posts = content.posts || [];
    portfolio = content.portfolio || [];
    settings = content.settings || {};

    bindNavigation();
    renderSettings();
    renderProjectPage();
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

  function renderSettings() {
    document.title = `Projects | ${settings.brandName || "Eben Tee"}`;

    $$("[data-setting]").forEach((node) => {
      node.textContent = settings[node.dataset.setting] || "";
    });

    $$("[data-brand-initials]").forEach((node) => {
      node.textContent = getInitials(settings.brandName);
    });

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

  function renderProjectPage() {
    const projectPosts = posts.filter((post) => post.category === "building-project" || post.category === "service-update");
    const newsPosts = posts.filter((post) => post.category === "construction-news");
    const projectMedia = portfolio.filter((item) =>
      [item.title, item.summary, item.clientType, item.location, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .match(/project|site|estate|construction|land|road|developer|contractor|progress/)
    );
    const feature = projectMedia.find((item) => item.featured) || projectMedia[0] || portfolio[0];

    renderStats(projectPosts, newsPosts, portfolio);
    renderFeature(feature);
    renderPostGrid("#projectPageGrid", projectPosts.length ? projectPosts : posts.slice(0, 4));
    renderPostGrid("#projectNewsGrid", newsPosts.slice(0, 4));
  }

  function renderStats(projectPosts, newsPosts, mediaItems) {
    const stats = $("#projectStats");
    if (!stats) return;

    stats.innerHTML = [
      ["Project posts", projectPosts.length],
      ["Media items", mediaItems.length],
      ["News notes", newsPosts.length],
      ["Coverage", "GH"]
    ]
      .map(
        ([label, value]) => `
          <span>
            <strong>${store.escapeHtml(String(value))}</strong>
            <small>${store.escapeHtml(label)}</small>
          </span>
        `
      )
      .join("");
  }

  function renderFeature(item) {
    const media = $("#projectFeatureMedia");
    const title = $("#projectFeatureTitle");
    const summary = $("#projectFeatureSummary");
    if (!media || !title || !summary) return;

    if (!item) {
      media.innerHTML = `<div class="project-feature-placeholder">ET</div>`;
      title.textContent = "Project visuals by Eben Tee";
      summary.textContent = "Publish project media in admin to feature it here.";
      return;
    }

    title.textContent = item.title;
    summary.textContent = item.summary || "Client-ready drone visuals from Eben Tee.";
    media.innerHTML = renderMedia(item);
  }

  function renderPostGrid(selector, items) {
    const grid = $(selector);
    if (!grid) return;

    grid.innerHTML = items.length
      ? items.map(renderProjectCard).join("")
      : `<p class="empty-state">No project updates yet.</p>`;
  }

  function renderProjectCard(post) {
    return `
      <article class="project-page-card">
        <a href="${store.escapeHtml(store.projectUrl(post))}">
          <span class="project-page-media">
            <img src="${store.escapeHtml(post.coverImage)}" alt="">
          </span>
          <span class="project-page-copy">
            <small>${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</small>
            <strong>${store.escapeHtml(post.title)}</strong>
            <span>${store.escapeHtml(post.summary)}</span>
            ${post.location ? `<em>${store.escapeHtml(post.location)}</em>` : ""}
          </span>
        </a>
      </article>
    `;
  }

  function renderMedia(item) {
    const embed = store.getYouTubeEmbedUrl(item.mediaUrl);
    const image = item.thumbnail || (item.type === "photo" ? item.mediaUrl : "") || store.getYouTubeThumbnailUrl(item.mediaUrl);

    if (embed) {
      return `<iframe src="${store.escapeHtml(embed)}" title="${store.escapeHtml(item.title)}" allowfullscreen></iframe>`;
    }

    if (item.type === "video" && item.mediaUrl) {
      return `<video src="${store.escapeHtml(item.mediaUrl)}" poster="${store.escapeHtml(image)}" controls playsinline></video>`;
    }

    if (image) {
      return `<img src="${store.escapeHtml(image)}" alt="${store.escapeHtml(item.title)}">`;
    }

    return `<div class="project-feature-placeholder">ET</div>`;
  }

  function getInitials(value) {
    return String(value || "ET")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase();
  }
})();

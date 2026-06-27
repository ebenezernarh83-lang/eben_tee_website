(function () {
  "use strict";

  const store = window.BuildHubData;
  let posts = [];
  let settings = {};
  let analytics = null;
  let analyticsLoaded = false;
  let coverData = "";
  let adminEventsBound = false;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    bindLogin();
    renderShellBrand();

    if (await store.isAdminUnlocked()) {
      await showAdmin();
    } else {
      showLogin();
    }
  });

  function bindLogin() {
    const form = $("#loginForm");
    const logout = $("#logoutButton");

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const pin = $("#pinInput").value.trim();
        $("#loginMessage").textContent = "Checking...";
        if (await store.unlockAdmin(pin)) {
          $("#loginMessage").textContent = "";
          await showAdmin();
        } else {
          $("#loginMessage").textContent = "PIN did not match.";
        }
      });
    }

    if (logout) {
      logout.addEventListener("click", async () => {
        await store.lockAdmin();
        showLogin();
      });
    }
  }

  function showLogin() {
    $("#loginPanel").classList.remove("is-hidden");
    $("#adminApp").classList.add("is-hidden");
  }

  async function showAdmin() {
    try {
      const content = await store.loadAdminContent();
      posts = content.posts;
      settings = content.settings;
    } catch (error) {
      $("#loginMessage").textContent = "Please log in again.";
      await store.lockAdmin();
      showLogin();
      return;
    }

    $("#loginPanel").classList.add("is-hidden");
    $("#adminApp").classList.remove("is-hidden");
    bindAdminEvents();
    resetPostForm();
    fillSettingsForm();
    renderAdmin();
  }

  function bindAdminEvents() {
    if (adminEventsBound) return;
    adminEventsBound = true;

    $$(".tab-button").forEach((button) => {
      button.addEventListener("click", () => switchPanel(button.dataset.adminTab));
    });

    $("#postForm").addEventListener("submit", savePost);
    $("#settingsForm").addEventListener("submit", saveSettings);
    $("#newPostButton").addEventListener("click", resetPostForm);
    $("#clearCoverButton").addEventListener("click", () => {
      const category = $("#postCategory").value;
      const title = $("#postTitle").value || "New project update";
      coverData = store.createGeneratedCover(category, title);
      $("#coverInput").value = "";
      renderEditorPreview();
    });

    $("#coverInput").addEventListener("change", handleCoverUpload);
    $("#postTitle").addEventListener("input", renderEditorPreview);
    $("#postSummary").addEventListener("input", renderEditorPreview);
    $("#postCategory").addEventListener("change", renderEditorPreview);
    $("#postVideo").addEventListener("input", renderEditorPreview);
    $("#adminSearch").addEventListener("input", renderPostList);
    $("#adminStatusFilter").addEventListener("change", renderPostList);
    $("#adminPostList").addEventListener("click", handlePostAction);
    $("#analyticsDays").addEventListener("change", loadAnalytics);
    $("#refreshAnalyticsButton").addEventListener("click", loadAnalytics);
    $("#exportButton").addEventListener("click", exportContent);
    $("#importInput").addEventListener("change", importContent);
    $("#resetButton").addEventListener("click", resetContent);
  }

  function switchPanel(panelName) {
    $$(".tab-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.adminTab === panelName);
    });

    $$("[data-panel]").forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.panel !== panelName);
    });

    if (panelName === "analytics" && !analyticsLoaded) {
      loadAnalytics();
    }
  }

  async function persistContent(message, pin = "") {
    try {
      const result = await store.saveAdminContent({ posts, settings, pin });
      posts = result.posts;
      settings = result.settings;

      if (result.offline) {
        setMessage("#postMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#settingsMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#importMessage", "Saved locally. Deploy Functions to save online.");
      } else if (message) {
        setMessage("#postMessage", message);
        setMessage("#settingsMessage", message);
        setMessage("#importMessage", message);
      }
      return true;
    } catch (error) {
      const messageText = error && error.status === 401 ? "Please log in again." : "Could not save online. Try again.";
      setMessage("#postMessage", messageText);
      setMessage("#settingsMessage", messageText);
      setMessage("#importMessage", messageText);
      if (error && error.status === 401) {
        await store.lockAdmin();
        showLogin();
      }
      return false;
    }
  }

  async function savePost(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "").trim();
    const existing = posts.find((post) => post.id === id);
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "personal");
    const featured = Boolean(formData.get("featured"));
    const videoUrl = String(formData.get("videoUrl") || "").trim();
    const existingAutoCover = existing && isAutoYouTubeCover(existing.coverImage, existing.videoUrl);
    const coverImage =
      coverData ||
      store.getYouTubeThumbnailUrl(videoUrl) ||
      (existingAutoCover ? "" : existing && existing.coverImage) ||
      store.createGeneratedCover(category, title);
    const nextPost = store.normalizePost({
      ...(existing || {}),
      id: existing ? existing.id : store.makeId(),
      title,
      category,
      status: String(formData.get("status") || "published"),
      publishedAt: String(formData.get("publishedAt") || store.today()),
      location: String(formData.get("location") || ""),
      summary: String(formData.get("summary") || ""),
      body: String(formData.get("body") || ""),
      videoUrl,
      projectStage: String(formData.get("projectStage") || ""),
      progress: Number(formData.get("progress") || 0),
      tags: store.parseTags(formData.get("tags")),
      featured,
      coverImage
    });

    if (featured) {
      posts = posts.map((post) => ({ ...post, featured: false }));
    }

    if (existing) {
      posts = posts.map((post) => (post.id === existing.id ? nextPost : post));
    } else {
      posts = [nextPost, ...posts];
    }

    $("#postMessage").textContent = "Saving...";
    if (!(await persistContent("Post saved online."))) return;
    editPost(nextPost.id);
    renderAdmin();
  }

  async function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      $("#postMessage").textContent = "Choose an image file.";
      event.target.value = "";
      return;
    }

    $("#postMessage").textContent = "Preparing cover image...";
    try {
      coverData = await resizeCoverImage(file);
      $("#postMessage").textContent = "Cover image ready.";
      renderEditorPreview();
    } catch (error) {
      $("#postMessage").textContent = "Could not prepare this image. Try a smaller JPG or PNG.";
      event.target.value = "";
    }
  }

  async function handlePostAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") editPost(id);
    if (action === "delete") await deletePost(id);
    if (action === "duplicate") await duplicatePost(id);
    if (action === "publish") await toggleStatus(id);
    if (action === "feature") await featurePost(id);
  }

  function editPost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    coverData = isAutoYouTubeCover(post.coverImage, post.videoUrl) ? "" : post.coverImage;
    $("#editorTitle").textContent = "Edit post";
    $("#postId").value = post.id;
    $("#postTitle").value = post.title;
    $("#postCategory").value = post.category;
    $("#postStatus").value = post.status;
    $("#postDate").value = post.publishedAt;
    $("#postLocation").value = post.location;
    $("#postSummary").value = post.summary;
    $("#postBody").value = post.body;
    $("#postVideo").value = post.videoUrl;
    $("#postStage").value = post.projectStage;
    $("#postProgress").value = post.progress;
    $("#postTags").value = post.tags.join(", ");
    $("#postFeatured").checked = post.featured;
    $("#coverInput").value = "";
    $("#postMessage").textContent = "";
    renderEditorPreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    const confirmed = window.confirm(`Delete "${post.title}"?`);
    if (!confirmed) return;

    posts = posts.filter((item) => item.id !== id);
    if (!(await persistContent("Post deleted online."))) return;
    resetPostForm();
    renderAdmin();
  }

  async function duplicatePost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    const copy = store.normalizePost({
      ...post,
      id: store.makeId(),
      title: `${post.title} copy`,
      status: "draft",
      featured: false,
      createdAt: new Date().toISOString()
    });

    posts = [copy, ...posts];
    if (!(await persistContent("Post copied online."))) return;
    renderAdmin();
    editPost(copy.id);
  }

  async function toggleStatus(id) {
    posts = posts.map((post) =>
      post.id === id ? { ...post, status: post.status === "published" ? "draft" : "published" } : post
    );
    if (!(await persistContent("Post status updated online."))) return;
    renderAdmin();
  }

  async function featurePost(id) {
    posts = posts.map((post) => ({ ...post, featured: post.id === id }));
    if (!(await persistContent("Featured post updated online."))) return;
    renderAdmin();
  }

  function resetPostForm() {
    coverData = "";
    $("#editorTitle").textContent = "New post";
    $("#postForm").reset();
    $("#postId").value = "";
    $("#postDate").value = store.today();
    $("#postStatus").value = "published";
    $("#postProgress").value = 0;
    $("#postMessage").textContent = "";
    coverData = "";
    renderEditorPreview();
  }

  async function saveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pin = String(formData.get("pin") || "").trim();
    const pinConfirm = String(formData.get("pinConfirm") || "").trim();

    if (pin || pinConfirm) {
      if (pin.length < 4) {
        $("#settingsMessage").textContent = "Use at least 4 digits for the PIN.";
        return;
      }

      if (pin !== pinConfirm) {
        $("#settingsMessage").textContent = "PIN confirmation did not match.";
        return;
      }

    }

    settings = {
      brandName: String(formData.get("brandName") || ""),
      ownerName: String(formData.get("ownerName") || ""),
      tagline: String(formData.get("tagline") || ""),
      about: String(formData.get("about") || ""),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      email: String(formData.get("email") || ""),
      location: String(formData.get("location") || ""),
      youtube: String(formData.get("youtube") || ""),
      facebook: String(formData.get("facebook") || ""),
      instagram: String(formData.get("instagram") || ""),
      tiktok: String(formData.get("tiktok") || ""),
      services: String(formData.get("services") || "")
        .split("\n")
        .map((service) => service.trim())
        .filter(Boolean)
    };

    $("#settingsMessage").textContent = "Saving...";
    if (!(await persistContent("Settings saved online.", pin))) return;
    $("#settingPin").value = "";
    $("#settingPinConfirm").value = "";
    renderShellBrand();
  }

  function fillSettingsForm() {
    $("#settingBrand").value = settings.brandName;
    $("#settingOwner").value = settings.ownerName;
    $("#settingTagline").value = settings.tagline;
    $("#settingAbout").value = settings.about;
    $("#settingPhone").value = settings.phone;
    $("#settingWhatsapp").value = settings.whatsapp;
    $("#settingEmail").value = settings.email;
    $("#settingLocation").value = settings.location;
    $("#settingYoutube").value = settings.youtube;
    $("#settingFacebook").value = settings.facebook;
    $("#settingInstagram").value = settings.instagram;
    $("#settingTiktok").value = settings.tiktok;
    $("#settingServices").value = settings.services.join("\n");
  }

  function renderAdmin() {
    renderStats();
    renderPostList();
    renderEditorPreview();
    renderAnalytics();
  }

  function renderStats() {
    $("#adminPublishedCount").textContent = posts.filter((post) => post.status === "published").length;
    $("#adminDraftCount").textContent = posts.filter((post) => post.status === "draft").length;
    $("#adminFeaturedCount").textContent = posts.filter((post) => post.featured).length;
  }

  function renderPostList() {
    const list = $("#adminPostList");
    const search = $("#adminSearch").value.trim().toLowerCase();
    const status = $("#adminStatusFilter").value;

    const filtered = posts.filter((post) => {
      const matchesStatus = status === "all" || post.status === status;
      const haystack = [post.title, post.summary, post.location, store.categoryLabel(post.category), post.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!search || haystack.includes(search));
    });

    list.innerHTML = filtered.length
      ? filtered.map(renderManagerItem).join("")
      : `<p class="empty-state">No posts found.</p>`;
  }

  function renderManagerItem(post) {
    return `
      <article class="manager-item" data-category="${store.escapeHtml(post.category)}">
        <img src="${store.escapeHtml(post.coverImage)}" alt="">
        <div>
          <span class="card-meta">${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</span>
          <h3>${store.escapeHtml(post.title)}</h3>
          <p>${store.escapeHtml(post.summary)}</p>
          <div class="tag-row compact">
            <span>${post.status}</span>
            ${post.featured ? "<span>featured</span>" : ""}
          </div>
        </div>
        <div class="manager-actions">
          <button type="button" data-action="edit" data-id="${store.escapeHtml(post.id)}">Edit</button>
          <button type="button" data-action="publish" data-id="${store.escapeHtml(post.id)}">${
            post.status === "published" ? "Draft" : "Publish"
          }</button>
          <button type="button" data-action="feature" data-id="${store.escapeHtml(post.id)}">Feature</button>
          <button type="button" data-action="duplicate" data-id="${store.escapeHtml(post.id)}">Copy</button>
          <button class="danger-link" type="button" data-action="delete" data-id="${store.escapeHtml(post.id)}">Delete</button>
        </div>
      </article>
    `;
  }

  function renderEditorPreview() {
    const preview = $("#editorPreview");
    if (!preview) return;

    const title = $("#postTitle").value || "New post title";
    const summary = $("#postSummary").value || "Your short update preview will appear here.";
    const category = $("#postCategory").value || "building-project";
    const videoUrl = $("#postVideo").value || "";
    const image = coverData || store.getYouTubeThumbnailUrl(videoUrl) || store.createGeneratedCover(category, title);

    preview.innerHTML = `
      <img src="${store.escapeHtml(image)}" alt="">
      <div>
        <span class="pill">${store.categoryLabel(category)}</span>
        <h3>${store.escapeHtml(title)}</h3>
        <p>${store.escapeHtml(summary)}</p>
      </div>
    `;
  }

  function isAutoYouTubeCover(coverImage, videoUrl) {
    return Boolean(coverImage && videoUrl && coverImage === store.getYouTubeThumbnailUrl(videoUrl));
  }

  function resizeCoverImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;
      reader.onload = () => {
        const dataUrl = String(reader.result || "");

        if (file.type === "image/svg+xml") {
          if (dataUrl.length > 1_500_000) reject(new Error("SVG too large"));
          else resolve(dataUrl);
          return;
        }

        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const maxWidth = 1600;
          const ratio = Math.min(1, maxWidth / Math.max(1, image.naturalWidth || image.width));
          const width = Math.max(1, Math.round((image.naturalWidth || image.width) * ratio));
          const height = Math.max(1, Math.round((image.naturalHeight || image.height) * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.84);

          if (compressed.length > 2_300_000) reject(new Error("Image too large"));
          else resolve(compressed);
        };
        image.src = dataUrl;
      };

      reader.readAsDataURL(file);
    });
  }

  async function loadAnalytics() {
    analyticsLoaded = true;
    const days = Number($("#analyticsDays").value) || 30;
    $("#analyticsMessage").textContent = "Loading analytics...";

    try {
      analytics = await store.loadAnalytics(days);
      renderAnalytics();
      $("#analyticsMessage").textContent = analytics.offline
        ? "Analytics is available on the live Cloudflare site."
        : `Updated ${new Date(analytics.updatedAt).toLocaleString()}.`;
    } catch (error) {
      if (error && error.status === 401) {
        $("#analyticsMessage").textContent = "Please log in again.";
        await store.lockAdmin();
        showLogin();
        return;
      }

      $("#analyticsMessage").textContent = "Could not load analytics. Try again.";
    }
  }

  function renderAnalytics() {
    if (!analytics) {
      setText("#analyticsTotalViews", "0");
      setText("#analyticsUniqueVisitors", "0");
      setText("#analyticsTodayViews", "0");
      setText("#analyticsTopPage", "None yet");
      renderDailyChart([]);
      renderCountList("#analyticsTopPaths", []);
      renderCountList("#analyticsReferrers", []);
      renderCountList("#analyticsDevices", []);
      return;
    }

    setText("#analyticsTotalViews", analytics.totals.views);
    setText("#analyticsUniqueVisitors", analytics.totals.uniqueVisitors);
    setText("#analyticsTodayViews", analytics.totals.todayViews);
    setText("#analyticsTopPage", analytics.topPaths[0] ? analytics.topPaths[0].label : "None yet");
    renderDailyChart(analytics.daily || []);
    renderCountList("#analyticsTopPaths", analytics.topPaths || []);
    renderCountList("#analyticsReferrers", analytics.topReferrers || []);
    renderCountList("#analyticsDevices", analytics.devices || []);
  }

  function renderDailyChart(items) {
    const chart = $("#analyticsDailyChart");
    if (!chart) return;

    const max = Math.max(1, ...items.map((item) => Number(item.views) || 0));
    chart.innerHTML = items.length
      ? items
          .map((item) => {
            const height = Math.max(6, Math.round(((Number(item.views) || 0) / max) * 100));
            const label = item.date.slice(5);
            return `
              <span class="analytics-bar" title="${store.escapeHtml(item.date)}: ${item.views} visits">
                <i style="height: ${height}%"></i>
                <small>${store.escapeHtml(label)}</small>
              </span>
            `;
          })
          .join("")
      : `<p class="empty-state">No visits recorded yet.</p>`;
  }

  function renderCountList(selector, items) {
    const list = $(selector);
    if (!list) return;

    list.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <div class="analytics-row">
                <span>${store.escapeHtml(item.label)}</span>
                <strong>${Number(item.count) || 0}</strong>
              </div>
            `
          )
          .join("")
      : `<p class="empty-state">No data yet.</p>`;
  }

  function renderShellBrand() {
    settings = store.loadSettings();
    $$("[data-setting]").forEach((node) => {
      node.textContent = settings[node.dataset.setting] || "";
    });
    $$("[data-brand-initials]").forEach((node) => {
      node.textContent = getInitials(settings.brandName);
    });
  }

  function exportContent() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      posts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "build-journal-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importContent(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        if (!Array.isArray(payload.posts)) {
          throw new Error("Missing posts array");
        }

        posts = payload.posts.map(store.normalizePost);
        if (payload.settings) {
          settings = payload.settings;
        }

        if (!(await persistContent("Import saved online."))) return;
        fillSettingsForm();
        renderShellBrand();
        renderAdmin();
        $("#importMessage").textContent = "Import saved online.";
      } catch (error) {
        $("#importMessage").textContent = "This JSON file could not be imported.";
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  async function resetContent() {
    const confirmed = window.confirm("Reset all posts to sample content?");
    if (!confirmed) return;

    posts = store.resetPosts();
    if (!(await persistContent("Sample content restored online."))) return;
    resetPostForm();
    renderAdmin();
  }

  function getInitials(value) {
    const parts = String(value || "Eben Tee").trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0] || "").join("").toUpperCase() || "ET";
  }

  function setMessage(selector, message) {
    const node = $(selector);
    if (node) node.textContent = message;
  }
})();

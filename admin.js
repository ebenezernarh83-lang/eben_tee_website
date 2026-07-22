(function () {
  "use strict";

  const store = window.BuildHubData;
  let posts = [];
  let portfolio = [];
  let properties = [];
  let testimonials = [];
  let leads = [];
  let settings = {};
  let analytics = null;
  let analyticsLoaded = false;
  let coverData = "";
  let portfolioUploadData = "";
  let propertyUploadData = "";
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
      portfolio = content.portfolio || [];
      properties = content.properties || [];
      testimonials = content.testimonials || [];
      leads = content.leads || [];
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
    resetPortfolioForm();
    resetPropertyForm();
    resetTestimonialForm();
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
    $("#portfolioForm").addEventListener("submit", savePortfolioItem);
    $("#propertyForm").addEventListener("submit", saveProperty);
    $("#testimonialForm").addEventListener("submit", saveTestimonial);
    $("#settingsForm").addEventListener("submit", saveSettings);
    $("#newPostButton").addEventListener("click", resetPostForm);
    $("#newPortfolioButton").addEventListener("click", resetPortfolioForm);
    $("#newPropertyButton").addEventListener("click", resetPropertyForm);
    $("#newTestimonialButton").addEventListener("click", resetTestimonialForm);
    $("#clearCoverButton").addEventListener("click", () => {
      const category = $("#postCategory").value;
      const title = $("#postTitle").value || "New project update";
      coverData = store.createGeneratedCover(category, title);
      $("#coverInput").value = "";
      renderEditorPreview();
    });
    $("#clearPortfolioMediaButton").addEventListener("click", () => {
      portfolioUploadData = "";
      $("#portfolioFile").value = "";
      renderPortfolioPreview();
    });
    $("#clearPropertyMediaButton").addEventListener("click", () => {
      propertyUploadData = "";
      $("#propertyFile").value = "";
      renderPropertyPreview();
    });

    $("#coverInput").addEventListener("change", handleCoverUpload);
    $("#portfolioFile").addEventListener("change", handlePortfolioUpload);
    $("#propertyFile").addEventListener("change", handlePropertyUpload);
    $("#postTitle").addEventListener("input", renderEditorPreview);
    $("#postSummary").addEventListener("input", renderEditorPreview);
    $("#postCategory").addEventListener("change", renderEditorPreview);
    $("#postVideo").addEventListener("input", renderEditorPreview);
    $("#portfolioTitle").addEventListener("input", renderPortfolioPreview);
    $("#portfolioSummary").addEventListener("input", renderPortfolioPreview);
    $("#portfolioType").addEventListener("change", renderPortfolioPreview);
    $("#portfolioMediaUrl").addEventListener("input", renderPortfolioPreview);
    $("#propertyTitle").addEventListener("input", renderPropertyPreview);
    $("#propertySummary").addEventListener("input", renderPropertyPreview);
    $("#propertyMediaUrl").addEventListener("input", renderPropertyPreview);
    $("#testimonialName").addEventListener("input", renderTestimonialPreview);
    $("#testimonialRole").addEventListener("input", renderTestimonialPreview);
    $("#testimonialQuote").addEventListener("input", renderTestimonialPreview);
    $("#testimonialRating").addEventListener("input", renderTestimonialPreview);
    $("#adminSearch").addEventListener("input", renderPostList);
    $("#adminStatusFilter").addEventListener("change", renderPostList);
    $("#adminPostList").addEventListener("click", handlePostAction);
    $("#portfolioSearch").addEventListener("input", renderPortfolioList);
    $("#portfolioStatusFilter").addEventListener("change", renderPortfolioList);
    $("#portfolioList").addEventListener("click", handlePortfolioAction);
    $("#propertyAdminSearch").addEventListener("input", renderPropertyList);
    $("#propertyAdminStatusFilter").addEventListener("change", renderPropertyList);
    $("#propertyList").addEventListener("click", handlePropertyAction);
    $("#testimonialSearch").addEventListener("input", renderTestimonialList);
    $("#testimonialStatusFilter").addEventListener("change", renderTestimonialList);
    $("#testimonialList").addEventListener("click", handleTestimonialAction);
    $("#leadSearch").addEventListener("input", renderLeadList);
    $("#leadStatusFilter").addEventListener("change", renderLeadList);
    $("#leadList").addEventListener("click", handleLeadAction);
    $("#refreshLeadsButton").addEventListener("click", async () => {
      const content = await store.loadAdminContent();
      leads = content.leads || leads;
      renderLeadList();
      setMessage("#leadMessage", "Lead inbox refreshed.");
    });
    $("#analyticsDays").addEventListener("change", loadAnalytics);
    $("#refreshAnalyticsButton").addEventListener("click", loadAnalytics);
    window.setInterval(() => {
      const panel = $('[data-panel="analytics"]');
      if (panel && !panel.classList.contains("is-hidden") && !$("#adminApp").classList.contains("is-hidden")) {
        loadAnalytics({ silent: true });
      }
    }, 60000);
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
      const result = await store.saveAdminContent({ posts, portfolio, properties, testimonials, leads, settings, pin });
      posts = result.posts;
      portfolio = result.portfolio || [];
      properties = result.properties || [];
      testimonials = result.testimonials || [];
      leads = result.leads || [];
      settings = result.settings;

      if (result.offline) {
        setMessage("#postMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#portfolioMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#propertyMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#testimonialMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#leadMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#settingsMessage", "Saved locally. Deploy Functions to save online.");
        setMessage("#importMessage", "Saved locally. Deploy Functions to save online.");
      } else if (message) {
        setMessage("#postMessage", message);
        setMessage("#portfolioMessage", message);
        setMessage("#propertyMessage", message);
        setMessage("#testimonialMessage", message);
        setMessage("#leadMessage", message);
        setMessage("#settingsMessage", message);
        setMessage("#importMessage", message);
      }
      return true;
    } catch (error) {
      const messageText = error && error.status === 401 ? "Please log in again." : "Could not save online. Try again.";
      setMessage("#postMessage", messageText);
      setMessage("#portfolioMessage", messageText);
      setMessage("#propertyMessage", messageText);
      setMessage("#testimonialMessage", messageText);
      setMessage("#leadMessage", messageText);
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

  async function savePortfolioItem(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "").trim();
    const existing = portfolio.find((item) => item.id === id);
    const type = String(formData.get("type") || "photo") === "video" ? "video" : "photo";
    const title = String(formData.get("title") || "").trim();
    const rawMediaUrl = String(formData.get("mediaUrl") || "").trim();
    const mediaUrl = portfolioUploadData || rawMediaUrl || (existing && existing.mediaUrl) || "";
    const uploadChanged = Boolean(portfolioUploadData || rawMediaUrl);
    const thumbnail =
      type === "photo" && mediaUrl.startsWith("data:image/")
        ? mediaUrl
        : store.getYouTubeThumbnailUrl(mediaUrl) || (uploadChanged ? "" : existing && existing.thumbnail) || "";
    const featured = Boolean(formData.get("featured"));
    const nextItem = store.normalizePortfolioItem({
      ...(existing || {}),
      id: existing ? existing.id : store.makeId().replace(/^post-/, "media-"),
      type,
      status: String(formData.get("status") || "published"),
      title,
      publishedAt: String(formData.get("publishedAt") || store.today()),
      location: String(formData.get("location") || ""),
      clientType: String(formData.get("clientType") || ""),
      summary: String(formData.get("summary") || ""),
      mediaUrl,
      thumbnail,
      tags: store.parseTags(formData.get("tags")),
      featured
    });

    if (featured) {
      portfolio = portfolio.map((item) => ({ ...item, featured: false }));
    }

    if (existing) {
      portfolio = portfolio.map((item) => (item.id === existing.id ? nextItem : item));
    } else {
      portfolio = [nextItem, ...portfolio];
    }

    $("#portfolioMessage").textContent = "Saving...";
    if (!(await persistContent("Portfolio media saved online."))) return;
    editPortfolioItem(nextItem.id);
    renderAdmin();
  }

  async function handlePortfolioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    $("#portfolioMessage").textContent = "Preparing media...";
    try {
      if (file.type.startsWith("image/")) {
        portfolioUploadData = await resizeCoverImage(file);
        $("#portfolioType").value = "photo";
      } else if (file.type.startsWith("video/")) {
        portfolioUploadData = await readLimitedFile(file, 2_400_000, 3_500_000);
        $("#portfolioType").value = "video";
      } else {
        throw new Error("Unsupported media type");
      }

      $("#portfolioMediaUrl").value = "";
      $("#portfolioMessage").textContent =
        file.type.startsWith("video/")
          ? "Short video ready. For long videos, paste a YouTube link instead."
          : "Photo ready.";
      renderPortfolioPreview();
    } catch (error) {
      $("#portfolioMessage").textContent =
        file.type.startsWith("video/")
          ? "Video is too large for direct upload. Upload it to YouTube and paste the link here."
          : "Could not prepare this image. Try a smaller JPG or PNG.";
      event.target.value = "";
    }
  }

  async function handlePortfolioAction(event) {
    const button = event.target.closest("[data-media-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.mediaAction;

    if (action === "edit") editPortfolioItem(id);
    if (action === "delete") await deletePortfolioItem(id);
    if (action === "publish") await togglePortfolioStatus(id);
    if (action === "feature") await featurePortfolioItem(id);
  }

  function editPortfolioItem(id) {
    const item = portfolio.find((entry) => entry.id === id);
    if (!item) return;

    portfolioUploadData = "";
    $("#portfolioEditorTitle").textContent = "Edit media item";
    $("#portfolioId").value = item.id;
    $("#portfolioTitle").value = item.title;
    $("#portfolioType").value = item.type;
    $("#portfolioStatus").value = item.status;
    $("#portfolioDate").value = item.publishedAt;
    $("#portfolioLocation").value = item.location;
    $("#portfolioClientType").value = item.clientType;
    $("#portfolioSummary").value = item.summary;
    $("#portfolioMediaUrl").value = item.mediaUrl.startsWith("data:") ? "" : item.mediaUrl;
    $("#portfolioTags").value = item.tags.join(", ");
    $("#portfolioFeatured").checked = item.featured;
    $("#portfolioFile").value = "";
    $("#portfolioMessage").textContent = "";
    renderPortfolioPreview();
  }

  async function deletePortfolioItem(id) {
    const item = portfolio.find((entry) => entry.id === id);
    if (!item) return;

    const confirmed = window.confirm(`Delete "${item.title}" from the portfolio?`);
    if (!confirmed) return;

    portfolio = portfolio.filter((entry) => entry.id !== id);
    if (!(await persistContent("Portfolio media deleted online."))) return;
    resetPortfolioForm();
    renderAdmin();
  }

  async function togglePortfolioStatus(id) {
    portfolio = portfolio.map((item) =>
      item.id === id ? { ...item, status: item.status === "published" ? "draft" : "published" } : item
    );
    if (!(await persistContent("Portfolio status updated online."))) return;
    renderAdmin();
  }

  async function featurePortfolioItem(id) {
    portfolio = portfolio.map((item) => ({ ...item, featured: item.id === id }));
    if (!(await persistContent("Featured portfolio media updated online."))) return;
    renderAdmin();
  }

  function resetPortfolioForm() {
    portfolioUploadData = "";
    $("#portfolioEditorTitle").textContent = "New media item";
    $("#portfolioForm").reset();
    $("#portfolioId").value = "";
    $("#portfolioDate").value = store.today();
    $("#portfolioStatus").value = "published";
    $("#portfolioType").value = "photo";
    $("#portfolioMessage").textContent = "";
    renderPortfolioPreview();
  }

  async function saveProperty(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "").trim();
    const existing = properties.find((item) => item.id === id);
    const title = String(formData.get("title") || "").trim();
    const mediaUrl = propertyUploadData || String(formData.get("mediaUrl") || "").trim() || (existing && existing.mediaUrl) || "";
    const coverImage =
      (propertyUploadData && propertyUploadData.startsWith("data:image/") ? propertyUploadData : "") ||
      store.getYouTubeThumbnailUrl(mediaUrl) ||
      (existing && existing.coverImage) ||
      store.createGeneratedCover("building-project", title);
    const featured = Boolean(formData.get("featured"));
    const nextProperty = store.normalizeProperty({
      ...(existing || {}),
      id: existing ? existing.id : store.makeId().replace(/^post-/, "property-"),
      title,
      propertyType: String(formData.get("propertyType") || ""),
      status: String(formData.get("status") || "published"),
      availability: String(formData.get("availability") || ""),
      publishedAt: String(formData.get("publishedAt") || store.today()),
      location: String(formData.get("location") || ""),
      price: String(formData.get("price") || ""),
      size: String(formData.get("size") || ""),
      summary: String(formData.get("summary") || ""),
      mediaUrl,
      coverImage,
      tags: store.parseTags(formData.get("tags")),
      featured
    });

    if (featured) {
      properties = properties.map((property) => ({ ...property, featured: false }));
    }

    properties = existing
      ? properties.map((property) => (property.id === existing.id ? nextProperty : property))
      : [nextProperty, ...properties];

    $("#propertyMessage").textContent = "Saving...";
    if (!(await persistContent("Property saved online."))) return;
    editProperty(nextProperty.id);
    renderAdmin();
  }

  async function handlePropertyUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      $("#propertyMessage").textContent = "Choose an image file.";
      event.target.value = "";
      return;
    }

    $("#propertyMessage").textContent = "Preparing property image...";
    try {
      propertyUploadData = await resizeCoverImage(file);
      $("#propertyMediaUrl").value = "";
      $("#propertyMessage").textContent = "Property image ready.";
      renderPropertyPreview();
    } catch (error) {
      $("#propertyMessage").textContent = "Could not prepare this image. Try a smaller JPG or PNG.";
      event.target.value = "";
    }
  }

  async function handlePropertyAction(event) {
    const button = event.target.closest("[data-property-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.propertyAction;

    if (action === "edit") editProperty(id);
    if (action === "delete") await deleteProperty(id);
    if (action === "publish") await togglePropertyStatus(id);
    if (action === "feature") await featureProperty(id);
  }

  function editProperty(id) {
    const property = properties.find((item) => item.id === id);
    if (!property) return;

    propertyUploadData = "";
    $("#propertyEditorTitle").textContent = "Edit property";
    $("#propertyId").value = property.id;
    $("#propertyTitle").value = property.title;
    $("#propertyType").value = property.propertyType;
    $("#propertyStatus").value = property.status;
    $("#propertyAvailability").value = property.availability;
    $("#propertyDate").value = property.publishedAt;
    $("#propertyLocation").value = property.location;
    $("#propertyPrice").value = property.price;
    $("#propertySize").value = property.size;
    $("#propertySummary").value = property.summary;
    $("#propertyMediaUrl").value = property.mediaUrl && property.mediaUrl.startsWith("data:") ? "" : property.mediaUrl;
    $("#propertyTags").value = property.tags.join(", ");
    $("#propertyFeatured").checked = property.featured;
    $("#propertyFile").value = "";
    $("#propertyMessage").textContent = "";
    renderPropertyPreview();
  }

  async function deleteProperty(id) {
    const property = properties.find((item) => item.id === id);
    if (!property) return;

    const confirmed = window.confirm(`Delete "${property.title}"?`);
    if (!confirmed) return;

    properties = properties.filter((item) => item.id !== id);
    if (!(await persistContent("Property deleted online."))) return;
    resetPropertyForm();
    renderAdmin();
  }

  async function togglePropertyStatus(id) {
    properties = properties.map((property) =>
      property.id === id ? { ...property, status: property.status === "published" ? "draft" : "published" } : property
    );
    if (!(await persistContent("Property status updated online."))) return;
    renderAdmin();
  }

  async function featureProperty(id) {
    properties = properties.map((property) => ({ ...property, featured: property.id === id }));
    if (!(await persistContent("Featured property updated online."))) return;
    renderAdmin();
  }

  function resetPropertyForm() {
    propertyUploadData = "";
    $("#propertyEditorTitle").textContent = "New property";
    $("#propertyForm").reset();
    $("#propertyId").value = "";
    $("#propertyDate").value = store.today();
    $("#propertyStatus").value = "published";
    $("#propertyAvailability").value = "available";
    $("#propertyMessage").textContent = "";
    renderPropertyPreview();
  }

  async function saveTestimonial(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "").trim();
    const existing = testimonials.find((item) => item.id === id);
    const nextTestimonial = store.normalizeTestimonial({
      ...(existing || {}),
      id: existing ? existing.id : store.makeId().replace(/^post-/, "testimonial-"),
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || ""),
      status: String(formData.get("status") || "published"),
      quote: String(formData.get("quote") || ""),
      rating: Number(formData.get("rating") || 5)
    });

    testimonials = existing
      ? testimonials.map((item) => (item.id === existing.id ? nextTestimonial : item))
      : [nextTestimonial, ...testimonials];

    $("#testimonialMessage").textContent = "Saving...";
    if (!(await persistContent("Testimonial saved online."))) return;
    editTestimonial(nextTestimonial.id);
    renderAdmin();
  }

  async function handleTestimonialAction(event) {
    const button = event.target.closest("[data-testimonial-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.testimonialAction;

    if (action === "edit") editTestimonial(id);
    if (action === "delete") await deleteTestimonial(id);
    if (action === "publish") await toggleTestimonialStatus(id);
  }

  function editTestimonial(id) {
    const item = testimonials.find((entry) => entry.id === id);
    if (!item) return;

    $("#testimonialEditorTitle").textContent = "Edit testimonial";
    $("#testimonialId").value = item.id;
    $("#testimonialName").value = item.name;
    $("#testimonialRole").value = item.role;
    $("#testimonialStatus").value = item.status;
    $("#testimonialRating").value = item.rating;
    $("#testimonialQuote").value = item.quote;
    $("#testimonialMessage").textContent = "";
    renderTestimonialPreview();
  }

  async function deleteTestimonial(id) {
    const item = testimonials.find((entry) => entry.id === id);
    if (!item) return;

    const confirmed = window.confirm(`Delete testimonial from "${item.name}"?`);
    if (!confirmed) return;

    testimonials = testimonials.filter((entry) => entry.id !== id);
    if (!(await persistContent("Testimonial deleted online."))) return;
    resetTestimonialForm();
    renderAdmin();
  }

  async function toggleTestimonialStatus(id) {
    testimonials = testimonials.map((item) =>
      item.id === id ? { ...item, status: item.status === "published" ? "draft" : "published" } : item
    );
    if (!(await persistContent("Testimonial status updated online."))) return;
    renderAdmin();
  }

  function resetTestimonialForm() {
    $("#testimonialEditorTitle").textContent = "New testimonial";
    $("#testimonialForm").reset();
    $("#testimonialId").value = "";
    $("#testimonialStatus").value = "published";
    $("#testimonialRating").value = 5;
    $("#testimonialMessage").textContent = "";
    renderTestimonialPreview();
  }

  async function handleLeadAction(event) {
    const button = event.target.closest("[data-lead-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.leadAction;
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;

    if (action === "delete") {
      const confirmed = window.confirm(`Delete lead from "${lead.name || "website visitor"}"?`);
      if (!confirmed) return;
      leads = leads.filter((item) => item.id !== id);
      $("#leadMessage").textContent = "Saving...";
      if (!(await persistContent("Lead deleted online."))) return;
      renderAdmin();
      return;
    }

    const statuses = store.leadStatuses || ["new", "contacted", "quoted", "won", "lost", "follow-up"];
    if (!statuses.includes(action)) return;

    leads = leads.map((item) =>
      item.id === id ? store.normalizeLead({ ...item, status: action, updatedAt: new Date().toISOString() }) : item
    );
    $("#leadMessage").textContent = "Saving...";
    if (!(await persistContent("Lead status updated online."))) return;
    renderAdmin();
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
      github: String(formData.get("github") || ""),
      tiktok: String(formData.get("tiktok") || ""),
      x: String(formData.get("x") || ""),
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
    $("#settingGithub").value = settings.github || "";
    $("#settingTiktok").value = settings.tiktok;
    $("#settingX").value = settings.x || "";
    $("#settingServices").value = settings.services.join("\n");
  }

  function renderAdmin() {
    renderStats();
    renderPostList();
    renderPortfolioList();
    renderPropertyList();
    renderTestimonialList();
    renderLeadList();
    renderContentPlan();
    renderEditorPreview();
    renderPortfolioPreview();
    renderPropertyPreview();
    renderTestimonialPreview();
    renderAnalytics();
  }

  function renderStats() {
    $("#adminPublishedCount").textContent = posts.filter((post) => post.status === "published").length;
    $("#adminDraftCount").textContent = posts.filter((post) => post.status === "draft").length;
    $("#adminFeaturedCount").textContent = posts.filter((post) => post.featured).length;
    $("#adminMediaCount").textContent = portfolio.length;
    $("#adminPropertyCount").textContent = properties.length;
    $("#adminTestimonialCount").textContent = testimonials.length;
    $("#adminLeadCount").textContent = leads.length;
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

  function renderPortfolioList() {
    const list = $("#portfolioList");
    if (!list) return;

    const search = $("#portfolioSearch").value.trim().toLowerCase();
    const status = $("#portfolioStatusFilter").value;
    const filtered = portfolio.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const haystack = [item.title, item.summary, item.location, item.clientType, item.type, item.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!search || haystack.includes(search));
    });

    list.innerHTML = filtered.length
      ? filtered.map(renderPortfolioManagerItem).join("")
      : `<p class="empty-state">No portfolio media found.</p>`;
  }

  function renderPortfolioManagerItem(item) {
    return `
      <article class="manager-item" data-category="${store.escapeHtml(item.type)}">
        ${renderPortfolioManagerThumb(item)}
        <div>
          <span class="card-meta">${item.type === "video" ? "Drone video" : "Drone photo"} · ${store.formatDate(item.publishedAt)}</span>
          <h3>${store.escapeHtml(item.title)}</h3>
          <p>${store.escapeHtml(item.summary || item.location || "Client portfolio media")}</p>
          <div class="tag-row compact">
            <span>${item.status}</span>
            ${item.featured ? "<span>featured</span>" : ""}
          </div>
        </div>
        <div class="manager-actions">
          <button type="button" data-media-action="edit" data-id="${store.escapeHtml(item.id)}">Edit</button>
          <button type="button" data-media-action="publish" data-id="${store.escapeHtml(item.id)}">${
            item.status === "published" ? "Draft" : "Publish"
          }</button>
          <button type="button" data-media-action="feature" data-id="${store.escapeHtml(item.id)}">Feature</button>
          <button class="danger-link" type="button" data-media-action="delete" data-id="${store.escapeHtml(item.id)}">Delete</button>
        </div>
      </article>
    `;
  }

  function renderPortfolioManagerThumb(item) {
    const image = portfolioThumbnail(item);
    if (image) {
      return `<img src="${store.escapeHtml(image)}" alt="">`;
    }

    if (item.type === "video" && item.mediaUrl) {
      return `<video src="${store.escapeHtml(item.mediaUrl)}" muted playsinline preload="metadata"></video>`;
    }

    return `<span class="manager-media-placeholder">ET</span>`;
  }

  function renderPropertyList() {
    const list = $("#propertyList");
    if (!list) return;

    const search = $("#propertyAdminSearch").value.trim().toLowerCase();
    const status = $("#propertyAdminStatusFilter").value;
    const filtered = properties.filter((property) => {
      const matchesStatus = status === "all" || property.status === status;
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
      return matchesStatus && (!search || haystack.includes(search));
    });

    list.innerHTML = filtered.length
      ? filtered.map(renderPropertyManagerItem).join("")
      : `<p class="empty-state">No properties found.</p>`;
  }

  function renderPropertyManagerItem(property) {
    return `
      <article class="manager-item" data-category="property">
        <img src="${store.escapeHtml(property.coverImage || store.createGeneratedCover("building-project", property.title))}" alt="">
        <div>
          <span class="card-meta">${store.escapeHtml(property.propertyType)} · ${store.escapeHtml(property.availability)}</span>
          <h3>${store.escapeHtml(property.title)}</h3>
          <p>${store.escapeHtml([property.location, property.price, property.size].filter(Boolean).join(" · "))}</p>
          <div class="tag-row compact">
            <span>${property.status}</span>
            ${property.featured ? "<span>featured</span>" : ""}
          </div>
        </div>
        <div class="manager-actions">
          <button type="button" data-property-action="edit" data-id="${store.escapeHtml(property.id)}">Edit</button>
          <button type="button" data-property-action="publish" data-id="${store.escapeHtml(property.id)}">${
            property.status === "published" ? "Draft" : "Publish"
          }</button>
          <button type="button" data-property-action="feature" data-id="${store.escapeHtml(property.id)}">Feature</button>
          <button class="danger-link" type="button" data-property-action="delete" data-id="${store.escapeHtml(property.id)}">Delete</button>
        </div>
      </article>
    `;
  }

  function renderTestimonialList() {
    const list = $("#testimonialList");
    if (!list) return;

    const search = $("#testimonialSearch").value.trim().toLowerCase();
    const status = $("#testimonialStatusFilter").value;
    const filtered = testimonials.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const haystack = [item.name, item.role, item.quote].join(" ").toLowerCase();
      return matchesStatus && (!search || haystack.includes(search));
    });

    list.innerHTML = filtered.length
      ? filtered.map(renderTestimonialManagerItem).join("")
      : `<p class="empty-state">No testimonials found.</p>`;
  }

  function renderTestimonialManagerItem(item) {
    return `
      <article class="manager-item" data-category="testimonial">
        <span class="manager-media-placeholder">"</span>
        <div>
          <span class="card-meta">${store.escapeHtml(item.role || "Client review")} · ${item.rating}/5</span>
          <h3>${store.escapeHtml(item.name)}</h3>
          <p>${store.escapeHtml(item.quote)}</p>
          <div class="tag-row compact"><span>${item.status}</span></div>
        </div>
        <div class="manager-actions">
          <button type="button" data-testimonial-action="edit" data-id="${store.escapeHtml(item.id)}">Edit</button>
          <button type="button" data-testimonial-action="publish" data-id="${store.escapeHtml(item.id)}">${
            item.status === "published" ? "Draft" : "Publish"
          }</button>
          <button class="danger-link" type="button" data-testimonial-action="delete" data-id="${store.escapeHtml(item.id)}">Delete</button>
        </div>
      </article>
    `;
  }

  function renderLeadList() {
    const list = $("#leadList");
    if (!list) return;

    const search = $("#leadSearch").value.trim().toLowerCase();
    const status = $("#leadStatusFilter").value;
    const filtered = leads.filter((lead) => {
      const matchesStatus = status === "all" || lead.status === status;
      const haystack = [lead.name, lead.email, lead.phone, lead.service, lead.location, lead.message, lead.source, lead.page]
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!search || haystack.includes(search));
    });

    list.innerHTML = filtered.length
      ? filtered.map(renderLeadItem).join("")
      : `<p class="empty-state">No leads yet. Website enquiries will appear here.</p>`;
  }

  function renderLeadItem(lead) {
    const contactLinks = [
      lead.phone ? `<a href="tel:${store.escapeHtml(lead.phone)}">Call</a>` : "",
      lead.email ? `<a href="mailto:${store.escapeHtml(lead.email)}">Email</a>` : "",
      lead.phone
        ? `<a href="https://wa.me/${store.escapeHtml(lead.phone.replace(/\D/g, ""))}" target="_blank" rel="noreferrer">WhatsApp</a>`
        : ""
    ]
      .filter(Boolean)
      .join("");

    return `
      <article class="lead-item">
        <div>
          <span class="card-meta">${store.escapeHtml(lead.service)} · ${formatDateTime(lead.createdAt)}</span>
          <h3>${store.escapeHtml(lead.name || "Website visitor")}</h3>
          <p>${store.escapeHtml(lead.message || "No message provided.")}</p>
          <div class="tag-row compact">
            <span>${store.escapeHtml(lead.status)}</span>
            ${lead.location ? `<span>${store.escapeHtml(lead.location)}</span>` : ""}
            ${lead.page ? `<span>${store.escapeHtml(lead.page)}</span>` : ""}
          </div>
          <div class="lead-contact-links">${contactLinks}</div>
        </div>
        <div class="manager-actions lead-actions">
          <button type="button" data-lead-action="new" data-id="${store.escapeHtml(lead.id)}">New</button>
          <button type="button" data-lead-action="contacted" data-id="${store.escapeHtml(lead.id)}">Contacted</button>
          <button type="button" data-lead-action="quoted" data-id="${store.escapeHtml(lead.id)}">Quoted</button>
          <button type="button" data-lead-action="follow-up" data-id="${store.escapeHtml(lead.id)}">Follow-up</button>
          <button type="button" data-lead-action="won" data-id="${store.escapeHtml(lead.id)}">Won</button>
          <button type="button" data-lead-action="lost" data-id="${store.escapeHtml(lead.id)}">Lost</button>
          <button class="danger-link" type="button" data-lead-action="delete" data-id="${store.escapeHtml(lead.id)}">Delete</button>
        </div>
      </article>
    `;
  }

  function renderContentPlan() {
    const list = $("#contentPromptList");
    if (!list) return;

    list.innerHTML = store.contentPlanPrompts
      .map(
        (prompt) => `
          <button type="button" class="content-prompt" data-prompt="${store.escapeHtml(prompt)}">
            <span>Post idea</span>
            <strong>${store.escapeHtml(prompt)}</strong>
          </button>
        `
      )
      .join("");

    list.querySelectorAll("[data-prompt]").forEach((button) => {
      button.addEventListener("click", () => {
        switchPanel("posts");
        resetPostForm();
        $("#postTitle").value = button.dataset.prompt;
        $("#postCategory").value = guessCategory(button.dataset.prompt);
        $("#postSummary").value = `Helpful Eben Tee guide about ${button.dataset.prompt.toLowerCase()} for people in Ghana and the diaspora.`;
        $("#postTags").value = button.dataset.prompt
          .split(/\s+/)
          .filter((word) => word.length > 3)
          .slice(0, 6)
          .join(", ");
        renderEditorPreview();
      });
    });
  }

  function guessCategory(prompt) {
    const text = String(prompt || "").toLowerCase();
    if (/drone|video|youtube/.test(text)) return "video";
    if (/construction|project|infrastructure/.test(text)) return "building-project";
    if (/land|property|real estate|airbnb/.test(text)) return "service-update";
    return "personal";
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

  function renderPortfolioPreview() {
    const preview = $("#portfolioPreview");
    if (!preview) return;

    const title = $("#portfolioTitle").value || "Drone portfolio title";
    const summary = $("#portfolioSummary").value || "A short client-facing description will appear here.";
    const type = $("#portfolioType").value === "video" ? "video" : "photo";
    const id = $("#portfolioId").value;
    const existing = portfolio.find((item) => item.id === id);
    const mediaUrl = portfolioUploadData || $("#portfolioMediaUrl").value.trim() || (existing && existing.mediaUrl) || "";
    const image =
      (type === "photo" && mediaUrl.startsWith("data:image/") ? mediaUrl : "") ||
      store.getYouTubeThumbnailUrl(mediaUrl) ||
      (existing && existing.thumbnail) ||
      "";

    preview.innerHTML = `
      ${renderPortfolioPreviewMedia(type, mediaUrl, image)}
      <div>
        <span class="pill">${type === "video" ? "Drone video" : "Drone photo"}</span>
        <h3>${store.escapeHtml(title)}</h3>
        <p>${store.escapeHtml(summary)}</p>
      </div>
    `;
  }

  function renderPropertyPreview() {
    const preview = $("#propertyPreview");
    if (!preview) return;

    const title = $("#propertyTitle").value || "Property title";
    const summary = $("#propertySummary").value || "Property description preview will appear here.";
    const id = $("#propertyId").value;
    const existing = properties.find((item) => item.id === id);
    const mediaUrl = propertyUploadData || $("#propertyMediaUrl").value.trim() || (existing && existing.mediaUrl) || "";
    const image =
      (mediaUrl.startsWith("data:image/") ? mediaUrl : "") ||
      store.getYouTubeThumbnailUrl(mediaUrl) ||
      (existing && existing.coverImage) ||
      store.createGeneratedCover("building-project", title);

    preview.innerHTML = `
      <img src="${store.escapeHtml(image)}" alt="">
      <div>
        <span class="pill">${store.escapeHtml($("#propertyType").value || "Property")}</span>
        <h3>${store.escapeHtml(title)}</h3>
        <p>${store.escapeHtml(summary)}</p>
      </div>
    `;
  }

  function renderTestimonialPreview() {
    const preview = $("#testimonialPreview");
    if (!preview) return;

    const name = $("#testimonialName").value || "Client name";
    const role = $("#testimonialRole").value || "Service";
    const quote = $("#testimonialQuote").value || "Client testimonial preview will appear here.";
    const rating = Math.max(1, Math.min(5, Number($("#testimonialRating").value) || 5));

    preview.innerHTML = `
      <span class="manager-media-placeholder">${rating}/5</span>
      <div>
        <span class="pill">${store.escapeHtml(role)}</span>
        <h3>${store.escapeHtml(name)}</h3>
        <p>${store.escapeHtml(quote)}</p>
      </div>
    `;
  }

  function renderPortfolioPreviewMedia(type, mediaUrl, image) {
    if (image) {
      return `<img src="${store.escapeHtml(image)}" alt="">`;
    }

    if (type === "video" && mediaUrl) {
      return `<video src="${store.escapeHtml(mediaUrl)}" muted playsinline preload="metadata"></video>`;
    }

    return `<span class="manager-media-placeholder">ET</span>`;
  }

  function portfolioThumbnail(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === "photo" && item.mediaUrl) return item.mediaUrl;
    return store.getYouTubeThumbnailUrl(item.mediaUrl);
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
          reject(new Error("Use JPG, PNG, WebP, or GIF for public media."));
          return;
        }

        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const maxWidth = 1200;
          const ratio = Math.min(1, maxWidth / Math.max(1, image.naturalWidth || image.width));
          const width = Math.max(1, Math.round((image.naturalWidth || image.width) * ratio));
          const height = Math.max(1, Math.round((image.naturalHeight || image.height) * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, width, height);
          const qualityLevels = [0.8, 0.65, 0.5];
          const compressed = qualityLevels
            .map((quality) => canvas.toDataURL("image/jpeg", quality))
            .find((candidate) => candidate.length <= 700_000);

          if (!compressed) reject(new Error("Image too large"));
          else resolve(compressed);
        };
        image.src = dataUrl;
      };

      reader.readAsDataURL(file);
    });
  }

  function readLimitedFile(file, maxBytes, maxDataUrlLength) {
    return new Promise((resolve, reject) => {
      if (file.size > maxBytes) {
        reject(new Error("File too large"));
        return;
      }

      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        if (!dataUrl || dataUrl.length > maxDataUrlLength) reject(new Error("File too large"));
        else resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  async function loadAnalytics(options = {}) {
    const silent = Boolean(options && options.silent);
    const days = Number($("#analyticsDays").value) || 30;
    if (!silent) $("#analyticsMessage").textContent = "Loading live analytics...";

    try {
      analytics = await store.loadAnalytics(days);
      analyticsLoaded = true;
      renderAnalytics();
      $("#analyticsMessage").textContent = analytics.offline
        ? "Analytics is available on the live Cloudflare site."
        : `Live data refreshed ${new Date(analytics.updatedAt).toLocaleString()}.`;
    } catch (error) {
      analyticsLoaded = false;
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
      renderCountList("#analyticsSources", []);
      renderCountList("#analyticsReferrers", []);
      renderCountList("#analyticsDevices", []);
      renderCountList("#analyticsEvents", []);
      renderCountList("#analyticsServices", []);
      renderCountList("#analyticsCountries", []);
      renderCountList("#analyticsCampaigns", []);
      setText("#analyticsLeadEvents", "0");
      setText("#analyticsSearchVisits", "0");
      return;
    }

    setText("#analyticsTotalViews", analytics.totals.views);
    setText("#analyticsUniqueVisitors", analytics.totals.uniqueVisitors);
    setText("#analyticsTodayViews", analytics.totals.todayViews);
    setText("#analyticsTopPage", analytics.topPaths[0] ? analytics.topPaths[0].label : "None yet");
    setText("#analyticsSearchVisits", analytics.totals.searchVisits || 0);
    setText(
      "#analyticsLeadEvents",
      (analytics.events || []).filter((item) => String(item.label) === "lead_submit").reduce((sum, item) => sum + Number(item.count || 0), 0)
    );
    renderDailyChart(analytics.daily || []);
    renderCountList("#analyticsTopPaths", analytics.topPaths || []);
    renderCountList("#analyticsSources", analytics.topSources || []);
    renderCountList("#analyticsReferrers", analytics.topReferrers || []);
    renderCountList("#analyticsDevices", analytics.devices || []);
    renderCountList("#analyticsEvents", analytics.events || []);
    renderCountList("#analyticsServices", analytics.services || []);
    renderCountList("#analyticsCountries", analytics.countries || [], countryName);
    renderCountList("#analyticsCampaigns", analytics.campaigns || []);
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

  function renderCountList(selector, items, labelFormatter) {
    const list = $(selector);
    if (!list) return;

    list.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <div class="analytics-row">
                <span>${store.escapeHtml(labelFormatter ? labelFormatter(item.label) : item.label)}</span>
                <strong>${Number(item.count) || 0}</strong>
              </div>
            `
          )
          .join("")
      : `<p class="empty-state">No data yet.</p>`;
  }

  function countryName(code) {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(String(code || "").toUpperCase()) || code;
    } catch (error) {
      return code;
    }
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
      portfolio,
      properties,
      testimonials,
      leads,
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
        portfolio = Array.isArray(payload.portfolio) ? payload.portfolio.map(store.normalizePortfolioItem) : portfolio;
        properties = Array.isArray(payload.properties) ? payload.properties.map(store.normalizeProperty) : properties;
        testimonials = Array.isArray(payload.testimonials)
          ? payload.testimonials.map(store.normalizeTestimonial)
          : testimonials;
        leads = Array.isArray(payload.leads) ? payload.leads.map(store.normalizeLead) : leads;
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
    portfolio = store.loadPortfolio();
    properties = store.loadProperties();
    testimonials = store.loadTestimonials();
    leads = store.loadLeads();
    if (!(await persistContent("Sample content restored online."))) return;
    resetPostForm();
    renderAdmin();
  }

  function getInitials(value) {
    const parts = String(value || "Eben Tee").trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0] || "").join("").toUpperCase() || "ET";
  }

  function formatDateTime(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "No date";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function setMessage(selector, message) {
    const node = $(selector);
    if (node) node.textContent = message;
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }
})();

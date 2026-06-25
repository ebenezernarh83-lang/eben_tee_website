(function () {
  "use strict";

  const store = window.BuildHubData;
  const EBOOK_SETTINGS = {
    title: "Building Project Field Guide",
    subtitle:
      "A practical digital guide for project owners, clients, and builders who want clearer site planning, progress checks, and construction decisions.",
    author: "By Eben Tee",
    price: "Contact to buy",
    pages: "45+ pages",
    format: "PDF Ebook",
    delivery: "Delivered as a PDF after purchase",
    paymentLink: "",
    sampleLink: "",
    preview:
      "This guide explains how to think through each building stage before money is wasted: planning, foundation checks, blockwork quality, roofing progress, finishing decisions, and simple ways to communicate clearly with workers on site.",
    features: [
      "Building stage checklist from foundation to finishing",
      "Simple site inspection points for project owners",
      "Common construction mistakes and how to avoid them",
      "Budget and material planning notes",
      "Questions to ask workers before each stage"
    ]
  };

  let settings = {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    settings = content.settings;

    bindNavigation();
    bindBuyButtons();
    renderSettings();
    renderEbook();
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

  function bindBuyButtons() {
    $$("#buyBookButton, #buyBookButtonSecondary").forEach((button) => {
      button.addEventListener("click", orderEbook);
    });
  }

  function orderEbook() {
    if (EBOOK_SETTINGS.paymentLink) {
      window.open(EBOOK_SETTINGS.paymentLink, "_blank", "noopener");
      return;
    }

    const text = [
      `Hello ${settings.ownerName || "Eben Tee"},`,
      `I want to buy your ebook: ${EBOOK_SETTINGS.title}.`,
      `Price shown: ${EBOOK_SETTINGS.price}.`,
      "Please send me the payment details and delivery process."
    ].join("\n");
    const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return;
    }

    if (settings.email) {
      window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Ebook order")}&body=${encodeURIComponent(text)}`;
    }
  }

  function renderSettings() {
    document.title = `${EBOOK_SETTINGS.title} | ${settings.brandName || "Eben Tee"}`;

    $$("[data-setting]").forEach((node) => {
      const key = node.dataset.setting;
      node.textContent = settings[key] || "";
    });

    $$("[data-brand-initials]").forEach((node) => {
      node.textContent = getInitials(settings.brandName);
    });

    const contactCards = $("#ebookContactCards");
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

  function renderEbook() {
    $$("[data-ebook]").forEach((node) => {
      const key = node.dataset.ebook;
      node.textContent = EBOOK_SETTINGS[key] || "";
    });

    const features = $("#ebookFeatures");
    if (features) {
      features.innerHTML = EBOOK_SETTINGS.features
        .map(
          (feature, index) => `
            <article class="ebook-feature">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${store.escapeHtml(feature)}</strong>
            </article>
          `
        )
        .join("");
    }
  }

  function getInitials(value) {
    return String(value || "ET")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
})();

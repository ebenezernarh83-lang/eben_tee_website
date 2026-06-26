(function () {
  "use strict";

  const store = window.BuildHubData;
  const EBOOK_SETTINGS = {
    title: "The African Online Income Blueprint",
    subtitle:
      "The no-hype 90-day playbook for turning skill, content, and service into real online income.",
    author: "By Ebenezer",
    price: "Contact to buy",
    pages: "33 chapters",
    format: "EPUB Ebook",
    delivery: "Delivered as an EPUB after purchase",
    coverImage: "assets/african-online-income-blueprint-cover.png",
    paymentLink: "https://selar.com/2gr1zv269p",
    sampleLink: "",
    preview:
      "A practical 90-day guide to building skills, proof of work, offers, and ethical online income opportunities for Ghana, Africa, and the global digital market.",
    features: [
      "Choose your first online income lane with a realistic 90-day plan",
      "Build proof of work, content, and offers people can trust",
      "Use AI, YouTube, short-form content, and digital products ethically",
      "Find service opportunities in virtual assistance, social media, and simple websites",
      "Price, deliver, and promote your work with practical outreach steps"
    ]
  };

  let settings = { ...(store.defaultSettings || {}) };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    settings = store.loadSettings ? store.loadSettings() : settings;

    bindNavigation();
    bindBuyButtons();
    renderEbook();
    renderSettings();

    const content = await store.loadPublicContent();
    settings = content.settings;

    renderSettings();
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

    const cover = $("#ebookCoverImage");
    if (cover && EBOOK_SETTINGS.coverImage) {
      cover.src = EBOOK_SETTINGS.coverImage;
      cover.alt = `${EBOOK_SETTINGS.title} ebook cover`;
    }

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

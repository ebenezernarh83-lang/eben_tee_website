(function () {
  "use strict";

  const store = window.BuildHubData;
  let settings = {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    settings = content.settings;

    bindNavigation();
    bindBookingForm();
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

  function bindBookingForm() {
    const form = $("#bookingForm");
    const messageNode = $("#bookingMessage");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = clean(formData.get("name"));
      const contact = clean(formData.get("contact"));
      const service = clean(formData.get("service"));
      const date = clean(formData.get("date")) || "Flexible";
      const location = clean(formData.get("location"));
      const budget = clean(formData.get("budget")) || "Not stated";
      const details = clean(formData.get("message"));
      const text = [
        `Hello ${settings.ownerName || "Eben Tee"}, my name is ${name}.`,
        `I want to book: ${service}.`,
        `Project location: ${location}.`,
        `Preferred date: ${date}.`,
        `Budget range: ${budget}.`,
        `My contact: ${contact}.`,
        `Details: ${details}`
      ].join("\n");
      const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

      if (whatsapp) {
        if (messageNode) messageNode.textContent = "Opening WhatsApp...";
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        form.reset();
        return;
      }

      if (settings.email) {
        if (messageNode) messageNode.textContent = "Opening email...";
        window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Booking request")}&body=${encodeURIComponent(text)}`;
        form.reset();
        return;
      }

      if (messageNode) messageNode.textContent = "Add WhatsApp or email in admin settings to receive bookings.";
    });
  }

  function renderSettings() {
    document.title = `Book | ${settings.brandName || "Eben Tee"}`;

    $$("[data-setting]").forEach((node) => {
      const key = node.dataset.setting;
      node.textContent = settings[key] || "";
    });

    $$("[data-setting-href]").forEach((node) => {
      const key = node.dataset.settingHref;
      node.href = settings[key] || "#";
      node.classList.toggle("is-disabled", !settings[key]);
    });

    $$("[data-brand-initials]").forEach((node) => {
      node.textContent = getInitials(settings.brandName);
    });

    const services = $("#bookingServices");
    if (services) {
      services.innerHTML = (settings.services || [])
        .map(
          (service, index) => `
            <article class="booking-service">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${store.escapeHtml(service)}</strong>
            </article>
          `
        )
        .join("");
    }

    const contactCards = $("#bookingContactCards");
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

  function clean(value) {
    return String(value || "").trim();
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

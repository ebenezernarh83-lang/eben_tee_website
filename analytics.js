(function () {
  "use strict";

  if (location.pathname.startsWith("/admin")) return;

  const ATTRIBUTION_KEY = "ebentee-attribution-v1";

  function readAttribution() {
    try {
      return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveAttribution(value) {
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
    } catch (error) {
      // A private browser session may block session storage.
    }
  }

  function cleanLabel(value, fallback = "") {
    return String(value || fallback)
      .trim()
      .replace(/[\s_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .slice(0, 120);
  }

  function classifyReferrer(value) {
    if (!value) return { source: "Direct", medium: "none" };

    try {
      const referrer = new URL(value);
      if (referrer.host === location.host) return { source: "Internal", medium: "internal" };

      const host = referrer.hostname.replace(/^www\./, "").toLowerCase();
      if (host.includes("google.")) return { source: "Google Search", medium: "organic" };
      if (host.includes("bing.com")) return { source: "Bing Search", medium: "organic" };
      if (host.includes("duckduckgo.com")) return { source: "DuckDuckGo Search", medium: "organic" };
      if (host.includes("yahoo.")) return { source: "Yahoo Search", medium: "organic" };
      if (host.includes("youtube.com") || host.includes("youtu.be")) return { source: "YouTube", medium: "social" };
      if (host.includes("facebook.com") || host.includes("fb.com")) return { source: "Facebook", medium: "social" };
      if (host.includes("instagram.com")) return { source: "Instagram", medium: "social" };
      if (host.includes("tiktok.com")) return { source: "TikTok", medium: "social" };
      if (host.includes("twitter.com") || host.includes("x.com")) return { source: "X / Twitter", medium: "social" };
      if (host.includes("linkedin.com")) return { source: "LinkedIn", medium: "social" };
      return { source: host, medium: "referral" };
    } catch (error) {
      return { source: "Direct", medium: "none" };
    }
  }

  function currentAttribution() {
    const params = new URLSearchParams(location.search);
    const stored = readAttribution();
    const referrer = document.referrer || "";
    const classified = classifyReferrer(referrer);
    const utmSource = params.get("utm_source");
    const paidSource = params.get("gclid")
      ? "Google Ads"
      : params.get("fbclid")
        ? "Facebook Ads"
        : params.get("msclkid")
          ? "Microsoft Ads"
          : "";
    const hasNewAttribution = Boolean(utmSource || paidSource || (referrer && classified.source !== "Internal"));

    if (stored && !hasNewAttribution) return stored;

    let source = cleanLabel(utmSource || paidSource || classified.source, "Direct");
    const medium = String(params.get("utm_medium") || (paidSource ? "paid" : classified.medium) || "none")
      .trim()
      .toLowerCase()
      .slice(0, 80);
    if (medium === "organic" && /^(google|bing|duckduckgo|yahoo)$/i.test(source)) source = `${source} Search`;
    const attribution = {
      source,
      medium,
      campaign: cleanLabel(params.get("utm_campaign")),
      landingReferrer: referrer,
      landingPath: location.pathname || "/"
    };

    saveAttribution(attribution);
    return attribution;
  }

  const attribution = currentAttribution();

  function send(payload) {
    const body = JSON.stringify({
      path: location.pathname,
      title: document.title,
      referrer: document.referrer || "",
      ...payload
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/track", blob)) return;
      }

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "same-origin"
      }).catch(() => {});
    } catch (error) {
      // Analytics should never interrupt the public site.
    }
  }

  window.EbenTeeAnalytics = {
    track(eventType, detail = {}) {
      send({ eventType, ...attribution, ...detail });
    }
  };

  send({ eventType: "page_view", ...attribution });
})();

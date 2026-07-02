(function () {
  "use strict";

  if (location.pathname.startsWith("/admin")) return;

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
        navigator.sendBeacon("/api/track", blob);
        return;
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
      send({ eventType, ...detail });
    }
  };

  send({ eventType: "page_view" });
})();

(function () {
  "use strict";

  if (location.pathname.startsWith("/admin")) return;

  const payload = {
    path: location.pathname,
    title: document.title,
    referrer: document.referrer || ""
  };

  const body = JSON.stringify(payload);

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
})();

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver;
  let refreshFrame = 0;
  let scrollFrame = 0;

  function decorateHeading(heading) {
    if (!heading || heading.dataset.motionDecorated === "true") return;

    heading.dataset.motionDecorated = "true";
    heading.classList.add("kinetic-heading");

    const preparedLines = Array.from(heading.querySelectorAll(":scope > .kinetic-line"));
    if (preparedLines.length) {
      preparedLines.forEach((line, index) => line.style.setProperty("--motion-index", index));
      return;
    }

    const words = String(heading.textContent || "").trim().split(/\s+/).filter(Boolean);
    heading.textContent = "";

    words.forEach((word, index) => {
      const shell = document.createElement("span");
      const text = document.createElement("span");
      shell.className = "kinetic-word";
      shell.style.setProperty("--motion-index", Math.min(index, 18));
      text.textContent = `${word}${index === words.length - 1 ? "" : " "}`;

      if (/ghana|digital|drone|project|software/i.test(word)) {
        shell.classList.add("is-accent");
      }

      shell.append(text);
      heading.append(shell);
    });
  }

  function setHeroMedia() {
    const hero = document.querySelector(".hero-band");
    const image = hero?.querySelector(".tour-screen img");
    const source = image?.currentSrc || image?.src;
    if (!hero || !source) return;

    hero.style.setProperty("--hero-project-image", `url("${source.replace(/"/g, "%22")}")`);
    hero.classList.add("has-project-image");
  }

  function getRevealNodes() {
    return Array.from(
      document.querySelectorAll(
        [
          "main > section:not(.hero-band)",
          ".section-heading",
          ".authority-grid > *",
          ".service-platform-grid > *",
          ".portfolio-layout > *",
          ".why-grid > *",
          ".platform-page-card",
          ".platform-page-stats > *",
          ".platform-card-grid > *",
          ".platform-process-grid > *",
          ".platform-proof-grid > *",
          ".project-card"
        ].join(",")
      )
    );
  }

  function observeReveals() {
    const nodes = getRevealNodes();

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("motion-reveal", "is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
      );
    }

    nodes.forEach((node, index) => {
      if (node.classList.contains("motion-reveal")) return;
      node.classList.add("motion-reveal");
      node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      revealObserver.observe(node);
    });
  }

  function setupScrollProgress() {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector(".scroll-progress")) return;

    const progress = document.createElement("span");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    header.append(progress);

    const update = () => {
      scrollFrame = 0;
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.setProperty("--scroll-progress", Math.min(1, window.scrollY / distance));
    };

    const requestUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  }

  function refresh() {
    document.body.classList.add("motion-system");
    document.querySelectorAll("main h1").forEach(decorateHeading);
    setHeroMedia();
    observeReveals();
    setupScrollProgress();

    window.requestAnimationFrame(() => {
      document.body.classList.add("motion-loaded");
    });
  }

  function scheduleRefresh() {
    if (refreshFrame) return;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      refresh();
    });
  }

  function start() {
    refresh();

    const main = document.querySelector("main");
    if (!(main instanceof Element)) return;

    const contentObserver = new MutationObserver(scheduleRefresh);
    contentObserver.observe(main, { childList: true, subtree: true });
    window.setTimeout(() => contentObserver.disconnect(), 8000);
  }

  window.EbenTeeMotion = { refresh: scheduleRefresh };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

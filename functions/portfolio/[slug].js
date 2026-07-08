import {
  BRAND_LOGO_URL,
  SITE_URL,
  absolutePortfolioUrl,
  escapeHtml,
  findItemBySlug,
  isShareableImage,
  plainText,
  readPublicContent,
  safeJson
} from "../_seo.js";

export async function onRequestGet({ env, params }) {
  const content = await readPublicContent(env);
  const item = findItemBySlug(content.portfolio, params.slug, "ghana-drone-portfolio");

  if (!item) {
    return new Response(renderNotFound(content.settings), { status: 404, headers: htmlHeaders() });
  }

  return new Response(renderPortfolioItem(item, content.settings, content.testimonials), { headers: htmlHeaders() });
}

function renderPortfolioItem(item, settings, testimonials) {
  const title = `${item.title} | ${settings.brandName}`;
  const description = plainText(item.summary || `${item.type} by ${settings.brandName}`, 300);
  const canonical = absolutePortfolioUrl(item);
  const image = item.thumbnail || (item.type === "photo" ? item.mediaUrl : "") || getYouTubeThumbnailUrl(item.mediaUrl);
  const socialImage = isShareableImage(image) ? image : BRAND_LOGO_URL;
  const embed = getYouTubeEmbedUrl(item.mediaUrl);
  const schema = {
    "@context": "https://schema.org",
    "@type": embed ? "VideoObject" : "CreativeWork",
    name: item.title,
    description,
    url: canonical,
    thumbnailUrl: embed && isShareableImage(socialImage) ? [socialImage] : undefined,
    image: isShareableImage(socialImage) ? socialImage : undefined,
    uploadDate: item.publishedAt,
    embedUrl: embed || undefined,
    contentUrl: item.mediaUrl || undefined,
    creator: {
      "@type": "Organization",
      name: settings.brandName,
      url: SITE_URL,
      logo: BRAND_LOGO_URL
    },
    about: item.serviceCategory || item.clientType
  };
  const proof = testimonials.find((review) => review.serviceCategory === item.serviceCategory);

  return pageShell({
    title,
    description,
    canonical,
    socialImage,
    settings,
    schema,
    body: `
      <article class="seo-post-shell">
        <a class="text-link" href="/portfolio">Back to portfolio</a>
        <p class="eyebrow">${escapeHtml(item.type === "video" ? "Drone video" : "Drone photo")}</p>
        <h1>${escapeHtml(item.title)}</h1>
        <p class="lead small-lead">${escapeHtml(description)}</p>
        <div class="seo-post-meta">
          ${item.clientType ? `<span>${escapeHtml(item.clientType)}</span>` : ""}
          ${item.serviceCategory ? `<span>${escapeHtml(item.serviceCategory)}</span>` : ""}
          ${item.location ? `<span>${escapeHtml(item.location)}</span>` : ""}
        </div>
        ${renderMedia(item, image, embed)}
        <div class="seo-post-body">
          <p>${escapeHtml(item.summary)}</p>
          ${item.mapUrl ? `<p><a class="text-link" href="${escapeHtml(item.mapUrl)}" target="_blank" rel="noreferrer">Open approximate map location</a></p>` : ""}
          ${renderTags(item.tags)}
        </div>
      </article>
      <aside class="seo-post-cta">
        <p class="eyebrow">Client media</p>
        <h2>Want visuals like this?</h2>
        <p>Book drone photos, real estate videos, project progress media, or promotional clips for your Ghana project.</p>
        <a class="button" href="/contact?service=drone">Book a shoot</a>
        ${proof ? `<div class="mini-proof"><strong>${escapeHtml(proof.name)}</strong><p>${escapeHtml(proof.quote)}</p></div>` : ""}
      </aside>
    `
  });
}

function renderMedia(item, image, embed) {
  if (embed) return `<div class="seo-post-media"><iframe src="${escapeHtml(embed)}" title="${escapeHtml(item.title)}" allowfullscreen></iframe></div>`;
  if (item.type === "video" && item.mediaUrl) return `<div class="seo-post-media"><video src="${escapeHtml(item.mediaUrl)}" poster="${escapeHtml(image)}" controls playsinline></video></div>`;
  if (image) return `<div class="seo-post-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}"></div>`;
  return "";
}

function pageShell({ title, description, canonical, socialImage, settings, schema, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="sitemap" type="application/xml" href="${SITE_URL}/sitemap.xml">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(socialImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${escapeHtml(socialImage)}">
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="/assets/eben-tee-icon-48.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/assets/eben-tee-icon-192.png" type="image/png" sizes="192x192">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#05080d">
    <link rel="stylesheet" href="/styles.css?v=platform-5">
    <script type="application/ld+json">${safeJson(schema)}</script>
  </head>
  <body data-page="public" data-view="portfolio-item">
    <header class="site-header"><nav class="nav-shell" aria-label="Main navigation"><a class="brand" href="/" aria-label="Home"><span class="brand-mark" aria-hidden="true"><img class="brand-logo" src="/assets/eben-tee-logo-512.png" alt=""></span><span class="brand-copy"><strong>${escapeHtml(settings.brandName)}</strong><small>${escapeHtml(settings.tagline)}</small></span></a><div class="nav-links always-open"><a href="/services">Services</a><a href="/drone-services">Drone</a><a href="/portfolio">Portfolio</a><a href="/contact">Contact</a></div></nav></header>
    <main class="seo-post-page">${body}</main>
    <footer class="site-footer"><div><strong>${escapeHtml(settings.brandName)}</strong><p>${escapeHtml(settings.tagline)}</p></div><div class="social-links">${settings.youtube ? `<a href="${escapeHtml(settings.youtube)}" target="_blank" rel="noreferrer">YouTube</a>` : ""}</div></footer>
    <script src="/analytics.js?v=platform-5"></script>
  </body>
</html>`;
}

function renderNotFound(settings) {
  return pageShell({
    title: `Portfolio item not found | ${settings.brandName}`,
    description: "This portfolio item is not available.",
    canonical: `${SITE_URL}/portfolio`,
    socialImage: BRAND_LOGO_URL,
    settings,
    schema: { "@context": "https://schema.org", "@type": "WebPage", name: "Portfolio item not found" },
    body: `<article class="seo-post-shell"><p class="eyebrow">Not found</p><h1>This portfolio item is not available</h1><a class="button" href="/portfolio">Open portfolio</a></article>`
  });
}

function renderTags(tags) {
  return tags && tags.length ? `<div class="tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";
}

function getYouTubeEmbedUrl(value) {
  const id = getYouTubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

function getYouTubeThumbnailUrl(value) {
  const id = getYouTubeId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getYouTubeId(value) {
  const url = String(value || "").trim();
  const patterns = [/youtube\.com\/watch\?v=([^&]+)/i, /youtu\.be\/([^?&]+)/i, /youtube\.com\/shorts\/([^?&]+)/i, /youtube\.com\/embed\/([^?&]+)/i];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1].replace(/[^a-zA-Z0-9_-]/g, "");
  }
  return "";
}

function htmlHeaders() {
  return { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" };
}

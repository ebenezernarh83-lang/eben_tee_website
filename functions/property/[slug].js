import {
  BRAND_LOGO_URL,
  SITE_URL,
  absolutePropertyUrl,
  escapeHtml,
  findItemBySlug,
  isShareableImage,
  plainText,
  readPublicContent,
  safeJson,
  secureHtmlHeaders
} from "../_seo.js";

export async function onRequestGet({ env, params }) {
  const content = await readPublicContent(env);
  const property = findItemBySlug(content.properties, params.slug, "ghana-property");

  if (!property) {
    return new Response(renderNotFound(content.settings), { status: 404, headers: secureHtmlHeaders() });
  }

  return new Response(renderProperty(property, content.settings, content.testimonials), { headers: secureHtmlHeaders() });
}

function renderProperty(property, settings, testimonials) {
  const title = `${property.title} | ${settings.brandName}`;
  const description = plainText(property.summary || `${property.propertyType} in ${property.location}`, 300);
  const canonical = absolutePropertyUrl(property);
  const socialImage = isShareableImage(property.coverImage) ? property.coverImage : BRAND_LOGO_URL;
  const matchingReviews = testimonials.filter((item) =>
    [item.serviceCategory, item.role].join(" ").toLowerCase().match(/real estate|property|drone|airbnb|land/)
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: property.title,
    description,
    url: canonical,
    image: socialImage,
    about: {
      "@type": "Offer",
      name: property.title,
      category: property.propertyType,
      availability: property.availability,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "GHS",
        description: property.price
      },
      areaServed: property.location || "Ghana",
      offeredBy: {
        "@type": "Organization",
        name: settings.brandName,
        url: SITE_URL,
        logo: BRAND_LOGO_URL
      }
    }
  };

  return pageShell({
    title,
    description,
    canonical,
    socialImage,
    settings,
    schema,
    body: `
      <article class="seo-post-shell">
        <a class="text-link" href="/real-estate">Back to properties</a>
        <p class="eyebrow">${escapeHtml(property.propertyType)} · ${escapeHtml(property.availability)}</p>
        <h1>${escapeHtml(property.title)}</h1>
        <p class="lead small-lead">${escapeHtml(description)}</p>
        <div class="seo-post-meta">
          ${property.location ? `<span>${escapeHtml(property.location)}</span>` : ""}
          ${property.price ? `<span>${escapeHtml(property.price)}</span>` : ""}
          ${property.size ? `<span>${escapeHtml(property.size)}</span>` : ""}
        </div>
        ${renderMedia(property)}
        <div class="seo-post-body">
          <p>${escapeHtml(property.summary)}</p>
          ${property.verificationNotes ? `<p><strong>Verification note:</strong> ${escapeHtml(property.verificationNotes)}</p>` : ""}
          ${property.mapUrl ? `<p><a class="text-link" href="${escapeHtml(property.mapUrl)}" target="_blank" rel="noreferrer">Open approximate map location</a></p>` : ""}
          ${renderTags(property.tags)}
        </div>
      </article>
      <aside class="seo-post-cta">
        <p class="eyebrow">Property enquiry</p>
        <h2>Ask Eben Tee about this opportunity</h2>
        <p>Request photos, drone footage, location context, inspection support, or a property marketing package.</p>
        <a class="button" href="/contact?service=property">WhatsApp enquiry</a>
        ${renderReview(matchingReviews[0])}
      </aside>
    `
  });
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
    <link rel="stylesheet" href="/styles.css?v=platform-10">
    <script type="application/ld+json">${safeJson(schema)}</script>
  </head>
  <body data-page="public" data-view="property">
    ${renderHeader(settings)}
    <main class="seo-post-page">${body}</main>
    ${renderFooter(settings)}
    <script src="/analytics.js?v=platform-10"></script>
  </body>
</html>`;
}

function renderHeader(settings) {
  return `<header class="site-header"><nav class="nav-shell" aria-label="Main navigation"><a class="brand" href="/" aria-label="Home"><span class="brand-mark" aria-hidden="true"><img class="brand-logo" src="/assets/eben-tee-icon-192.png" alt="" width="40" height="40"></span><span class="brand-copy"><strong>${escapeHtml(settings.brandName)}</strong><small>${escapeHtml(settings.tagline)}</small></span></a><div class="nav-links always-open"><a href="/services">Services</a><a href="/real-estate">Properties</a><a href="/construction">Construction</a><a href="/portfolio">Portfolio</a><a href="/contact">Contact</a></div></nav></header>`;
}

function renderFooter(settings) {
  return `<footer class="site-footer"><div><strong>${escapeHtml(settings.brandName)}</strong><p>${escapeHtml(settings.tagline)}</p></div><div class="social-links">${settings.youtube ? `<a href="${escapeHtml(settings.youtube)}" target="_blank" rel="noreferrer">YouTube</a>` : ""}</div></footer>`;
}

function renderMedia(property) {
  const embed = getYouTubeEmbedUrl(property.mediaUrl);
  if (embed) return `<div class="seo-post-media"><iframe src="${escapeHtml(embed)}" title="${escapeHtml(property.title)}" allowfullscreen></iframe></div>`;
  if (property.coverImage) return `<div class="seo-post-media"><img src="${escapeHtml(property.coverImage)}" alt="${escapeHtml(property.title)}"></div>`;
  return "";
}

function renderTags(tags) {
  return tags && tags.length ? `<div class="tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";
}

function renderReview(review) {
  return review ? `<div class="mini-proof"><strong>${escapeHtml(review.name)}</strong><p>${escapeHtml(review.quote)}</p></div>` : "";
}

function renderNotFound(settings) {
  return pageShell({
    title: `Property not found | ${settings.brandName}`,
    description: "This property is not available.",
    canonical: `${SITE_URL}/real-estate`,
    socialImage: BRAND_LOGO_URL,
    settings,
    schema: { "@context": "https://schema.org", "@type": "WebPage", name: "Property not found" },
    body: `<article class="seo-post-shell"><p class="eyebrow">Not found</p><h1>This property is not available</h1><a class="button" href="/real-estate">Open properties</a></article>`
  });
}

function getYouTubeEmbedUrl(value) {
  const url = String(value || "").trim();
  const patterns = [/youtube\.com\/watch\?v=([^&]+)/i, /youtu\.be\/([^?&]+)/i, /youtube\.com\/shorts\/([^?&]+)/i, /youtube\.com\/embed\/([^?&]+)/i];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1].replace(/[^a-zA-Z0-9_-]/g, "")}`;
  }
  return "";
}

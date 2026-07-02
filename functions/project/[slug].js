import {
  BRAND_LOGO_URL,
  SITE_URL,
  absoluteProjectUrl,
  categoryLabel,
  escapeHtml,
  findPostBySlug,
  isShareableImage,
  plainText,
  readPublicContent,
  safeJson
} from "../_seo.js";

export async function onRequestGet({ env, params }) {
  const content = await readPublicContent(env);
  const projectPosts = content.posts.filter((post) => ["building-project", "construction-news", "service-update"].includes(post.category));
  const post = findPostBySlug(projectPosts, params.slug);

  if (!post) {
    return new Response(renderNotFound(content.settings), { status: 404, headers: htmlHeaders() });
  }

  return new Response(renderProject(post, content.settings), { headers: htmlHeaders() });
}

function renderProject(post, settings) {
  const title = `${post.title} | ${settings.brandName}`;
  const description = plainText(post.summary || post.body || settings.tagline, 300);
  const canonical = absoluteProjectUrl(post);
  const socialImage = isShareableImage(post.coverImage) ? post.coverImage : BRAND_LOGO_URL;
  const publisher = {
    "@type": "Organization",
    name: settings.brandName,
    url: SITE_URL,
    logo: BRAND_LOGO_URL
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: isShareableImage(post.coverImage) ? post.coverImage : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Person", name: settings.ownerName || settings.brandName },
    publisher,
    mainEntityOfPage: canonical,
    articleSection: categoryLabel(post.category),
    keywords: post.tags.join(", ")
  };

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
    <meta property="og:type" content="article">
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
    <link rel="stylesheet" href="/styles.css?v=platform-3">
    <script type="application/ld+json">${safeJson(schema)}</script>
  </head>
  <body data-page="public" data-view="project">
    <header class="site-header"><nav class="nav-shell" aria-label="Main navigation"><a class="brand" href="/" aria-label="Home"><span class="brand-mark" aria-hidden="true"><img class="brand-logo" src="/assets/eben-tee-logo-512.png" alt=""></span><span class="brand-copy"><strong>${escapeHtml(settings.brandName)}</strong><small>${escapeHtml(settings.tagline)}</small></span></a><div class="nav-links always-open"><a href="/projects">Projects</a><a href="/construction">Construction</a><a href="/drone-services">Drone</a><a href="/contact">Contact</a></div></nav></header>
    <main class="seo-post-page">
      <article class="seo-post-shell">
        <a class="text-link" href="/projects">Back to projects</a>
        <p class="eyebrow">${escapeHtml(categoryLabel(post.category))}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="lead small-lead">${escapeHtml(description)}</p>
        <div class="seo-post-meta">
          <span>${escapeHtml(formatDate(post.publishedAt))}</span>
          ${post.location ? `<span>${escapeHtml(post.location)}</span>` : ""}
          ${post.projectStage ? `<span>${escapeHtml(post.projectStage)}</span>` : ""}
          <span>${post.progress}% complete</span>
        </div>
        ${renderMedia(post)}
        <div class="progress-track large"><span style="width: ${post.progress}%"></span></div>
        <div class="seo-post-body">${renderBody(post.body || post.summary)}${renderTags(post.tags)}</div>
      </article>
      <aside class="seo-post-cta">
        <p class="eyebrow">Project support</p>
        <h2>Need this kind of update for your site?</h2>
        <p>Request drone footage, walkthroughs, progress reports, and construction documentation for Ghana projects.</p>
        <a class="button" href="/contact?service=construction">Request a site visit</a>
      </aside>
    </main>
    <footer class="site-footer"><div><strong>${escapeHtml(settings.brandName)}</strong><p>${escapeHtml(settings.tagline)}</p></div><div class="social-links">${settings.youtube ? `<a href="${escapeHtml(settings.youtube)}" target="_blank" rel="noreferrer">YouTube</a>` : ""}</div></footer>
    <script src="/analytics.js?v=platform-3"></script>
  </body>
</html>`;
}

function renderNotFound(settings) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Project not found | ${escapeHtml(settings.brandName)}</title><link rel="stylesheet" href="/styles.css?v=platform-3"></head><body data-page="public"><main class="seo-post-page"><article class="seo-post-shell"><p class="eyebrow">Not found</p><h1>This project update is not available</h1><a class="button" href="/projects">Open projects</a></article></main></body></html>`;
}

function renderMedia(post) {
  const embed = getYouTubeEmbedUrl(post.videoUrl);
  if (embed) return `<div class="seo-post-media"><iframe src="${escapeHtml(embed)}" title="${escapeHtml(post.title)}" allowfullscreen></iframe></div>`;
  if (post.coverImage) return `<div class="seo-post-media"><img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}"></div>`;
  return "";
}

function renderBody(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderTags(tags) {
  return tags && tags.length ? `<div class="tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";
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

function formatDate(value) {
  const date = value ? new Date(`${value}T12:00:00`) : new Date();
  if (Number.isNaN(date.getTime())) return "No date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function htmlHeaders() {
  return { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" };
}

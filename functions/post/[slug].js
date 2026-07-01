import {
  BRAND_LOGO_URL,
  SITE_URL,
  absolutePostUrl,
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
  const post = findPostBySlug(content.posts, params.slug);

  if (!post) {
    return new Response(renderNotFound(content.settings), {
      status: 404,
      headers: htmlHeaders()
    });
  }

  return new Response(renderPost(post, content.settings), {
    headers: htmlHeaders()
  });
}

function renderPost(post, settings) {
  const title = `${post.title} | ${settings.brandName}`;
  const description = plainText(post.summary || post.body || settings.tagline, 300);
  const canonical = absolutePostUrl(post);
  const socialImage = isShareableImage(post.coverImage) ? post.coverImage : BRAND_LOGO_URL;
  const imageMeta = `<meta property="og:image" content="${escapeHtml(socialImage)}">`;
  const publisher = {
    "@type": "Organization",
    name: settings.brandName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: BRAND_LOGO_URL
    }
  };
  const schemas = [
    {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: settings.ownerName || settings.brandName
    },
    publisher,
    mainEntityOfPage: canonical,
    articleSection: categoryLabel(post.category),
    keywords: post.tags.join(", ")
    }
  ];

  if (isShareableImage(post.coverImage)) {
    schemas[0].image = post.coverImage;
  }

  const videoEmbedUrl = getYouTubeEmbedUrl(post.videoUrl);
  if (videoEmbedUrl) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: post.title,
      description,
      thumbnailUrl: isShareableImage(post.coverImage) ? [post.coverImage] : undefined,
      uploadDate: post.publishedAt,
      embedUrl: videoEmbedUrl,
      contentUrl: post.videoUrl,
      publisher
    });
  }

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
    <meta property="og:site_name" content="${escapeHtml(settings.brandName)}">
    ${imageMeta}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${escapeHtml(socialImage)}">
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="/assets/eben-tee-icon-48.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/assets/eben-tee-icon-192.png" type="image/png" sizes="192x192">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#05080d">
    <link rel="stylesheet" href="/styles.css?v=platform-1">
    <script type="application/ld+json">${safeJson(schemas.length === 1 ? schemas[0] : schemas)}</script>
  </head>
  <body data-page="public" data-view="post">
    <a class="skip-link" href="#postMain">Skip to post</a>
    <header class="site-header">
      <nav class="nav-shell" aria-label="Main navigation">
        <a class="brand" href="/" aria-label="Home">
          <span class="brand-mark" aria-hidden="true"><img class="brand-logo" src="/assets/eben-tee-logo-512.png" alt=""></span>
          <span class="brand-copy">
            <strong>${escapeHtml(settings.brandName)}</strong>
            <small>${escapeHtml(settings.tagline)}</small>
          </span>
        </a>
        <div class="nav-links always-open">
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/real-estate">Properties</a>
          <a href="/construction">Construction</a>
          <a href="/projects">Projects</a>
          <a href="/media">Media</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/contact">Contact</a>
          <a class="button small nav-cta" href="/book">Ebook</a>
        </div>
      </nav>
    </header>

    <main id="postMain" class="seo-post-page">
      <article class="seo-post-shell">
        <a class="text-link" href="/#latest">Back to latest work</a>
        <p class="eyebrow">${escapeHtml(categoryLabel(post.category))}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="lead small-lead">${escapeHtml(description)}</p>
        <div class="seo-post-meta">
          <span>${escapeHtml(formatDate(post.publishedAt))}</span>
          ${post.location ? `<span>${escapeHtml(post.location)}</span>` : ""}
          ${post.projectStage ? `<span>${escapeHtml(post.projectStage)}</span>` : ""}
        </div>
        ${renderMedia(post)}
        <div class="seo-post-body">
          ${renderBody(post.body || post.summary)}
          ${renderTags(post.tags)}
        </div>
      </article>

      <aside class="seo-post-cta">
        <p class="eyebrow">Work with Eben Tee</p>
        <h2>Drone visuals, walkthroughs, and project updates</h2>
        <p>${escapeHtml(settings.about)}</p>
        <a class="button" href="/#contact">Contact Eben Tee</a>
      </aside>
    </main>

    <footer class="site-footer">
      <div>
        <strong>${escapeHtml(settings.brandName)}</strong>
        <p>${escapeHtml(settings.tagline)}</p>
      </div>
      <div class="social-links">
        ${settings.youtube ? `<a href="${escapeHtml(settings.youtube)}" target="_blank" rel="noreferrer">YouTube</a>` : ""}
      </div>
    </footer>
    <script src="/analytics.js?v=platform-1"></script>
  </body>
</html>`;
}

function renderNotFound(settings) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>Post not found | ${escapeHtml(settings.brandName)}</title>
    <link rel="icon" href="/assets/eben-tee-icon-48.png" type="image/png" sizes="48x48">
    <link rel="icon" href="/assets/eben-tee-icon-192.png" type="image/png" sizes="192x192">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#05080d">
    <link rel="stylesheet" href="/styles.css?v=platform-1">
  </head>
  <body data-page="public" data-view="post">
    <main class="seo-post-page">
      <article class="seo-post-shell">
        <p class="eyebrow">Not found</p>
        <h1>This update is not available</h1>
        <p class="lead small-lead">It may have been unpublished or moved.</p>
        <a class="button" href="/">Go home</a>
      </article>
    </main>
  </body>
</html>`;
}

function renderMedia(post) {
  if (post.videoUrl) {
    const embed = getYouTubeEmbedUrl(post.videoUrl);
    if (embed) {
      return `<div class="seo-post-media"><iframe src="${escapeHtml(embed)}" title="${escapeHtml(post.title)}" allowfullscreen></iframe></div>`;
    }
  }

  if (post.coverImage) {
    return `<div class="seo-post-media"><img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}"></div>`;
  }

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
  if (!tags.length) return "";
  return `<div class="tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function getYouTubeEmbedUrl(value) {
  const url = String(value || "").trim();
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/i,
    /youtu\.be\/([^?&]+)/i,
    /youtube\.com\/shorts\/([^?&]+)/i,
    /youtube\.com\/embed\/([^?&]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1].replace(/[^a-zA-Z0-9_-]/g, "")}`;
    }
  }

  return "";
}

function formatDate(value) {
  const date = value ? new Date(`${value}T12:00:00`) : new Date();
  if (Number.isNaN(date.getTime())) return "No date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function getInitials(value) {
  return String(value || "ET")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase();
}

function htmlHeaders() {
  return {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate"
  };
}

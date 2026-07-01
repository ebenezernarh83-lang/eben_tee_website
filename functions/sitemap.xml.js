import { SITE_URL, absolutePostUrl, escapeXml, readPublicContent } from "./_seo.js";

export async function onRequestGet({ env }) {
  const content = await readPublicContent(env);
  const staticUrls = [
    { loc: `${SITE_URL}/`, lastmod: content.updatedAt, priority: "1.0" },
    { loc: `${SITE_URL}/about`, lastmod: content.updatedAt, priority: "0.8" },
    { loc: `${SITE_URL}/services`, lastmod: content.updatedAt, priority: "0.95" },
    { loc: `${SITE_URL}/drone-services`, lastmod: content.updatedAt, priority: "0.9" },
    { loc: `${SITE_URL}/real-estate`, lastmod: content.updatedAt, priority: "0.95" },
    { loc: `${SITE_URL}/construction`, lastmod: content.updatedAt, priority: "0.9" },
    { loc: `${SITE_URL}/property-management`, lastmod: content.updatedAt, priority: "0.85" },
    { loc: `${SITE_URL}/media`, lastmod: content.updatedAt, priority: "0.85" },
    { loc: `${SITE_URL}/digital-products`, lastmod: content.updatedAt, priority: "0.85" },
    { loc: `${SITE_URL}/portfolio`, lastmod: content.updatedAt, priority: "0.85" },
    { loc: `${SITE_URL}/blog`, lastmod: content.updatedAt, priority: "0.85" },
    { loc: `${SITE_URL}/contact`, lastmod: content.updatedAt, priority: "0.9" },
    { loc: `${SITE_URL}/projects`, lastmod: content.updatedAt, priority: "0.9" },
    { loc: `${SITE_URL}/book`, lastmod: content.updatedAt, priority: "0.8" }
  ];
  const postUrls = content.posts.map((post) => ({
    loc: absolutePostUrl(post),
    lastmod: post.updatedAt || post.publishedAt || content.updatedAt,
    priority: "0.7"
  }));

  const urls = [...staticUrls, ...postUrls]
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${escapeXml(String(item.lastmod).slice(0, 10))}</lastmod>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}

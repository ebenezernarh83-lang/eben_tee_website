export function onRequestGet() {
  return new Response(`User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /admin
Disallow: /api/
Allow: /api/content$

Sitemap: https://ebentee.com/sitemap.xml
`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}

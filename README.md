# Eben Tee Website

A ready-to-use Eben Tee platform for Ghana drone media, real estate, construction updates, property management, digital products, YouTube stories, leads, and analytics. The live Cloudflare version includes an online admin backend using Pages Functions and KV storage.

## Files

- `index.html` is the public homepage.
- `about.html`, `services.html`, `drone-services.html`, `real-estate.html`, `construction.html`, `property-management.html`, `media.html`, `digital-products.html`, `portfolio.html`, `projects.html`, `blog.html`, `contact.html`, `booking.html`, `brochures.html`, `client-portal.html`, and `business-profile.html` are the public platform pages.
- `book.html` is the separate ebook sales page.
- `admin.html` is the admin page for creating and managing posts, properties, portfolio media, testimonials, leads, analytics, and site settings.
- `data.js` stores fallback posts, properties, portfolio items, testimonials, leads, and settings in the browser.
- `app.js` renders the public site.
- `platform-pages.js` renders the shared service/platform pages.
- `projects.js` renders the dedicated projects page.
- `book.js` powers the ebook sales page buttons and editable ebook details.
- `analytics.js` records first-party page visits and conversion events for the private admin analytics page.
- `admin.js` powers the admin tools.
- `styles.css` controls the design.
- `functions/api/[[path]].js` is the Cloudflare Pages API for login, content, leads, analytics, settings, and sessions.
- `functions/post/[slug].js`, `functions/project/[slug].js`, `functions/property/[slug].js`, `functions/portfolio/[slug].js`, `functions/sitemap.xml.js`, and `functions/robots.txt.js` create Google-friendly detail pages and crawl files.
- `wrangler.jsonc` binds the site to Cloudflare KV.
- `dist/` is generated for deployment and should not be edited directly.

## Run locally

From this folder, run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173
```

If that port is already busy, use another one:

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

Admin page:

```text
http://127.0.0.1:4173/admin.html
```

Use the Cloudflare production admin PIN for the live site. Change it in `admin.html` under Site settings after logging in.

## How posting works

On Cloudflare, posts and settings are saved online through Pages Functions into KV storage. The public site reads published posts from `/api/content`; the admin page reads and saves all posts through `/api/admin/content`.

When running with a plain local static server, the site still falls back to `localStorage` so you can preview the design without Cloudflare.

## SEO and analytics

Published posts get public URLs under `/post/...`; project updates, properties, and portfolio items also get detail URLs under `/project/...`, `/property/...`, and `/portfolio/...`. `/sitemap.xml` lists the homepage, platform pages, ebook page, and all published detail URLs. Public pages send first-party visit and conversion events to `/api/track`; the admin Analytics tab reads private totals from `/api/admin/analytics`.

## YouTube posts

Paste a YouTube link into the YouTube link field. The public site will show the uploaded cover image on cards and embed the video inside the post popup.

## Hosting

This project is deployed to Cloudflare Pages as `ebentee`.

Build the clean public folder:

```bash
rm -rf dist && mkdir -p dist && cp *.html *.css *.js *.png *.ico *.svg *.webmanifest dist/ && cp -R assets dist/
```

Deploy:

```bash
wrangler pages deploy dist --project-name ebentee --branch production --commit-dirty=true
```

Required production secrets:

```text
ADMIN_PIN
SESSION_SECRET
```

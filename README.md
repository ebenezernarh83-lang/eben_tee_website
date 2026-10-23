# Eben Tee Website

A platform for Ghana drone media, real estate, construction updates, property management, digital products and YouTube stories. Cloudflare Pages Functions use KV for public content/media and D1 for independent enquiries and atomic visitor counts.

## Files

- `index.html` is the public homepage.
- `about.html`, `services.html`, `drone-services.html`, `real-estate.html`, `construction.html`, `property-management.html`, `media.html`, `digital-products.html`, `portfolio.html`, `projects.html`, `blog.html`, `contact.html`, `booking.html`, `brochures.html`, `client-portal.html`, and `business-profile.html` are the public platform pages.
- `book.html` is the separate ebook sales page.
- `gallery.html` is the public filtered drone and project photo gallery.
- `admin.html` is the admin page for creating and managing posts, gallery images, properties, portfolio media, testimonials, leads, analytics, and site settings.
- `data.js` stores fallback posts, gallery images, properties, portfolio items, testimonials, leads, and settings in the browser.
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

Use Node.js 24+ and pnpm. The complete local preview (including forms and Admin) is:

```bash
pnpm install
pnpm build
pnpm exec wrangler d1 migrations apply ebentee-records --local
pnpm dev
```

Set a **local-only** `ADMIN_PIN`, `SESSION_SECRET`, and `ADMIN_RECOVERY_KEY` in the ignored `.dev.vars` file before testing Admin. Do not reuse production credentials for tests. Open `http://127.0.0.1:4184`.

Run `pnpm test` for backend regressions. For browser tests, install Chromium with `pnpm exec playwright install chromium`, start an isolated local preview, and run `pnpm test:browser`. Browser tests refuse non-local URLs and must not be pointed at a production database. They create local enquiries and edit a local gallery item.

For a **design-only** static preview, the older commands below still work. Contact submissions require Pages Functions and will not be marked successful on a plain static server.

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

Customer enquiries are stored individually in D1, separately from the Admin content snapshot. Existing KV enquiries import without overwriting newer records, and deletion tombstones prevent old backups from restoring deleted enquiries. Status updates use a per-record revision to detect conflicting edits.

Contact and Booking accept an email or phone number and an optional JPG/PNG/WebP/GIF photo up to 2.5 MB. Photos are stored privately and can be opened from the Admin lead inbox, not from public media URLs. The form confirms a server save before clearing the fields, preserves input on error, and provides an optional WhatsApp link. It does **not** claim to send an automatic email notification; a separate email delivery provider would be needed for that.

Use the **Gallery** tab in the admin to manage the complete public gallery. The original 23 images are imported automatically, so their pictures, titles, descriptions, labels, filters, layouts, and visibility can all be edited. **Unlist** hides an image without deleting it; **Publish** restores it.

In **Properties**, enter confirmed numeric prices/currency, dimensions, availability-check dates, map links and listing notes. Never invent missing facts. Mark an exact map location only with the owner's approval. In **Portfolio**, add your role and actual delivered work to make a case study. In **Testimonials**, confirm client permission before publishing a named review; unapproved reviews remain drafts.

When running with a plain local static server, the site still falls back to `localStorage` so you can preview the design without Cloudflare.

## SEO and analytics

Published posts get public URLs under `/post/...`; project updates, properties, and portfolio items also get detail URLs under `/project/...`, `/property/...`, and `/portfolio/...`. `/sitemap.xml` lists public pages. Robots rules allow the public content endpoint but block private API paths. Authentication, not robots rules, protects private data.

`functions/_middleware.js` permanently redirects `www.ebentee.com` to `ebentee.com`, the host used by every canonical URL. Unknown URLs get `404.html` with a real 404 status. After changing `styles.css`, bump `ASSET_VERSION` in `functions/_seo.js` and the `styles.css?v=` value in the HTML pages together.

Gallery photos in `assets/gallery/` each have an `-800.jpg` copy that phones load through `srcset`. Keep that pair when adding bundled photos (about 1400 px wide, JPEG quality around 75). Link previews use `assets/eben-tee-share.jpg` (1200×630).

Admin PIN entry allows 8 wrong attempts per address per 15 minutes and 40 site-wide per hour, counted atomically in D1. A site-wide lock only blocks new logins for up to an hour; signed-in sessions keep working. Logging out ends every Admin session. Page-view tracking ignores requests without browser origin headers and counts at most 60 events per visitor address per 10 minutes.

Visits and sources are incremented atomically in D1. Historical KV totals remain visible but previously lost counts cannot be recovered. Admin analytics refreshes periodically; these are recorded visits, not an exact count of people currently online. Google positions, queries, impressions and clicks remain in Search Console. After deployment, inspect representative pages in Search Console and resubmit the sitemap. Ranking is not guaranteed by code changes.

## YouTube posts

Paste a YouTube link into the YouTube link field. The public site will show the uploaded cover image on cards and embed the video inside the post popup.

## Hosting

This project is deployed to Cloudflare Pages as `ebentee`.

Build the clean public folder:

```bash
pnpm build
```

Deploy:

```bash
pnpm deploy
```

Before the first deployment of the D1 changes:

1. Run `pnpm exec wrangler login` and confirm the correct Cloudflare account.
2. Run `pnpm exec wrangler d1 list`. Reuse `ebentee-records` if it already exists; otherwise create it with `pnpm exec wrangler d1 create ebentee-records`.
3. Replace `local-ebentee-records` in `wrangler.jsonc` with the returned production database ID. The deploy script refuses the placeholder.
4. Back up the existing production content privately outside Git.
5. `pnpm build && pnpm deploy` applies the additive D1 migrations before deploying. Keep the existing KV binding and production secrets unchanged. Never upload `.dev.vars`, local preview data, or test credentials.
6. Verify live public pages, phone/WhatsApp links, Admin enquiries and analytics. An authenticated Admin read imports existing enquiries without deleting the KV copy.

Required production secrets:

```text
ADMIN_PIN
SESSION_SECRET
ADMIN_RECOVERY_KEY
```

`ADMIN_PIN` is used only for the first login. After that, the active PIN is stored
as a one-way, server-keyed hash in KV. `ADMIN_RECOVERY_KEY` powers the **Forgot
your PIN?** form on the admin page. Keep the recovery code outside the repository
and never place it in HTML or JavaScript.

## Update with VS Code

1. Edit a website file and save it with `Command+S`.
2. Open Source Control with `Control+Shift+G`.
3. Review the changed files and stage only the files you intend to publish.
4. Enter a short commit message and select **Commit**.
5. Select **Sync Changes** or **Push** to send the commits to GitHub.

# Eben Tee Website

A ready-to-use website for posting YouTube videos, construction news, building project updates, and other work. The live Cloudflare version includes an online admin backend using Pages Functions and KV storage.

## Files

- `index.html` is the public website.
- `book.html` is the separate booking page.
- `admin.html` is the admin page for creating and managing posts.
- `data.js` stores posts and settings in the browser.
- `app.js` renders the public site.
- `book.js` powers the booking form.
- `admin.js` powers the admin tools.
- `styles.css` controls the design.
- `functions/api/[[path]].js` is the Cloudflare Pages API for login, posts, settings, and sessions.
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

## YouTube posts

Paste a YouTube link into the YouTube link field. The public site will show the uploaded cover image on cards and embed the video inside the post popup.

## Hosting

This project is deployed to Cloudflare Pages as `ebentee`.

Build the clean public folder:

```bash
rm -rf dist && mkdir -p dist && cp index.html book.html admin.html styles.css data.js app.js book.js admin.js dist/
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

import { SITE_URL } from "./_seo.js";

// Serve the site from one host so search engines see a single canonical copy.
const canonicalHost = new URL(SITE_URL).host;

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === `www.${canonicalHost}`) {
    url.hostname = canonicalHost;
    return Response.redirect(url.toString(), 301);
  }
  return next();
}

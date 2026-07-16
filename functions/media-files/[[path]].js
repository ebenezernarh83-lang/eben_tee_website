export async function onRequestGet({ env, params }) {
  return readMediaObject(env, params.path, false);
}

export async function onRequestHead({ env, params }) {
  return readMediaObject(env, params.path, true);
}

async function readMediaObject(env, pathParts, headOnly) {
  if (!env.EBENTEE_CONTENT) return new Response("Not found", { status: 404 });

  const parts = Array.isArray(pathParts) ? pathParts : [pathParts];
  const key = parts.map((part) => decodeURIComponent(String(part || ""))).join("/").replace(/^\/+/, "");
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });

  const object = await env.EBENTEE_CONTENT.getWithMetadata(`media-v1:${key}`, { type: "arrayBuffer", cacheTtl: 300 });
  if (!object || !object.value) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  headers.set("Content-Type", object.metadata && object.metadata.contentType ? object.metadata.contentType : "image/jpeg");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(headOnly ? null : object.value, { headers });
}

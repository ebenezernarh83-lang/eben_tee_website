import { readdir, mkdir, rm, cp } from "node:fs/promises";

// Publish only the public assets. Credentials, tests, source tools and migrations stay private.
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
for (const entry of await readdir(".", { withFileTypes: true })) {
  if (entry.isFile() && (/\.(html|css|js|png|ico|svg|webmanifest)$/.test(entry.name) || entry.name === "_headers")) {
    await cp(entry.name, `dist/${entry.name}`);
  }
}
await cp("assets", "dist/assets", { recursive: true });
console.log("Built public site in dist/");

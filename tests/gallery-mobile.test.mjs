import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the mobile gallery cannot remain hidden by the reveal animation", async () => {
  const [galleryScript, motionScript, styles, markup] = await Promise.all([
    readFile(new URL("gallery.js", root), "utf8"),
    readFile(new URL("motion.js", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("gallery.html", root), "utf8")
  ]);

  assert.match(galleryScript, /galleryCollection"\)\?\.classList\.add\("is-visible"\)/);
  assert.match(motionScript, /:not\(\.gallery-page-collection\)/);
  assert.match(motionScript, /threshold:\s*0\.01/);
  assert.match(
    styles,
    /\.gallery-page-collection\.motion-reveal\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*none;/s
  );
  assert.match(markup, /styles\.css\?v=gallery-mobile-1/);
});

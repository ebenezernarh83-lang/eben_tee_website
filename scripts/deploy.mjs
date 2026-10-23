import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const database = config.d1_databases?.find((entry) => entry.binding === "EBENTEE_RECORDS");
if (!/^[a-f0-9-]{36}$/.test(database?.database_id || "")) {
  throw new Error("Set the production EBENTEE_RECORDS database_id after Cloudflare sign-in before deploying.");
}
for (const args of [["d1", "migrations", "apply", "ebentee-records", "--remote"], ["pages", "deploy", "dist", "--project-name", "ebentee", "--branch", "production", "--commit-dirty=true"]]) {
  const result = spawnSync("wrangler", args, { stdio: "inherit", shell: false });
  if (result.status !== 0) process.exit(result.status || 1);
}

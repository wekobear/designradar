// Vercel serverless entry for the API (bundled by scripts/vercel-bundles.mjs into api/server.mjs).
// One Fastify instance serves every rewritten path. Resident-only behaviours — heartbeat, worker
// watchdog, SIGTERM shutdown — live in apps/api/src/main.ts and are not started in serverless.
// Bundled code shares one import.meta: pin the repo root before the framework config module
// initialises, so the config import has to happen after the assignment (hence dynamic imports).
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { installEmbeddedFs } from "./embedded-fs.mjs";

process.env.AIHOT_REPO_ROOT = path.resolve(import.meta.dirname, "..");
// Serve prompts, brand assets, fonts, the OpenAPI spec, leaderboard seeds and harfbuzzjs wasm from
// the bundle (see embedded-fs.mjs) — before anything reads them from disk.
installEmbeddedFs(process.env.AIHOT_REPO_ROOT);
const { assertProductionSecrets } = await import("@aihot/backend/config");
const { buildApp } = await import("../apps/api/src/app.ts");

assertProductionSecrets([
  ["auth", "SESSION_SECRET"],
  ["auth", "IMG_PROXY_SIGN_SECRET"],
]);

const app = await buildApp();
await app.ready();

// Vercel rewrites append the captured path as a `?path=` query parameter; the public v1 API
// validates its query with a strict schema and would reject the injected parameter.
function stripInjectedParams(req: IncomingMessage): void {
  const raw = req.url ?? "/";
  if (!raw.includes("path=")) return;
  try {
    const url = new URL(raw, "http://internal");
    if (url.searchParams.has("path")) {
      url.searchParams.delete("path");
      req.url = `${url.pathname}${url.search}`;
    }
  } catch {
    // Malformed URL: let the API's own handler produce the problem response.
  }
}

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  stripInjectedParams(req);
  app.routing(req, res);
}

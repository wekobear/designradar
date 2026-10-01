// Vercel serverless entry for the API (bundled by scripts/vercel-bundles.mjs into api/server.mjs).
// One Fastify instance serves every rewritten path. Resident-only behaviours — heartbeat, worker
// watchdog, SIGTERM shutdown — live in apps/api/src/main.ts and are not started in serverless.
// Bundled code shares one import.meta: pin the repo root before the framework config module
// initialises, so the config import has to happen after the assignment (hence dynamic imports).
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

process.env.AIHOT_REPO_ROOT = path.resolve(import.meta.dirname, "..");
const { assertProductionSecrets } = await import("@aihot/backend/config");
const { buildApp } = await import("../apps/api/src/app.ts");

assertProductionSecrets([
  ["auth", "SESSION_SECRET"],
  ["auth", "IMG_PROXY_SIGN_SECRET"],
]);

const app = await buildApp();
await app.ready();

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  app.routing(req, res);
}

// Vercel serverless entry for the API: one Fastify instance serves every rewritten path.
// Resident-only behaviours — heartbeat, worker watchdog, SIGTERM shutdown — live in
// apps/api/src/main.ts and are deliberately not started in a serverless environment.
import type { IncomingMessage, ServerResponse } from "node:http";
import { assertProductionSecrets } from "@aihot/backend/config";
import { buildApp } from "../apps/api/src/app.ts";

assertProductionSecrets([
  ["auth", "SESSION_SECRET"],
  ["auth", "IMG_PROXY_SIGN_SECRET"],
]);

const app = await buildApp();
await app.ready();

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  app.routing(req, res);
}

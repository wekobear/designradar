// Vercel serverless entry for the web app: React Router 8 SSR without the custom node server.
// The production behaviours of apps/web/server.ts are reproduced across this repo's Vercel setup:
// static client assets are served from the deployment filesystem (filesystem beats rewrites), the
// shared redirect table lives in vercel.json redirects, and api-owned paths rewrite to /api/server.
import { createRequestListener } from "@react-router/node";
import type { IncomingMessage, ServerResponse } from "node:http";

const build = await import("../apps/web/build/server/index.js");
const ssr = createRequestListener({ build, mode: "production" });

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  ssr(req, res);
}

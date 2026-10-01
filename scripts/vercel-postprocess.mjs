// Post-processes .vercel/output after `vercel build` (run before `vercel deploy --prebuilt`).
// `functions.includeFiles` is silently ignored for this project's Fluid functions, so the runtime
// files the API bundle reads from REPO_ROOT must be copied into the function output by hand:
// - industry/            prompts (read at module init), brand assets, taxonomy seeds
// - assets/og-fonts/     satori fonts for OG image rendering
// - node_modules/harfbuzzjs/  full package: its hb.wasm is loaded dynamically, so file tracing
//                        ships only the JS entry and OG rendering would abort without it
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const funcDir = path.join(root, ".vercel/output/functions/api/server.func");
if (!existsSync(funcDir)) throw new Error("vercel-postprocess: run `vercel build` first");

for (const [src, dest] of [
  ["industry", "industry"],
  ["assets/og-fonts", "assets/og-fonts"],
  ["node_modules/harfbuzzjs", "node_modules/harfbuzzjs"],
]) {
  const from = path.join(root, src);
  const to = path.join(funcDir, dest);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true, dereference: true });
  console.log(`vercel-postprocess: ${dest} -> server.func`);
}

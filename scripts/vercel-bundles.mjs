// Bundles the Vercel serverless entries into self-contained files under api/.
// Why: Vercel's file tracer does not follow npm-workspace symlinks (node_modules/@aihot/* →
// packages/*), so unbundled entries crash at runtime with ERR_MODULE_NOT_FOUND. Bundling pulls
// every workspace source into the output; only native modules stay external.
// Run by the vercel.json buildCommand. Requires apps/web/build (run the web build first).
import { build } from "esbuild";

const native = ["sharp", "@resvg/resvg-js", "highs", "harfbuzzjs"];
// CJS dependencies (react-dom/server, avvio, …) call require() at runtime; ESM output needs one.
// esbuild injects its own createRequire import for external CJS packages, so use another name.
const banner = { js: `import { createRequire as __bannerCreateRequire } from "node:module"; const require = __bannerCreateRequire(import.meta.url);` };

await build({
  entryPoints: ["deploy/server.ts"],
  outfile: "api/server.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
  sourcemap: false,
  external: native,
  banner,
  logLevel: "warning",
});

await build({
  entryPoints: ["deploy/ssr.ts"],
  outfile: "api/ssr.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
  sourcemap: false,
  banner,
  logLevel: "warning",
});

console.log("vercel bundles: api/server.mjs, api/ssr.mjs");

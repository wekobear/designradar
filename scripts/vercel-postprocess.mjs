// Post-processes .vercel/output after `vercel build` (run before `vercel deploy --prebuilt`).
// - `functions.includeFiles` is silently ignored for this project's Fluid functions, so the runtime
//   files the API bundle reads from REPO_ROOT are copied into the function output by hand:
//   industry/ (prompts are read at module init, brand assets), assets/og-fonts (satori), and
//   node_modules/harfbuzzjs (its hb.wasm is loaded dynamically, so file tracing ships only the JS
//   entry and OG rendering would abort without it).
// - The local build's node_modules carry the host platform's native binaries, but Functions run on
//   linux-arm64, so the Linux builds of sharp and @resvg/resvg-js are installed and swapped in.
import { execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const funcDir = path.join(root, ".vercel/output/functions/api/server.func");
if (!existsSync(funcDir)) throw new Error("vercel-postprocess: run `vercel build` first");

for (const [src, dest] of [
  ["industry", "industry"],
  ["assets/og-fonts", "assets/og-fonts"],
  ["database/seeds", "database/seeds"],
  ["reference", "reference"],
  ["node_modules/harfbuzzjs", "node_modules/harfbuzzjs"],
]) {
  cpSync(path.join(root, src), path.join(funcDir, dest), { recursive: true, dereference: true });
  console.log(`vercel-postprocess: ${dest} -> server.func`);
}

const sharpVersion = JSON.parse(readFileSync(path.join(root, "node_modules/sharp/package.json"), "utf8")).version;
const resvgVersion = JSON.parse(readFileSync(path.join(root, "node_modules/@resvg/resvg-js/package.json"), "utf8")).version;
const funcModules = path.join(funcDir, "node_modules");
// Functions may run on x64 or arm64 Lambdas; install the Linux (glibc) builds of both architectures.
// A separate staging prefix per arch: a shared one would let the second install prune the first.
for (const cpu of ["x64", "arm64"]) {
  const staging = path.join(root, `.vercel/output/.linux-natives-${cpu}`);
  rmSync(staging, { recursive: true, force: true });
  execSync(
    `npm install --prefix ${JSON.stringify(staging)} --os=linux --cpu=${cpu} --libc=glibc --no-audit --no-fund --no-save ` +
      `sharp@${sharpVersion} @resvg/resvg-js@${resvgVersion}`,
    { stdio: "inherit" },
  );
  for (const dir of ["@img", "@resvg"]) {
    cpSync(path.join(staging, "node_modules", dir), path.join(funcModules, dir), { recursive: true, dereference: true });
  }
  rmSync(staging, { recursive: true, force: true });
}
console.log("vercel-postprocess: linux binaries (x64+arm64) -> node_modules/@img, @resvg");

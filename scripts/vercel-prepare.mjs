// Prepares the Vercel build container for function compilation (run by vercel.json buildCommand).
// Vercel's file tracer does not follow npm-workspace symlinks (node_modules/@aihot/* → packages/*),
// so unbundled functions crash with ERR_MODULE_NOT_FOUND at runtime. Replacing the symlinks with
// real dereferenced copies lets the tracer include the workspace sources. Must run AFTER the web
// build (which itself needs the proper workspace links).
import { cpSync, rmSync, existsSync, lstatSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const members = [
  ["packages/backend", "node_modules/@aihot/backend"],
  ["packages/contracts", "node_modules/@aihot/contracts"],
  ["industry", "node_modules/@aihot/industry"],
];

for (const [from, to] of members) {
  const dest = path.join(root, to);
  if (!existsSync(dest)) continue;
  const isLink = lstatSync(dest).isSymbolicLink();
  if (!isLink) continue;
  rmSync(dest, { recursive: true, force: true });
  cpSync(path.join(root, from), dest, { recursive: true, dereference: true });
  console.log(`vercel-prepare: ${to} -> real copy of ${from}`);
}

// Sanity check: the entry chain must resolve to real files from here on.
for (const mustExist of ["node_modules/@aihot/backend/src/config.ts", "node_modules/@aihot/industry/site.ts"]) {
  if (!existsSync(path.join(root, mustExist))) throw new Error(`vercel-prepare: missing ${mustExist}`);
}
console.log("vercel-prepare: done");

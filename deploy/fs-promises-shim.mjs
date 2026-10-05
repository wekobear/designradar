import { EMBEDDED } from "./embedded-assets.mjs";
// Bundled modules share one scope, so import.meta.dirname is the bundle file's directory (…/api);
// the repo root that mapped paths are keyed against is its parent.
const repoRoot = new URL("..", import.meta.url).pathname.replace(/\/+$/, "");
const keyOf = (p) => {
  if (typeof p !== "string" && !(p instanceof URL)) return null;
  const norm = String(p).split("\\").join("/");
  // harfbuzzjs reads its wasm via a hard-coded __dirname; map it wherever the bundle runs.
  const hb = "/node_modules/harfbuzzjs/";
  const hbAt = norm.indexOf(hb);
  if (hbAt >= 0) return "node_modules/harfbuzzjs/" + norm.slice(hbAt + hb.length);
  if (!norm.startsWith(repoRoot + "/")) return null;
  return norm.slice(repoRoot.length + 1);
};
const embeddedBuf = (key) => Buffer.from(EMBEDDED[key], "base64");
import { createRequire as __shimCreateRequireP } from "node:module";
const real = __shimCreateRequireP(import.meta.url)("node:fs/promises");
export const readFile = async function (p, options) {
  const key = keyOf(p);
  if (key && key in EMBEDDED) {
    const buf = embeddedBuf(key);
    const enc = typeof options === "string" ? options : options?.encoding;
    return enc ? buf.toString(enc) : buf;
  }
  return real.readFile(p, options);
};
export const stat = async function (p, options) {
  const key = keyOf(p);
  if (key && key in EMBEDDED) {
    const size = embeddedBuf(key).length;
    return { size, isFile: () => true, isDirectory: () => false, isSymbolicLink: () => false };
  }
  return real.stat(p, options);
};
export const access = real.access;
export const copyFile = real.copyFile;
export const cp = real.cp;
export const glob = real.glob;
export const open = real.open;
export const opendir = real.opendir;
export const rename = real.rename;
export const truncate = real.truncate;
export const rm = real.rm;
export const rmdir = real.rmdir;
export const mkdir = real.mkdir;
export const readdir = real.readdir;
export const readlink = real.readlink;
export const symlink = real.symlink;
export const lstat = real.lstat;
export const statfs = real.statfs;
export const link = real.link;
export const unlink = real.unlink;
export const chmod = real.chmod;
export const lchmod = real.lchmod;
export const lchown = real.lchown;
export const chown = real.chown;
export const utimes = real.utimes;
export const lutimes = real.lutimes;
export const realpath = real.realpath;
export const mkdtemp = real.mkdtemp;
export const mkdtempDisposable = real.mkdtempDisposable;
export const writeFile = real.writeFile;
export const appendFile = real.appendFile;
export const watch = real.watch;
export const constants = real.constants;
export default real;

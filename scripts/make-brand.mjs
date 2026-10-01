// One-off brand asset build: derives icon.png / icon-192.png / apple-icon.png / favicon.ico
// from industry/brand/logo-art.png (generated art). Run: node scripts/make-brand.cjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const brand = path.resolve(import.meta.dirname, "../industry/brand");
const art = path.join(brand, "logo-art.png");

/** ICO container wrapping PNG blobs (Vista+ format). */
function icoFromPngs(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(images.length, 2);
  const dir = Buffer.alloc(16 * images.length);
  const blobs = [];
  let offset = 6 + dir.length;
  images.forEach((img, i) => {
    const d = dir.subarray(i * 16, (i + 1) * 16);
    d.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    d.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    d.writeUInt8(0, 2);
    d.writeUInt8(0, 3);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(img.png.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += img.png.length;
    blobs.push(img.png);
  });
  return Buffer.concat([header, dir, ...blobs]);
}

const base = sharp(art).flatten({ background: "#ffffff" });
for (const [name, size] of [["icon.png", 512], ["icon-192.png", 192], ["apple-icon.png", 180]]) {
  await base.clone().resize(size, size).png().toFile(path.join(brand, name));
  console.log(`${name}: ${size}px`);
}
const favSizes = [16, 32, 48];
const favPngs = await Promise.all(favSizes.map(async (size) => ({
  size,
  png: await base.clone().resize(size, size).png().toBuffer(),
})));
await writeFile(path.join(brand, "favicon.ico"), icoFromPngs(favPngs));
console.log("favicon.ico:", favSizes.join("/"));
await readFile(path.join(brand, "icon.png"));

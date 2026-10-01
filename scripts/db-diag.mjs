// One-off DB diagnostic: compare pooled (transaction, 6543, prepare:false) vs session (5432)
// connections running the site queries that hang inside the Vercel function. Each trial re-imports
// the backend modules with a cache-busting query so config.databaseUrl is read fresh per trial.
let n = 0;
async function trial(label, env, run) {
  process.env.DATABASE_URL = env.url;
  process.env.DATABASE_PREPARE = env.prepare;
  process.env.DATABASE_POOL_MAX = "1";
  const v = `t${n++}`;
  const t = Date.now();
  try {
    const stats = await import(`../packages/backend/src/site/stats.ts?${v}`);
    const r = await Promise.race([
      stats.loadSiteStats().then((s) => `sources=${s.sources}`),
      new Promise((_, rej) => setTimeout(() => rej(new Error("TIMEOUT 20s")), 20_000)),
    ]);
    console.log(label, Date.now() - t + "ms OK", r);
  } catch (e) {
    console.log(label, "FAIL", Date.now() - t + "ms", e.code || "", e.message?.slice(0, 100));
  }
}
const envUrl = process.env.DATABASE_URL;
const pooled = /6543/.test(envUrl) ? envUrl : envUrl.replace(":5432/", ":6543/") + (envUrl.includes("?") ? "&pgbouncer=true" : "?sslmode=require&pgbouncer=true");
const session = envUrl.replace(":6543/", ":5432/").replace("&pgbouncer=true", "");
console.log("pooled:", /6543/.test(pooled), "session:", !/6543/.test(session));
await trial("A pooled prepare=false", { url: pooled, prepare: "false" });
await trial("B pooled prepare default", { url: pooled, prepare: undefined });
await trial("C session", { url: session, prepare: undefined });

// One-off DB diagnostic: reproduce the hanging site queries (timeline/stats) on a clean network.
import postgres from "postgres";
const url = process.env.DATABASE_URL;
console.log("pooled?", /6543|pgbouncer/.test(url), "prepare:", process.env.DATABASE_PREPARE);
const sql = postgres(url, { max: Number(process.env.DATABASE_POOL_MAX || 10), prepare: process.env.DATABASE_PREPARE !== "false", connect_timeout: 15, idle_timeout: 5 });
const q = async (label, fn) => {
  const t = Date.now();
  try { const r = await fn(); console.log(label, Date.now() - t + "ms OK", JSON.stringify(r).slice(0, 200)); }
  catch (e) { console.log(label, "FAIL", Date.now() - t + "ms", e.code || "", e.message?.slice(0, 140)); }
};
await q("ping", () => sql`select 1`);
const { loadSiteStats } = // import lazily below
await q("stats", async () => { const m = await import("../packages/backend/src/site/stats.ts"); return (await m.loadSiteStats()).sources; });
await q("timeline", async () => { const m = await import("../packages/backend/src/publication/timeline.ts"); const r = await m.loadTimeline({ limit: 5 }); return r.cards?.length ?? "n/a"; });
await sql.end({ timeout: 2 });

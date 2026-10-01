// One-off DB diagnostic: compare pooled (transaction, 6543, prepare:false) vs session (5432)
// connections running the site queries that hang inside the Vercel function.
import postgres from "postgres";
import { readFileSync } from "node:fs";

const envUrl = process.env.DATABASE_URL!;
const pooled = /sslmode=require&pgbouncer=true/.test(envUrl) ? envUrl : envUrl.replace(":5432/", ":6543/").replace("sslmode=require", "sslmode=require&pgbouncer=true").replace("postgres.aivdomtumarcswubinmn", "postgres.aivdomtumarcswubinmn");
const session = envUrl.replace(":6543/", ":5432/").replace("&pgbouncer=true", "");

async function trial(label: string, url: string, opts: Record<string, unknown>, run: (sql: any) => Promise<unknown>) {
  const sql = postgres(url, { connect_timeout: 15, idle_timeout: 3, max: 1, ...opts } as never);
  const t = Date.now();
  try {
    const r = await run(sql);
    console.log(label, Date.now() - t + "ms OK", JSON.stringify(r)?.slice(0, 120));
  } catch (e) {
    console.log(label, "FAIL", Date.now() - t + "ms", (e as { code?: string }).code || "", (e as Error).message?.slice(0, 120));
  }
  await sql.end({ timeout: 2 }).catch(() => {});
}

const stats = (sql: never) => import("../packages/backend/src/site/stats.ts").then(async (m) => {
  // stats caches per process; call the raw query path through a fresh module each time
  return (await (m as { loadSiteStats(): Promise<{ sources: number }> }).loadSiteStats()).sources;
});
const timeline = (sql: never) => import("../packages/backend/src/publication/timeline.ts").then((m) => m.loadTimeline({ limit: 5 }).then((r: { cards?: unknown[] }) => r.cards?.length ?? 0));

await trial("A pooled+prepareFalse stats", pooled, { prepare: false }, stats as never);
await trial("B pooled+prepareFalse timeline", pooled, { prepare: false }, timeline as never);
await trial("C session+prepareTrue stats", session, {}, stats as never);
await trial("D session+prepareTrue timeline", session, {}, timeline as never);

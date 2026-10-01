// One-off DB diagnostic (run via db-diag workflow): connection sanity + blocked query inspection.
import postgres from "postgres";
const url = process.env.DATABASE_URL;
const sql = postgres(url, { max: 1, connect_timeout: 20, idle_timeout: 5 });
const q = async (label, query) => {
  const t = Date.now();
  try { const r = await sql.unsafe(query); console.log(label, Date.now() - t + "ms", JSON.stringify(r).slice(0, 600)); }
  catch (e) { console.log(label, "FAIL", Date.now() - t + "ms", e.code || "", e.message?.slice(0, 140)); }
};
await q("ping", "select 1");
await q("counts", "select (select count(*) from publications) p, (select count(*) from items) i, (select count(*) from events) e, (select count(*) from sources) s, (select count(*) from stories) st");
await q("activity", `select pid, state, wait_event_type, wait_event, now()-xact_start as xact_age, now()-state_change as idle_age, left(coalesce(query,''),90) as q
  from pg_stat_activity where datname = current_database() and pid <> pg_backend_pid() order by xact_start nulls last limit 12`);
await q("locks", `select count(*) blocked from pg_locks where not granted`);
await sql.end({ timeout: 2 });

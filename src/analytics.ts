/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser, rateLimit } from "./auth";
import type { Env } from "./worker";

const analytics = new Hono<{ Bindings: Env }>();

const utcDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const dayBefore = (now: number, n: number) => utcDay(now - n * 86_400_000);

// ── ingest ──────────────────────────────────────────────────────────────────
// Anonymous-friendly: no auth required (we attach the opaque user_id only if a
// session happens to be present). Server stamps ts/day; everything is capped.
analytics.post("/", async (c) => {
  if (!(await rateLimit(c, "events", 120, 60_000))) return c.json({ ok: false }, 429);
  let body: {
    anonId?: string;
    sessionId?: string;
    lang?: string;
    ua?: string;
    events?: { name?: string; props?: Record<string, unknown> }[];
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false }, 400);
  }
  const events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];
  if (!events.length) return c.json({ ok: true });

  const user = await currentUser(c).catch(() => null);
  const now = Date.now();
  const day = utcDay(now);
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);
  const anonId = str(body.anonId, 40);
  const sessionId = str(body.sessionId, 40);
  const lang = str(body.lang, 8);
  const ua = body.ua === "mobile" || body.ua === "desktop" ? body.ua : null;

  const ins = c.env.DB.prepare(
    "INSERT INTO events (ts,day,name,user_id,anon_id,session_id,lang,props,ua) VALUES (?,?,?,?,?,?,?,?,?)",
  );
  const stmts: D1PreparedStatement[] = [];
  for (const e of events) {
    if (!e || typeof e.name !== "string") continue;
    let props: string | null = null;
    if (e.props && typeof e.props === "object") {
      try {
        const s = JSON.stringify(e.props);
        if (s.length <= 1024) props = s;
      } catch {
        /* drop unserialisable props */
      }
    }
    stmts.push(ins.bind(now, day, e.name.slice(0, 64), user?.id ?? null, anonId, sessionId, lang, props, ua));
  }
  if (stmts.length) await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

// ── owner dashboard metrics ──────────────────────────────────────────────────
analytics.get("/metrics", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const admin = await c.env.DB.prepare("SELECT is_admin FROM users WHERE id = ?")
    .bind(user.id)
    .first<{ is_admin: number }>();
  if (!admin || admin.is_admin !== 1) return c.json({ error: "forbidden" }, 403);

  const now = Date.now();
  const today = utcDay(now);
  const d7 = dayBefore(now, 6);
  const d14 = dayBefore(now, 13);
  const DB = c.env.DB;
  const one = <T>(sql: string, ...args: unknown[]) => DB.prepare(sql).bind(...args).first<T>();
  const many = <T>(sql: string, ...args: unknown[]) => DB.prepare(sql).bind(...args).all<T>();
  const ACTIVE = "COUNT(DISTINCT COALESCE(user_id, anon_id))";

  const [users, activeToday, active7, dau, signups, sessDone, sessStart, acc, errors] = await Promise.all([
    one<{ c: number }>("SELECT COUNT(*) c FROM users"),
    one<{ c: number }>(`SELECT ${ACTIVE} c FROM events WHERE day = ?`, today),
    one<{ c: number }>(`SELECT ${ACTIVE} c FROM events WHERE day >= ?`, d7),
    many<{ day: string; c: number }>(`SELECT day, ${ACTIVE} c FROM events WHERE day >= ? GROUP BY day ORDER BY day`, d14),
    many<{ day: string; c: number }>(
      "SELECT day, COUNT(*) c FROM events WHERE name = 'signup' AND day >= ? GROUP BY day ORDER BY day",
      d14,
    ),
    one<{ c: number }>("SELECT COUNT(*) c FROM events WHERE name = 'session_complete' AND day = ?", today),
    one<{ c: number }>("SELECT COUNT(*) c FROM events WHERE name = 'session_start' AND day = ?", today),
    one<{ ok: number; tot: number }>(
      "SELECT SUM(json_extract(props,'$.correct')) ok, SUM(json_extract(props,'$.answered')) tot FROM events WHERE name = 'session_complete' AND props IS NOT NULL AND day >= ?",
      d7,
    ),
    many<{ msg: string; c: number }>(
      "SELECT json_extract(props,'$.message') msg, COUNT(*) c FROM events WHERE name = 'error' AND day >= ? GROUP BY msg ORDER BY c DESC LIMIT 10",
      d7,
    ),
  ]);

  return c.json({
    totalUsers: users?.c ?? 0,
    activeToday: activeToday?.c ?? 0,
    active7d: active7?.c ?? 0,
    sessionsToday: sessDone?.c ?? 0,
    sessionsStartedToday: sessStart?.c ?? 0,
    accuracy7d: acc?.tot ? Math.round((100 * (acc.ok ?? 0)) / acc.tot) : null,
    dau: dau.results,
    signups: signups.results,
    topErrors: errors.results.filter((e) => e.msg),
  });
});

export default analytics;

/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser } from "./auth";
import type { Env } from "./worker";

const circle = new Hono<{ Bindings: Env }>();

// ── date helpers (UTC, ISO week starting Monday) ─────────────────────────────
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function weekRange(now: number): { start: string; end: string } {
  const d = new Date(now);
  const dow = (d.getUTCDay() + 6) % 7; // 0 = Monday
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow));
  const sunday = new Date(monday.getTime() + 6 * 86_400_000);
  return { start: dayKey(monday), end: dayKey(sunday) };
}
function joinCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

async function detail(env: Env, circleId: string, viewerId: string) {
  const c = await env.DB.prepare("SELECT id, name, owner_id, join_code, created_at FROM circles WHERE id = ?")
    .bind(circleId)
    .first<{ id: string; name: string; owner_id: string; join_code: string; created_at: number }>();
  if (!c) return null;

  const now = Date.now();
  const today = dayKey(new Date(now));
  const { start, end } = weekRange(now);

  const members = await env.DB.prepare(
    "SELECT m.user_id, m.role, u.display_name, u.handle FROM circle_members m JOIN users u ON u.id = m.user_id WHERE m.circle_id = ?",
  )
    .bind(circleId)
    .all<{ user_id: string; role: string; display_name: string; handle: string | null }>();

  const week = await env.DB.prepare(
    "SELECT user_id, SUM(reviews) AS wk FROM circle_activity WHERE circle_id = ? AND day >= ? AND day <= ? GROUP BY user_id",
  )
    .bind(circleId, start, end)
    .all<{ user_id: string; wk: number }>();
  const weekBy = new Map<string, number>();
  for (const r of week.results) weekBy.set(r.user_id, r.wk ?? 0);

  const todayRows = await env.DB.prepare(
    "SELECT user_id, reviews FROM circle_activity WHERE circle_id = ? AND day = ?",
  )
    .bind(circleId, today)
    .all<{ user_id: string; reviews: number }>();
  const todayBy = new Map<string, number>();
  for (const r of todayRows.results) todayBy.set(r.user_id, r.reviews ?? 0);

  const goalRow = await env.DB.prepare("SELECT target_words FROM circle_goals WHERE circle_id = ? AND week_start = ?")
    .bind(circleId, start)
    .first<{ target_words: number }>();

  const people = members.results
    .map((m) => ({
      name: m.display_name,
      handle: m.handle,
      role: m.role,
      isYou: m.user_id === viewerId,
      weekReviews: weekBy.get(m.user_id) ?? 0,
      studiedToday: (todayBy.get(m.user_id) ?? 0) > 0,
    }))
    .sort((a, b) => b.weekReviews - a.weekReviews || a.name.localeCompare(b.name));

  const weekTotal = people.reduce((n, p) => n + p.weekReviews, 0);

  // Recent activity feed (aggregate counts only — no items/answers).
  const recent = await env.DB.prepare(
    "SELECT ca.user_id, ca.day, ca.reviews, u.display_name FROM circle_activity ca JOIN users u ON u.id = ca.user_id WHERE ca.circle_id = ? AND ca.reviews > 0 ORDER BY ca.day DESC, ca.reviews DESC LIMIT 12",
  )
    .bind(circleId)
    .all<{ user_id: string; day: string; reviews: number; display_name: string }>();
  const feed = recent.results.map((r) => ({
    name: r.display_name,
    day: r.day,
    reviews: r.reviews,
    isYou: r.user_id === viewerId,
    isToday: r.day === today,
  }));

  return {
    id: c.id,
    name: c.name,
    joinCode: c.join_code,
    isOwner: c.owner_id === viewerId,
    members: people,
    weekTotal,
    goal: goalRow ? goalRow.target_words : null,
    weekStart: start,
    feed,
  };
}

// GET /api/circle/invite?code=CODE — public preview of an invite (no auth):
// the code IS the invitation, so resolving it to a circle + inviter name is
// safe and lets the sign-in page say "Maya invited you to …".
circle.get("/invite", async (c) => {
  const code = (c.req.query("code") ?? "").trim().toUpperCase().slice(0, 12);
  if (!code) return c.json({ error: "no_code" }, 400);
  const row = await c.env.DB.prepare(
    "SELECT c.name AS circle, u.display_name AS inviter FROM circles c JOIN users u ON u.id = c.owner_id WHERE c.join_code = ?",
  )
    .bind(code)
    .first<{ circle: string; inviter: string }>();
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json({ circle: row.circle, inviter: row.inviter });
});

// GET /api/circle — the viewer's circles + detail of the first one.
circle.get("/", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const rows = await c.env.DB.prepare(
    "SELECT c.id, c.name FROM circles c JOIN circle_members m ON m.circle_id = c.id WHERE m.user_id = ? ORDER BY m.joined_at",
  )
    .bind(user.id)
    .all<{ id: string; name: string }>();
  const requested = c.req.query("id");
  const activeId = requested && rows.results.some((r) => r.id === requested) ? requested : rows.results[0]?.id;
  const current = activeId ? await detail(c.env, activeId, user.id) : null;
  return c.json({ circles: rows.results, current });
});

// POST /api/circle { name } — create a circle and join as owner.
circle.post("/", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const { name } = (await c.req.json().catch(() => ({}))) as { name?: string };
  const clean = (name ?? "").trim().slice(0, 40);
  if (!clean) return c.json({ error: "missing_name" }, 400);
  const id = crypto.randomUUID();
  const now = Date.now();
  let code = joinCode();
  for (let i = 0; i < 4; i++) {
    const taken = await c.env.DB.prepare("SELECT 1 FROM circles WHERE join_code = ?").bind(code).first();
    if (!taken) break;
    code = joinCode();
  }
  await c.env.DB.prepare("INSERT INTO circles (id,name,owner_id,join_code,created_at) VALUES (?,?,?,?,?)")
    .bind(id, clean, user.id, code, now)
    .run();
  await c.env.DB.prepare("INSERT INTO circle_members (circle_id,user_id,role,joined_at) VALUES (?,?,'owner',?)")
    .bind(id, user.id, now)
    .run();
  return c.json({ current: await detail(c.env, id, user.id) });
});

// POST /api/circle/join { code }
circle.post("/join", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const { code } = (await c.req.json().catch(() => ({}))) as { code?: string };
  const clean = (code ?? "").trim().toUpperCase();
  const found = await c.env.DB.prepare("SELECT id FROM circles WHERE join_code = ?")
    .bind(clean)
    .first<{ id: string }>();
  if (!found) return c.json({ error: "not_found" }, 404);
  await c.env.DB.prepare(
    "INSERT INTO circle_members (circle_id,user_id,role,joined_at) VALUES (?,?,'member',?) ON CONFLICT(circle_id,user_id) DO NOTHING",
  )
    .bind(found.id, user.id, Date.now())
    .run();
  return c.json({ current: await detail(c.env, found.id, user.id) });
});

// POST /api/circle/leave { circleId }
circle.post("/leave", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const { circleId } = (await c.req.json().catch(() => ({}))) as { circleId?: string };
  if (circleId) {
    await c.env.DB.prepare("DELETE FROM circle_members WHERE circle_id = ? AND user_id = ?")
      .bind(circleId, user.id)
      .run();
  }
  return c.json({ ok: true });
});

// PUT /api/circle/goal { circleId, targetWords } — owner sets the weekly goal.
circle.put("/goal", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const { circleId, targetWords } = (await c.req.json().catch(() => ({}))) as { circleId?: string; targetWords?: number };
  if (!circleId || typeof targetWords !== "number") return c.json({ error: "bad_request" }, 400);
  const owner = await c.env.DB.prepare("SELECT 1 FROM circles WHERE id = ? AND owner_id = ?")
    .bind(circleId, user.id)
    .first();
  if (!owner) return c.json({ error: "forbidden" }, 403);
  const start = weekRange(Date.now()).start;
  await c.env.DB.prepare(
    "INSERT INTO circle_goals (circle_id,week_start,target_words,created_at) VALUES (?,?,?,?) ON CONFLICT(circle_id,week_start) DO UPDATE SET target_words = excluded.target_words",
  )
    .bind(circleId, start, Math.max(1, Math.round(targetWords)), Date.now())
    .run();
  return c.json({ current: await detail(c.env, circleId, user.id) });
});

export default circle;

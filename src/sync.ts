/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser } from "./auth";
import type { Env } from "./worker";

const sync = new Hono<{ Bindings: Env }>();

interface CardState {
  stability: number;
  difficulty: number;
  dueAt: number;
  lastReviewed: number | null;
  reps: number;
  lapses: number;
}

// Offline-first merge: the client POSTs its full local state, we reconcile into
// D1 last-write-wins (per card by lastReviewed; per day by max), and return the
// authoritative merged state for the client to adopt.
sync.post("/", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);

  let body: { progress?: Record<string, CardState>; stats?: { reviewsByDay?: Record<string, number>; newByDay?: Record<string, number> } };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }
  const progress = body.progress ?? {};
  const stats = body.stats ?? {};
  const reviewsByDay = stats.reviewsByDay ?? {};
  const newByDay = stats.newByDay ?? {};
  const now = Date.now();

  // ── cards: keep the newer of client vs server by lastReviewed ──
  const existing = await c.env.DB.prepare(
    "SELECT item_id, last_reviewed FROM card_states WHERE user_id = ?",
  )
    .bind(user.id)
    .all<{ item_id: string; last_reviewed: number | null }>();
  const serverLR = new Map<string, number>();
  for (const r of existing.results) serverLR.set(r.item_id, r.last_reviewed ?? 0);

  const cardStmts: D1PreparedStatement[] = [];
  const upsert = c.env.DB.prepare(
    "INSERT INTO card_states (user_id,item_id,stability,difficulty,due_at,last_reviewed,reps,lapses,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,item_id) DO UPDATE SET stability=excluded.stability,difficulty=excluded.difficulty,due_at=excluded.due_at,last_reviewed=excluded.last_reviewed,reps=excluded.reps,lapses=excluded.lapses,updated_at=excluded.updated_at",
  );
  for (const [itemId, st] of Object.entries(progress)) {
    if (!st || typeof st.dueAt !== "number") continue;
    const clientLR = st.lastReviewed ?? 0;
    if (clientLR >= (serverLR.get(itemId) ?? 0)) {
      cardStmts.push(
        upsert.bind(user.id, itemId, st.stability, st.difficulty, st.dueAt, st.lastReviewed, st.reps, st.lapses, now),
      );
    }
  }
  if (cardStmts.length) await c.env.DB.batch(cardStmts);

  // ── daily activity: max per day ──
  const statStmts: D1PreparedStatement[] = [];
  const dayUpsert = c.env.DB.prepare(
    "INSERT INTO daily_activity (user_id,day,reviews,new_count,minutes,updated_at) VALUES (?,?,?,?,0,?) ON CONFLICT(user_id,day) DO UPDATE SET reviews=MAX(reviews,excluded.reviews), new_count=MAX(new_count,excluded.new_count), updated_at=excluded.updated_at",
  );
  for (const day of new Set([...Object.keys(reviewsByDay), ...Object.keys(newByDay)])) {
    statStmts.push(dayUpsert.bind(user.id, day, reviewsByDay[day] ?? 0, newByDay[day] ?? 0, now));
  }
  if (statStmts.length) await c.env.DB.batch(statStmts);

  // Project today's totals into any circles this user shares activity with.
  await projectCircleActivity(c.env, user.id, now);

  // ── return authoritative merged state ──
  const mergedCards = await c.env.DB.prepare(
    "SELECT item_id,stability,difficulty,due_at,last_reviewed,reps,lapses FROM card_states WHERE user_id = ?",
  )
    .bind(user.id)
    .all<{ item_id: string; stability: number; difficulty: number; due_at: number; last_reviewed: number | null; reps: number; lapses: number }>();
  const mergedProgress: Record<string, CardState> = {};
  for (const r of mergedCards.results) {
    mergedProgress[r.item_id] = {
      stability: r.stability,
      difficulty: r.difficulty,
      dueAt: r.due_at,
      lastReviewed: r.last_reviewed,
      reps: r.reps,
      lapses: r.lapses,
    };
  }

  const mergedAct = await c.env.DB.prepare("SELECT day,reviews,new_count FROM daily_activity WHERE user_id = ?")
    .bind(user.id)
    .all<{ day: string; reviews: number; new_count: number }>();
  const outReviews: Record<string, number> = {};
  const outNew: Record<string, number> = {};
  for (const r of mergedAct.results) {
    if (r.reviews) outReviews[r.day] = r.reviews;
    if (r.new_count) outNew[r.day] = r.new_count;
  }

  return c.json({ progress: mergedProgress, stats: { reviewsByDay: outReviews, newByDay: outNew } });
});

// Mirror today's aggregate review count into the user's circles (privacy: only
// counts, never item ids or answers), respecting their share_activity setting.
async function projectCircleActivity(env: Env, userId: string, now: number): Promise<void> {
  const day = new Date(now).toISOString().slice(0, 10);
  const settings = await env.DB.prepare("SELECT share_activity FROM user_settings WHERE user_id = ?")
    .bind(userId)
    .first<{ share_activity: number }>();
  if (settings && settings.share_activity === 0) return;
  const today = await env.DB.prepare("SELECT reviews FROM daily_activity WHERE user_id = ? AND day = ?")
    .bind(userId, day)
    .first<{ reviews: number }>();
  const reviews = today?.reviews ?? 0;
  const circles = await env.DB.prepare("SELECT circle_id FROM circle_members WHERE user_id = ?")
    .bind(userId)
    .all<{ circle_id: string }>();
  if (!circles.results.length) return;
  const stmts = circles.results.map((r) =>
    env.DB.prepare(
      "INSERT INTO circle_activity (circle_id,user_id,day,reviews,minutes,updated_at) VALUES (?,?,?,?,0,?) ON CONFLICT(circle_id,user_id,day) DO UPDATE SET reviews=excluded.reviews, updated_at=excluded.updated_at",
    ).bind(r.circle_id, userId, day, reviews, now),
  );
  await env.DB.batch(stmts);
}

export default sync;

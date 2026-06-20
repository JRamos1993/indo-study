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

  let body: {
    progress?: Record<string, CardState>;
    stats?: { reviewsByDay?: Record<string, number>; newByDay?: Record<string, number> };
    settings?: Record<string, any>;
    settingsUpdatedAt?: number;
    saved?: { id?: string; target?: string; en?: string; lang?: string; ts?: number }[];
    today?: string; // client's LOCAL YYYY-MM-DD, for correct circle projection
  };
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
  // Cap entries to bound the batch write (the whole curriculum is ~550 items).
  const fin = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
  for (const [itemId, st] of Object.entries(progress).slice(0, 10_000)) {
    if (!st || typeof itemId !== "string" || itemId.length > 80) continue;
    if (typeof st.dueAt !== "number" || !Number.isFinite(st.dueAt)) continue;
    // Coerce/clamp every numeric field so a buggy/tampered client can't persist
    // NaN/Infinity/garbage into card_states (which round-trips to all devices).
    const stability = Math.max(0, fin(st.stability, 0));
    const difficulty = Math.min(10, Math.max(1, fin(st.difficulty, 5)));
    const reps = Math.max(0, Math.round(fin(st.reps, 0)));
    const lapses = Math.max(0, Math.round(fin(st.lapses, 0)));
    const lastReviewed = st.lastReviewed == null ? null : fin(st.lastReviewed, Date.now());
    const clientLR = lastReviewed ?? 0;
    if (clientLR >= (serverLR.get(itemId) ?? 0)) {
      cardStmts.push(
        upsert.bind(user.id, itemId, stability, difficulty, st.dueAt, lastReviewed, reps, lapses, now),
      );
    }
  }
  if (cardStmts.length) await c.env.DB.batch(cardStmts);

  // ── daily activity: max per day (validated — these feed the shared circle
  //    leaderboard, so counts are clamped and day keys are format-checked) ──
  const isDay = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const clampCount = (n: unknown) =>
    Math.max(0, Math.min(100_000, Math.round(typeof n === "number" && Number.isFinite(n) ? n : 0)));
  const statStmts: D1PreparedStatement[] = [];
  const dayUpsert = c.env.DB.prepare(
    "INSERT INTO daily_activity (user_id,day,reviews,new_count,minutes,updated_at) VALUES (?,?,?,?,0,?) ON CONFLICT(user_id,day) DO UPDATE SET reviews=MAX(reviews,excluded.reviews), new_count=MAX(new_count,excluded.new_count), updated_at=excluded.updated_at",
  );
  const days = [...new Set([...Object.keys(reviewsByDay), ...Object.keys(newByDay)])]
    .filter(isDay)
    .slice(0, 1000);
  for (const day of days) {
    statStmts.push(dayUpsert.bind(user.id, day, clampCount(reviewsByDay[day]), clampCount(newByDay[day]), now));
  }
  if (statStmts.length) await c.env.DB.batch(statStmts);

  // ── settings: last-write-wins by the client's timestamp ──
  const clientTs = typeof body.settingsUpdatedAt === "number" ? body.settingsUpdatedAt : 0;
  const cs = body.settings;
  const sRow0 = await c.env.DB.prepare("SELECT updated_at FROM user_settings WHERE user_id = ?")
    .bind(user.id)
    .first<{ updated_at: number }>();
  if (cs && clientTs > (sRow0?.updated_at ?? 0)) {
    await c.env.DB.prepare(
      "INSERT INTO user_settings (user_id, study_language, daily_goal, daily_goal_minutes, new_per_day, target_retention, default_direction, theme, learning_focus, share_activity, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET study_language=excluded.study_language, daily_goal=excluded.daily_goal, daily_goal_minutes=excluded.daily_goal_minutes, new_per_day=excluded.new_per_day, target_retention=excluded.target_retention, default_direction=excluded.default_direction, theme=excluded.theme, learning_focus=excluded.learning_focus, share_activity=excluded.share_activity, updated_at=excluded.updated_at",
    )
      .bind(
        user.id,
        cs.studyLanguage ?? "id",
        Math.round(cs.dailyGoal ?? 20),
        Math.round(cs.dailyGoalMinutes ?? 10),
        Math.round(cs.newPerDay ?? 15),
        cs.targetRetention ?? 0.9,
        cs.defaultDirection ?? "auto",
        cs.theme ?? "light",
        cs.learningFocus ?? "balanced",
        cs.shareActivity === false ? 0 : 1,
        clientTs,
      )
      .run();
  }

  // ── saved phrases (from AI conversations): union-merge, keep earliest ts ──
  const saved = Array.isArray(body.saved) ? body.saved.slice(0, 2000) : [];
  if (saved.length) {
    const sUpsert = c.env.DB.prepare(
      "INSERT INTO saved_phrases (user_id,id,target,en,lang,ts) VALUES (?,?,?,?,?,?) ON CONFLICT(user_id,id) DO UPDATE SET ts=MIN(ts,excluded.ts)",
    );
    const sStmts: D1PreparedStatement[] = [];
    for (const p of saved) {
      if (!p || typeof p.id !== "string" || !p.id || p.id.length > 80) continue;
      if (typeof p.target !== "string" || !p.target.trim()) continue;
      const en = typeof p.en === "string" ? p.en.slice(0, 200) : "";
      const lang = typeof p.lang === "string" ? p.lang.slice(0, 8) : "id";
      const ts = typeof p.ts === "number" && Number.isFinite(p.ts) ? Math.round(p.ts) : now;
      sStmts.push(sUpsert.bind(user.id, p.id, p.target.slice(0, 120), en, lang, ts));
    }
    if (sStmts.length) await c.env.DB.batch(sStmts);
  }

  // Project today's totals into any circles this user shares activity with.
  // Use the client's LOCAL day so the lookup matches the locally-keyed rows
  // (daily_activity is keyed by the user's local date, not UTC).
  const today = typeof body.today === "string" && isDay(body.today) ? body.today : new Date(now).toISOString().slice(0, 10);
  await projectCircleActivity(c.env, user.id, today);

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

  const finalS = await c.env.DB.prepare("SELECT * FROM user_settings WHERE user_id = ?")
    .bind(user.id)
    .first<any>();
  const settings = finalS
    ? {
        studyLanguage: finalS.study_language,
        dailyGoal: finalS.daily_goal,
        dailyGoalMinutes: finalS.daily_goal_minutes,
        newPerDay: finalS.new_per_day,
        targetRetention: finalS.target_retention,
        defaultDirection: finalS.default_direction,
        theme: finalS.theme,
        learningFocus: finalS.learning_focus,
        shareActivity: finalS.share_activity === 1,
      }
    : null;

  const mergedSaved = await c.env.DB.prepare("SELECT id,target,en,lang,ts FROM saved_phrases WHERE user_id = ?")
    .bind(user.id)
    .all<{ id: string; target: string; en: string; lang: string; ts: number }>();

  return c.json({
    progress: mergedProgress,
    stats: { reviewsByDay: outReviews, newByDay: outNew },
    settings,
    settingsUpdatedAt: finalS?.updated_at ?? 0,
    saved: mergedSaved.results,
  });
});

// Mirror a given local day's aggregate review count into the user's circles
// (privacy: only counts, never item ids or answers), respecting share_activity.
async function projectCircleActivity(env: Env, userId: string, day: string): Promise<void> {
  const settings = await env.DB.prepare("SELECT share_activity FROM user_settings WHERE user_id = ?")
    .bind(userId)
    .first<{ share_activity: number }>();
  if (settings && settings.share_activity === 0) return;
  const row = await env.DB.prepare("SELECT reviews FROM daily_activity WHERE user_id = ? AND day = ?")
    .bind(userId, day)
    .first<{ reviews: number }>();
  const reviews = row?.reviews ?? 0;
  const circles = await env.DB.prepare("SELECT circle_id FROM circle_members WHERE user_id = ?")
    .bind(userId)
    .all<{ circle_id: string }>();
  if (!circles.results.length) return;
  const ts = Date.now();
  const stmts = circles.results.map((r) =>
    env.DB.prepare(
      "INSERT INTO circle_activity (circle_id,user_id,day,reviews,minutes,updated_at) VALUES (?,?,?,?,0,?) ON CONFLICT(circle_id,user_id,day) DO UPDATE SET reviews=excluded.reviews, updated_at=excluded.updated_at",
    ).bind(r.circle_id, userId, day, reviews, ts),
  );
  await env.DB.batch(stmts);
}

export default sync;

/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import auth from "./auth";
import circle from "./circle";
import sync from "./sync";

export interface Env {
  /** D1 database "lilt" — the social/account/sync backend. */
  DB: D1Database;
  /** Static-asset binding (the Next.js export in ./out). */
  ASSETS: Fetcher;
  APP_ENV?: string;
  /** Server-side pepper for password hashing (set via `wrangler secret put`). */
  SESSION_PEPPER?: string;
}

const app = new Hono<{ Bindings: Env }>();

// CSRF: every mutating /api request must carry a same-origin Origin (or
// Referer). The static frontend is same-origin, so this is transparent for the
// app while blocking cross-site forgery against the cookie-authed endpoints.
app.use("/api/*", async (c, next) => {
  const m = c.req.method;
  if (m !== "GET" && m !== "HEAD" && m !== "OPTIONS") {
    const src = c.req.header("Origin") || c.req.header("Referer");
    let ok = false;
    if (src) {
      try {
        ok = new URL(src).host === new URL(c.req.url).host;
      } catch {
        ok = false;
      }
    }
    if (!ok) return c.json({ error: "bad_origin" }, 403);
  }
  return next();
});

// Health check — confirms the Worker + D1 binding are wired.
app.get("/api/health", async (c) => {
  let db: "ok" | "unavailable" = "unavailable";
  try {
    await c.env.DB.prepare("SELECT 1").first();
    db = "ok";
  } catch {
    db = "unavailable";
  }
  return c.json({ ok: true, env: c.env.APP_ENV ?? "dev", db });
});

// Accounts / auth.
app.route("/api/auth", auth);
// Cross-device progress sync.
app.route("/api/sync", sync);
// Circle — friends / group goal / leaderboard.
app.route("/api/circle", circle);

// `run_worker_first` only routes /api/* to the Worker; any other path that
// reaches here means the static asset was missing — respond defensively.
app.all("*", (c) => c.json({ error: "not_found" }, 404));

// Daily housekeeping (Cron Trigger): prune expired sessions/invites and stale
// rate-limit buckets so those tables don't grow unbounded.
async function scheduled(_event: ScheduledController, env: Env): Promise<void> {
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
    env.DB.prepare("DELETE FROM invites WHERE expires_at < ?").bind(now),
    env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(now - 3_600_000),
  ]);
}

export default {
  fetch: app.fetch,
  scheduled,
} satisfies ExportedHandler<Env>;

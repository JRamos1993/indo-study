/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import ai from "./ai";
import analytics from "./analytics";
import auth, { currentUser } from "./auth";
import billing from "./billing";
import circle from "./circle";
import push, { sendReminders } from "./push";
import sync from "./sync";

export interface Env {
  /** D1 database "lilt" — the social/account/sync backend. */
  DB: D1Database;
  /** Static-asset binding (the Next.js export in ./out). */
  ASSETS: Fetcher;
  APP_ENV?: string;
  /** Server-side pepper for password hashing (set via `wrangler secret put`). */
  SESSION_PEPPER?: string;
  /** Web Push VAPID: public key (var) + private JWK (secret) + subject. */
  VAPID_PUBLIC?: string;
  VAPID_PRIVATE_JWK?: string;
  VAPID_SUBJECT?: string;
  /** Workers AI binding (conversation tutor + scenario generation). */
  AI: Ai;
  /** Stripe (Lilt Pro). Secrets via `wrangler secret put`; price id + label are vars. */
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID?: string;
  PRO_PRICE_LABEL?: string;
}

const app = new Hono<{ Bindings: Env }>();

// CSRF: every mutating /api request must carry a same-origin Origin (or
// Referer). The static frontend is same-origin, so this is transparent for the
// app while blocking cross-site forgery against the cookie-authed endpoints.
app.use("/api/*", async (c, next) => {
  const m = c.req.method;
  // Stripe webhooks are server-to-server (no Origin) and are authenticated by
  // their signature instead — exempt them from the same-origin check.
  if (new URL(c.req.url).pathname === "/api/billing/webhook") return next();
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
// Product analytics + client error tracking (ingest is anonymous-friendly).
app.route("/api/events", analytics);
// Web Push subscriptions for due-review reminders.
app.route("/api/push", push);
// Workers AI conversation tutor.
app.route("/api/ai", ai);
// Lilt Pro (Stripe checkout + webhook).
app.route("/api/billing", billing);
// Pro status + config for the upgrade UI.
app.get("/api/pro", async (c) => {
  const user = await currentUser(c);
  return c.json({
    pro: user?.isPro ?? false,
    available: !!(c.env.STRIPE_SECRET_KEY && c.env.STRIPE_PRICE_ID),
    priceLabel: c.env.PRO_PRICE_LABEL ?? "$4.99 / month",
  });
});

// `run_worker_first` only routes /api/* to the Worker; any other path that
// reaches here means the static asset was missing — respond defensively.
app.all("*", (c) => c.json({ error: "not_found" }, 404));

// Cron Trigger runs hourly: send due-review reminders at each user's local
// reminder hour, and once a day (UTC 04:00) prune expired sessions/invites and
// stale rate-limit buckets so those tables don't grow unbounded.
async function scheduled(_event: ScheduledController, env: Env): Promise<void> {
  await sendReminders(env);
  if (new Date().getUTCHours() === 4) {
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
      env.DB.prepare("DELETE FROM invites WHERE expires_at < ?").bind(now),
      // 24h: don't evict the daily AI-cost buckets before their window ends
      // (shorter login/burst buckets are long stale by 24h anyway).
      env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(now - 86_400_000),
    ]);
  }
}

export default {
  fetch: app.fetch,
  scheduled,
} satisfies ExportedHandler<Env>;

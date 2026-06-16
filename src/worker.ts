/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import auth from "./auth";
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

// `run_worker_first` only routes /api/* to the Worker; any other path that
// reaches here means the static asset was missing — respond defensively.
app.all("*", (c) => c.json({ error: "not_found" }, 404));

export default app;

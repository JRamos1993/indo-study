/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";
import type { Env } from "./worker";

const PBKDF2_ITER = 210_000; // native WebCrypto; stored per-row so this can rise safely
const SESSION_DAYS = 60;
const COOKIE = "lilt_session";
const te = new TextEncoder();

// ── encoding ─────────────────────────────────────────────────────────────────
function bytesToHex(b: Uint8Array): string {
  let s = "";
  for (const x of b) s += x.toString(16).padStart(2, "0");
  return s;
}
function bytesToB64(b: Uint8Array): string {
  let s = "";
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s);
}
function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

// ── password hashing (PBKDF2-SHA256) ─────────────────────────────────────────
async function pbkdf2(password: string, pepper: string, salt: Uint8Array, iter: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", te.encode(password + pepper), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, key, 256);
  return bytesToB64(new Uint8Array(bits));
}
async function hashPassword(password: string, pepper: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { hash: await pbkdf2(password, pepper, salt, PBKDF2_ITER), salt: bytesToB64(salt), iter: PBKDF2_ITER };
}
async function verifyPassword(password: string, pepper: string, saltB64: string, expected: string, iter: number) {
  const hash = await pbkdf2(password, pepper, b64ToBytes(saltB64), iter);
  return timingSafeEqual(hash, expected);
}
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", te.encode(s));
  return bytesToHex(new Uint8Array(d));
}
function newToken(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

// ── sessions ─────────────────────────────────────────────────────────────────
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  handle: string | null;
}

async function createSession(env: Env, userId: string, token: string): Promise<void> {
  const id = await sha256Hex(token);
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at) VALUES (?,?,?,?,?)",
  )
    .bind(id, userId, now, now + SESSION_DAYS * 86_400_000, now)
    .run();
}

export async function currentUser(c: Context<{ Bindings: Env }>): Promise<SessionUser | null> {
  const token = getCookie(c, COOKIE);
  if (!token) return null;
  const id = await sha256Hex(token);
  const row = await c.env.DB.prepare(
    "SELECT u.id, u.email, u.display_name, u.handle, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?",
  )
    .bind(id)
    .first<{ id: string; email: string; display_name: string; handle: string | null; expires_at: number }>();
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
    return null;
  }
  return { id: row.id, email: row.email, name: row.display_name, handle: row.handle };
}

function setSessionCookie(c: Context<{ Bindings: Env }>, token: string): void {
  const secure = new URL(c.req.url).protocol === "https:";
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

// ── helpers ──────────────────────────────────────────────────────────────────
function sameOrigin(c: Context<{ Bindings: Env }>): boolean {
  const origin = c.req.header("Origin");
  if (!origin) return true; // non-browser client (e.g. curl) — allow
  try {
    return new URL(origin).host === new URL(c.req.url).host;
  } catch {
    return false;
  }
}

async function rateLimit(c: Context<{ Bindings: Env }>, bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const ip = c.req.header("CF-Connecting-IP") || c.req.header("x-forwarded-for") || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const row = await c.env.DB.prepare("SELECT count, window_start FROM rate_limits WHERE key = ?")
    .bind(key)
    .first<{ count: number; window_start: number }>();
  if (!row || now - row.window_start > windowMs) {
    await c.env.DB.prepare(
      "INSERT INTO rate_limits (key, count, window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count = 1, window_start = ?",
    )
      .bind(key, now, now)
      .run();
    return true;
  }
  if (row.count >= limit) return false;
  await c.env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

const validEmail = (e: unknown): e is string =>
  typeof e === "string" && e.length <= 200 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

function makeHandle(name: string, email: string): string {
  const base = (name || email.split("@")[0] || "learner")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 16) || "learner";
  const suffix = bytesToHex(crypto.getRandomValues(new Uint8Array(2)));
  return `${base}_${suffix}`;
}

// High-entropy, human-copyable recovery key, e.g. ABCD-EF2H-...-WXYZ.
function makeRecoveryKey(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]);
  return [0, 4, 8, 12, 16].map((i) => chars.slice(i, i + 4).join("")).join("-");
}
const normalizeKey = (k: string) => k.trim().toUpperCase().replace(/\s+/g, "");

// ── routes ───────────────────────────────────────────────────────────────────
const auth = new Hono<{ Bindings: Env }>();

auth.post("/signup", async (c) => {
  if (!sameOrigin(c)) return c.json({ error: "bad_origin" }, 403);
  if (!(await rateLimit(c, "signup", 8, 60_000))) return c.json({ error: "rate_limited" }, 429);

  let body: { email?: string; password?: string; name?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim();
  if (!validEmail(email)) return c.json({ error: "invalid_email" }, 400);
  if (password.length < 8) return c.json({ error: "weak_password" }, 400);
  if (!name) return c.json({ error: "missing_name" }, 400);

  const norm = email.toLowerCase();
  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email_norm = ?").bind(norm).first();
  if (existing) return c.json({ error: "email_taken" }, 409);

  const { hash, salt, iter } = await hashPassword(password, c.env.SESSION_PEPPER ?? "");
  const id = crypto.randomUUID();
  const handle = makeHandle(name, norm);
  const recoveryKey = makeRecoveryKey();
  const recoveryHash = await sha256Hex(normalizeKey(recoveryKey));
  const now = Date.now();
  await c.env.DB.prepare(
    "INSERT INTO users (id, email, email_norm, password_hash, password_salt, password_iter, display_name, handle, recovery_hash, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  )
    .bind(id, email, norm, hash, salt, iter, name, handle, recoveryHash, now, now)
    .run();
  // theme 'light' to match the client default (the design ships light first).
  await c.env.DB.prepare("INSERT INTO user_settings (user_id, theme, updated_at) VALUES (?, 'light', ?)").bind(id, now).run();

  const token = newToken();
  await createSession(c.env, id, token);
  setSessionCookie(c, token);
  // recoveryKey is returned ONCE so the client can show it to the user.
  return c.json({ user: { id, email, name, handle }, recoveryKey });
});

auth.post("/login", async (c) => {
  if (!sameOrigin(c)) return c.json({ error: "bad_origin" }, 403);
  if (!(await rateLimit(c, "login", 12, 60_000))) return c.json({ error: "rate_limited" }, 429);

  let body: { email?: string; password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const pepper = c.env.SESSION_PEPPER ?? "";

  const row = await c.env.DB.prepare(
    "SELECT id, email, display_name, handle, password_hash, password_salt, password_iter FROM users WHERE email_norm = ?",
  )
    .bind(email)
    .first<{ id: string; email: string; display_name: string; handle: string | null; password_hash: string; password_salt: string; password_iter: number }>();

  if (!row) {
    // Dummy derive so a missing account costs the same time as a wrong password.
    await pbkdf2(password, pepper, new Uint8Array(16), PBKDF2_ITER);
    return c.json({ error: "invalid_credentials" }, 401);
  }
  const ok = await verifyPassword(password, pepper, row.password_salt, row.password_hash, row.password_iter);
  if (!ok) return c.json({ error: "invalid_credentials" }, 401);

  const token = newToken();
  await createSession(c.env, row.id, token);
  setSessionCookie(c, token);
  return c.json({ user: { id: row.id, email: row.email, name: row.display_name, handle: row.handle } });
});

auth.post("/logout", async (c) => {
  const token = getCookie(c, COOKIE);
  if (token) {
    const id = await sha256Hex(token);
    await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
  }
  deleteCookie(c, COOKIE, { path: "/" });
  return c.json({ ok: true });
});

auth.get("/me", async (c) => {
  return c.json({ user: await currentUser(c) });
});

// Change password (logged in).
auth.post("/password", async (c) => {
  if (!sameOrigin(c)) return c.json({ error: "bad_origin" }, 403);
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const body = (await c.req.json().catch(() => ({}))) as { currentPassword?: string; newPassword?: string };
  if ((body.newPassword ?? "").length < 8) return c.json({ error: "weak_password" }, 400);
  const pepper = c.env.SESSION_PEPPER ?? "";
  const row = await c.env.DB.prepare(
    "SELECT password_hash, password_salt, password_iter FROM users WHERE id = ?",
  )
    .bind(user.id)
    .first<{ password_hash: string; password_salt: string; password_iter: number }>();
  if (!row) return c.json({ error: "unauthorized" }, 401);
  const ok = await verifyPassword(body.currentPassword ?? "", pepper, row.password_salt, row.password_hash, row.password_iter);
  if (!ok) return c.json({ error: "invalid_credentials" }, 401);
  const { hash, salt, iter } = await hashPassword(body.newPassword!, pepper);
  await c.env.DB.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ?, password_iter = ?, updated_at = ? WHERE id = ?",
  )
    .bind(hash, salt, iter, Date.now(), user.id)
    .run();
  return c.json({ ok: true });
});

// Reset password with a recovery key (forgot password — no email needed).
auth.post("/recover", async (c) => {
  if (!sameOrigin(c)) return c.json({ error: "bad_origin" }, 403);
  if (!(await rateLimit(c, "recover", 8, 60_000))) return c.json({ error: "rate_limited" }, 429);
  const body = (await c.req.json().catch(() => ({}))) as { email?: string; recoveryKey?: string; newPassword?: string };
  if ((body.newPassword ?? "").length < 8) return c.json({ error: "weak_password" }, 400);
  const pepper = c.env.SESSION_PEPPER ?? "";
  const email = (body.email ?? "").trim().toLowerCase();
  const row = await c.env.DB.prepare(
    "SELECT id, email, display_name, handle, recovery_hash FROM users WHERE email_norm = ?",
  )
    .bind(email)
    .first<{ id: string; email: string; display_name: string; handle: string | null; recovery_hash: string | null }>();
  const given = await sha256Hex(normalizeKey(body.recoveryKey ?? ""));
  if (!row || !row.recovery_hash || given !== row.recovery_hash) {
    return c.json({ error: "invalid_recovery" }, 401);
  }
  const { hash, salt, iter } = await hashPassword(body.newPassword!, pepper);
  const nextKey = makeRecoveryKey();
  const nextHash = await sha256Hex(normalizeKey(nextKey));
  await c.env.DB.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ?, password_iter = ?, recovery_hash = ?, updated_at = ? WHERE id = ?",
  )
    .bind(hash, salt, iter, nextHash, Date.now(), row.id)
    .run();
  // Invalidate every existing session, then start a fresh one.
  await c.env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(row.id).run();
  const token = newToken();
  await createSession(c.env, row.id, token);
  setSessionCookie(c, token);
  return c.json({ user: { id: row.id, email: row.email, name: row.display_name, handle: row.handle }, recoveryKey: nextKey });
});

// Delete account (logged in; password-confirmed). Cascades to all user data.
auth.delete("/account", async (c) => {
  if (!sameOrigin(c)) return c.json({ error: "bad_origin" }, 403);
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const body = (await c.req.json().catch(() => ({}))) as { password?: string };
  const pepper = c.env.SESSION_PEPPER ?? "";
  const row = await c.env.DB.prepare(
    "SELECT password_hash, password_salt, password_iter FROM users WHERE id = ?",
  )
    .bind(user.id)
    .first<{ password_hash: string; password_salt: string; password_iter: number }>();
  if (!row) return c.json({ error: "unauthorized" }, 401);
  const ok = await verifyPassword(body.password ?? "", pepper, row.password_salt, row.password_hash, row.password_iter);
  if (!ok) return c.json({ error: "invalid_credentials" }, 401);
  await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
  deleteCookie(c, COOKIE, { path: "/" });
  return c.json({ ok: true });
});

export default auth;

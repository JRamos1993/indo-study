/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser } from "./auth";
import type { Env } from "./worker";

const push = new Hono<{ Bindings: Env }>();

// ── VAPID (RFC 8292) — no-payload pushes, so we only sign the auth JWT ─────────
function b64url(buf: ArrayBuffer | Uint8Array): string {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const c of b) s += String.fromCharCode(c);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const b64urlJson = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));

async function vapidJwt(env: Env, audience: string): Promise<string> {
  const jwk = JSON.parse(env.VAPID_PRIVATE_JWK as string);
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const header = b64urlJson({ alg: "ES256", typ: "JWT" });
  const payload = b64urlJson({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: env.VAPID_SUBJECT || "mailto:noreply@lilt.app",
  });
  const signing = `${header}.${payload}`;
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(signing));
  return `${signing}.${b64url(sig)}`;
}

async function sendPush(env: Env, endpoint: string): Promise<number> {
  const jwt = await vapidJwt(env, new URL(endpoint).origin);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC}`, TTL: "86400" },
  });
  return res.status;
}

// ── routes ────────────────────────────────────────────────────────────────────
push.get("/key", (c) => c.json({ key: c.env.VAPID_PUBLIC ?? null }));

push.post("/subscribe", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const body = (await c.req.json().catch(() => ({}))) as {
    subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
    tzOffset?: number;
    reminderHour?: number;
  };
  const sub = body.subscription;
  if (!sub?.endpoint || typeof sub.endpoint !== "string" || sub.endpoint.length > 1024) {
    return c.json({ error: "bad_subscription" }, 400);
  }
  const tz = Number.isFinite(body.tzOffset) ? Math.trunc(body.tzOffset as number) : 0;
  const hour = Number.isFinite(body.reminderHour) ? Math.min(23, Math.max(0, Math.trunc(body.reminderHour as number))) : 19;
  await c.env.DB.prepare(
    "INSERT INTO push_subscriptions (user_id,endpoint,p256dh,auth,tz_offset,reminder_hour,created_at) VALUES (?,?,?,?,?,?,?) " +
      "ON CONFLICT(endpoint) DO UPDATE SET user_id=excluded.user_id, p256dh=excluded.p256dh, auth=excluded.auth, tz_offset=excluded.tz_offset, reminder_hour=excluded.reminder_hour",
  )
    .bind(user.id, sub.endpoint, sub.keys?.p256dh ?? null, sub.keys?.auth ?? null, tz, hour, Date.now())
    .run();
  return c.json({ ok: true });
});

push.post("/unsubscribe", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  const body = (await c.req.json().catch(() => ({}))) as { endpoint?: string };
  if (body.endpoint) {
    await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ? AND user_id = ?")
      .bind(body.endpoint, user.id)
      .run();
  } else {
    await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE user_id = ?").bind(user.id).run();
  }
  return c.json({ ok: true });
});

// POST /api/push/test — send an immediate push to the user's own devices, so
// they can confirm reminders work end-to-end (needs VAPID_PRIVATE_JWK set).
push.post("/test", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  if (!c.env.VAPID_PRIVATE_JWK) return c.json({ error: "not_configured" }, 503);
  const subs = await c.env.DB.prepare("SELECT id, endpoint FROM push_subscriptions WHERE user_id = ?")
    .bind(user.id)
    .all<{ id: number; endpoint: string }>();
  if (!subs.results.length) return c.json({ error: "no_subscription" }, 400);
  let sent = 0;
  for (const s of subs.results) {
    try {
      const status = await sendPush(c.env, s.endpoint);
      if (status >= 200 && status < 300) sent += 1;
      else if (status === 404 || status === 410)
        await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE id = ?").bind(s.id).run();
    } catch {
      /* skip a bad endpoint */
    }
  }
  return c.json({ ok: sent > 0, sent });
});

// ── cron sender: nudge users with due reviews at their local reminder hour ─────
export async function sendReminders(env: Env): Promise<void> {
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC) return; // not configured yet
  const now = Date.now();
  const d = new Date(now);
  const utcMinutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  const subs = await env.DB.prepare(
    "SELECT id, user_id, endpoint, tz_offset, reminder_hour FROM push_subscriptions",
  ).all<{ id: number; user_id: string; endpoint: string; tz_offset: number; reminder_hour: number }>();

  for (const s of subs.results) {
    const localHour = Math.floor(((((utcMinutes - s.tz_offset) % 1440) + 1440) % 1440) / 60);
    if (localHour !== s.reminder_hour) continue;
    const localDay = new Date(now - s.tz_offset * 60_000).toISOString().slice(0, 10);

    const due = await env.DB.prepare("SELECT 1 FROM card_states WHERE user_id = ? AND due_at <= ? LIMIT 1")
      .bind(s.user_id, now)
      .first();
    if (!due) continue;
    const studied = await env.DB.prepare("SELECT reviews FROM daily_activity WHERE user_id = ? AND day = ?")
      .bind(s.user_id, localDay)
      .first<{ reviews: number }>();
    if (studied && studied.reviews > 0) continue;

    try {
      const status = await sendPush(env, s.endpoint);
      if (status === 404 || status === 410) {
        await env.DB.prepare("DELETE FROM push_subscriptions WHERE id = ?").bind(s.id).run();
      }
    } catch {
      /* a single bad endpoint must not abort the batch */
    }
  }
}

export default push;

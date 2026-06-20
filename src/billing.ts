/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser } from "./auth";
import type { Env } from "./worker";

const billing = new Hono<{ Bindings: Env }>();

// Start a Stripe Checkout subscription. Inert (503) until the Stripe secrets are
// configured, so shipping this is safe before a Stripe account exists.
billing.post("/checkout", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  if (user.isPro) return c.json({ error: "already_pro" }, 400);
  if (!c.env.STRIPE_SECRET_KEY || !c.env.STRIPE_PRICE_ID) return c.json({ error: "not_configured" }, 503);

  const origin = new URL(c.req.url).origin;
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("line_items[0][price]", c.env.STRIPE_PRICE_ID);
  form.set("line_items[0][quantity]", "1");
  form.set("success_url", `${origin}/settings/?pro=1`);
  form.set("cancel_url", `${origin}/settings/`);
  form.set("client_reference_id", user.id);
  form.set("customer_email", user.email);
  form.set("allow_promotion_codes", "true");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) return c.json({ error: "stripe_error" }, 502);
  const data = (await res.json()) as { url?: string };
  return data.url ? c.json({ url: data.url }) : c.json({ error: "stripe_error" }, 502);
});

// Stripe webhook → flip is_pro. Authenticated by the Stripe signature (not the
// cookie/Origin), so it's exempted from the CSRF middleware in worker.ts.
billing.post("/webhook", async (c) => {
  const secret = c.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return c.json({ error: "not_configured" }, 503);
  const raw = await c.req.text();
  const ok = await verifyStripeSignature(raw, c.req.header("Stripe-Signature") ?? "", secret);
  if (!ok) return c.json({ error: "bad_signature" }, 400);

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(raw);
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }
  const obj = (event.data?.object ?? {}) as Record<string, unknown>;
  if (event.type === "checkout.session.completed") {
    const userId = obj.client_reference_id as string | undefined;
    const customer = (obj.customer as string | undefined) ?? null;
    if (userId) {
      await c.env.DB.prepare("UPDATE users SET is_pro = 1, stripe_customer_id = ? WHERE id = ?")
        .bind(customer, userId)
        .run();
    }
  } else if (event.type === "customer.subscription.deleted") {
    const customer = obj.customer as string | undefined;
    if (customer) {
      await c.env.DB.prepare("UPDATE users SET is_pro = 0 WHERE stripe_customer_id = ?").bind(customer).run();
    }
  }
  return c.json({ received: true });
});

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts: Record<string, string> = {};
  for (const kv of header.split(",")) {
    const [k, v] = kv.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // 5-min tolerance
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${payload}`));
  const expected = Array.from(new Uint8Array(mac), (b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

export default billing;

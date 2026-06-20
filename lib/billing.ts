"use client";

export interface ProInfo {
  pro: boolean;
  available: boolean; // Stripe configured?
  priceLabel: string;
}

export async function fetchPro(): Promise<ProInfo> {
  try {
    const r = await fetch("/api/pro", { credentials: "include" });
    if (r.ok) return (await r.json()) as ProInfo;
  } catch {
    /* ignore */
  }
  return { pro: false, available: false, priceLabel: "" };
}

/** Start Stripe Checkout — redirects to Stripe on success. */
export async function startCheckout(): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch("/api/billing/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const d = (await r.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (r.ok && d?.url) {
      window.location.href = d.url;
      return { ok: true };
    }
    return { ok: false, error: d?.error ?? "failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

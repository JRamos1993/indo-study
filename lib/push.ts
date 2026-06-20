"use client";

// Web Push subscription helpers for due-review reminders. Subscription state
// lives in the browser's PushManager (per-device), not in settings.

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buf = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return buf;
}

const HOUR_KEY = "lilt:reminder-hour:v1";

export function getReminderHour(): number {
  if (typeof window === "undefined") return 19;
  const v = Number(localStorage.getItem(HOUR_KEY));
  return Number.isInteger(v) && v >= 0 && v <= 23 ? v : 19;
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function isPushOn(): Promise<boolean> {
  if (!pushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    return !!(await reg.pushManager.getSubscription());
  } catch {
    return false;
  }
}

export async function enablePush(): Promise<{ ok: boolean; error?: string }> {
  if (!pushSupported()) return { ok: false, error: "unsupported" };
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return { ok: false, error: "denied" };
  const keyRes = await fetch("/api/push/key")
    .then((r) => r.json())
    .catch(() => null);
  if (!keyRes?.key) return { ok: false, error: "not_configured" };

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(keyRes.key),
    });
  }
  const json = sub.toJSON() as { keys?: { p256dh?: string; auth?: string } };
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscription: { endpoint: sub.endpoint, keys: json.keys },
      tzOffset: new Date().getTimezoneOffset(),
      reminderHour: getReminderHour(),
    }),
  });
  return res.ok ? { ok: true } : { ok: false, error: "server" };
}

/** Fire an immediate push to this user's devices to confirm delivery works. */
export async function testPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/push/test", { method: "POST", credentials: "include" });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (data?.ok) return { ok: true };
    return { ok: false, error: data?.error ?? "failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** Change the local reminder hour; if already subscribed, push the new time. */
export async function setReminderHour(hour: number): Promise<void> {
  try {
    localStorage.setItem(HOUR_KEY, String(hour));
  } catch {
    /* ignore */
  }
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    const json = sub.toJSON() as { keys?: { p256dh?: string; auth?: string } };
    await fetch("/api/push/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: { endpoint: sub.endpoint, keys: json.keys },
        tzOffset: new Date().getTimezoneOffset(),
        reminderHour: hour,
      }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    const endpoint = sub?.endpoint;
    if (sub) await sub.unsubscribe();
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

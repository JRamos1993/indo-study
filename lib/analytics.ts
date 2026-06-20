"use client";

// Tiny privacy-respecting product analytics + automatic error capture. No PII:
// a random anon id (for logged-out retention) and a per-tab session id; the
// server attaches the opaque user id from the session cookie if present. Events
// are buffered and flushed in small batches (interval + on tab-hide). Honours
// Do Not Track.
import { getSettings } from "@/lib/settings";

type Ev = { name: string; props?: Record<string, unknown> };

const ANON_KEY = "lilt:anon:v1";
let buffer: Ev[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let started = false;
let enabled = true;
let anonId = "";
let sessionId = "";

function rid(): string {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

function uaHint(): "mobile" | "desktop" {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

function ensureInit(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  const dnt = navigator.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack;
  if (dnt === "1" || dnt === "yes") {
    enabled = false;
    return;
  }
  try {
    anonId = localStorage.getItem(ANON_KEY) ?? "";
    if (!anonId) {
      anonId = rid();
      localStorage.setItem(ANON_KEY, anonId);
    }
  } catch {
    /* storage blocked (private mode) — stay anonymous per-session */
  }
  sessionId = rid();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
  window.addEventListener("error", (e) => {
    track("error", {
      message: String(e.message || "error").slice(0, 300),
      source: `${e.filename || ""}:${e.lineno || 0}`.slice(0, 200),
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason as { message?: string } | string | undefined;
    const message = typeof r === "string" ? r : r?.message || "unhandledrejection";
    track("error", { message: String(message).slice(0, 300), source: "promise" });
  });
}

export function track(name: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  ensureInit();
  if (!enabled) return;
  buffer.push({ name, props });
  if (buffer.length >= 20) {
    flush();
  } else if (!timer) {
    timer = setTimeout(flush, 15_000);
  }
}

export function flush(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!enabled || buffer.length === 0 || typeof window === "undefined") return;
  const events = buffer.splice(0, 50);
  let lang: string | undefined;
  try {
    lang = getSettings().studyLanguage;
  } catch {
    /* ignore */
  }
  const body = JSON.stringify({ anonId, sessionId, lang, ua: uaHint(), events });
  try {
    void fetch("/api/events", {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  } catch {
    /* swallow — analytics must never break the app */
  }
}

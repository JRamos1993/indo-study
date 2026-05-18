"use client";

import { useSyncExternalStore } from "react";

const KEY = "indo-study:stats:v1";

export interface StatsData {
  reviewsByDay: Record<string, number>;
  newByDay: Record<string, number>;
}

const EMPTY: StatsData = Object.freeze({ reviewsByDay: {}, newByDay: {} }) as StatsData;
let cache: StatsData | null = null;
const listeners = new Set<() => void>();

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
function today(): string {
  return dayKey(new Date());
}

function readFromDisk(): StatsData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { reviewsByDay: {}, newByDay: {} };
    const p = JSON.parse(raw) as Partial<StatsData>;
    return { reviewsByDay: p.reviewsByDay ?? {}, newByDay: p.newByDay ?? {} };
  } catch {
    return { reviewsByDay: {}, newByDay: {} };
  }
}

function ensure(): StatsData {
  if (cache === null) cache = readFromDisk();
  return cache;
}

function commit(next: StatsData): void {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = readFromDisk();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStats(): StatsData {
  return useSyncExternalStore(subscribe, ensure, () => EMPTY);
}

/** Called from gradeItem on every answer. */
export function recordReview(wasNew: boolean): void {
  const s = ensure();
  const d = today();
  commit({
    reviewsByDay: { ...s.reviewsByDay, [d]: (s.reviewsByDay[d] ?? 0) + 1 },
    newByDay: wasNew ? { ...s.newByDay, [d]: (s.newByDay[d] ?? 0) + 1 } : s.newByDay,
  });
}

/** Reverse the most recent recordReview (single-level undo of a grade). */
export function undoReview(wasNew: boolean): void {
  const s = ensure();
  const d = today();
  const reviews = { ...s.reviewsByDay };
  if (reviews[d]) reviews[d] = Math.max(0, reviews[d] - 1);
  const news = { ...s.newByDay };
  if (wasNew && news[d]) news[d] = Math.max(0, news[d] - 1);
  commit({ reviewsByDay: reviews, newByDay: news });
}

export function getNewIntroducedToday(): number {
  return ensure().newByDay[today()] ?? 0;
}

export function todayCount(s: StatsData): number {
  return s.reviewsByDay[today()] ?? 0;
}

/** Consecutive days (ending today, or yesterday if today not done yet),
 *  tolerating a single missed "grace" day so one busy day won't reset it. */
export function currentStreak(s: StatsData): number {
  const has = (d: Date) => (s.reviewsByDay[dayKey(d)] ?? 0) > 0;
  const d = new Date();
  if (!has(d)) d.setDate(d.getDate() - 1); // today not done yet — that's fine
  let n = 0;
  let graceUsed = false;
  for (;;) {
    if (has(d)) {
      n += 1;
      d.setDate(d.getDate() - 1);
    } else if (!graceUsed) {
      graceUsed = true; // forgive one gap inside the streak
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return n;
}

export function resetStats(): void {
  commit({ reviewsByDay: {}, newByDay: {} });
}

export function exportStats(): StatsData {
  return ensure();
}

export function replaceStats(next: StatsData): void {
  commit({ reviewsByDay: next.reviewsByDay ?? {}, newByDay: next.newByDay ?? {} });
}

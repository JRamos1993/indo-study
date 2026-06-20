"use client";

import { useSyncExternalStore } from "react";
import { duplicateGroups } from "@/lib/data";
import {
  type CardState,
  type Grade,
  familiarity,
  isDue,
  isMastered,
  isNew,
  migrateState,
  schedule,
} from "@/lib/srs";
import { getSettings } from "@/lib/settings";
import { recordReview, undoReview } from "@/lib/stats";

const KEY = "indo-study:progress:v1";

export type ProgressStore = Record<string, CardState>;

const EMPTY: ProgressStore = Object.freeze({});
let cache: ProgressStore | null = null;
const listeners = new Set<() => void>();

function migrateAll(store: Record<string, unknown>): ProgressStore {
  const out: ProgressStore = {};
  for (const id in store) out[id] = migrateState(store[id]);
  return out;
}

function readFromDisk(): ProgressStore {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? migrateAll(JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function ensure(): ProgressStore {
  if (cache === null) cache = readFromDisk();
  return cache;
}

function commit(next: ProgressStore): void {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full / unavailable — keep in-memory copy */
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

/** Reactive snapshot of all card states. Stable ref between writes. */
export function useProgress(): ProgressStore {
  return useSyncExternalStore(subscribe, ensure, () => EMPTY);
}

export interface GradeUndo {
  prev: Record<string, CardState | undefined>;
  wasNew: boolean;
}

export function gradeItem(itemId: string, grade: Grade): GradeUndo {
  const store = ensure();
  const wasNew = isNew(store[itemId]);
  const ids = [itemId, ...(duplicateGroups[itemId] ?? [])];
  const prev: Record<string, CardState | undefined> = {};
  for (const id of ids) prev[id] = store[id];

  const next = schedule(store[itemId], grade, Date.now(), getSettings().targetRetention);
  const updated: ProgressStore = { ...store };
  for (const id of ids) updated[id] = next; // duplicates share progress
  commit(updated);
  recordReview(wasNew);
  return { prev, wasNew };
}

/** Placement: mark words the learner already knows as mastered so they skip the
 *  drill. Only affects never-started items — any real progress is preserved.
 *  Returns how many were newly marked. */
export function markKnown(itemIds: string[]): number {
  const store = ensure();
  const now = Date.now();
  const updated: ProgressStore = { ...store };
  let n = 0;
  for (const id of itemIds) {
    if (!isNew(updated[id])) continue;
    updated[id] = { stability: 45, difficulty: 4, dueAt: now + 45 * 86_400_000, lastReviewed: now, reps: 1, lapses: 0 };
    n += 1;
  }
  if (n) commit(updated);
  return n;
}

/** Revert a single gradeItem (misclick recovery). */
export function undoGrade(u: GradeUndo): void {
  const store = ensure();
  const updated: ProgressStore = { ...store };
  for (const id in u.prev) {
    const v = u.prev[id];
    if (v === undefined) delete updated[id];
    else updated[id] = v;
  }
  commit(updated);
  undoReview(u.wasNew);
}

export function resetAllProgress(): void {
  commit({});
}

export function exportProgress(): ProgressStore {
  return ensure();
}

export function replaceProgress(next: ProgressStore): void {
  commit(migrateAll(next as Record<string, unknown>));
}

// ── Selectors (work on a snapshot from useProgress) ──────────────────────────

export function dueItemIds(store: ProgressStore, allIds: string[], now: number = Date.now()): string[] {
  return allIds.filter((id) => isDue(store[id], now));
}

/** Items the learner keeps forgetting (lapsed ≥ minLapses times). */
export function troubleItemIds(
  store: ProgressStore,
  allIds: string[],
  minLapses = 2,
): string[] {
  return allIds.filter((id) => (store[id]?.lapses ?? 0) >= minLapses);
}

/** Count of scheduled reviews coming due on each of the next `days` days
 *  (index 0 = today, includes anything overdue). New/unseen items excluded. */
export function reviewForecast(
  store: ProgressStore,
  ids: string[],
  days = 7,
  now: number = Date.now(),
): number[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const buckets = new Array(days).fill(0) as number[];
  for (const id of ids) {
    const st = store[id];
    if (!st || st.lastReviewed === null) continue;
    if (st.dueAt <= now) {
      buckets[0] += 1;
      continue;
    }
    const idx = Math.floor((st.dueAt - start.getTime()) / 86_400_000);
    if (idx >= 0 && idx < days) buckets[idx] += 1;
  }
  return buckets;
}

export interface ProgressSummary {
  total: number;
  newCount: number;
  learning: number;
  review: number;
  mastered: number;
  due: number;
}

export function summarize(store: ProgressStore, ids: string[], now: number = Date.now()): ProgressSummary {
  const s: ProgressSummary = { total: ids.length, newCount: 0, learning: 0, review: 0, mastered: 0, due: 0 };
  for (const id of ids) {
    const st = store[id];
    if (isDue(st, now)) s.due += 1;
    switch (familiarity(st)) {
      case "new":
        s.newCount += 1;
        break;
      case "learning":
        s.learning += 1;
        break;
      case "review":
        s.review += 1;
        break;
      case "mastered":
        s.mastered += 1;
        break;
    }
  }
  return s;
}

export function masteryPercent(store: ProgressStore, ids: string[]): number {
  if (ids.length === 0) return 0;
  const m = ids.filter((id) => isMastered(store[id])).length;
  return Math.round((m / ids.length) * 100);
}

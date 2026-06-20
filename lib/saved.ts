"use client";

import { useSyncExternalStore } from "react";
import type { ItemContext } from "@/lib/types";

// Phrases the learner saves from AI conversations. They get SRS state in the
// normal progress store (keyed by the same id) and are merged into the daily
// review pool, so conversation vocab resurfaces like everything else.
const KEY = "lilt:saved:v1";
const EMPTY: SavedPhrase[] = [];

export interface SavedPhrase {
  id: string;
  target: string;
  en: string;
  lang: string;
  ts: number;
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function phraseId(lang: string, target: string): string {
  return `tk-${lang}-${hash(target.toLowerCase().trim())}`;
}

let cache: SavedPhrase[] | null = null;
const listeners = new Set<() => void>();

function read(): SavedPhrase[] {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(v) ? v : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: SavedPhrase[]): void {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function getSaved(): SavedPhrase[] {
  return read();
}

export function isSaved(lang: string, target: string): boolean {
  const id = phraseId(lang, target);
  return read().some((p) => p.id === id);
}

export function savePhrase(target: string, en: string, lang: string): void {
  const t = target.trim();
  if (!t) return;
  const id = phraseId(lang, t);
  const cur = read();
  if (cur.some((p) => p.id === id)) return;
  write([...cur, { id, target: t, en: en.trim(), lang, ts: Date.now() }]);
}

export function removePhrase(id: string): void {
  write(read().filter((p) => p.id !== id));
}

/** Union-merge a remote list into local (used by sync). Keeps the earliest ts. */
export function mergeSaved(remote: SavedPhrase[]): void {
  const byId = new Map<string, SavedPhrase>();
  for (const p of read()) byId.set(p.id, p);
  for (const p of remote) {
    if (!p?.id) continue;
    const existing = byId.get(p.id);
    if (!existing || (p.ts ?? 0) < existing.ts) byId.set(p.id, { ...existing, ...p });
  }
  write([...byId.values()]);
}

export function useSaved(): SavedPhrase[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}

/** Saved phrases for a language as session items (for the daily review pool). */
export function savedItems(lang: string): ItemContext[] {
  return read()
    .filter((p) => p.lang === lang)
    .map((p) => ({
      item: { id: p.id, target: p.target, english: p.en, kind: "vocab" as const },
      lessonId: "saved",
      lessonTitle: "From conversations",
      sectionId: "saved",
      sectionTitle: "Saved phrases",
    }));
}

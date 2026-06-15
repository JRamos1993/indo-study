"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LANG, type LangId, isLangId } from "@/lib/languages";

const KEY = "indo-study:settings:v1";

export type ThemePref = "system" | "light" | "dark";
export type DirectionPref = "auto" | "id2en" | "en2id";

export interface Settings {
  studyLanguage: LangId;
  dailyGoal: number;
  newPerDay: number;
  targetRetention: number; // 0.7..0.97
  defaultDirection: DirectionPref;
  theme: ThemePref;
}

export const DEFAULT_SETTINGS: Settings = {
  studyLanguage: DEFAULT_LANG,
  dailyGoal: 20,
  newPerDay: 15,
  targetRetention: 0.9,
  defaultDirection: "auto",
  theme: "system",
};

const listeners = new Set<() => void>();
let cache: Settings | null = null;

function clamp(n: number, lo: number, hi: number, d: number): number {
  return typeof n === "number" && isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;
}

function normalize(raw: unknown): Settings {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const dir = o.defaultDirection;
  const theme = o.theme;
  return {
    studyLanguage: isLangId(o.studyLanguage) ? o.studyLanguage : DEFAULT_SETTINGS.studyLanguage,
    dailyGoal: Math.round(clamp(o.dailyGoal as number, 5, 200, DEFAULT_SETTINGS.dailyGoal)),
    newPerDay: Math.round(clamp(o.newPerDay as number, 0, 100, DEFAULT_SETTINGS.newPerDay)),
    targetRetention: clamp(o.targetRetention as number, 0.7, 0.97, DEFAULT_SETTINGS.targetRetention),
    defaultDirection:
      dir === "id2en" || dir === "en2id" || dir === "auto" ? dir : DEFAULT_SETTINGS.defaultDirection,
    theme: theme === "light" || theme === "dark" || theme === "system" ? theme : DEFAULT_SETTINGS.theme,
  };
}

function readFromDisk(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Non-reactive read for pure/non-component callers (srs/stats/progress). */
export function getSettings(): Settings {
  if (cache === null) cache = readFromDisk();
  return cache;
}

/** Non-reactive active study language (for data/quiz/speech helpers). */
export function getStudyLanguage(): LangId {
  return getSettings().studyLanguage;
}

function commit(next: Settings): void {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  applyTheme(next.theme);
  listeners.forEach((l) => l());
}

export function updateSettings(patch: Partial<Settings>): void {
  commit(normalize({ ...getSettings(), ...patch }));
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

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings, () => DEFAULT_SETTINGS);
}

/** Apply (or follow the system) colour theme by toggling `.dark` on <html>. */
export function applyTheme(theme: ThemePref): void {
  if (typeof document === "undefined") return;
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", !!dark);
}

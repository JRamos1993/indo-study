"use client";

import type { IconName } from "@/components/Icon";
import { getLessons } from "@/lib/data";
import { summarize, type ProgressStore } from "@/lib/progress";
import { currentStreak, type StatsData } from "@/lib/stats";
import type { LangId } from "@/lib/languages";

export type Tier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: IconName;
  tier: Tier;
  /** Predicate over the user's metrics. */
  earned: (m: AchMetrics) => boolean;
}

export interface AchMetrics {
  totalReviews: number;
  streak: number;
  wordsStrong: number;
  unitsMastered: number;
}

// Cumulative achievements, computed entirely from existing progress + stats.
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-review", title: "First steps", desc: "Your first review", icon: "play", tier: "bronze", earned: (m) => m.totalReviews >= 1 },
  { id: "reviews-100", title: "Warmed up", desc: "100 reviews", icon: "refresh", tier: "bronze", earned: (m) => m.totalReviews >= 100 },
  { id: "reviews-500", title: "Committed", desc: "500 reviews", icon: "refresh", tier: "silver", earned: (m) => m.totalReviews >= 500 },
  { id: "reviews-1000", title: "Devoted", desc: "1,000 reviews", icon: "refresh", tier: "gold", earned: (m) => m.totalReviews >= 1000 },
  { id: "streak-3", title: "On a roll", desc: "3-day streak", icon: "flame", tier: "bronze", earned: (m) => m.streak >= 3 },
  { id: "streak-7", title: "One week strong", desc: "7-day streak", icon: "flame", tier: "silver", earned: (m) => m.streak >= 7 },
  { id: "streak-30", title: "Unstoppable", desc: "30-day streak", icon: "flame", tier: "gold", earned: (m) => m.streak >= 30 },
  { id: "streak-100", title: "Centurion", desc: "100-day streak", icon: "flame", tier: "gold", earned: (m) => m.streak >= 100 },
  { id: "strong-10", title: "Vocabulary builder", desc: "10 words mastered", icon: "star", tier: "bronze", earned: (m) => m.wordsStrong >= 10 },
  { id: "strong-50", title: "Word collector", desc: "50 words mastered", icon: "star", tier: "silver", earned: (m) => m.wordsStrong >= 50 },
  { id: "strong-250", title: "Big vocabulary", desc: "250 words mastered", icon: "star", tier: "gold", earned: (m) => m.wordsStrong >= 250 },
  { id: "unit-1", title: "First unit done", desc: "Master a whole unit", icon: "check", tier: "bronze", earned: (m) => m.unitsMastered >= 1 },
  { id: "unit-5", title: "Five down", desc: "Master 5 units", icon: "book", tier: "silver", earned: (m) => m.unitsMastered >= 5 },
];

/** Derive achievement metrics from the live progress + stats stores. */
export function metricsFrom(store: ProgressStore, stats: StatsData, lang: LangId): AchMetrics {
  const lessons = getLessons(lang);
  const allIds = lessons.flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id)));
  const overall = summarize(store, allIds);
  const unitsMastered = lessons.filter((l) => {
    const ids = l.sections.flatMap((s) => s.items.map((i) => i.id));
    const ls = summarize(store, ids);
    return ls.total > 0 && ls.mastered === ls.total;
  }).length;
  return {
    totalReviews: Object.values(stats.reviewsByDay).reduce((a, b) => a + b, 0),
    streak: currentStreak(stats),
    wordsStrong: overall.mastered,
    unitsMastered,
  };
}

const SEEN_KEY = "lilt:achievements:v1";

function readSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Returns achievements that are earned now but weren't last time, and records
 * them as seen — so each one celebrates exactly once. Side-effecting; call from
 * an effect, not during render.
 */
export function claimNewAchievements(m: AchMetrics): Achievement[] {
  if (typeof window === "undefined") return [];
  const seen = readSeen();
  const fresh = ACHIEVEMENTS.filter((a) => a.earned(m) && !seen.includes(a.id));
  if (fresh.length) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, ...fresh.map((a) => a.id)]));
    } catch {
      /* ignore */
    }
  }
  return fresh;
}

export const TIER_COLOR: Record<Tier, string> = {
  bronze: "var(--lilt-yellow)",
  silver: "var(--tint-violet-2)",
  gold: "var(--lilt-lime)",
};

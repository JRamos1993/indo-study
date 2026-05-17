// Pure SM-2-lite spaced-repetition scheduler. No I/O — easy to reason about/test.

export type Grade = "again" | "good" | "easy";

export interface CardState {
  ease: number; // interval multiplier
  intervalDays: number;
  dueAt: number; // epoch ms
  reps: number; // consecutive successful reviews
  lapses: number; // times forgotten after being learned
  lastReviewed: number | null;
}

export const DEFAULT_EASE = 2.3;
const MIN_EASE = 1.3;
const DAY = 86_400_000;

export function freshState(): CardState {
  return { ease: DEFAULT_EASE, intervalDays: 0, dueAt: 0, reps: 0, lapses: 0, lastReviewed: null };
}

export function isNew(s?: CardState | null): boolean {
  return !s || s.lastReviewed === null;
}

export function isDue(s: CardState | undefined | null, now: number = Date.now()): boolean {
  if (isNew(s)) return true; // never seen → always available
  return (s as CardState).dueAt <= now;
}

export function schedule(prev: CardState | undefined | null, grade: Grade, now: number = Date.now()): CardState {
  const s: CardState = prev ? { ...prev } : freshState();

  if (grade === "again") {
    if (prev && prev.reps > 0) s.lapses += 1;
    s.reps = 0;
    s.ease = Math.max(MIN_EASE, s.ease - 0.2);
    s.intervalDays = 0;
    s.dueAt = now + 60_000; // ~1 min → still due this session
  } else {
    s.reps += 1;
    if (grade === "easy") s.ease += 0.15;

    let interval: number;
    if (s.reps === 1) interval = 1;
    else if (s.reps === 2) interval = 3;
    else interval = Math.round(Math.max(1, s.intervalDays) * s.ease);
    if (grade === "easy") interval = Math.round(interval * 1.3);

    s.intervalDays = Math.max(1, interval);
    s.dueAt = now + s.intervalDays * DAY;
  }

  s.lastReviewed = now;
  return s;
}

export function isMastered(s?: CardState | null): boolean {
  return !!s && s.reps >= 4 && s.ease >= DEFAULT_EASE;
}

export type Familiarity = "new" | "learning" | "review" | "mastered";

export function familiarity(s?: CardState | null): Familiarity {
  if (isNew(s)) return "new";
  if (isMastered(s)) return "mastered";
  if ((s as CardState).reps >= 2) return "review";
  return "learning";
}

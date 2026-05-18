// FSRS (Free Spaced Repetition Scheduler), FSRS-5. Pure, no I/O.
// Models each card's memory stability (S, days until R=90%) and difficulty (D,
// 1..10) and schedules the next review at REQUEST_RETENTION. Replaces the old
// SM-2-lite scheduler; old records are upgraded by migrateState().

export type Grade = "again" | "hard" | "good" | "easy";

export interface CardState {
  stability: number; // days; expected retention 0.9 after this many days
  difficulty: number; // 1 (easy) .. 10 (hard)
  dueAt: number; // epoch ms
  lastReviewed: number | null;
  reps: number; // successful reviews in a row (UI/heuristics)
  lapses: number; // times forgotten after being learned (trouble deck)
}

const DAY = 86_400_000;

// ts-fsrs FSRS-5 default parameters.
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655,
  0.6621,
];
const DECAY = -0.5;
const FACTOR = 0.9 ** (1 / DECAY) - 1; // = 19/81
const REQUEST_RETENTION = 0.9;
const MAX_INTERVAL = 365;
const MASTERED_STABILITY = 30; // S ≥ ~1 month ⇒ "mastered"

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const gradeNum = (g: Grade): number => ({ again: 1, hard: 2, good: 3, easy: 4 })[g];

function retrievability(elapsedDays: number, stability: number): number {
  return (1 + (FACTOR * elapsedDays) / stability) ** DECAY;
}

function initStability(g: number): number {
  return Math.max(0.1, W[g - 1]);
}
function initDifficulty(g: number): number {
  return clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);
}
function nextDifficulty(d: number, g: number): number {
  const deltaD = -W[6] * (g - 3);
  const next = d + deltaD * ((10 - d) / 9); // linear damping
  const meanReverted = W[7] * initDifficulty(4) + (1 - W[7]) * next; // toward D0(Easy)
  return clamp(meanReverted, 1, 10);
}
function nextStabilitySuccess(d: number, s: number, r: number, g: number): number {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  const inc =
    Math.exp(W[8]) *
    (11 - d) *
    s ** -W[9] *
    (Math.exp(W[10] * (1 - r)) - 1) *
    hard *
    easy;
  return Math.max(0.1, s * (1 + inc));
}
function nextStabilityLapse(d: number, s: number, r: number): number {
  const post =
    W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp(W[14] * (1 - r));
  return clamp(post, 0.1, s); // never exceeds pre-lapse stability
}

function intervalDays(stability: number, retention: number): number {
  const raw = (stability / FACTOR) * (retention ** (1 / DECAY) - 1);
  return clamp(Math.round(raw), 1, MAX_INTERVAL);
}

export function freshState(): CardState {
  return {
    stability: 0,
    difficulty: 0,
    dueAt: 0,
    lastReviewed: null,
    reps: 0,
    lapses: 0,
  };
}

export function isNew(s?: CardState | null): boolean {
  return !s || s.lastReviewed === null;
}

export function isDue(s: CardState | undefined | null, now: number = Date.now()): boolean {
  if (isNew(s)) return true; // never seen → always available
  return (s as CardState).dueAt <= now;
}

export function schedule(
  prev: CardState | undefined | null,
  grade: Grade,
  now: number = Date.now(),
  retention: number = REQUEST_RETENTION,
): CardState {
  const g = gradeNum(grade);
  const fresh = isNew(prev);
  const base: CardState = prev ? { ...prev } : freshState();

  let stability: number;
  let difficulty: number;

  if (fresh) {
    stability = initStability(g);
    difficulty = initDifficulty(g);
  } else {
    const elapsed = Math.max(0, (now - (base.lastReviewed as number)) / DAY);
    const r = retrievability(elapsed, base.stability);
    difficulty = nextDifficulty(base.difficulty, g);
    stability =
      g === 1
        ? nextStabilityLapse(base.difficulty, base.stability, r)
        : nextStabilitySuccess(base.difficulty, base.stability, r, g);
  }

  const out: CardState = { ...base, stability, difficulty, lastReviewed: now };

  if (grade === "again") {
    if (prev && prev.reps > 0) out.lapses = base.lapses + 1;
    out.reps = 0;
    out.dueAt = now + 5 * 60_000; // short learning step → resurfaces this session
  } else {
    out.reps = base.reps + 1;
    out.dueAt = now + intervalDays(stability, retention) * DAY;
  }
  return out;
}

/** Human-readable next interval per grade, for grade-button hints. */
export function previewIntervals(
  prev: CardState | undefined | null,
  now: number = Date.now(),
  retention: number = REQUEST_RETENTION,
): Record<Grade, string> {
  const fmt = (g: Grade): string => {
    if (g === "again") return "<5m";
    const d = Math.round((schedule(prev, g, now, retention).dueAt - now) / DAY);
    if (d >= 365) return `${Math.round(d / 365)}y`;
    if (d >= 30) return `${Math.round(d / 30)}mo`;
    return `${Math.max(1, d)}d`;
  };
  return { again: fmt("again"), hard: fmt("hard"), good: fmt("good"), easy: fmt("easy") };
}

export function isMastered(s?: CardState | null): boolean {
  return !!s && s.lastReviewed !== null && s.stability >= MASTERED_STABILITY;
}

export type Familiarity = "new" | "learning" | "review" | "mastered";

export function familiarity(s?: CardState | null): Familiarity {
  if (isNew(s)) return "new";
  if (isMastered(s)) return "mastered";
  return (s as CardState).stability >= 1 ? "review" : "learning";
}

/** Upgrade an old SM-2-lite record (ease/intervalDays, no stability) to FSRS.
 *  Idempotent: an already-FSRS record is returned normalized. */
export function migrateState(raw: unknown): CardState {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? v : d);
  const lastReviewed =
    typeof o.lastReviewed === "number" ? o.lastReviewed : null;

  if (typeof o.stability === "number") {
    return {
      stability: num(o.stability, 0),
      difficulty: clamp(num(o.difficulty, 5), 1, 10),
      dueAt: num(o.dueAt, 0),
      lastReviewed,
      reps: num(o.reps, 0),
      lapses: num(o.lapses, 0),
    };
  }

  if (lastReviewed === null) return freshState();

  // Old shape → approximate FSRS state.
  const ease = num(o.ease, 2.3);
  const interval = num(o.intervalDays, 0);
  return {
    stability: Math.max(0.1, interval),
    difficulty: clamp(11 - ((ease - 1.3) / (2.6 - 1.3)) * 9, 1, 10),
    dueAt: num(o.dueAt, 0),
    lastReviewed,
    reps: num(o.reps, 0),
    lapses: num(o.lapses, 0),
  };
}

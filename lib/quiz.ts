import type { ItemContext, ItemKind } from "@/lib/types";

export type Direction = "id2en" | "en2id";

export interface KindedText {
  text: string;
  kind: ItemKind;
}

export function promptText(ctx: ItemContext, dir: Direction): string {
  return dir === "id2en" ? ctx.item.indonesian : ctx.item.english;
}
export function answerText(ctx: ItemContext, dir: Direction): string {
  return dir === "id2en" ? ctx.item.english : ctx.item.indonesian;
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (harmless for Indonesian)
    .replace(/[.,!?;:"'‘’()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Expand a target answer into the set of acceptable normalized forms.
 *  Handles "a / b / c" alternatives, comma lists and "(parenthetical)" hints. */
export function answerVariants(target: string): string[] {
  const variants = new Set<string>();
  const add = (s: string) => {
    const n = normalize(s);
    if (n) variants.add(n);
  };
  add(target);
  const noParen = target.replace(/\([^)]*\)/g, " ");
  add(noParen);
  for (const part of noParen.split(/\s*\/\s*|\s*,\s*/)) add(part);
  return [...variants];
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

export interface CheckResult {
  correct: boolean;
  /** true when accepted only thanks to typo tolerance — show the canonical spelling */
  fuzzy: boolean;
}

/** Lenient check: exact match on any variant, or within a small edit distance. */
export function checkAnswer(input: string, target: string): CheckResult {
  const u = normalize(input);
  if (!u) return { correct: false, fuzzy: false };
  const variants = answerVariants(target);
  if (variants.includes(u)) return { correct: true, fuzzy: false };
  for (const v of variants) {
    const tolerance = v.length <= 4 ? 0 : v.length <= 8 ? 1 : 2;
    if (levenshtein(u, v) <= tolerance) return { correct: true, fuzzy: true };
  }
  return { correct: false, fuzzy: false };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export { shuffle };

/** Build up to `count` MC options. Distractors of the same `answerKind` are
 *  preferred (so a sentence prompt never shows a one-word option), then ones
 *  closest in length, so wrong answers are plausible rather than guessable. */
export function buildChoices(
  correct: string,
  pool: KindedText[],
  answerKind: ItemKind,
  count = 4,
): string[] {
  const seen = new Set<string>([normalize(correct)]);
  const sameKind: string[] = [];
  const otherKind: string[] = [];
  for (const cand of shuffle(pool)) {
    const n = normalize(cand.text);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    (cand.kind === answerKind ? sameKind : otherKind).push(cand.text);
  }
  const byCloseLength = (arr: string[]) =>
    arr.sort(
      (a, b) => Math.abs(a.length - correct.length) - Math.abs(b.length - correct.length),
    );
  const distractors = [...byCloseLength(sameKind), ...byCloseLength(otherKind)].slice(
    0,
    count - 1,
  );
  return shuffle([correct, ...distractors]);
}

/** Split a string into display word tokens (keeps punctuation on the token). */
export function wordTokens(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean);
}

export interface Cloze {
  tokens: string[];
  blankIndex: number;
  answer: string;
}

const tokenCore = (t: string): string =>
  t.replace(/^[^\p{L}\p{N}-]+/u, "").replace(/[^\p{L}\p{N}-]+$/u, "");

/** Pick one meaningful word in a sentence to blank out for a cloze.
 *  Prefers a word that is itself a known vocab term; never the first word. */
export function makeCloze(sentence: string, preferNormalized: Set<string>): Cloze | null {
  const tokens = wordTokens(sentence);
  if (tokens.length < 3) return null;
  const candidates: number[] = [];
  for (let i = 1; i < tokens.length; i++) {
    if (tokenCore(tokens[i]).length >= 3) candidates.push(i);
  }
  if (candidates.length === 0) return null;
  const preferred = candidates.filter((i) =>
    preferNormalized.has(normalize(tokenCore(tokens[i]))),
  );
  const pickFrom = preferred.length ? preferred : candidates;
  const blankIndex = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  return { tokens, blankIndex, answer: tokenCore(tokens[blankIndex]) };
}

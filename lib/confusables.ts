import { getAllItems } from "@/lib/data";
import type { LangId } from "@/lib/languages";
import { normalize } from "@/lib/quiz";
import type { ItemContext } from "@/lib/types";

// Derives "easily confused" vocabulary groups from the corpus — same/overlapping
// meaning with different spellings, or minimal possessive/affix variants of one
// stem. The trainer asks the learner to pick the right form for a given meaning,
// so distractors are the *siblings*. Memoized per active-language item set.

export interface Confusable {
  options: string[]; // the forms in the set (incl. the target)
  note?: string; // disambiguating hint, if present
}

const primarySense = (en: string) => normalize(en.split(/[/,(]/)[0] || en);
const stem = (t: string) => normalize(t).replace(/(nya|ku|mu)$/, "");

let cacheSrc: ItemContext[] | null = null;
let byId: Map<string, Confusable> = new Map();
let items: ItemContext[] = [];

function build(src: ItemContext[]): void {
  cacheSrc = src;
  // Vocab only, and never bound morphemes (e.g. -ku/-mu/-nya): a suffix makes a
  // confusing standalone multiple-choice option.
  const all = src.filter((c) => c.item.kind === "vocab" && !c.item.target.startsWith("-"));
  const groups = new Map<string, ItemContext[]>();
  const push = (key: string, c: ItemContext) => {
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  };
  for (const c of all) {
    push("sense:" + primarySense(c.item.english), c);
    const s = stem(c.item.target);
    if (s.length >= 3) push("stem:" + s, c);
  }

  byId = new Map();
  for (const members of groups.values()) {
    const uniq: ItemContext[] = [];
    const seen = new Set<string>();
    for (const m of members) {
      const k = normalize(m.item.target);
      if (!seen.has(k)) {
        seen.add(k);
        uniq.push(m);
      }
    }
    if (uniq.length < 2 || uniq.length > 5) continue; // need a real, small contrast
    const options = uniq.map((m) => m.item.target);
    for (const m of uniq) {
      if (byId.has(m.item.id)) continue; // first (smallest, by build order) wins
      byId.set(m.item.id, { options, note: m.item.note });
    }
  }
  items = src.filter((c) => byId.has(c.item.id));
}

function ensure(lang?: LangId): void {
  const src = getAllItems(lang);
  if (cacheSrc !== src) build(src);
}

export function getConfusableItems(lang?: LangId): ItemContext[] {
  ensure(lang);
  return items;
}

export function hasConfusables(lang?: LangId): boolean {
  ensure(lang);
  return items.length > 0;
}

export function confusableFor(itemId: string, lang?: LangId): Confusable | null {
  ensure(lang);
  return byId.get(itemId) ?? null;
}

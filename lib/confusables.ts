import { getAllItems } from "@/lib/data";
import { normalize } from "@/lib/quiz";
import type { ItemContext } from "@/lib/types";

// Derives "easily confused" vocabulary groups from the existing (faithful)
// items — same/overlapping meaning with different Indonesian, or minimal
// possessive/affix variants of one stem. The trainer asks the learner to pick
// the right form for a given meaning, so distractors are the *siblings*.

export interface Confusable {
  options: string[]; // Indonesian forms in the set (incl. the target)
  note?: string; // disambiguating hint, if the teacher gave one
}

const primarySense = (en: string) => normalize(en.split(/[/,(]/)[0] || en);
const stem = (idn: string) => normalize(idn).replace(/(nya|ku|mu)$/, "");

let byId: Map<string, Confusable> | null = null;
let items: ItemContext[] | null = null;

function build(): void {
  // Vocab only, and never bound morphemes (e.g. -ku/-mu/-nya): a suffix makes a
  // confusing standalone multiple-choice option.
  const all = getAllItems().filter(
    (c) => c.item.kind === "vocab" && !c.item.indonesian.startsWith("-"),
  );
  const groups = new Map<string, ItemContext[]>();
  const push = (key: string, c: ItemContext) => {
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  };
  for (const c of all) {
    push("sense:" + primarySense(c.item.english), c);
    const s = stem(c.item.indonesian);
    if (s.length >= 3) push("stem:" + s, c);
  }

  byId = new Map();
  for (const members of groups.values()) {
    const uniq: ItemContext[] = [];
    const seen = new Set<string>();
    for (const m of members) {
      const k = normalize(m.item.indonesian);
      if (!seen.has(k)) {
        seen.add(k);
        uniq.push(m);
      }
    }
    if (uniq.length < 2 || uniq.length > 5) continue; // need a real, small contrast
    const options = uniq.map((m) => m.item.indonesian);
    for (const m of uniq) {
      if (byId.has(m.item.id)) continue; // first (smallest, by build order) wins
      byId.set(m.item.id, { options, note: m.item.note });
    }
  }
  items = getAllItems().filter((c) => byId!.has(c.item.id));
}

export function getConfusableItems(): ItemContext[] {
  if (!items) build();
  return items as ItemContext[];
}

export function confusableFor(itemId: string): Confusable | null {
  if (!byId) build();
  return byId!.get(itemId) ?? null;
}

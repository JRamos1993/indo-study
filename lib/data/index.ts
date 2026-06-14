import { normalize, wordTokens } from "@/lib/quiz";
import type { ItemContext, Lesson, RawLesson } from "@/lib/types";
import { lesson as u01 } from "./unit-01-greetings";
import { lesson as u02 } from "./unit-02-pronouns";
import { lesson as u03 } from "./unit-03-questions";
import { lesson as u04 } from "./unit-04-numbers";
import { lesson as u05 } from "./unit-05-time";
import { lesson as u06 } from "./unit-06-family";
import { lesson as u07 } from "./unit-07-verbs";
import { lesson as u08 } from "./unit-08-adjectives";
import { lesson as u09 } from "./unit-09-food";
import { lesson as u10 } from "./unit-10-places";
import { lesson as u11 } from "./unit-11-home";
import { lesson as u12 } from "./unit-12-body-health";
import { lesson as u13 } from "./unit-13-colors-clothes";
import { lesson as u14 } from "./unit-14-nature";
import { lesson as u15 } from "./unit-15-work-school";
import { lesson as u16 } from "./unit-16-phrases";
import { lesson as u17 } from "./unit-17-grammar-words";

// ─────────────────────────────────────────────────────────────────────────────
// Content = a curated beginner Indonesian curriculum, organised as themed units
// (each file exports `lesson: RawLesson`). To add or extend a unit:
//   1. Create lib/data/unit-NN-topic.ts (copy the shape of an existing file —
//      sections of vocab/sentence items; tag affixed forms with `root`).
//   2. Import it below and add it to RAW_LESSONS in display order.
// Item ids are generated from position, so keep section/item order stable once
// authored (reordering resets spaced-repetition progress for moved items).
// ─────────────────────────────────────────────────────────────────────────────
const RAW_LESSONS: RawLesson[] = [
  u01, u02, u03, u04, u05, u06, u07, u08, u09,
  u10, u11, u12, u13, u14, u15, u16, u17,
];

export const lessons: Lesson[] = RAW_LESSONS.map((rl, li) => ({
  id: rl.id,
  date: rl.date,
  title: rl.title,
  index: li,
  sections: rl.sections.map((rs, si) => ({
    id: `${rl.id}-s${si + 1}`,
    index: si,
    titleEn: rs.titleEn,
    titleId: rs.titleId,
    notes: rs.notes ?? [],
    items: rs.items.map((ri, ii) => ({
      id: `${rl.id}-s${si + 1}-i${ii + 1}`,
      indonesian: ri.idn,
      english: ri.en,
      kind: ri.kind,
      note: ri.note,
      root: ri.root,
    })),
  })),
}));

export function getLessons(): Lesson[] {
  return lessons;
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

function buildContexts(filter?: (ctx: ItemContext) => boolean): ItemContext[] {
  const out: ItemContext[] = [];
  for (const lesson of lessons) {
    for (const section of lesson.sections) {
      for (const item of section.items) {
        const ctx: ItemContext = {
          item,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          sectionId: section.id,
          sectionTitle: `${section.titleEn} / ${section.titleId}`,
        };
        if (!filter || filter(ctx)) out.push(ctx);
      }
    }
  }
  return out;
}

export function getAllItems(): ItemContext[] {
  return buildContexts();
}

export function getLessonItems(lessonId: string): ItemContext[] {
  return buildContexts((c) => c.lessonId === lessonId);
}

export function getSectionItems(sectionId: string): ItemContext[] {
  return buildContexts((c) => c.sectionId === sectionId);
}

/** Resolve a scope query (used by every practice mode) to its item pool. */
export function getScopedItems(scope: {
  lessonId?: string | null;
  sectionId?: string | null;
}): ItemContext[] {
  if (scope.sectionId) return getSectionItems(scope.sectionId);
  if (scope.lessonId) return getLessonItems(scope.lessonId);
  return getAllItems();
}

export function scopeLabel(scope: { lessonId?: string | null; sectionId?: string | null }): string {
  if (scope.sectionId) {
    for (const l of lessons) {
      const s = l.sections.find((x) => x.id === scope.sectionId);
      if (s) return `${s.titleEn} / ${s.titleId}`;
    }
  }
  if (scope.lessonId) return getLesson(scope.lessonId)?.title ?? "Lesson";
  return "All lessons";
}

export const totalItemCount = getAllItems().length;

// ── Cross-lesson duplicate merge ─────────────────────────────────────────────
// The same word can appear in more than one class. Grading any copy should
// update them all so progress is not re-ground. `duplicateGroups[id]` lists
// every item id (including itself) that shares the same Indonesian+English.
const canonicalKey = (idn: string, en: string) => `${normalize(idn)}|${normalize(en)}`;

export const duplicateGroups: Record<string, string[]> = (() => {
  const byKey = new Map<string, string[]>();
  for (const c of getAllItems()) {
    const k = canonicalKey(c.item.indonesian, c.item.english);
    const arr = byKey.get(k);
    if (arr) arr.push(c.item.id);
    else byKey.set(k, [c.item.id]);
  }
  const out: Record<string, string[]> = {};
  for (const ids of byKey.values()) {
    if (ids.length > 1) for (const id of ids) out[id] = ids;
  }
  return out;
})();

// Words that are themselves taught as vocabulary — used to pick a meaningful
// blank in cloze (fill-in-the-blank) practice.
let vocabWordSet: Set<string> | null = null;
export function getVocabWordSet(): Set<string> {
  if (vocabWordSet) return vocabWordSet;
  const s = new Set<string>();
  for (const c of getAllItems()) {
    if (c.item.kind !== "vocab") continue;
    s.add(normalize(c.item.indonesian));
    for (const w of wordTokens(c.item.indonesian)) s.add(normalize(w));
  }
  vocabWordSet = s;
  return s;
}

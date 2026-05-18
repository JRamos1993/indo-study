import { normalize, wordTokens } from "@/lib/quiz";
import type { ItemContext, Lesson, RawLesson } from "@/lib/types";
import { lesson as lesson20260511 } from "./lesson-2026-05-11";
import { lesson as lesson20260512 } from "./lesson-2026-05-12";

// ─────────────────────────────────────────────────────────────────────────────
// Adding a new class:
//   1. Create lib/data/lesson-YYYY-MM-DD.ts exporting `lesson: RawLesson`
//      (copy the shape of an existing file — sections with vocab/sentence items).
//   2. Import it below and append to RAW_LESSONS in chronological order.
// Item ids are generated from position, so keep section/item order stable once
// authored (reordering would reset spaced-repetition progress for moved items).
// ─────────────────────────────────────────────────────────────────────────────
const RAW_LESSONS: RawLesson[] = [lesson20260511, lesson20260512];

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

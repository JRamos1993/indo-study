import { DEFAULT_LANG, LANGUAGES, LANG_IDS, type LangId, isLangId } from "@/lib/languages";
import { normalize, wordTokens } from "@/lib/quiz";
import type { ItemContext, Lesson, RawLesson } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// The corpus is multi-language. Each language's themed units live under
// lib/data/<lang>/unit-*.ts and are registered in lib/languages.ts. The data
// functions below resolve the *active* study language (from settings) so the
// rest of the app stays language-agnostic. Static/server paths use the
// all-languages variants. Item ids are position-generated and namespaced per
// language (id units start "u..", Japanese "ja.."), so they never collide and
// progress for each language coexists in the same store.
// ─────────────────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "indo-study:settings:v1";

/** Active language — read directly from localStorage so this module stays
 *  server-safe and free of the "use client" settings module. */
function activeLang(): LangId {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const s = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || "{}");
    return isLangId(s.studyLanguage) ? s.studyLanguage : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function buildLessons(units: RawLesson[]): Lesson[] {
  return units.map((rl, li) => ({
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
        target: ri.target,
        english: ri.en,
        kind: ri.kind,
        reading: ri.reading,
        note: ri.note,
        root: ri.root,
      })),
    })),
  }));
}

const lessonsByLang: Record<LangId, Lesson[]> = {
  id: buildLessons(LANGUAGES.id.units),
  ja: buildLessons(LANGUAGES.ja.units),
};

function contextsOf(lessons: Lesson[]): ItemContext[] {
  const out: ItemContext[] = [];
  for (const lesson of lessons) {
    for (const section of lesson.sections) {
      for (const item of section.items) {
        out.push({
          item,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          sectionId: section.id,
          sectionTitle: `${section.titleEn} / ${section.titleId}`,
        });
      }
    }
  }
  return out;
}

const contextsByLang: Record<LangId, ItemContext[]> = {
  id: contextsOf(lessonsByLang.id),
  ja: contextsOf(lessonsByLang.ja),
};

// ── Active-language accessors (used by client components) ─────────────────────

export function getLessons(lang: LangId = activeLang()): Lesson[] {
  return lessonsByLang[lang];
}

export function getAllItems(lang: LangId = activeLang()): ItemContext[] {
  return contextsByLang[lang];
}

export function getLessonItems(lessonId: string): ItemContext[] {
  return getAllItems().filter((c) => c.lessonId === lessonId);
}

export function getSectionItems(sectionId: string): ItemContext[] {
  return getAllItems().filter((c) => c.sectionId === sectionId);
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
    for (const l of getAllLessons()) {
      const s = l.sections.find((x) => x.id === scope.sectionId);
      if (s) return `${s.titleEn} / ${s.titleId}`;
    }
  }
  if (scope.lessonId) return getLesson(scope.lessonId)?.title ?? "Lesson";
  return "All lessons";
}

// ── All-languages accessors (server-safe: static params, lesson lookup) ───────

export function getAllLessons(): Lesson[] {
  return LANG_IDS.flatMap((l) => lessonsByLang[l]);
}

export interface LessonGroup {
  title: string;
  icon: string;
  lessons: Lesson[];
}

/** The active language's units organised into named category groups. */
export function getLessonGroups(lang: LangId = activeLang()): LessonGroup[] {
  const byId = new Map(lessonsByLang[lang].map((l) => [l.id, l]));
  return LANGUAGES[lang].groups.map((g) => ({
    title: g.title,
    icon: g.icon,
    lessons: g.units.map((u) => byId.get(u.id)).filter((l): l is Lesson => !!l),
  }));
}

/** Look up a lesson by id across every language. */
export function getLesson(id: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

// ── Cross-unit duplicate merge (global across all languages) ──────────────────
// The same word can appear in more than one unit. Grading any copy updates them
// all so progress is not re-ground. Built once across every language; ids are
// unique per language so groups never span languages in practice.
const canonicalKey = (target: string, en: string) => `${normalize(target)}|${normalize(en)}`;

export const duplicateGroups: Record<string, string[]> = (() => {
  const byKey = new Map<string, string[]>();
  for (const c of getAllLessons().flatMap((l) => l.sections).flatMap((s) => s.items)) {
    const k = canonicalKey(c.target, c.english);
    const arr = byKey.get(k);
    if (arr) arr.push(c.id);
    else byKey.set(k, [c.id]);
  }
  const out: Record<string, string[]> = {};
  for (const ids of byKey.values()) {
    if (ids.length > 1) for (const id of ids) out[id] = ids;
  }
  return out;
})();

// Words taught as vocabulary — used to pick a meaningful blank in cloze
// practice. Built per language (cloze is only offered for space-delimited
// languages, but keeping it per-language keeps blanks on-topic).
const vocabWordSetByLang: Partial<Record<LangId, Set<string>>> = {};
export function getVocabWordSet(): Set<string> {
  const lang = activeLang();
  const cached = vocabWordSetByLang[lang];
  if (cached) return cached;
  const s = new Set<string>();
  for (const c of contextsByLang[lang]) {
    if (c.item.kind !== "vocab") continue;
    s.add(normalize(c.item.target));
    for (const w of wordTokens(c.item.target)) s.add(normalize(w));
  }
  vocabWordSetByLang[lang] = s;
  return s;
}

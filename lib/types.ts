export type ItemKind = "vocab" | "sentence";

/** Raw item as authored in the per-lesson data files. `idn` = Indonesian. */
export interface RawItem {
  idn: string;
  en: string;
  kind: ItemKind;
  note?: string;
}

export interface RawSection {
  titleEn: string;
  titleId: string;
  notes?: string[];
  items: RawItem[];
}

export interface RawLesson {
  id: string; // stable, e.g. "2026-05-11"
  date: string; // ISO date
  title: string; // e.g. "Class — 11 May 2026"
  sections: RawSection[];
}

/** Built (runtime) shapes with generated stable ids. */
export interface Item {
  id: string; // e.g. "2026-05-11-s3-i2"
  indonesian: string;
  english: string;
  kind: ItemKind;
  note?: string;
}

export interface Section {
  id: string;
  index: number;
  titleEn: string;
  titleId: string;
  notes: string[];
  items: Item[];
}

export interface Lesson {
  id: string;
  date: string;
  title: string;
  index: number;
  sections: Section[];
}

/** An item plus where it came from — used by quiz/review/SRS. */
export interface ItemContext {
  item: Item;
  lessonId: string;
  lessonTitle: string;
  sectionId: string;
  sectionTitle: string;
}

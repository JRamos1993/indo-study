export type ItemKind = "vocab" | "sentence" | "kana" | "kanji" | "radical";

/** Raw item as authored in the per-unit data files.
 *  `target` = the foreign-language text (Indonesian word, or Japanese
 *  kana/kanji). `reading` = pronunciation aid (romaji for Japanese; usually
 *  omitted for Indonesian, which is already phonetic). */
export interface RawItem {
  target: string;
  en: string;
  kind: ItemKind;
  reading?: string;
  note?: string;
  /** Root this is an affixed form of (Indonesian word-building, e.g.
   *  "membeli" → "beli"). */
  root?: string;
}

export interface RawSection {
  titleEn: string;
  titleId: string; // native-language section title
  notes?: string[];
  items: RawItem[];
}

export interface RawLesson {
  id: string; // stable, e.g. "u01-greetings" or "ja01-hiragana"
  date: string; // ordering label
  title: string;
  sections: RawSection[];
}

/** Built (runtime) shapes with generated stable ids. */
export interface Item {
  id: string; // e.g. "u01-greetings-s3-i2"
  target: string;
  english: string;
  kind: ItemKind;
  reading?: string;
  note?: string;
  root?: string;
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

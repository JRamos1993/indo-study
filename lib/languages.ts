import type { RawLesson } from "@/lib/types";

// Indonesian units
import { lesson as id01 } from "@/lib/data/id/unit-01-greetings";
import { lesson as id02 } from "@/lib/data/id/unit-02-pronouns";
import { lesson as id03 } from "@/lib/data/id/unit-03-questions";
import { lesson as id04 } from "@/lib/data/id/unit-04-numbers";
import { lesson as id05 } from "@/lib/data/id/unit-05-time";
import { lesson as id06 } from "@/lib/data/id/unit-06-family";
import { lesson as id07 } from "@/lib/data/id/unit-07-verbs";
import { lesson as id08 } from "@/lib/data/id/unit-08-adjectives";
import { lesson as id09 } from "@/lib/data/id/unit-09-food";
import { lesson as id10 } from "@/lib/data/id/unit-10-places";
import { lesson as id11 } from "@/lib/data/id/unit-11-home";
import { lesson as id12 } from "@/lib/data/id/unit-12-body-health";
import { lesson as id13 } from "@/lib/data/id/unit-13-colors-clothes";
import { lesson as id14 } from "@/lib/data/id/unit-14-nature";
import { lesson as id15 } from "@/lib/data/id/unit-15-work-school";
import { lesson as id16 } from "@/lib/data/id/unit-16-phrases";
import { lesson as id17 } from "@/lib/data/id/unit-17-grammar-words";

// Japanese units
import { lesson as ja01 } from "@/lib/data/ja/unit-01-hiragana";
import { lesson as ja02 } from "@/lib/data/ja/unit-02-katakana";
import { lesson as ja03 } from "@/lib/data/ja/unit-03-greetings";
import { lesson as ja04 } from "@/lib/data/ja/unit-04-numbers";
import { lesson as ja05 } from "@/lib/data/ja/unit-05-time";
import { lesson as ja06 } from "@/lib/data/ja/unit-06-family";
import { lesson as ja07 } from "@/lib/data/ja/unit-07-food";
import { lesson as ja08 } from "@/lib/data/ja/unit-08-places";
import { lesson as ja09 } from "@/lib/data/ja/unit-09-verbs";
import { lesson as ja10 } from "@/lib/data/ja/unit-10-adjectives";
import { lesson as ja11 } from "@/lib/data/ja/unit-11-phrases";
import { lesson as ja12 } from "@/lib/data/ja/unit-12-kanji";
import { lesson as ja13 } from "@/lib/data/ja/unit-13-radicals";

export type LangId = "id" | "ja";

export interface LanguageFeatures {
  cloze: boolean;
  order: boolean;
  wordBuilding: boolean;
  kana: boolean;
  kanji: boolean;
}

/** A named category that groups several units on the dashboard. */
export interface UnitGroup {
  title: string;
  icon: string; // key into components/icons
  units: RawLesson[];
}

function flatten(groups: UnitGroup[]): RawLesson[] {
  return groups.flatMap((g) => g.units);
}

export interface LanguageConfig {
  id: LangId;
  name: string; // English name, e.g. "Indonesian"
  nativeName: string; // e.g. "日本語"
  flag: string;
  /** BCP-47 tag for the Web Speech API. */
  speechLang: string;
  /** Short code for the TTS generator (scripts/gen-audio.mjs). */
  ttsLang: string;
  /** Whether items carry a reading (romaji) to display under the target. */
  hasReading: boolean;
  /** Dashboard hero greeting. */
  greeting: string;
  /** Placeholder when typing the target language. */
  targetPlaceholder: string;
  /** Units organised into named categories (display + ordering). */
  groups: UnitGroup[];
  /** Units organised by difficulty tier (alternative grouping). */
  levels: { title: string; unitIds: string[] }[];
  /** Flat list of all units (derived from groups). */
  units: RawLesson[];
  features: LanguageFeatures;
}

const idGroups: UnitGroup[] = [
  { title: "Foundations", icon: "compass", units: [id01, id02, id03, id04, id05] },
  {
    title: "People & daily life",
    icon: "home",
    units: [id06, id09, id10, id11, id12, id13, id14, id15],
  },
  { title: "Grammar & expression", icon: "chat", units: [id07, id08, id17, id16] },
];

const jaGroups: UnitGroup[] = [
  { title: "Writing system", icon: "kana", units: [ja01, ja02] },
  {
    title: "Everyday vocabulary",
    icon: "chat",
    units: [ja03, ja04, ja05, ja06, ja07, ja08, ja09, ja10, ja11],
  },
  { title: "Kanji & characters", icon: "kanji", units: [ja12, ja13] },
];

const idLevels = [
  { title: "Starter", unitIds: [id01.id, id02.id, id03.id, id04.id, id05.id] },
  { title: "Building", unitIds: [id06.id, id09.id, id10.id, id11.id, id13.id] },
  {
    title: "Elementary",
    unitIds: [id07.id, id08.id, id12.id, id14.id, id15.id, id17.id, id16.id],
  },
];

const jaLevels = [
  { title: "Starter", unitIds: [ja01.id, ja02.id, ja03.id, ja04.id] },
  { title: "Building", unitIds: [ja05.id, ja06.id, ja07.id, ja08.id, ja13.id] },
  { title: "Elementary", unitIds: [ja09.id, ja10.id, ja12.id, ja11.id] },
];

export const LANGUAGES: Record<LangId, LanguageConfig> = {
  id: {
    id: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    speechLang: "id-ID",
    ttsLang: "id",
    hasReading: false,
    greeting: "Selamat belajar!",
    targetPlaceholder: "Ketik dalam Bahasa Indonesia…",
    groups: idGroups,
    levels: idLevels,
    units: flatten(idGroups),
    features: { cloze: true, order: true, wordBuilding: true, kana: false, kanji: false },
  },
  ja: {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    speechLang: "ja-JP",
    ttsLang: "ja",
    hasReading: true,
    greeting: "がんばってください！",
    targetPlaceholder: "Type the rōmaji…",
    groups: jaGroups,
    levels: jaLevels,
    units: flatten(jaGroups),
    features: { cloze: false, order: false, wordBuilding: false, kana: true, kanji: true },
  },
};

export const LANG_IDS: LangId[] = ["id", "ja"];
export const DEFAULT_LANG: LangId = "id";

export function isLangId(v: unknown): v is LangId {
  return v === "id" || v === "ja";
}

export function getLanguage(id: LangId): LanguageConfig {
  return LANGUAGES[id] ?? LANGUAGES[DEFAULT_LANG];
}

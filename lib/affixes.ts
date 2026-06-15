import { getAllItems } from "@/lib/data";
import type { LangId } from "@/lib/languages";
import type { ItemContext } from "@/lib/types";

/** Items tagged with a root (an affixed form whose base is also taught).
 *  Word-building practice draws from these. Memoized per item set (getAllItems
 *  returns a new array reference when the language changes). */
let cacheSrc: ItemContext[] | null = null;
let cache: ItemContext[] | null = null;

export function getAffixPairs(lang?: LangId): ItemContext[] {
  const src = getAllItems(lang);
  if (cache && cacheSrc === src) return cache;
  cacheSrc = src;
  cache = src.filter((c) => !!c.item.root && c.item.root !== c.item.target);
  return cache;
}

export function hasWordBuilding(lang?: LangId): boolean {
  return getAffixPairs(lang).length >= 4;
}

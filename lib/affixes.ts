import { getAllItems } from "@/lib/data";
import type { ItemContext } from "@/lib/types";

/** Items tagged with a root (an affixed form whose base is also taught).
 *  Word-building practice draws from these; grows as lessons are tagged. */
let cache: ItemContext[] | null = null;

export function getAffixPairs(): ItemContext[] {
  if (cache) return cache;
  cache = getAllItems().filter((c) => !!c.item.root && c.item.root !== c.item.indonesian);
  return cache;
}

export function hasWordBuilding(): boolean {
  return getAffixPairs().length >= 4;
}

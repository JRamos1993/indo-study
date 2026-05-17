import type { Direction } from "@/lib/quiz";
import type { ItemContext } from "@/lib/types";

/** A practice route ("mixed" = spaced review, mixes every sub-mode). */
export type Mode =
  | "flashcards"
  | "mc"
  | "type"
  | "mixed"
  | "listening"
  | "speaking"
  | "cloze"
  | "order";

/** The actual exercise shown for a single card. */
export type SubMode = "flashcards" | "mc" | "type" | "listening" | "speaking" | "cloze" | "order";

export interface Card {
  ctx: ItemContext;
  dir: Direction;
  sub: SubMode;
  requeues: number;
}

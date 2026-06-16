import type { ReactNode } from "react";

export type IconName =
  | "cards"
  | "list"
  | "keyboard"
  | "headphones"
  | "mic"
  | "blank"
  | "sort"
  | "shuffle"
  | "blocks"
  | "refresh"
  | "compass"
  | "home"
  | "chat"
  | "kana"
  | "kanji"
  | "flame"
  | "book"
  | "target"
  | "bolt"
  // Lilt nav + utility glyphs
  | "sun"
  | "course"
  | "doc"
  | "bars"
  | "people"
  | "check"
  | "arrow"
  | "lock"
  | "play"
  | "search"
  | "star"
  | "plus"
  | "gear"
  | "grammar";

const glyph = (ch: string): ReactNode => (
  <text x="12" y="17" textAnchor="middle" fontSize="15" stroke="none" fill="currentColor">
    {ch}
  </text>
);

const PATHS: Record<IconName, ReactNode> = {
  cards: (
    <>
      <rect x="3" y="7" width="12.5" height="14" rx="2.5" />
      <path d="M8 7V5.2A2.2 2.2 0 0 1 10.2 3H18.8A2.2 2.2 0 0 1 21 5.2v9.6A2.2 2.2 0 0 1 18.8 17H16.5" />
    </>
  ),
  list: (
    <>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 6.2l1.1 1.1L7.3 5M4 12.2l1.1 1.1L7.3 11M4 18.2l1.1 1.1L7.3 17" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2.5" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7.5 14h9" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.5" y="13.5" width="4" height="6.5" rx="1.6" />
      <rect x="17.5" y="13.5" width="4" height="6.5" rx="1.6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  blank: (
    <>
      <rect x="4" y="6" width="6" height="7" rx="1.2" />
      <path d="M13 9h6M4 18h16" />
    </>
  ),
  sort: (
    <>
      <path d="M7 4v16M7 4 4 7m3-3 3 3" />
      <path d="M14 8h6M14 13h4M14 18h2" />
    </>
  ),
  shuffle: (
    <>
      <path d="M16 3h5v5M21 3l-8 8M3 21l8-8M3 8V3h5" />
    </>
  ),
  blocks: (
    <>
      <rect x="3.5" y="13" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13" width="7" height="7" rx="1.4" />
      <rect x="8.5" y="4" width="7" height="7" rx="1.4" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 4v5h-5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9.5h12V10" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 0 1-11.4 7.2L4 20.5l1.3-4.5A8 8 0 1 1 21 12z" />,
  kana: glyph("あ"),
  kanji: glyph("字"),
  flame: (
    <path d="M12 3c.6 2.6 3.6 3.8 3.6 7.6A3.6 3.6 0 0 1 8.4 11c0-1 .4-1.9 1-2.8.6 1.9 2 1.8 2-.2 0-1.7-.8-2.8.6-5z" />
  ),
  book: (
    <>
      <path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H12v17H6.2A2.2 2.2 0 0 0 4 22.2z" />
      <path d="M20 5.2A2.2 2.2 0 0 0 17.8 3H12v17h5.8A2.2 2.2 0 0 1 20 22.2z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
  course: (
    <path d="M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2z" />
  ),
  doc: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M9 8h7M9 12h7M9 16h4" />
    </>
  ),
  bars: <path d="M4 20V11M10 20V4M16 20v-6M3 20h18" />,
  people: (
    <>
      <circle cx="8.5" cy="9" r="3" />
      <path d="M3 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="8" r="2.4" />
      <path d="M15 18a5 5 0 0 1 6.5-4" />
    </>
  ),
  check: <path d="M5 12l5 5L19 7" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  star: (
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.3l5.9-.9z" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c0 .35.12.7.33 1Z" />
    </>
  ),
  grammar: glyph("Aa"),
};

export function Icon({
  name,
  size = 22,
  strokeWidth = 1.7,
  className = "",
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

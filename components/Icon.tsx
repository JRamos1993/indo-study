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
  | "bolt";

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
};

export function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

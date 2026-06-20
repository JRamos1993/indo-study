"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { hasWordBuilding } from "@/lib/affixes";
import { hasConfusables } from "@/lib/confusables";
import { getLanguage } from "@/lib/languages";
import { useSettings } from "@/lib/settings";

type Mode = { href: string; label: string; desc: string; icon: IconName; badge?: string };

// Rotating accent palette — each tile gets a tinted icon box + matching hard shadow,
// cycling violet → lime → yellow → coral the way the Today dashboard mode grid does.
const ACCENTS = [
  { shadow: "var(--lilt-violet)", tint: "var(--tint-lilac)" },
  { shadow: "var(--lilt-lime)", tint: "var(--tint-lime)" },
  { shadow: "var(--lilt-yellow)", tint: "var(--tint-yellow)" },
  { shadow: "var(--lilt-coral)", tint: "var(--tint-coral)" },
] as const;

export default function PracticeHub() {
  const lang = useSettings().studyLanguage;
  const f = getLanguage(lang).features;

  const modes = useMemo(() => {
    const m: Mode[] = [
      { href: "/review", label: "Spaced review", desc: "Smart mix of everything due", icon: "refresh", badge: "Recommended" },
      { href: "/study/flashcards", label: "Flashcards", desc: "Flip & self-rate", icon: "cards" },
      { href: "/quiz/mc", label: "Multiple choice", desc: "Pick the meaning", icon: "list" },
      { href: "/quiz/type", label: "Type the answer", desc: "Active recall", icon: "keyboard" },
      { href: "/study/listening", label: "Listening", desc: "Hear & choose", icon: "headphones" },
      { href: "/study/speaking", label: "Speaking", desc: "Say it aloud", icon: "mic" },
    ];
    if (f.kana) m.push({ href: "/study/kana", label: "Alphabet", desc: "Hiragana & katakana", icon: "kana" });
    if (f.kanji) m.push({ href: "/study/kanji", label: "Kanji", desc: "Characters & readings", icon: "kanji" });
    if (f.cloze) m.push({ href: "/quiz/cloze", label: "Fill the blank", desc: "Sentence grammar", icon: "blank" });
    if (f.order) m.push({ href: "/study/order", label: "Word order", desc: "Build sentences", icon: "sort" });
    if (hasConfusables(lang))
      m.push({ href: "/quiz/confusables", label: "Which form?", desc: "Confusable pairs", icon: "shuffle" });
    if (f.wordBuilding && hasWordBuilding(lang))
      m.push({ href: "/study/word-building", label: "Word building", desc: "Roots & affixes", icon: "blocks" });
    return m;
  }, [lang, f.kana, f.kanji, f.cloze, f.order, f.wordBuilding]);

  return (
    <div>
      <header>
        <span className="eyebrow">{getLanguage(lang).name} · drills</span>
        <h1 className="mt-1.5 text-[30px] leading-none">Practice</h1>
        <p className="mt-2 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
          Your daily session already weaves these together. Come here when you want to focus a single
          skill.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {modes.map((m, i) => {
          const a = ACCENTS[i % ACCENTS.length];
          return (
            <Link
              key={m.href}
              href={m.href}
              className="relative flex flex-col rounded-[16px] p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${a.shadow}` }}
            >
              {m.badge && (
                <span
                  className="absolute right-2.5 top-2.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.04em]"
                  style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "1.5px solid var(--edge)" }}
                >
                  {m.badge}
                </span>
              )}
              <span
                className="mb-3 grid h-10 w-10 place-items-center rounded-[11px]"
                style={{ background: a.tint, border: "2px solid var(--edge)", color: "var(--ink)" }}
              >
                <Icon name={m.icon} size={21} strokeWidth={1.9} />
              </span>
              <div className="font-display text-[16px] font-extrabold leading-tight">{m.label}</div>
              <div className="mt-0.5 text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>{m.desc}</div>
            </Link>
          );
        })}
      </div>

      {/* References — not drills, so they sit apart from the grid. */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <GuideLink
          href="/guide/pronunciation"
          icon="headphones"
          title="Pronunciation guide"
          desc={`How ${getLanguage(lang).name} letters & sounds work`}
        />
        <GuideLink
          href="/guide/grammar"
          icon="book"
          title="Grammar guide"
          desc={`Core ${getLanguage(lang).name} patterns, explained`}
        />
      </div>
    </div>
  );
}

function GuideLink({ href, icon, title, desc }: { href: string; icon: IconName; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[16px] p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--lilt-violet)" }}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]"
        style={{ background: "var(--tint-lilac)", border: "2px solid var(--edge)", color: "var(--ink)" }}
      >
        <Icon name={icon} size={21} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-extrabold leading-tight">{title}</span>
        <span className="block text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
          {desc}
        </span>
      </span>
      <Icon name="arrow" size={18} strokeWidth={2.2} />
    </Link>
  );
}

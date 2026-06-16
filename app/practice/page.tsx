"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { hasWordBuilding } from "@/lib/affixes";
import { hasConfusables } from "@/lib/confusables";
import { getLanguage } from "@/lib/languages";
import { useSettings } from "@/lib/settings";

export default function PracticeHub() {
  const lang = useSettings().studyLanguage;
  const f = getLanguage(lang).features;

  const modes = useMemo(() => {
    const m: { href: string; label: string; desc: string; icon: IconName }[] = [
      { href: "/review", label: "Spaced review", desc: "Smart mix of everything due", icon: "refresh" },
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
      <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
        ← Course
      </Link>
      <h1 className="mt-3 text-2xl">Practice</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Pick any drill — each pulls from your whole {getLanguage(lang).name} course.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modes.map((m) => (
          <Link key={m.href} href={m.href} className="card card-hover flex items-center gap-3.5 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ border: "2px solid var(--edge)", background: "var(--pop)", color: "#14151a" }}>
              <Icon name={m.icon} size={22} />
            </span>
            <span className="min-w-0">
              <span className="block font-display font-bold leading-tight">{m.label}</span>
              <span className="mt-0.5 block text-sm" style={{ color: "var(--muted)" }}>
                {m.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

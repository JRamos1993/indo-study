"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { hasWordBuilding } from "@/lib/affixes";
import { hasConfusables } from "@/lib/confusables";
import { getLessonGroups, getLessons, getLevelGroups } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { masteryPercent, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { currentStreak, todayCount, useStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

type View = "category" | "difficulty";

export default function LearnDashboard() {
  const store = useProgress();
  const mounted = useMounted();
  const stats = useStats();
  const settings = useSettings();
  const lang = settings.studyLanguage;
  const langCfg = getLanguage(lang);
  const f = langCfg.features;
  const dailyGoal = settings.dailyGoal;
  const [view, setView] = useState<View>("category");

  const groups = view === "category" ? getLessonGroups(lang) : getLevelGroups(lang);
  const levelOf = useMemo(() => {
    const map: Record<string, string> = {};
    for (const lvl of getLevelGroups(lang)) for (const l of lvl.lessons) map[l.id] = lvl.title;
    return map;
  }, [lang]);

  const practiceModes = useMemo(() => {
    const m: { href: string; label: string; desc: string; icon: IconName }[] = [
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
    m.push({ href: "/review", label: "Spaced review", desc: "Smart mix, all due", icon: "refresh" });
    return m;
  }, [lang, f.kana, f.kanji, f.cloze, f.order, f.wordBuilding]);

  const allIds = useMemo(
    () => getLessons(lang).flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lang],
  );

  const overall = summarize(store, allIds);
  const show = mounted;
  const troubleCount = mounted ? troubleItemIds(store, allIds).length : 0;
  const doneToday = mounted ? todayCount(stats) : 0;
  const streak = mounted ? currentStreak(stats) : 0;
  const goalMet = doneToday >= dailyGoal;
  const goalPct = Math.min(100, Math.round((doneToday / dailyGoal) * 100));

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">
            {langCfg.flag} {langCfg.name}
          </p>
          <h1 className="mt-1 text-[30px] leading-none">{langCfg.greeting}</h1>
        </div>
      </header>

      {/* Study today */}
      <Link
        href="/today"
        className="mb-7 block rounded-2xl p-6"
        style={{
          background: "var(--accent)",
          color: "var(--accent-ink)",
          border: "2px solid var(--edge)",
          boxShadow: "5px 5px 0 0 var(--edge)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "currentColor", opacity: 0.8 }}>
              Daily session
            </p>
            <h2 className="mt-1 text-2xl">{show && goalMet ? "Goal reached" : "Study today"}</h2>
            <p className="mt-1.5 text-sm" style={{ opacity: 0.9 }}>
              {!show
                ? "One tap — the best mix."
                : goalMet
                  ? "Nice work. Tap for extra practice."
                  : `${overall.due} due${troubleCount > 0 ? ` · ${troubleCount} tricky` : ""} · a few new`}
            </p>
          </div>
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5"
            style={{ border: "2px solid var(--edge)", background: "rgba(255,255,255,0.12)" }}
          >
            <Icon name="flame" size={16} />
            <span className="font-display text-base font-bold">{show ? streak : "—"}</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.85 }}>
            <span>Today</span>
            <span>
              {show ? doneToday : 0} / {dailyGoal}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.18)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goalPct}%`, background: "var(--pop)" }} />
          </div>
        </div>
      </Link>

      {show && troubleCount > 0 && (
        <Link href="/review?trouble=1" className="card card-hover mb-7 flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl text-rose-600 dark:text-rose-300" style={{ border: "2px solid var(--edge)" }}>
              <Icon name="bolt" size={20} />
            </span>
            <div>
              <h2 className="text-base">Trouble words</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {troubleCount} you keep missing — drill just these.
              </p>
            </div>
          </div>
          <span className="chip text-white" style={{ background: "#e11d48", border: "2px solid var(--edge)" }}>
            Practice
          </span>
        </Link>
      )}

      <h2 className="section-label">Ways to practice</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {practiceModes.map((m) => (
          <Link key={m.href} href={m.href} className="card card-hover flex items-start gap-3 p-3.5">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
              style={{ border: "2px solid var(--edge)", background: "var(--pop)", color: "#14151a" }}
            >
              <Icon name={m.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-bold leading-tight">{m.label}</span>
              <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
                {m.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Course with grouping toggle */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-label mb-0">Your course</h2>
        <div className="inline-flex overflow-hidden rounded-lg" style={{ border: "2px solid var(--edge)" }}>
          {(["category", "difficulty"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 text-xs font-bold uppercase tracking-wide transition"
              style={
                view === v
                  ? { background: "var(--edge)", color: "var(--paper)" }
                  : { background: "transparent", color: "var(--muted)" }
              }
            >
              {v === "category" ? "Topic" : "Level"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-7">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md" style={{ border: "2px solid var(--edge)" }}>
                <Icon name={group.icon as IconName} size={15} />
              </span>
              <h3 className="text-base">{group.title}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.lessons.map((lesson) => {
                const ids = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
                const sum = summarize(store, ids);
                const pct = show ? masteryPercent(store, ids) : 0;
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="card card-hover p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-display font-bold">{lesson.title}</span>
                      {show && sum.due > 0 ? (
                        <span className="chip shrink-0 text-amber-900 dark:text-amber-200" style={{ background: "#fde68a", border: "1.5px solid var(--edge)" }}>
                          {sum.due} due
                        </span>
                      ) : (
                        view === "category" && (
                          <span className="chip shrink-0" style={{ color: "var(--muted)", border: "1.5px solid var(--edge)" }}>
                            {levelOf[lesson.id]}
                          </span>
                        )
                      )}
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--paper)", border: "1.5px solid var(--edge)" }}>
                      <div className="h-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
                    </div>
                    <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                      {ids.length} items{show ? ` · ${pct}% mastered` : ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-6 text-xs" style={{ borderTop: "2px solid var(--edge)", color: "var(--muted)" }}>
        <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/glossary" className="font-bold" style={{ color: "var(--accent)" }}>Glossary</Link>
          <Link href="/guide/pronunciation" className="font-bold" style={{ color: "var(--accent)" }}>Pronunciation</Link>
          <Link href="/stats" className="font-bold" style={{ color: "var(--accent)" }}>Stats</Link>
          <Link href="/settings" className="font-bold" style={{ color: "var(--accent)" }}>Settings</Link>
          <Link href="/" className="font-bold" style={{ color: "var(--accent)" }}>About Lingo</Link>
        </p>
        <p>Progress is saved in this browser. Audio uses your device&apos;s {langCfg.name} voice when available.</p>
      </footer>
    </div>
  );
}

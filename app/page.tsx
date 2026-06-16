"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { hasWordBuilding } from "@/lib/affixes";
import { hasConfusables } from "@/lib/confusables";
import { getLessonGroups } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { masteryPercent, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { currentStreak, todayCount, useStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

export default function Dashboard() {
  const store = useProgress();
  const mounted = useMounted();
  const stats = useStats();
  const settings = useSettings();
  const lang = settings.studyLanguage;
  const langCfg = getLanguage(lang);
  const f = langCfg.features;
  const dailyGoal = settings.dailyGoal;

  const groups = getLessonGroups(lang);

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
    () => groups.flatMap((g) => g.lessons.flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id)))),
    [groups],
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
      <header className="mb-7">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
          {langCfg.flag} {langCfg.name}
        </p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">{langCfg.greeting}</h1>
      </header>

      {/* Study today — hero */}
      <Link
        href="/today"
        className="group mb-7 block overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-[0_20px_50px_-24px_rgba(79,70,229,0.85)] transition active:scale-[0.99]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                <Icon name="bolt" size={20} />
              </span>
              <h2 className="text-xl font-bold">{show && goalMet ? "Daily goal reached" : "Study today"}</h2>
            </div>
            <p className="mt-2 text-sm text-indigo-100">
              {!show
                ? "One tap — the best mix for right now."
                : goalMet
                  ? "Nice work. Tap for extra practice."
                  : `${overall.due} due${troubleCount > 0 ? ` · ${troubleCount} tricky` : ""} · a few new`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
            <Icon name="flame" size={16} className="text-amber-200" />
            <span className="text-sm font-bold">{show ? streak : "—"}</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-indigo-100">
            <span>Today&apos;s goal</span>
            <span>
              {show ? doneToday : 0} / {dailyGoal}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      </Link>

      {/* Trouble words */}
      {show && troubleCount > 0 && (
        <Link
          href="/review?trouble=1"
          className="card card-hover mb-7 flex items-center justify-between gap-4 p-5"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
              <Icon name="bolt" size={20} />
            </span>
            <div>
              <h2 className="font-semibold">Trouble words</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {troubleCount} you keep missing — drill just these.
              </p>
            </div>
          </div>
          <span className="chip bg-rose-600 px-3 py-1.5 text-white">Practice</span>
        </Link>
      )}

      {/* Ways to practice */}
      <h2 className="section-label">Ways to practice</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {practiceModes.map((m) => (
          <Link key={m.href} href={m.href} className="card card-hover flex items-start gap-3 p-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              <Icon name={m.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight">{m.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{m.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Course, grouped by category */}
      <h2 className="section-label">Your course</h2>
      <div className="space-y-7">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <Icon name={group.icon as IconName} size={16} />
              </span>
              <h3 className="text-sm font-semibold">{group.title}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.lessons.map((lesson) => {
                const ids = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
                const sum = summarize(store, ids);
                const pct = show ? masteryPercent(store, ids) : 0;
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="card card-hover p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-semibold">{lesson.title}</span>
                      {show && sum.due > 0 && (
                        <span className="chip shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          {sum.due} due
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {ids.length} items{show ? ` · ${pct}% mastered` : ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-slate-200/70 pt-6 text-xs text-slate-400 dark:border-slate-800/70">
        <p className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/glossary" className="font-medium text-indigo-600 hover:underline">Glossary</Link>
          <Link href="/guide/pronunciation" className="font-medium text-indigo-600 hover:underline">Pronunciation guide</Link>
          <Link href="/stats" className="font-medium text-indigo-600 hover:underline">Progress &amp; stats</Link>
          <Link href="/settings" className="font-medium text-indigo-600 hover:underline">Settings</Link>
        </p>
        <p>
          Progress is saved in this browser only. Audio uses your device&apos;s {langCfg.name} voice
          when available, otherwise bundled audio.
        </p>
      </footer>
    </div>
  );
}

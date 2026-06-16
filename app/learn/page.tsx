"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { getLessonGroups, getLessons, getLevelGroups } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { masteryPercent, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { currentStreak, todayCount, useStats } from "@/lib/stats";
import type { Lesson } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";

type View = "category" | "difficulty";

export default function LearnDashboard() {
  const store = useProgress();
  const mounted = useMounted();
  const stats = useStats();
  const settings = useSettings();
  const lang = settings.studyLanguage;
  const langCfg = getLanguage(lang);
  const dailyGoal = settings.dailyGoal;
  const [view, setView] = useState<View>("category");

  const groups = view === "category" ? getLessonGroups(lang) : getLevelGroups(lang);

  const order = useMemo(() => {
    const m: Record<string, number> = {};
    getLessons(lang).forEach((l, i) => (m[l.id] = i + 1));
    return m;
  }, [lang]);

  const allIds = useMemo(
    () => getLessons(lang).flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lang],
  );

  // Current unit = first (in path order) not yet fully mastered.
  const currentId = useMemo(() => {
    if (!mounted) return null;
    for (const l of getLessons(lang)) {
      const ids = l.sections.flatMap((s) => s.items.map((i) => i.id));
      if (masteryPercent(store, ids) < 100) return l.id;
    }
    return null;
  }, [mounted, store, lang]);

  const overall = summarize(store, allIds);
  const show = mounted;
  const troubleCount = mounted ? troubleItemIds(store, allIds).length : 0;
  const doneToday = mounted ? todayCount(stats) : 0;
  const streak = mounted ? currentStreak(stats) : 0;
  const goalMet = doneToday >= dailyGoal;
  const goalPct = Math.min(100, Math.round((doneToday / dailyGoal) * 100));

  return (
    <div>
      <header className="mb-6">
        <p className="eyebrow">
          {langCfg.flag} {langCfg.name}
        </p>
        <h1 className="mt-1 text-[30px] leading-none">{langCfg.greeting}</h1>
      </header>

      {/* Daily session */}
      <Link
        href="/today"
        className="mb-6 block rounded-2xl p-6"
        style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--edge)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "currentColor", opacity: 0.85 }}>
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
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ border: "2px solid var(--edge)", background: "rgba(255,255,255,0.14)" }}>
            <Icon name="flame" size={16} />
            <span className="font-display text-base font-bold">{show ? streak : "—"}</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.85 }}>
            <span>Today</span>
            <span>{show ? doneToday : 0} / {dailyGoal}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.2)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goalPct}%`, background: "var(--pop)" }} />
          </div>
        </div>
      </Link>

      {/* Quick links */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <QuickLink href="/practice" icon="blocks" label="Practice" />
        <QuickLink href="/review" icon="refresh" label="Review" />
        <QuickLink href="/glossary" icon="book" label="Glossary" />
      </div>

      {/* Path */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-label mb-0">Your path</h2>
        <div className="inline-flex overflow-hidden rounded-lg" style={{ border: "2px solid var(--edge)" }}>
          {(["category", "difficulty"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 text-xs font-bold uppercase tracking-wide transition"
              style={view === v ? { background: "var(--edge)", color: "var(--paper)" } : { color: "var(--muted)" }}
            >
              {v === "category" ? "Topic" : "Level"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md" style={{ border: "2px solid var(--edge)" }}>
                <Icon name={group.icon as IconName} size={13} />
              </span>
              <h3 className="text-sm">{group.title}</h3>
            </div>
            <div className="space-y-2.5">
              {group.lessons.map((lesson) => (
                <UnitRow
                  key={lesson.id}
                  lesson={lesson}
                  n={order[lesson.id]}
                  store={store}
                  show={show}
                  current={lesson.id === currentId}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-6 text-xs" style={{ borderTop: "2px solid var(--edge)", color: "var(--muted)" }}>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/stats" className="font-bold" style={{ color: "var(--accent)" }}>Stats</Link>
          <Link href="/guide/pronunciation" className="font-bold" style={{ color: "var(--accent)" }}>Pronunciation</Link>
          <Link href="/settings" className="font-bold" style={{ color: "var(--accent)" }}>Settings</Link>
          <Link href="/" className="font-bold" style={{ color: "var(--accent)" }}>About</Link>
        </p>
      </footer>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <Link href={href} className="card card-hover flex flex-col items-center gap-1.5 p-3 text-center">
      <span style={{ color: "var(--accent)" }}>
        <Icon name={icon} size={20} />
      </span>
      <span className="text-sm font-bold">{label}</span>
    </Link>
  );
}

function UnitRow({
  lesson,
  n,
  store,
  show,
  current,
}: {
  lesson: Lesson;
  n: number;
  store: ReturnType<typeof useProgress>;
  show: boolean;
  current: boolean;
}) {
  const ids = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
  const sum = summarize(store, ids);
  const pct = show ? masteryPercent(store, ids) : 0;
  const done = pct >= 100;

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="card card-hover flex items-center gap-3.5 p-3.5"
      style={current ? { boxShadow: "4px 4px 0 0 var(--accent)" } : undefined}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold"
        style={
          done
            ? { background: "var(--pop)", color: "#14151a", border: "2px solid var(--edge)" }
            : current
              ? { background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)" }
              : { border: "2px solid var(--edge)", color: "var(--muted)" }
        }
      >
        {done ? <Icon name="target" size={18} /> : n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-display font-bold">{lesson.title}</span>
          {current && (
            <span className="chip shrink-0" style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "1.5px solid var(--edge)" }}>
              Continue
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--paper)", border: "1.5px solid var(--edge)" }}>
          <div className="h-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
      </div>
      {show && sum.due > 0 && (
        <span className="chip shrink-0" style={{ background: "var(--pop)", color: "#14151a", border: "1.5px solid var(--edge)" }}>
          {sum.due} due
        </span>
      )}
    </Link>
  );
}

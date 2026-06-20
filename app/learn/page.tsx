"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { getLessonGroups, getLessons } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { masteryPercent, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { currentStreak, todayCount, useStats } from "@/lib/stats";
import type { Lesson } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";

type UnitState = "mastered" | "current" | "next" | "locked";

export default function LearnDashboard() {
  const store = useProgress();
  const mounted = useMounted();
  const stats = useStats();
  const settings = useSettings();
  const lang = settings.studyLanguage;
  const langCfg = getLanguage(lang);
  const dailyGoal = settings.dailyGoal;

  const groups = getLessonGroups(lang);

  const order = useMemo(() => {
    const m: Record<string, number> = {};
    getLessons(lang).forEach((l, i) => (m[l.id] = i + 1));
    return m;
  }, [lang]);

  const allIds = useMemo(
    () => getLessons(lang).flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lang],
  );

  // Per-lesson percent + path state, computed in global path order (drives the
  // mastered / in-progress / up-next / locked-at-80% syllabus states).
  const lessonState = useMemo(() => {
    const map: Record<string, { pct: number; state: UnitState }> = {};
    const lessons = getLessons(lang);
    const pcts = lessons.map((l) => {
      const ids = l.sections.flatMap((s) => s.items.map((i) => i.id));
      return mounted ? masteryPercent(store, ids) : 0;
    });
    let currentSet = false;
    lessons.forEach((l, i) => {
      const pct = pcts[i];
      const mastered = pct >= 100;
      const prevOk = i === 0 || pcts[i - 1] >= 80;
      let state: UnitState;
      if (mastered) {
        state = "mastered";
      } else if (mounted && !prevOk) {
        state = "locked";
      } else if (!currentSet && (!mounted || prevOk)) {
        state = "current";
        currentSet = true;
      } else {
        state = "next";
      }
      map[l.id] = { pct, state };
    });
    return map;
  }, [mounted, store, lang]);

  const overall = summarize(store, allIds);
  const show = mounted;
  const troubleCount = mounted ? troubleItemIds(store, allIds).length : 0;
  const doneToday = mounted ? todayCount(stats) : 0;
  const streak = mounted ? currentStreak(stats) : 0;
  const goalMet = doneToday >= dailyGoal;
  const goalPct = Math.min(100, Math.round((doneToday / dailyGoal) * 100));

  const totalUnits = getLessons(lang).length;
  const masteredUnits = mounted
    ? Object.values(lessonState).filter((s) => s.state === "mastered").length
    : 0;
  const coursePct = totalUnits ? Math.round((masteredUnits / totalUnits) * 100) : 0;

  return (
    <div>
      <header className="mb-6">
        <div
          className="text-[13px] font-extrabold uppercase tracking-[0.05em]"
          style={{ color: "var(--muted)" }}
        >
          {langCfg.flag} {langCfg.name} · Course
        </div>
        <h1 className="mt-1 text-[30px] leading-none">{langCfg.greeting}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/guide/pronunciation"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition active:translate-y-0.5"
            style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
          >
            <Icon name="headphones" size={14} strokeWidth={2.2} /> Pronunciation guide
          </Link>
          <Link
            href="/guide/grammar"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition active:translate-y-0.5"
            style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
          >
            <Icon name="book" size={14} strokeWidth={2.2} /> Grammar guide
          </Link>
        </div>
      </header>

      {/* Daily session — bold sticker hero */}
      <Link
        href="/today"
        className="mb-7 block rounded-[22px] p-6 transition active:translate-x-[2px] active:translate-y-[2px] sm:p-7"
        style={{
          background: "var(--lilt-ink)",
          color: "#fff",
          border: "2px solid var(--edge)",
          boxShadow: "5px 5px 0 0 var(--lilt-violet)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
              style={{ background: "var(--lilt-violet)", color: "#fff" }}
            >
              Daily session
            </span>
            <h2 className="mt-3.5 text-[26px] leading-tight text-white">
              {show && goalMet ? "Goal reached" : "Study today"}
            </h2>
            <p className="mt-1.5 text-sm font-bold" style={{ color: "var(--on-ink-muted)" }}>
              {!show
                ? "One tap — the best mix."
                : goalMet
                  ? "Nice work. Tap for extra practice."
                  : `${overall.due} due${troubleCount > 0 ? ` · ${troubleCount} tricky` : ""} · a few new`}
            </p>
          </div>
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ border: "2px solid var(--lilt-lime)", background: "var(--ink-surface)" }}
          >
            <span style={{ color: "var(--lilt-yellow)" }}>
              <Icon name="flame" size={16} />
            </span>
            <span className="font-display text-base font-extrabold text-white">{show ? streak : "—"}</span>
          </div>
        </div>
        <div className="mt-5">
          <div
            className="mb-1.5 flex justify-between text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
            style={{ color: "var(--on-ink-muted)" }}
          >
            <span>Today</span>
            <span>
              {show ? doneToday : 0} / {dailyGoal}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--ink-surface)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPct}%`, background: "var(--lilt-lime)" }}
            />
          </div>
        </div>
      </Link>

      {/* Quick links */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <QuickLink href="/practice" icon="blocks" label="Practice" shadow="var(--lilt-violet)" tint="var(--tint-lilac)" />
        <QuickLink href="/review" icon="refresh" label="Review" shadow="var(--lilt-lime)" tint="var(--tint-lime)" />
        <QuickLink href="/glossary" icon="book" label="Glossary" shadow="var(--lilt-yellow)" tint="var(--tint-yellow)" />
      </div>

      {/* Course header + mastery track */}
      <div className="mb-3.5">
        <h2 className="text-[18px]">Your course</h2>
      </div>

      <div
        className="mb-7 flex items-center gap-3.5 rounded-[16px] px-4 py-3.5"
        style={{ background: "var(--panel)", border: "2px solid var(--edge)" }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
          style={{ background: "var(--lilt-lime)", border: "2px solid var(--edge)", color: "var(--lilt-ink)" }}
        >
          <Icon name="course" size={18} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-[14px] font-extrabold">{langCfg.name} mastery</span>
            <span className="text-[12px] font-extrabold" style={{ color: "var(--accent)" }}>
              {show ? `${masteredUnits} of ${totalUnits} units` : `${totalUnits} units`}
            </span>
          </div>
          <div
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--track)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${show ? coursePct : 0}%`, background: "var(--lilt-lime)" }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-7">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="grid h-7 w-7 place-items-center rounded-[9px]"
                style={{ background: "var(--tint-violet)", border: "2px solid var(--edge)", color: "var(--accent)" }}
              >
                <Icon name={group.icon as IconName} size={14} strokeWidth={2} />
              </span>
              <h3 className="text-[16px]">{group.title}</h3>
            </div>
            <div
              className="overflow-hidden rounded-[18px]"
              style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}
            >
              {group.lessons.map((lesson, i) => (
                <UnitRow
                  key={lesson.id}
                  lesson={lesson}
                  n={order[lesson.id]}
                  store={store}
                  show={show}
                  state={lessonState[lesson.id]?.state ?? "next"}
                  pct={lessonState[lesson.id]?.pct ?? 0}
                  last={i === group.lessons.length - 1}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer
        className="mt-12 pt-6 text-xs"
        style={{ borderTop: "2px solid var(--edge)", color: "var(--muted)" }}
      >
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/stats" className="font-extrabold" style={{ color: "var(--accent)" }}>
            Stats
          </Link>
          <Link href="/guide/pronunciation" className="font-extrabold" style={{ color: "var(--accent)" }}>
            Pronunciation
          </Link>
          <Link href="/settings" className="font-extrabold" style={{ color: "var(--accent)" }}>
            Settings
          </Link>
          <Link href="/" className="font-extrabold" style={{ color: "var(--accent)" }}>
            About
          </Link>
        </p>
      </footer>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  shadow,
  tint,
}: {
  href: string;
  icon: IconName;
  label: string;
  shadow: string;
  tint: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-[16px] p-3.5 text-center transition hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${shadow}` }}
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-[11px]"
        style={{ background: tint, border: "2px solid var(--edge)", color: "var(--ink)" }}
      >
        <Icon name={icon} size={20} strokeWidth={1.9} />
      </span>
      <span className="text-[13.5px] font-extrabold">{label}</span>
    </Link>
  );
}

function UnitRow({
  lesson,
  n,
  store,
  show,
  state,
  pct,
  last,
}: {
  lesson: Lesson;
  n: number;
  store: ReturnType<typeof useProgress>;
  show: boolean;
  state: UnitState;
  pct: number;
  last: boolean;
}) {
  const ids = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
  const sum = summarize(store, ids);
  const mastered = state === "mastered";
  const current = state === "current";
  const locked = show && state === "locked";

  return (
    <Link
      href={locked ? "#" : `/lessons/${lesson.id}`}
      className="flex items-center gap-3.5 px-4 py-3.5 transition"
      style={{
        borderBottom: last ? undefined : "1.5px solid var(--divider)",
        background: current ? "var(--tint-violet)" : undefined,
        pointerEvents: locked ? "none" : undefined,
      }}
    >
      <span
        className="w-6 shrink-0 text-center font-display text-[15px] font-extrabold"
        style={{ color: current ? "var(--accent)" : locked ? "var(--text-disabled)" : "var(--text-faint)" }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <StatusDot mastered={mastered} current={current} locked={locked} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className="truncate font-display text-[15px] font-extrabold"
            style={{ color: locked ? "var(--text-faint)" : "var(--ink)" }}
          >
            {lesson.title}
          </span>
          {show && !locked && sum.due > 0 && (
            <span
              className="chip shrink-0"
              style={{ background: "var(--pop)", color: "var(--pop-ink)", border: "1.5px solid var(--edge)" }}
            >
              {sum.due} due
            </span>
          )}
        </span>
        <span
          className="mt-0.5 block text-[12px] font-bold"
          style={{ color: current ? "var(--accent)" : "var(--muted)" }}
        >
          {!show
            ? "—"
            : mastered
              ? `Mastered · ${pct}%`
              : locked
                ? "Locked · unlocks at 80%"
                : current
                  ? `In progress · ${pct}%`
                  : `Up next · ${pct}%`}
        </span>
      </span>
      {current ? (
        <span
          className="shrink-0 rounded-full px-4 py-2 text-[13px] font-extrabold"
          style={{
            background: "var(--accent)",
            color: "var(--accent-ink)",
            border: "2px solid var(--edge)",
            boxShadow: "3px 3px 0 0 var(--edge)",
          }}
        >
          Continue
        </span>
      ) : (
        <span
          className="hidden h-2 w-[120px] shrink-0 overflow-hidden rounded-full sm:block"
          style={{ background: "var(--track)" }}
        >
          <span
            className="block h-full"
            style={{ width: `${show ? pct : 0}%`, background: mastered ? "var(--lilt-lime)" : "var(--accent)" }}
          />
        </span>
      )}
    </Link>
  );
}

function StatusDot({ mastered, current, locked }: { mastered: boolean; current: boolean; locked: boolean }) {
  if (mastered)
    return (
      <span
        className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]"
        style={{ background: "var(--lilt-lime)", border: "2px solid var(--edge)", color: "var(--lilt-ink)" }}
      >
        <Icon name="check" size={16} strokeWidth={3} />
      </span>
    );
  if (current)
    return (
      <span
        className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]"
        style={{ background: "var(--accent)", border: "2px solid var(--edge)", color: "#fff" }}
      >
        <Icon name="play" size={14} />
      </span>
    );
  if (locked)
    return (
      <span
        className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]"
        style={{ background: "var(--tint-violet-2)", border: "2px solid var(--border-dashed)", color: "var(--border-dashed)" }}
      >
        <Icon name="lock" size={15} strokeWidth={2.4} />
      </span>
    );
  return (
    <span
      className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]"
      style={{ background: "var(--surface)", border: "2px solid var(--border-dashed)", color: "var(--border-dashed)" }}
    >
      <Icon name="arrow" size={15} strokeWidth={2.4} />
    </span>
  );
}

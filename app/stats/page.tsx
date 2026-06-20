"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "@/components/Icon";
import { getLessons } from "@/lib/data";
import { masteryPercent, reviewForecast, summarize, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { currentStreak, todayCount, useStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

export default function StatsPage() {
  const settings = useSettings();
  const lessons = getLessons(settings.studyLanguage);
  const store = useProgress();
  const stats = useStats();
  const dailyGoal = settings.dailyGoal;
  const dailyGoalMinutes = settings.dailyGoalMinutes;
  const mounted = useMounted();

  const allIds = useMemo(
    () => lessons.flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lessons],
  );

  if (!mounted) {
    return (
      <div>
        <Header />
        <div
          className="grid h-40 place-items-center rounded-[18px] font-display text-[15px] font-extrabold"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--muted)" }}
        >
          Loading…
        </div>
      </div>
    );
  }

  const overall = summarize(store, allIds);
  const streak = currentStreak(stats);
  const today = todayCount(stats);
  const mastery = masteryPercent(store, allIds);
  const forecast = reviewForecast(store, allIds, 7);
  const maxF = Math.max(1, ...forecast);
  const dayNames = nextSevenDayLabels();
  const goalPct = Math.min(100, (today / dailyGoal) * 100);
  const goalReached = today >= dailyGoal;

  return (
    <div>
      <Header />

      {/* ── KPI sticker cards ───────────────────────────────────────────── */}
      <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <StatCard
          big={`${streak}`}
          suffix="days"
          label="Streak"
          icon="flame"
          tint="var(--tint-coral)"
          shadow="var(--lilt-coral)"
        />
        <StatCard
          big={`${today}`}
          suffix={`/ ${dailyGoal}`}
          label="Today's reviews"
          icon="refresh"
          tint="var(--tint-violet-2)"
          shadow="var(--lilt-violet)"
        />
        <StatCard
          big={`${mastery}%`}
          label="Mastered"
          icon="star"
          tint="var(--tint-lime)"
          shadow="var(--lilt-lime)"
        />
        <StatCard
          big={`${overall.total}`}
          label="Total words"
          icon="book"
          tint="var(--tint-yellow)"
          shadow="var(--lilt-yellow)"
        />
      </div>

      {/* ── Daily goal ──────────────────────────────────────────────────── */}
      <div
        className="mb-5 rounded-[18px] p-5"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}
      >
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px]">Daily goal</h2>
            <p className="mt-0.5 text-[12px] font-bold" style={{ color: "var(--muted)" }}>
              About {dailyGoalMinutes} min a day · {dailyGoal} reviews
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
            style={
              goalReached
                ? { background: "var(--lilt-lime)", color: "var(--pop-ink)", border: "2px solid var(--edge)" }
                : { background: "var(--tint-violet)", color: "var(--accent)", border: "2px solid var(--border-soft)" }
            }
          >
            {goalReached ? "Reached 🎉" : `${dailyGoal - today} to go`}
          </span>
        </div>
        <div
          className="h-4 w-full overflow-hidden rounded-full"
          style={{ background: "var(--track)", border: "2px solid var(--edge)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${goalPct}%`, background: goalReached ? "var(--lilt-lime)" : "var(--accent)" }}
          />
        </div>
      </div>

      {/* ── Review forecast ─────────────────────────────────────────────── */}
      <div
        className="mb-5 rounded-[18px] p-5"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-[18px]">Reviews due</h2>
          <span className="text-[12.5px] font-extrabold" style={{ color: "var(--muted)" }}>next 7 days</span>
        </div>
        <div className="flex items-end justify-between gap-2.5" style={{ height: 132 }}>
          {forecast.map((n, i) => {
            const isToday = i === 0;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[12px] font-extrabold" style={{ color: n > 0 ? "var(--ink)" : "var(--text-disabled)" }}>{n}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[8px]"
                    style={{
                      height: `${Math.max(n > 0 ? 6 : 0, (n / maxF) * 100)}%`,
                      background: n > 0 ? (isToday ? "var(--lilt-violet)" : "var(--tint-lilac)") : "transparent",
                      border: n > 0 ? "2px solid var(--edge)" : undefined,
                      borderBottom: n > 0 ? "none" : undefined,
                    }}
                    title={`${n} due`}
                  />
                </div>
                <span
                  className="text-[11px] font-extrabold uppercase tracking-[0.03em]"
                  style={{ color: isToday ? "var(--accent)" : "var(--muted)" }}
                >
                  {dayNames[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Per-lesson mastery ──────────────────────────────────────────── */}
      <h2 className="section-label">By lesson</h2>
      <div
        className="mb-5 overflow-hidden rounded-[18px]"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}
      >
        {lessons.map((lesson, li) => {
          const lessonIds = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
          const ls = summarize(store, lessonIds);
          const mastered = ls.total > 0 && ls.mastered === ls.total;
          return (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="block px-4 py-3.5 transition hover:bg-[var(--tint-violet)]"
              style={{ borderBottom: li < lessons.length - 1 ? "1.5px solid var(--divider)" : undefined }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-display text-[15px] font-extrabold">{lesson.title}</span>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-extrabold"
                  style={
                    mastered
                      ? { background: "var(--lilt-lime)", color: "var(--pop-ink)", border: "2px solid var(--edge)" }
                      : { background: "var(--tint-violet-2)", color: "var(--muted)", border: "2px solid var(--border-soft)" }
                  }
                >
                  {ls.mastered}/{ls.total} mastered
                </span>
              </div>
              <div
                className="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--track)", border: "1.5px solid var(--edge)" }}
              >
                <Seg n={ls.mastered} total={ls.total} color="var(--lilt-lime)" />
                <Seg n={ls.review} total={ls.total} color="var(--accent)" />
                <Seg n={ls.learning} total={ls.total} color="var(--lilt-yellow)" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* legend */}
      <div className="mb-7 flex flex-wrap gap-4 text-[12px] font-bold" style={{ color: "var(--muted)" }}>
        <LegendDot color="var(--lilt-lime)" label="Mastered" />
        <LegendDot color="var(--accent)" label="Review" />
        <LegendDot color="var(--lilt-yellow)" label="Learning" />
      </div>

    </div>
  );
}

function Header() {
  return (
    <div className="mb-7">
      <h1 className="text-[30px] leading-none">Your progress</h1>
    </div>
  );
}

function StatCard({
  big,
  suffix,
  label,
  icon,
  tint,
  shadow,
}: {
  big: string;
  suffix?: string;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
  shadow: string;
}) {
  return (
    <div
      className="rounded-[16px] p-4"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${shadow}` }}
    >
      <span
        className="mb-3 grid h-9 w-9 place-items-center rounded-[10px]"
        style={{ background: tint, border: "2px solid var(--edge)", color: "var(--ink)" }}
      >
        <Icon name={icon} size={19} strokeWidth={2} />
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[26px] font-extrabold leading-none">{big}</span>
        {suffix && <span className="text-[13px] font-extrabold" style={{ color: "var(--muted)" }}>{suffix}</span>}
      </div>
      <div className="mt-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.04em]" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-full" style={{ background: color, border: "1.5px solid var(--edge)" }} />
      {label}
    </span>
  );
}

function Seg({ n, total, color }: { n: number; total: number; color: string }) {
  if (total === 0 || n === 0) return null;
  return <div style={{ width: `${(n / total) * 100}%`, background: color }} />;
}

function nextSevenDayLabels(): string[] {
  const fmt = new Intl.DateTimeFormat("en", { weekday: "short" });
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < 7; i++) {
    out.push(i === 0 ? "Today" : fmt.format(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

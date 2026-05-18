"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getLessons } from "@/lib/data";
import { resetAllProgress, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { DAILY_GOAL, currentStreak, todayCount, useStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

const PRACTICE_MODES: { href: string; label: string; desc: string }[] = [
  { href: "/study/flashcards", label: "Flashcards", desc: "Flip & self-rate" },
  { href: "/quiz/mc", label: "Multiple choice", desc: "Pick the meaning" },
  { href: "/quiz/type", label: "Type the answer", desc: "Active recall" },
  { href: "/quiz/cloze", label: "Fill the blank", desc: "Sentence grammar" },
  { href: "/study/listening", label: "Listening", desc: "Hear & choose" },
  { href: "/study/speaking", label: "Speaking", desc: "Say it aloud" },
  { href: "/study/order", label: "Word order", desc: "Build sentences" },
  { href: "/review", label: "Spaced review", desc: "Smart mix, all due" },
];

export default function Dashboard() {
  const lessons = useMemo(() => getLessons(), []);
  const store = useProgress();
  const mounted = useMounted();

  const allIds = useMemo(
    () => lessons.flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lessons],
  );
  const stats = useStats();
  const overall = summarize(store, allIds);
  const showStats = mounted;
  const troubleCount = mounted ? troubleItemIds(store, allIds).length : 0;
  const doneToday = mounted ? todayCount(stats) : 0;
  const streak = mounted ? currentStreak(stats) : 0;
  const goalMet = doneToday >= DAILY_GOAL;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Selamat belajar! 🇮🇩</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Study and test yourself on your Indonesian class materials.
        </p>
      </header>

      {/* Study today — primary action */}
      <Link
        href="/today"
        className="mb-6 block rounded-2xl bg-indigo-600 p-6 text-white shadow-sm transition hover:bg-indigo-700"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {showStats && goalMet ? "Daily goal reached 🎉" : "Study today"}
            </h2>
            <p className="mt-1 text-sm text-indigo-100">
              {!showStats
                ? "One tap — the best mix for right now."
                : goalMet
                  ? "Nice work. Tap for extra practice."
                  : `${overall.due} due${troubleCount > 0 ? ` · ${troubleCount} tricky` : ""} · a few new`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{showStats ? `${streak}🔥` : "—"}</div>
            <div className="text-[11px] uppercase tracking-wide text-indigo-200">streak</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-indigo-100">
            <span>Today</span>
            <span>
              {showStats ? doneToday : 0}/{DAILY_GOAL}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-400/40">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${Math.min(100, (doneToday / DAILY_GOAL) * 100)}%` }}
            />
          </div>
        </div>
      </Link>

      {/* Review due */}
      <div className="card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Spaced review</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {showStats
              ? overall.due > 0
                ? `${overall.due} item${overall.due === 1 ? "" : "s"} ready to review now.`
                : "You're all caught up — nothing due."
              : "Loading your progress…"}
          </p>
        </div>
        <Link
          href="/review"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {showStats && overall.due > 0 ? `Review ${overall.due} now` : "Start a review"}
        </Link>
      </div>

      {/* Trouble words */}
      {showStats && troubleCount > 0 && (
        <Link
          href="/review?trouble=1"
          className="card mb-6 flex items-center justify-between gap-4 p-5 transition hover:border-rose-300 dark:hover:border-rose-800"
        >
          <div>
            <h2 className="text-lg font-semibold">Trouble words</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {troubleCount} word{troubleCount === 1 ? "" : "s"} you keep missing — drill just these.
            </p>
          </div>
          <span className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white">
            Practice
          </span>
        </Link>
      )}

      {/* Ways to practice */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Ways to practice
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PRACTICE_MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="card flex flex-col gap-0.5 p-3 transition hover:border-indigo-300 dark:hover:border-indigo-800"
          >
            <span className="text-sm font-semibold">{m.label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</span>
          </Link>
        ))}
      </div>

      {/* Overall progress */}
      {showStats && overall.mastered + overall.review + overall.learning > 0 && (
        <div className="card mb-6 p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Overall mastery</span>
            <span className="text-slate-500 dark:text-slate-400">
              {overall.mastered} / {overall.total} mastered
            </span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <Bar n={overall.mastered} total={overall.total} cls="bg-emerald-500" />
            <Bar n={overall.review} total={overall.total} cls="bg-sky-500" />
            <Bar n={overall.learning} total={overall.total} cls="bg-amber-400" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <Legend cls="bg-emerald-500" label={`Mastered ${overall.mastered}`} />
            <Legend cls="bg-sky-500" label={`Review ${overall.review}`} />
            <Legend cls="bg-amber-400" label={`Learning ${overall.learning}`} />
            <Legend cls="bg-slate-300 dark:bg-slate-600" label={`New ${overall.newCount}`} />
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Lessons
      </h2>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const ids = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
          const sum = summarize(store, ids);
          return (
            <div key={lesson.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="text-lg font-semibold hover:text-indigo-600"
                  >
                    {lesson.title}
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {lesson.sections.length} sections · {ids.length} items
                    {showStats && sum.due > 0 && (
                      <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                        {sum.due} due
                      </span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Browse
                </Link>
              </div>

              {showStats && (
                <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <Bar n={sum.mastered} total={sum.total} cls="bg-emerald-500" />
                  <Bar n={sum.review} total={sum.total} cls="bg-sky-500" />
                  <Bar n={sum.learning} total={sum.total} cls="bg-amber-400" />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/study/flashcards?lesson=${lesson.id}`}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Flashcards
                </Link>
                <Link
                  href={`/quiz/mc?lesson=${lesson.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Quiz
                </Link>
                <Link
                  href={`/quiz/type?lesson=${lesson.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Type test
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-400 dark:border-slate-800">
        <p className="mb-2">
          <Link
            href="/guide/pronunciation"
            className="font-medium text-indigo-600 hover:underline"
          >
            Pronunciation guide
          </Link>{" "}
          ·{" "}
          <Link href="/stats" className="font-medium text-indigo-600 hover:underline">
            Progress &amp; stats
          </Link>
        </p>
        <p>
          Progress is saved in this browser only. Audio uses your device&apos;s built-in
          Indonesian voice (install an Indonesian TTS voice in your OS settings if you hear
          nothing).
        </p>
        {showStats && overall.mastered + overall.review + overall.learning > 0 && (
          <button
            onClick={() => {
              if (confirm("Reset all study progress? This cannot be undone.")) resetAllProgress();
            }}
            className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Reset progress
          </button>
        )}
      </footer>
    </div>
  );
}

function Bar({ n, total, cls }: { n: number; total: number; cls: string }) {
  if (total === 0 || n === 0) return null;
  return <div className={cls} style={{ width: `${(n / total) * 100}%` }} />;
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${cls}`} />
      {label}
    </span>
  );
}

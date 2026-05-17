"use client";

import Link from "next/link";
import { useMemo } from "react";
import { masteryPercent, useProgress } from "@/lib/progress";
import { familiarity } from "@/lib/srs";
import type { Lesson } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";
import { SpeakButton } from "./SpeakButton";

const DOT: Record<string, string> = {
  new: "bg-slate-300 dark:bg-slate-600",
  learning: "bg-amber-400",
  review: "bg-sky-500",
  mastered: "bg-emerald-500",
};

function PracticeLinks({ query }: { query: string }) {
  const base =
    "rounded-lg px-2.5 py-1 text-xs font-semibold transition border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 dark:border-slate-700 dark:hover:bg-slate-800";
  return (
    <div className="flex flex-wrap gap-1.5">
      <Link href={`/study/flashcards?${query}`} className={base}>
        Flashcards
      </Link>
      <Link href={`/quiz/mc?${query}`} className={base}>
        Quiz
      </Link>
      <Link href={`/quiz/type?${query}`} className={base}>
        Type
      </Link>
    </div>
  );
}

export function LessonBrowser({ lesson }: { lesson: Lesson }) {
  const store = useProgress();
  const mounted = useMounted();

  const allIds = useMemo(
    () => lesson.sections.flatMap((s) => s.items.map((i) => i.id)),
    [lesson],
  );
  const mastery = mounted ? masteryPercent(store, allIds) : 0;
  const itemCount = allIds.length;

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
          ← All lessons
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {lesson.sections.length} sections · {itemCount} items
          {mounted && ` · ${mastery}% mastered`}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/study/flashcards?lesson=${lesson.id}`}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Flashcards (whole lesson)
          </Link>
          <Link
            href={`/quiz/mc?lesson=${lesson.id}`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Multiple-choice quiz
          </Link>
          <Link
            href={`/quiz/type?lesson=${lesson.id}`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Type test
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        {lesson.sections.map((section) => (
          <section key={section.id} className="card overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-semibold">{section.titleEn}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{section.titleId}</p>
              </div>
              <PracticeLinks query={`section=${section.id}`} />
            </div>

            {section.notes.length > 0 && (
              <ul className="space-y-1.5 border-b border-slate-200 bg-amber-50/60 px-5 py-3 text-sm text-amber-900 dark:border-slate-800 dark:bg-amber-950/20 dark:text-amber-200">
                {section.notes.map((n, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>💡</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {section.items.map((item) => {
                const fam = mounted ? familiarity(store[item.id]) : "new";
                return (
                  <li key={item.id} className="px-5 py-2.5 text-sm">
                    <div className="flex items-start gap-3 sm:items-center">
                      <span
                        title={fam}
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full sm:mt-0 ${DOT[fam]}`}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                        <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                          <span className="font-medium">{item.indonesian}</span>
                          <SpeakButton text={item.indonesian} size="sm" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 sm:flex-1 sm:text-right">
                          {item.english}
                          {item.note && (
                            <span className="ml-1 text-xs italic text-slate-400">
                              ({item.note})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

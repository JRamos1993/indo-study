"use client";

import Link from "next/link";
import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { getAllItems, getLessons } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { useProgress } from "@/lib/progress";
import { normalize } from "@/lib/quiz";
import { useSettings } from "@/lib/settings";
import { type Familiarity, familiarity } from "@/lib/srs";
import { useMounted } from "@/lib/useMounted";

const DOT: Record<Familiarity, string> = {
  new: "bg-slate-300 dark:bg-slate-600",
  learning: "bg-amber-400",
  review: "bg-sky-500",
  mastered: "bg-emerald-500",
};

export default function GlossaryPage() {
  const lang = useSettings().studyLanguage;
  const langName = getLanguage(lang).name;
  const all = getAllItems(lang);
  const lessons = getLessons(lang);
  const store = useProgress();
  const mounted = useMounted();
  const [q, setQ] = useState("");
  const [lesson, setLesson] = useState("");

  const nq = normalize(q);
  const results = all.filter((c) => {
    if (lesson && c.lessonId !== lesson) return false;
    if (!nq) return true;
    return (
      normalize(c.item.target).includes(nq) ||
      normalize(c.item.english).includes(nq) ||
      (c.item.reading ? normalize(c.item.reading).includes(nq) : false)
    );
  });

  return (
    <div>
      <div className="mb-5">
        <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Glossary</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {all.length} words & phrases across all lessons
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${langName} or English…`}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All lessons</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-2 text-xs text-slate-400">{results.length} shown</p>

      <ul className="card divide-y divide-slate-100 dark:divide-slate-800/70">
        {results.slice(0, 800).map((c) => {
          const fam = mounted ? familiarity(store[c.item.id]) : "new";
          return (
            <li key={c.item.id} className="px-4 py-2.5 text-sm">
              <div className="flex items-start gap-3 sm:items-center">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full sm:mt-0 ${DOT[fam]}`} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                    <span className="font-medium">{c.item.target}</span>
                    {c.item.reading && (
                      <span className="text-xs text-slate-400">{c.item.reading}</span>
                    )}
                    <SpeakButton text={c.item.target} size="sm" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 sm:flex-1 sm:text-right">
                    {c.item.english}
                  </span>
                </div>
                <Link
                  href={`/quiz/mc?section=${c.sectionId}`}
                  className="shrink-0 text-xs font-medium text-indigo-600 hover:underline"
                >
                  practice
                </Link>
              </div>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-slate-400">No matches.</li>
        )}
      </ul>
    </div>
  );
}

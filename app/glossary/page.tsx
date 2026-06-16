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
        <Link href="/learn" className="text-sm font-bold" style={{ color: "var(--muted)" }}>
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl">Glossary</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {all.length} words & phrases across all lessons
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${langName} or English…`}
          className="min-w-0 flex-1 rounded-xl border-2 border-[color:var(--edge)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium outline-none"
        />
        <select
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          className="rounded-xl border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3 py-2.5 text-sm font-bold outline-none"
        >
          <option value="">All lessons</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      <p className="section-label mb-2">{results.length} shown</p>

      <ul className="card divide-y" style={{ borderColor: "var(--edge)" }}>
        {results.slice(0, 800).map((c) => {
          const fam = mounted ? familiarity(store[c.item.id]) : "new";
          return (
            <li key={c.item.id} className="px-4 py-2.5 text-sm" style={{ borderColor: "color-mix(in srgb, var(--edge) 25%, transparent)" }}>
              <div className="flex items-start gap-3 sm:items-center">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 ${DOT[fam]}`} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                    <span className="font-semibold">{c.item.target}</span>
                    {c.item.reading && (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{c.item.reading}</span>
                    )}
                    <SpeakButton text={c.item.target} size="sm" />
                  </div>
                  <span className="sm:flex-1 sm:text-right" style={{ color: "var(--muted)" }}>
                    {c.item.english}
                  </span>
                </div>
                <Link
                  href={`/quiz/mc?section=${c.sectionId}`}
                  className="shrink-0 text-xs font-bold uppercase tracking-wide hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  practice
                </Link>
              </div>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-4 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>No matches.</li>
        )}
      </ul>
    </div>
  );
}

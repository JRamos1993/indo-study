"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { masteryPercent, summarize, useProgress } from "@/lib/progress";
import { type Familiarity, familiarity } from "@/lib/srs";
import type { Lesson, Section } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";
import { SpeakButton } from "./SpeakButton";

const DOT: Record<Familiarity, string> = {
  new: "bg-slate-300 dark:bg-slate-600",
  learning: "bg-amber-400",
  review: "bg-sky-500",
  mastered: "bg-emerald-500",
};

export function LessonBrowser({ lesson }: { lesson: Lesson }) {
  const store = useProgress();
  const mounted = useMounted();

  const allIds = useMemo(() => lesson.sections.flatMap((s) => s.items.map((i) => i.id)), [lesson]);
  const sum = summarize(store, allIds);
  const mastery = mounted ? masteryPercent(store, allIds) : 0;

  return (
    <div>
      <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
        ← Course
      </Link>

      {/* Unit header / study CTA */}
      <div className="card mt-3 p-5">
        <p className="eyebrow">Unit</p>
        <h1 className="mt-1 text-2xl">{lesson.title}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {lesson.sections.length} sections · {allIds.length} items{mounted ? ` · ${mastery}% mastered` : ""}
        </p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--paper)", border: "1.5px solid var(--edge)" }}>
          <div className="h-full" style={{ width: `${mastery}%`, background: "var(--accent)" }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link href={`/study/unit?lesson=${lesson.id}`} className="btn btn-primary">
            <Icon name="bolt" size={16} /> Study this unit
          </Link>
          {mounted && sum.due > 0 && (
            <Link href={`/review?lesson=${lesson.id}`} className="btn btn-secondary">
              Review {sum.due} due
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {lesson.sections.map((section) => (
          <SectionCard key={section.id} section={section} mounted={mounted} store={store} />
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  mounted,
  store,
}: {
  section: Section;
  mounted: boolean;
  store: ReturnType<typeof useProgress>;
}) {
  const [open, setOpen] = useState(false);
  const sectionMastery = mounted
    ? masteryPercent(store, section.items.map((i) => i.id))
    : 0;

  return (
    <section className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-bold">{section.titleEn}</h2>
          <p className="truncate text-sm" style={{ color: "var(--muted)" }}>
            {section.titleId} · {section.items.length} items{mounted ? ` · ${sectionMastery}%` : ""}
          </p>
        </div>
        <span className="shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--muted)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div style={{ borderTop: "2px solid var(--edge)" }}>
          {section.notes.length > 0 && (
            <ul className="space-y-1.5 px-5 py-3 text-sm" style={{ background: "color-mix(in srgb, var(--pop) 16%, transparent)", borderBottom: "2px solid var(--edge)" }}>
              {section.notes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden style={{ color: "var(--accent)" }}>
                    <Icon name="bolt" size={14} />
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
          <ul className="divide-y" style={{ borderColor: "var(--edge)" }}>
            {section.items.map((item) => {
              const fam = mounted ? familiarity(store[item.id]) : "new";
              return (
                <li key={item.id} className="px-5 py-2.5 text-sm" style={{ borderColor: "color-mix(in srgb, var(--edge) 25%, transparent)" }}>
                  <div className="flex items-start gap-3 sm:items-center">
                    <span title={fam} className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 ${DOT[fam]}`} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                      <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                        <span className="font-semibold">{item.target}</span>
                        {item.reading && <span className="text-xs" style={{ color: "var(--muted)" }}>{item.reading}</span>}
                        <SpeakButton text={item.target} size="sm" />
                      </div>
                      <span className="sm:flex-1 sm:text-right" style={{ color: "var(--muted)" }}>
                        {item.english}
                        {item.note && <span className="ml-1 text-xs italic"> ({item.note})</span>}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-5 py-3" style={{ borderTop: "2px solid var(--edge)" }}>
            <Link href={`/study/flashcards?section=${section.id}`} className="btn btn-secondary px-3 py-1.5 text-xs">
              Practice this section
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { masteryPercent, summarize, useProgress } from "@/lib/progress";
import { type Familiarity, familiarity } from "@/lib/srs";
import type { Lesson, Section } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";
import { SpeakButton } from "./SpeakButton";

const DOT: Record<Familiarity, { bg: string; label: string }> = {
  new: { bg: "var(--text-disabled)", label: "New" },
  learning: { bg: "var(--lilt-yellow)", label: "Learning" },
  review: { bg: "var(--lilt-violet)", label: "Review" },
  mastered: { bg: "var(--lilt-lime)", label: "Mastered" },
};

export function LessonBrowser({ lesson }: { lesson: Lesson }) {
  const store = useProgress();
  const mounted = useMounted();

  const allIds = useMemo(() => lesson.sections.flatMap((s) => s.items.map((i) => i.id)), [lesson]);
  const sum = summarize(store, allIds);
  const mastery = mounted ? masteryPercent(store, allIds) : 0;

  return (
    <div>
      {/* Unit header / study CTA — sticker card with accent shadow */}
      <div
        className="overflow-hidden rounded-[18px] p-6 sm:p-7"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)" }}
      >
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
          style={{ background: "var(--lilt-violet)", color: "#fff" }}
        >
          <Icon name="course" size={14} strokeWidth={2.2} /> Unit
        </span>
        <h1 className="mt-3 text-[28px] leading-tight">{lesson.title}</h1>
        <p className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--muted)" }}>
          {lesson.sections.length} sections · {allIds.length} items{mounted ? ` · ${mastery}% mastered` : ""}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span
            className="h-3 flex-1 overflow-hidden rounded-full"
            style={{ background: "var(--track)", border: "2px solid var(--edge)" }}
          >
            <span
              className="block h-full"
              style={{ width: `${mastery}%`, background: mastery >= 100 ? "var(--lilt-lime)" : "var(--accent)" }}
            />
          </span>
          <span className="shrink-0 font-display text-[15px] font-extrabold" style={{ color: "var(--accent)" }}>
            {mounted ? mastery : 0}%
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href={`/study/unit?lesson=${lesson.id}`} className="btn btn-primary rounded-full px-6 py-3 text-[15px]">
            <Icon name="bolt" size={16} strokeWidth={2.2} /> Study this unit
          </Link>
          {mounted && sum.due > 0 && (
            <Link href={`/review?lesson=${lesson.id}`} className="btn btn-secondary rounded-full px-5 py-3 text-[15px]">
              <Icon name="refresh" size={16} strokeWidth={2.2} /> Review {sum.due} due
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
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
    <section
      className="overflow-hidden rounded-[16px]"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition"
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px]"
          style={{ background: "var(--tint-violet)", border: "2px solid var(--edge)", color: "var(--accent)" }}
        >
          <Icon name="book" size={18} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[16px] font-extrabold">{section.titleEn}</h2>
          <p className="truncate text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
            {section.titleId} · {section.items.length} items{mounted ? ` · ${sectionMastery}%` : ""}
          </p>
        </div>
        <span
          className="shrink-0 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--muted)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div style={{ borderTop: "2px solid var(--edge)" }}>
          {section.notes.length > 0 && (
            <ul
              className="space-y-2 px-5 py-3.5 text-[13.5px] font-bold"
              style={{ background: "var(--tint-lime)", borderBottom: "2px solid var(--edge)", color: "var(--on-lime)" }}
            >
              {section.notes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="mt-0.5 shrink-0" style={{ color: "var(--on-lime)" }}>
                    <Icon name="bolt" size={14} strokeWidth={2.2} />
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
          <ul>
            {section.items.map((item, idx) => {
              const fam = mounted ? familiarity(store[item.id]) : "new";
              const dot = DOT[fam];
              return (
                <li
                  key={item.id}
                  className="px-5 py-3 text-sm"
                  style={{ borderTop: idx === 0 ? undefined : "1.5px solid var(--divider)" }}
                >
                  <div className="flex items-start gap-3 sm:items-center">
                    <span
                      title={dot.label}
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0"
                      style={{ background: dot.bg, border: "1.5px solid var(--edge)" }}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                      <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                        <span className="font-display font-extrabold" style={{ color: "var(--ink)" }}>{item.target}</span>
                        {item.reading && (
                          <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>{item.reading}</span>
                        )}
                        <SpeakButton text={item.target} size="sm" />
                      </div>
                      <span className="font-bold sm:flex-1 sm:text-right" style={{ color: "var(--text-body)" }}>
                        {item.english}
                        {item.note && <span className="ml-1 text-xs italic" style={{ color: "var(--text-faint)" }}> ({item.note})</span>}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-5 py-4" style={{ borderTop: "2px solid var(--edge)", background: "var(--panel)" }}>
            <Link
              href={`/study/flashcards?section=${section.id}`}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-extrabold transition active:translate-x-[1px] active:translate-y-[1px]"
              style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
            >
              <Icon name="cards" size={15} strokeWidth={2} /> Practice this section
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

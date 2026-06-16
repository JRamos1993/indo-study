"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SpeakButton } from "@/components/SpeakButton";
import { getAllItems, getLessons } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { useProgress } from "@/lib/progress";
import { normalize } from "@/lib/quiz";
import { useSettings } from "@/lib/settings";
import { type Familiarity, familiarity } from "@/lib/srs";
import { useMounted } from "@/lib/useMounted";

const DOT: Record<Familiarity, string> = {
  new: "var(--text-disabled)",
  learning: "var(--lilt-yellow)",
  review: "var(--lilt-violet)",
  mastered: "var(--lilt-lime)",
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

  const strong = mounted ? all.filter((c) => familiarity(store[c.item.id]) === "mastered").length : 0;

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mb-6">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-[13px] font-extrabold"
          style={{ color: "var(--muted)" }}
        >
          <Icon name="arrow" size={15} strokeWidth={2.4} className="-scale-x-100" />
          Back
        </Link>
        <h1 className="mt-2.5 text-[30px] leading-none">Glossary</h1>
        <p className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--muted)" }}>
          <b style={{ color: "var(--ink)" }}>{all.length}</b> words ·{" "}
          <b style={{ color: "var(--lilt-violet)" }}>{strong}</b> strong
        </p>
      </header>

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="mb-3.5">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          >
            <Icon name="search" size={18} strokeWidth={2.2} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${langName} or English…`}
            className="w-full rounded-full py-3 pl-11 pr-4 text-[15px] font-semibold outline-none"
            style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
          />
        </div>
      </div>

      {/* ── Filter chips ───────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={lesson === ""} onClick={() => setLesson("")}>
          All lessons
        </FilterChip>
        {lessons.map((l) => (
          <FilterChip key={l.id} active={lesson === l.id} onClick={() => setLesson(l.id)}>
            {l.title}
          </FilterChip>
        ))}
      </div>

      <p className="section-label mb-2.5">{results.length} shown</p>

      {/* ── Word rows ──────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
        {results.slice(0, 800).map((c, i) => {
          const fam = mounted ? familiarity(store[c.item.id]) : "new";
          return (
            <div
              key={c.item.id}
              className="flex items-start gap-3 px-4 py-3 sm:items-center"
              style={{ borderTop: i > 0 ? "1.5px solid var(--divider)" : undefined }}
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0"
                style={{ background: DOT[fam], border: "1.5px solid var(--edge)" }}
                title={fam}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:flex-1">
                  <span className="text-[15px] font-extrabold" style={{ color: "var(--ink)" }}>
                    {c.item.target}
                  </span>
                  {c.item.reading && (
                    <span className="text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
                      {c.item.reading}
                    </span>
                  )}
                  <SpeakButton text={c.item.target} size="sm" />
                </div>
                <span
                  className="text-[13.5px] font-bold sm:flex-1 sm:text-right"
                  style={{ color: "var(--text-body)" }}
                >
                  {c.item.english}
                </span>
              </div>
              <Link
                href={`/quiz/mc?section=${c.sectionId}`}
                className="shrink-0 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em] transition active:translate-y-0.5"
                style={{ background: "var(--tint-violet)", color: "var(--lilt-violet)", border: "2px solid var(--lilt-violet)" }}
              >
                Practice
              </Link>
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="px-4 py-10 text-center text-[14px] font-bold" style={{ color: "var(--muted)" }}>
            No matches.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition active:translate-y-0.5"
      style={
        active
          ? { background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }
          : { background: "var(--surface)", color: "var(--text-body)", border: "2px solid var(--edge)" }
      }
    >
      {children}
    </button>
  );
}

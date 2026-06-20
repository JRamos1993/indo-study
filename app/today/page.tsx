"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { getAllItems, getLessons } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import { dueItemIds, masteryPercent, summarize, troubleItemIds, useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { isNew } from "@/lib/srs";
import { currentStreak, getNewIntroducedToday, useStats } from "@/lib/stats";
import type { Lesson } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export default function TodayDashboard() {
  const store = useProgress();
  const stats = useStats();
  const settings = useSettings();
  const mounted = useMounted();
  const lang = settings.studyLanguage;
  const cfg = getLanguage(lang);

  const lessons = useMemo(() => getLessons(lang), [lang]);
  const ctx = useMemo(() => getAllItems(lang), [lang]);
  const allIds = useMemo(() => ctx.map((c) => c.item.id), [ctx]);
  const kindById = useMemo(() => {
    const m: Record<string, string> = {};
    ctx.forEach((c) => (m[c.item.id] = c.item.kind));
    return m;
  }, [ctx]);

  const summary = summarize(store, allIds);
  const dueIds = mounted ? dueItemIds(store, allIds) : [];
  const reviewsDue = dueIds.filter((id) => !isNew(store[id])).length;
  const grammarDue = dueIds.filter((id) => !isNew(store[id]) && kindById[id] === "sentence").length;
  const newRemaining = Math.max(0, settings.newPerDay - (mounted ? getNewIntroducedToday() : 0));
  const newAvailable = Math.min(newRemaining, allIds.filter((id) => isNew(store[id])).length);
  const sessionSize = reviewsDue + newAvailable;
  const minutes = Math.max(1, Math.round(sessionSize * 0.2));
  const mastery = mounted ? masteryPercent(store, allIds) : 0;
  const strong = summary.mastered;
  const stillLearning = summary.learning + summary.review;
  const streak = mounted ? currentStreak(stats) : 0;
  const troubleCount = mounted ? troubleItemIds(store, allIds).length : 0;

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_268px]">
      <section className="min-w-0">
        <Greeting cfg={cfg} mounted={mounted} />
        <SmartMixHero
          mounted={mounted}
          reviewsDue={reviewsDue}
          newWords={newAvailable}
          grammar={grammarDue}
          minutes={minutes}
          empty={mounted && sessionSize === 0}
          sample={ctx[0]}
        />
        <ModeGrid lang={lang} reviewsDue={reviewsDue} grammarDue={grammarDue} words={allIds.length} />
        <CourseStrip lessons={lessons} store={store} mounted={mounted} langName={cfg.name} />
      </section>

      <aside className="flex flex-col gap-4">
        <StreakWeek stats={stats} streak={streak} mounted={mounted} />
        {troubleCount > 0 && <TroubleCard count={troubleCount} />}
        <RadialMastery pct={mastery} strong={strong} learning={stillLearning} mounted={mounted} />
        <CirclePeek />
      </aside>
    </div>
  );
}

// ── Greeting ─────────────────────────────────────────────────────────────────

function Greeting({ cfg, mounted }: { cfg: ReturnType<typeof getLanguage>; mounted: boolean }) {
  const now = mounted ? new Date() : null;
  const hour = now ? now.getHours() : 9;
  const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const dateStr = now
    ? new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(now)
    : "";
  return (
    <header className="mb-5">
      <div className="text-[13px] font-extrabold uppercase tracking-[0.05em]" style={{ color: "var(--muted)" }}>
        {dateStr || `${cfg.flag} ${cfg.name}`}
      </div>
      <h1 className="mt-1 text-[30px] leading-none">Good {part}.</h1>
    </header>
  );
}

// ── Smart-mix hero ───────────────────────────────────────────────────────────

function SmartMixHero({
  mounted,
  reviewsDue,
  newWords,
  grammar,
  minutes,
  empty,
  sample,
}: {
  mounted: boolean;
  reviewsDue: number;
  newWords: number;
  grammar: number;
  minutes: number;
  empty: boolean;
  sample?: { item: { target: string; english: string } };
}) {
  return (
    <div
      className="relative mb-7 overflow-hidden rounded-[22px] p-6 sm:p-7"
      style={{ background: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)", color: "#fff" }}
    >
      <div className="relative z-10 max-w-[26rem]">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
          style={{ background: "var(--lilt-violet)", color: "#fff" }}
        >
          Spaced review · smart mix
        </span>
        <h2 className="mt-3.5 text-[28px] leading-tight text-white">
          {!mounted ? "Your daily mix" : empty ? "All caught up" : "Your daily mix is ready"}
        </h2>
        <div className="my-4 flex items-stretch gap-4">
          <HeroStat n={reviewsDue} label="reviews due" accent />
          <span className="w-0.5" style={{ background: "var(--ink-surface)" }} />
          <HeroStat n={newWords} label="new words" />
          <span className="w-0.5" style={{ background: "var(--ink-surface)" }} />
          <HeroStat n={grammar} label="grammar" />
        </div>
        <Link
          href="/today/session"
          className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5"
          style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--lilt-lime)" }}
        >
          {empty ? "Extra practice" : "Start session"}
          <span className="text-[13px] opacity-70">~{minutes} min</span>
        </Link>
      </div>

      {/* fanned card-deck motif */}
      <div className="pointer-events-none absolute right-5 top-1/2 hidden h-[170px] w-[180px] -translate-y-1/2 sm:block">
        <span className="absolute left-10 top-8 h-[140px] w-[110px] rounded-2xl" style={{ background: "var(--ink-surface)", border: "2px solid var(--lilt-lime)", transform: "rotate(-14deg)" }} />
        <span className="absolute left-12 top-5 h-[140px] w-[110px] rounded-2xl" style={{ background: "var(--ink-surface-2)", border: "2px solid #fff", transform: "rotate(-3deg)" }} />
        <span
          className="absolute left-[3.25rem] top-3 flex h-[140px] w-[110px] flex-col items-center justify-center gap-2 rounded-2xl"
          style={{ background: "var(--lilt-violet)", border: "2px solid #fff", transform: "rotate(8deg)" }}
        >
          <span className="text-[11px] font-extrabold tracking-[0.06em]" style={{ color: "var(--lilt-lime)" }}>DUE NOW</span>
          <span className="px-2 text-center font-display text-[20px] font-extrabold text-white">{sample?.item.target ?? "—"}</span>
          <span className="px-2 text-center text-[12px] font-bold" style={{ color: "var(--on-ink-bright)" }}>{sample?.item.english ?? ""}</span>
        </span>
      </div>
    </div>
  );
}

function HeroStat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-display text-[24px] font-extrabold" style={{ color: accent ? "var(--lilt-lime)" : "#fff" }}>{n}</div>
      <div className="text-[12px] font-bold" style={{ color: "var(--on-ink-muted)" }}>{label}</div>
    </div>
  );
}

// ── Practice mode grid ───────────────────────────────────────────────────────

type Tile = { href: string; label: string; desc: string; icon: IconName; shadow: string; tint: string; badge?: string };

function ModeGrid({ lang, reviewsDue, grammarDue, words }: { lang: string; reviewsDue: number; grammarDue: number; words: number }) {
  const f = getLanguage(lang as never).features;
  const tiles: Tile[] = [
    { href: "/review", label: "Spaced review", desc: "Everything due, mixed", icon: "refresh", shadow: "var(--lilt-violet)", tint: "var(--tint-lilac)", badge: `${reviewsDue} due` },
    { href: "/study/flashcards", label: "Flashcards", desc: "Flip & self-rate", icon: "cards", shadow: "var(--lilt-lime)", tint: "var(--tint-lime)" },
    { href: "/study/listening", label: "Listening", desc: "Hear & choose", icon: "headphones", shadow: "var(--lilt-yellow)", tint: "var(--tint-yellow)" },
    { href: "/study/speaking", label: "Speaking", desc: "Say it aloud", icon: "mic", shadow: "var(--lilt-coral)", tint: "var(--tint-coral)" },
  ];
  if (f.cloze || f.order) {
    tiles.push({ href: "/practice", label: "Grammar gym", desc: "Word order · which form", icon: "grammar", shadow: "var(--edge)", tint: "var(--lilt-ink)", badge: grammarDue > 0 ? `${grammarDue} due` : undefined });
  }
  tiles.push({ href: "/glossary", label: "Glossary", desc: "Your word bank", icon: "doc", shadow: "var(--lilt-violet)", tint: "var(--tint-violet-2)", badge: `${words} words` });

  return (
    <div className="mb-8">
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="text-[18px]">Practice your way</h2>
        <Link href="/practice" className="text-[13px] font-extrabold" style={{ color: "var(--accent)" }}>All modes →</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-[16px] p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${t.shadow}` }}
          >
            <span
              className="mb-3 grid h-10 w-10 place-items-center rounded-[11px]"
              style={{ background: t.tint, border: "2px solid var(--edge)", color: t.tint === "var(--lilt-ink)" ? "var(--lilt-lime)" : "var(--ink)" }}
            >
              <Icon name={t.icon} size={21} strokeWidth={1.9} />
            </span>
            <div className="font-display text-[16px] font-extrabold">{t.label}</div>
            <div className="mt-0.5 text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>{t.desc}</div>
            {t.badge && (
              <span className="mt-2.5 inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-extrabold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                {t.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Course strip ─────────────────────────────────────────────────────────────

function CourseStrip({ lessons, store, mounted, langName }: { lessons: Lesson[]; store: ReturnType<typeof useProgress>; mounted: boolean; langName: string }) {
  const rows = lessons.slice(0, 5).map((l) => {
    const ids = l.sections.flatMap((s) => s.items.map((i) => i.id));
    return { lesson: l, ids, pct: mounted ? masteryPercent(store, ids) : 0 };
  });
  const total = lessons.length;
  const done = rows.filter((r) => r.pct >= 100).length;
  // First not-yet-mastered unit (whose predecessor is ≥80%) is "current".
  let currentIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const prevOk = i === 0 || rows[i - 1].pct >= 80;
    if (rows[i].pct < 100 && prevOk) { currentIdx = i; break; }
  }

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="text-[18px]">Your course · {langName}</h2>
        <Link href="/learn" className="text-[13px] font-extrabold" style={{ color: "var(--muted)" }}>
          {mounted ? `${done} of ${total} units` : `${total} units`}
        </Link>
      </div>
      <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
        {rows.map((r, i) => {
          const mastered = r.pct >= 100;
          const current = i === currentIdx;
          const locked = mounted && !mastered && !current && (i > 0 && rows[i - 1].pct < 80);
          return (
            <Link
              key={r.lesson.id}
              href={locked ? "#" : `/lessons/${r.lesson.id}`}
              className="flex items-center gap-4 px-4 py-3.5"
              style={{ borderBottom: i < rows.length - 1 ? "1.5px solid var(--divider)" : undefined, background: current ? "var(--tint-violet)" : undefined, pointerEvents: locked ? "none" : undefined }}
            >
              <span className="w-6 shrink-0 text-center font-display text-[15px] font-extrabold" style={{ color: current ? "var(--accent)" : "var(--text-disabled)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <StatusDot mastered={mastered} current={current} locked={locked} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold" style={{ color: locked ? "var(--text-faint)" : "var(--ink)" }}>{r.lesson.title}</span>
                <span className="block text-[12px] font-bold" style={{ color: current ? "var(--accent)" : "var(--muted)" }}>
                  {!mounted ? "—" : mastered ? `Mastered · ${r.pct}%` : locked ? "Locked · unlocks at 80%" : current ? `In progress · ${r.pct}%` : `${r.pct}%`}
                </span>
              </span>
              {current ? (
                <span className="shrink-0 rounded-full px-4 py-2 text-[13px] font-extrabold" style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}>Continue</span>
              ) : (
                <span className="hidden h-2 w-[120px] shrink-0 overflow-hidden rounded-full sm:block" style={{ background: "var(--track)" }}>
                  <span className="block h-full" style={{ width: `${r.pct}%`, background: mastered ? "var(--lilt-lime)" : "var(--accent)" }} />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatusDot({ mastered, current, locked }: { mastered: boolean; current: boolean; locked: boolean }) {
  if (mastered)
    return (
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]" style={{ background: "var(--lilt-lime)", border: "2px solid var(--edge)", color: "var(--lilt-ink)" }}>
        <Icon name="check" size={16} strokeWidth={3} />
      </span>
    );
  if (current)
    return (
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]" style={{ background: "var(--accent)", border: "2px solid var(--edge)", color: "#fff" }}>
        <Icon name="play" size={14} />
      </span>
    );
  if (locked)
    return (
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]" style={{ background: "var(--tint-violet-2)", border: "2px solid var(--border-dashed)", color: "var(--border-dashed)" }}>
        <Icon name="lock" size={15} strokeWidth={2.4} />
      </span>
    );
  return (
    <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]" style={{ background: "var(--surface)", border: "2px solid var(--border-dashed)", color: "var(--border-dashed)" }}>
      <Icon name="arrow" size={15} strokeWidth={2.4} />
    </span>
  );
}

// ── Right rail ───────────────────────────────────────────────────────────────

function StreakWeek({ stats, streak, mounted }: { stats: ReturnType<typeof useStats>; streak: number; mounted: boolean }) {
  // Monday-start week of today.
  const cells = useMemo(() => {
    if (!mounted) return DAY_LETTERS.map((d) => ({ d, state: "empty" as const }));
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // 0 = Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    return DAY_LETTERS.map((d, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
      const did = (stats.reviewsByDay[key] ?? 0) > 0;
      const isToday = i === dow;
      const future = day.getTime() > now.setHours(0, 0, 0, 0) && !isToday;
      return { d, state: isToday ? ("today" as const) : did ? ("done" as const) : future ? ("future" as const) : ("missed" as const) };
    });
  }, [stats, mounted]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[14px] font-extrabold">This week</span>
        <span className="text-[12px] font-extrabold" style={{ color: "var(--accent)" }}>{mounted ? `${streak}-day streak` : "—"}</span>
      </div>
      <div className="flex gap-1.5">
        {cells.map((c, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className="h-[30px] rounded-[8px]"
              style={
                c.state === "done"
                  ? { background: "var(--lilt-lime)", border: "2px solid var(--edge)" }
                  : c.state === "today"
                    ? { background: "var(--accent)", border: "2px solid var(--edge)" }
                    : { background: "var(--tint-violet-2)", border: "2px dashed var(--border-dashed)" }
              }
            />
            <div className="mt-1 text-[10px] font-extrabold" style={{ color: c.state === "today" ? "var(--ink)" : "var(--muted)" }}>{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadialMastery({ pct, strong, learning, mounted }: { pct: number; strong: number; learning: number; mounted: boolean }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - (mounted ? pct : 0) / 100);
  return (
    <div className="rounded-[16px] p-[18px]" style={{ background: "var(--panel)", border: "2px solid var(--edge)" }}>
      <div className="mb-3.5 text-[14px] font-extrabold">Word mastery</div>
      <div className="flex items-center gap-3.5">
        <div className="relative h-[72px] w-[72px] shrink-0">
          <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
            <circle cx="36" cy="36" r={r} fill="none" stroke="var(--track)" strokeWidth="9" />
            <circle cx="36" cy="36" r={r} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
          </svg>
          <div className="absolute inset-0 grid place-items-center font-display text-[17px] font-extrabold">{mounted ? pct : 0}%</div>
        </div>
        <div className="text-[12.5px] font-bold leading-relaxed" style={{ color: "var(--text-body)" }}>
          <b style={{ color: "var(--ink)" }}>{strong}</b> strong<br />
          <b style={{ color: "var(--ink)" }}>{learning}</b> still learning
        </div>
      </div>
    </div>
  );
}

function TroubleCard({ count }: { count: number }) {
  return (
    <Link
      href="/review?trouble=1"
      className="block rounded-[16px] p-[18px] transition hover:-translate-y-0.5"
      style={{ background: "var(--tint-coral)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-coral)" }}
    >
      <div className="flex items-center gap-2 font-display text-[15px] font-extrabold" style={{ color: "var(--ink)" }}>
        <Icon name="target" size={17} strokeWidth={2.2} /> Trouble words
      </div>
      <div className="mt-1 text-[12.5px] font-bold" style={{ color: "var(--on-coral)" }}>
        {count} word{count === 1 ? "" : "s"} you keep missing
      </div>
      <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold" style={{ color: "var(--signout)" }}>
        Clear them →
      </span>
    </Link>
  );
}

function CirclePeek() {
  return (
    <Link
      href="/circle"
      className="block rounded-[16px] p-[18px]"
      style={{ background: "var(--lilt-lime)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)", color: "var(--lilt-ink)" }}
    >
      <div className="font-display text-[15px] font-extrabold">Your circle</div>
      <div className="mt-1 text-[12.5px] font-bold" style={{ color: "var(--on-lime)" }}>Study with friends — invite yours</div>
      <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold">
        <Icon name="people" size={16} strokeWidth={2} /> Open Circle →
      </span>
    </Link>
  );
}

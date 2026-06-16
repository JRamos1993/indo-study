"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { buildBackup, restoreBackup } from "@/lib/backup";
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
  const mounted = useMounted();

  const allIds = useMemo(
    () => lessons.flatMap((l) => l.sections.flatMap((s) => s.items.map((i) => i.id))),
    [lessons],
  );

  if (!mounted) {
    return (
      <div>
        <Header />
        <div className="card grid h-40 place-items-center" style={{ color: "var(--muted)" }}>Loading…</div>
      </div>
    );
  }

  const overall = summarize(store, allIds);
  const streak = currentStreak(stats);
  const today = todayCount(stats);
  const forecast = reviewForecast(store, allIds, 7);
  const maxF = Math.max(1, ...forecast);
  const dayNames = nextSevenDayLabels();

  return (
    <div>
      <Header />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat big={`${streak}🔥`} label="day streak" />
        <Stat big={`${today}/${dailyGoal}`} label="today's reviews" />
        <Stat big={`${masteryPercent(store, allIds)}%`} label="mastered" />
      </div>

      <div className="card mb-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg">Daily goal</h2>
          <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>
            {today >= dailyGoal ? "Reached 🎉" : `${dailyGoal - today} to go`}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: "var(--paper)", border: "1.5px solid var(--edge)" }}>
          <div
            className="h-full transition-all"
            style={{ width: `${Math.min(100, (today / dailyGoal) * 100)}%`, background: "var(--accent)" }}
          />
        </div>
      </div>

      <div className="card mb-6 p-5">
        <h2 className="mb-4 text-lg">Reviews due — next 7 days</h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
          {forecast.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${(n / maxF) * 100}%`, minHeight: n > 0 ? 4 : 0, background: "var(--accent)", border: n > 0 ? "1.5px solid var(--edge)" : undefined }}
                  title={`${n} due`}
                />
              </div>
              <span className="text-[11px] font-bold" style={{ color: "var(--muted)" }}>{dayNames[i]}</span>
              <span className="text-[11px] font-bold">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-label">By lesson</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const lessonIds = lesson.sections.flatMap((s) => s.items.map((i) => i.id));
          const ls = summarize(store, lessonIds);
          return (
            <div key={lesson.id} className="card p-5">
              <div className="flex items-center justify-between">
                <Link href={`/lessons/${lesson.id}`} className="font-display font-bold">
                  {lesson.title}
                </Link>
                <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>
                  {ls.mastered}/{ls.total} mastered
                </span>
              </div>
              <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--paper)", border: "1.5px solid var(--edge)" }}>
                <Seg n={ls.mastered} total={ls.total} cls="bg-emerald-500" />
                <Seg n={ls.review} total={ls.total} cls="bg-sky-500" />
                <Seg n={ls.learning} total={ls.total} cls="bg-amber-400" />
              </div>
            </div>
          );
        })}
      </div>

      <BackupCard />

      <div className="mt-6">
        <Link href="/guide/pronunciation" className="text-sm font-bold hover:underline" style={{ color: "var(--accent)" }}>
          Pronunciation guide →
        </Link>
      </div>
    </div>
  );
}

function BackupCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const onExport = () => {
    const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `indo-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    const text = await file.text();
    const res = restoreBackup(text);
    if (res.ok) {
      setMsg("Progress restored. Reloading…");
      setTimeout(() => location.reload(), 600);
    } else {
      setMsg(res.error);
    }
  };

  return (
    <div className="card mt-6 p-5">
      <h2 className="text-lg">Backup &amp; move devices</h2>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Progress lives in this browser only. Export a file, then import it on another
        device to carry your streak and mastery across.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={onExport} className="btn btn-primary">
          Export progress
        </button>
        <button onClick={() => fileRef.current?.click()} className="btn btn-secondary">
          Import progress
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImport(f);
            e.target.value = "";
          }}
        />
      </div>
      {msg && <p className="mt-3 text-sm font-bold" style={{ color: "var(--accent)" }}>{msg}</p>}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <Link href="/learn" className="text-sm font-bold" style={{ color: "var(--muted)" }}>
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl">Your progress</h1>
    </div>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="font-display text-2xl font-bold">{big}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

function Seg({ n, total, cls }: { n: number; total: number; cls: string }) {
  if (total === 0 || n === 0) return null;
  return <div className={cls} style={{ width: `${(n / total) * 100}%` }} />;
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

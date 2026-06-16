"use client";

import Link from "next/link";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { resetAllProgress } from "@/lib/progress";
import { type DirectionPref, type ThemePref, updateSettings, useSettings } from "@/lib/settings";
import { resetStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

export default function SettingsPage() {
  const s = useSettings();
  const mounted = useMounted();

  return (
    <div>
      <div className="mb-6">
        <Link href="/learn" className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      {!mounted ? (
        <div className="card grid h-40 place-items-center text-slate-400">Loading…</div>
      ) : (
        <div className="space-y-4">
          <Row label="Study language" hint="Which language you're learning">
            <select
              value={s.studyLanguage}
              onChange={(e) => updateSettings({ studyLanguage: e.target.value as LangId })}
              className={selectCls}
            >
              {LANG_IDS.map((id) => {
                const c = getLanguage(id);
                return (
                  <option key={id} value={id}>
                    {c.flag} {c.name}
                  </option>
                );
              })}
            </select>
          </Row>

          <Row label="Daily goal" hint="Reviews per day for the streak ring">
            <Stepper
              value={s.dailyGoal}
              min={5}
              max={200}
              step={5}
              onChange={(dailyGoal) => updateSettings({ dailyGoal })}
            />
          </Row>

          <Row label="New words / day" hint="Cap on brand-new items in spaced review">
            <Stepper
              value={s.newPerDay}
              min={0}
              max={100}
              step={5}
              onChange={(newPerDay) => updateSettings({ newPerDay })}
            />
          </Row>

          <Row label="Target retention" hint="Higher = more reviews, stronger recall">
            <select
              value={String(s.targetRetention)}
              onChange={(e) => updateSettings({ targetRetention: Number(e.target.value) })}
              className={selectCls}
            >
              {[0.8, 0.85, 0.9, 0.95].map((v) => (
                <option key={v} value={v}>
                  {Math.round(v * 100)}%
                </option>
              ))}
            </select>
          </Row>

          <Row label="Default direction" hint="Which way new cards are quizzed">
            <select
              value={s.defaultDirection}
              onChange={(e) =>
                updateSettings({ defaultDirection: e.target.value as DirectionPref })
              }
              className={selectCls}
            >
              <option value="auto">Auto (mixed)</option>
              <option value="id2en">Indonesian → English</option>
              <option value="en2id">English → Indonesian</option>
            </select>
          </Row>

          <Row label="Theme" hint="Appearance">
            <select
              value={s.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as ThemePref })}
              className={selectCls}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Row>

          <div className="card p-5">
            <h2 className="font-semibold text-rose-700 dark:text-rose-300">Danger zone</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Erase all spaced-repetition progress and stats on this device. Export a backup
              first from the Stats page if you want to keep it.
            </p>
            <button
              onClick={() => {
                if (confirm("Reset ALL progress and stats? This cannot be undone.")) {
                  resetAllProgress();
                  resetStats();
                }
              }}
              className="mt-3 rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              Reset everything
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const selectCls =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900";

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{hint}</div>
      </div>
      {children}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const btn =
    "h-9 w-9 rounded-lg border border-slate-300 text-lg font-semibold hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800";
  return (
    <div className="flex items-center gap-2">
      <button
        className={btn}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        −
      </button>
      <span className="w-10 text-center text-lg font-semibold tabular-nums">{value}</span>
      <button
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        +
      </button>
    </div>
  );
}

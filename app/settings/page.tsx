"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { resetAllProgress } from "@/lib/progress";
import { type DirectionPref, type ThemePref, updateSettings, useSettings } from "@/lib/settings";
import { resetStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

export default function SettingsPage() {
  const s = useSettings();
  const mounted = useMounted();

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-[30px] leading-none">Settings</h1>
        <p className="mt-2 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>
          Tune your learning, appearance, and saved data — all stored on this device.
        </p>
      </header>

      {!mounted ? (
        <div
          className="grid h-40 place-items-center rounded-[18px] text-[14px] font-bold"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--muted)" }}
        >
          Loading…
        </div>
      ) : (
        <div className="space-y-7">
          {/* ── Learning ─────────────────────────────────────────────── */}
          <Section title="Learning" icon="target" shadow="var(--lilt-violet)" tint="var(--tint-lilac)">
            <Row label="Study language" hint="Which language you're learning" last={false}>
              <Select
                value={s.studyLanguage}
                onChange={(e) => updateSettings({ studyLanguage: e.target.value as LangId })}
              >
                {LANG_IDS.map((id) => {
                  const c = getLanguage(id);
                  return (
                    <option key={id} value={id}>
                      {c.flag} {c.name}
                    </option>
                  );
                })}
              </Select>
            </Row>

            <Row label="Daily goal" hint="Reviews per day for the streak ring" last={false}>
              <Stepper
                value={s.dailyGoal}
                min={5}
                max={200}
                step={5}
                onChange={(dailyGoal) => updateSettings({ dailyGoal })}
              />
            </Row>

            <Row label="New words / day" hint="Cap on brand-new items in spaced review" last={false}>
              <Stepper
                value={s.newPerDay}
                min={0}
                max={100}
                step={5}
                onChange={(newPerDay) => updateSettings({ newPerDay })}
              />
            </Row>

            <Row label="Target retention" hint="Higher = more reviews, stronger recall" last={false}>
              <Select
                value={String(s.targetRetention)}
                onChange={(e) => updateSettings({ targetRetention: Number(e.target.value) })}
              >
                {[0.8, 0.85, 0.9, 0.95].map((v) => (
                  <option key={v} value={v}>
                    {Math.round(v * 100)}%
                  </option>
                ))}
              </Select>
            </Row>

            <Row label="Default direction" hint="Which way new cards are quizzed" last>
              <Select
                value={s.defaultDirection}
                onChange={(e) => updateSettings({ defaultDirection: e.target.value as DirectionPref })}
              >
                <option value="auto">Auto (mixed)</option>
                <option value="id2en">{getLanguage(s.studyLanguage).name} → English</option>
                <option value="en2id">English → {getLanguage(s.studyLanguage).name}</option>
              </Select>
            </Row>
          </Section>

          {/* ── Appearance ───────────────────────────────────────────── */}
          <Section title="Appearance" icon="sun" shadow="var(--lilt-yellow)" tint="var(--tint-yellow)">
            <Row label="Theme" hint="Light, dark, or follow your system" last>
              <Select
                value={s.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as ThemePref })}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </Row>
          </Section>

          {/* ── Data ─────────────────────────────────────────────────── */}
          <Section title="Data" icon="refresh" shadow="var(--lilt-coral)" tint="var(--tint-coral)">
            <div className="px-5 py-5">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
                style={{ background: "var(--lilt-coral)", color: "#fff" }}
              >
                <Icon name="refresh" size={13} strokeWidth={2.6} /> Danger zone
              </div>
              <p className="mt-3 text-[13.5px] font-bold leading-relaxed" style={{ color: "var(--text-body)" }}>
                Erase all spaced-repetition progress and stats on this device. Export a backup first
                from the Stats page if you want to keep it.
              </p>
              <button
                onClick={() => {
                  if (confirm("Reset ALL progress and stats? This cannot be undone.")) {
                    resetAllProgress();
                    resetStats();
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-extrabold transition active:translate-x-[1px] active:translate-y-[1px]"
                style={{
                  background: "var(--lilt-coral)",
                  color: "#fff",
                  border: "2px solid var(--edge)",
                  boxShadow: "3px 3px 0 0 var(--edge)",
                }}
              >
                <Icon name="refresh" size={16} strokeWidth={2.4} /> Reset everything
              </button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

// ── Section sticker card ───────────────────────────────────────────────────────

function Section({
  title,
  icon,
  shadow,
  tint,
  children,
}: {
  title: string;
  icon: IconName;
  shadow: string;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-[11px]"
          style={{ background: tint, border: "2px solid var(--edge)", color: "var(--ink)" }}
        >
          <Icon name={icon} size={19} strokeWidth={1.9} />
        </span>
        <h2 className="text-[18px]">{title}</h2>
      </div>
      <div
        className="overflow-hidden rounded-[18px]"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `4px 4px 0 0 ${shadow}` }}
      >
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  hint,
  last,
  children,
}: {
  label: string;
  hint: string;
  last: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
      style={{ borderBottom: last ? undefined : "1.5px solid var(--divider)" }}
    >
      <div className="min-w-0">
        <div className="font-display text-[15px] font-extrabold">{label}</div>
        <div className="mt-0.5 text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
          {hint}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Controls ───────────────────────────────────────────────────────────────────

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="shrink-0 rounded-full px-4 py-2 text-[13.5px] font-extrabold outline-none"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
    >
      {children}
    </select>
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
    "grid h-9 w-9 place-items-center rounded-full text-xl font-extrabold transition active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40";
  const btnStyle = { background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" };
  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-full px-1.5 py-1"
      style={{ background: "var(--tint-violet)", border: "2px solid var(--edge)" }}
    >
      <button
        className={btn}
        style={btnStyle}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-10 text-center font-display text-[17px] font-extrabold tabular-nums">{value}</span>
      <button
        className={btn}
        style={btnStyle}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

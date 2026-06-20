"use client";

import { useEffect, useState } from "react";
import { BackupCard } from "@/components/BackupCard";
import { Dropdown } from "@/components/Dropdown";
import { Icon, type IconName } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import { type ProInfo, fetchPro, startCheckout } from "@/lib/billing";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { resetAllProgress } from "@/lib/progress";
import { disablePush, enablePush, getReminderHour, isPushOn, pushSupported, setReminderHour, testPush } from "@/lib/push";
import {
  type DirectionPref,
  type LearningFocus,
  type ThemePref,
  goalCardsForMinutes,
  updateSettings,
  useSettings,
} from "@/lib/settings";

const FOCUS_LABELS: Record<LearningFocus, string> = {
  balanced: "Balanced mix",
  conversation: "Conversation",
  reading: "Reading & vocab",
  grammar: "Grammar & structure",
};
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
          Tune your learning, appearance and privacy — synced across your devices.
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
          {/* ── Lilt Pro ─────────────────────────────────────────────── */}
          <ProSection />

          {/* ── Learning ─────────────────────────────────────────────── */}
          <Section title="Learning" icon="target" shadow="var(--lilt-violet)" tint="var(--tint-lilac)">
            <Row label="Study language" hint="Which language you're learning" last={false}>
              <Dropdown
                ariaLabel="Study language"
                value={s.studyLanguage}
                options={LANG_IDS.map((id) => ({ value: id, label: `${getLanguage(id).flag} ${getLanguage(id).name}` }))}
                onChange={(v) => updateSettings({ studyLanguage: v as LangId })}
              />
            </Row>

            <Row label="Daily goal" hint={`Minutes a day — about ${goalCardsForMinutes(s.dailyGoalMinutes)} reviews`} last={false}>
              <Stepper
                value={s.dailyGoalMinutes}
                min={5}
                max={60}
                step={5}
                suffix="min"
                onChange={(m) => updateSettings({ dailyGoalMinutes: m })}
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
              <Dropdown
                ariaLabel="Target retention"
                value={String(s.targetRetention)}
                options={[0.8, 0.85, 0.9, 0.95].map((v) => ({ value: String(v), label: `${Math.round(v * 100)}%` }))}
                onChange={(v) => updateSettings({ targetRetention: Number(v) })}
                menuWidth={120}
              />
            </Row>

            <Row label="Default direction" hint="Which way new cards are quizzed" last={false}>
              <Dropdown
                ariaLabel="Default direction"
                value={s.defaultDirection}
                options={[
                  { value: "auto", label: "Auto (mixed)" },
                  { value: "id2en", label: `${getLanguage(s.studyLanguage).name} → English` },
                  { value: "en2id", label: `English → ${getLanguage(s.studyLanguage).name}` },
                ]}
                onChange={(v) => updateSettings({ defaultDirection: v as DirectionPref })}
                menuWidth={210}
              />
            </Row>

            <Row label="Focus" hint="Biases your daily mix of exercise types" last>
              <Dropdown
                ariaLabel="Learning focus"
                value={s.learningFocus}
                options={(Object.keys(FOCUS_LABELS) as LearningFocus[]).map((f) => ({ value: f, label: FOCUS_LABELS[f] }))}
                onChange={(v) => updateSettings({ learningFocus: v as LearningFocus })}
                menuWidth={196}
              />
            </Row>
          </Section>

          {/* ── Appearance ───────────────────────────────────────────── */}
          <Section title="Appearance" icon="sun" shadow="var(--lilt-yellow)" tint="var(--tint-yellow)">
            <Row label="Theme" hint="Light, dark, or follow your system" last>
              <Dropdown
                ariaLabel="Theme"
                value={s.theme}
                options={[
                  { value: "system", label: "System" },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
                onChange={(v) => updateSettings({ theme: v as ThemePref })}
                menuWidth={130}
              />
            </Row>
          </Section>

          {/* ── Notifications ────────────────────────────────────────── */}
          <Section title="Notifications" icon="flame" shadow="var(--lilt-coral)" tint="var(--tint-coral)">
            <Row label="Daily review reminders" hint="A nudge when reviews are due (this device)" last={false}>
              <ReminderToggle />
            </Row>
            <Row label="Reminder time" hint="When to nudge you, in your local time" last>
              <ReminderTimePicker />
            </Row>
          </Section>

          {/* ── Privacy ──────────────────────────────────────────────── */}
          <Section title="Privacy" icon="people" shadow="var(--lilt-violet)" tint="var(--tint-lilac)">
            <Row label="Share activity with your Circle" hint="Show your daily review count to circle members" last>
              <Toggle on={s.shareActivity} onChange={(shareActivity) => updateSettings({ shareActivity })} />
            </Row>
          </Section>

          {/* ── Backup ───────────────────────────────────────────────── */}
          <BackupCard />

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
                (in the Backup section above) if you want to keep it.
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

// ── Lilt Pro ────────────────────────────────────────────────────────────────

function ProSection() {
  const { user } = useAuth();
  const [info, setInfo] = useState<ProInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    fetchPro().then(setInfo);
  }, []);
  const isPro = !!(user?.isPro || info?.pro);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-[11px]"
          style={{ background: "var(--tint-lime)", border: "2px solid var(--edge)", color: "var(--ink)" }}
        >
          <Icon name="star" size={19} strokeWidth={1.9} />
        </span>
        <h2 className="text-[18px]">Lilt Pro</h2>
      </div>
      <div
        className="rounded-[18px] p-5"
        style={{
          background: isPro ? "var(--lilt-lime)" : "var(--lilt-ink)",
          color: isPro ? "var(--lilt-ink)" : "#fff",
          border: "2px solid var(--edge)",
          boxShadow: "4px 4px 0 0 var(--lilt-violet)",
        }}
      >
        {isPro ? (
          <p className="text-[14px] font-bold">✨ You’re on Lilt Pro — unlimited AI conversations. Thank you for supporting Lilt!</p>
        ) : (
          <>
            <div className="font-display text-[19px] font-extrabold">Unlimited AI conversations</div>
            <p className="mt-1.5 text-[13.5px] font-semibold" style={{ color: "var(--on-ink)" }}>
              Practise with the AI tutor as much as you like. Free includes a few chats a day.
            </p>
            {info?.available ? (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setErr(null);
                  const r = await startCheckout();
                  if (!r.ok) {
                    setBusy(false);
                    setErr("Couldn’t start checkout — try again.");
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5 disabled:opacity-50"
                style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}
              >
                {busy ? "Starting…" : `Upgrade — ${info.priceLabel}`}
              </button>
            ) : (
              <p className="mt-3 text-[12.5px] font-bold" style={{ color: "var(--on-ink-muted)" }}>
                Pro is coming soon.
              </p>
            )}
            {err && <p className="mt-2 text-[12px] font-bold" style={{ color: "var(--lilt-coral)" }}>{err}</p>}
          </>
        )}
      </div>
    </section>
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

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative h-8 w-[52px] shrink-0 rounded-full transition-colors"
      style={{ background: on ? "var(--lilt-lime)" : "var(--track)", border: "2px solid var(--edge)" }}
    >
      <span
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all"
        style={{ left: on ? "26px" : "2px", background: on ? "var(--lilt-ink)" : "var(--surface)", border: "2px solid var(--edge)" }}
      />
    </button>
  );
}

function ReminderToggle() {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setSupported(pushSupported());
    isPushOn().then(setOn);
  }, []);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      if (on) {
        await disablePush();
        setOn(false);
      } else {
        const r = await enablePush();
        if (r.ok) setOn(true);
        else
          setMsg(
            r.error === "denied"
              ? "Allow notifications in your browser, then try again."
              : r.error === "not_configured"
                ? "Reminders aren’t set up yet — check back soon."
                : "Couldn’t enable — try again.",
          );
      }
    } finally {
      setBusy(false);
    }
  };

  if (!supported) {
    return (
      <span className="text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
        Not supported here
      </span>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1.5">
      <Toggle on={on} onChange={() => toggle()} />
      {on && (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setMsg(null);
            const r = await testPush();
            setMsg(
              r.ok
                ? "Sent! Check your device."
                : r.error === "not_configured"
                  ? "Reminders aren’t fully set up yet."
                  : r.error === "no_subscription"
                    ? "Re-toggle reminders, then try again."
                    : "Couldn’t send — try again.",
            );
            setBusy(false);
          }}
          className="text-[11px] font-extrabold underline disabled:opacity-50"
          style={{ color: "var(--accent)" }}
        >
          {busy ? "Sending…" : "Send a test"}
        </button>
      )}
      {msg && (
        <span className="max-w-[190px] text-right text-[11px] font-bold" style={{ color: msg.startsWith("Sent") ? "var(--accent)" : "var(--lilt-coral)" }}>
          {msg}
        </span>
      )}
    </div>
  );
}

const REMINDER_HOURS = [7, 8, 9, 12, 17, 18, 19, 20, 21, 22];
function fmtHour(h: number): string {
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ampm}`;
}
function ReminderTimePicker() {
  const [hour, setHour] = useState(19);
  useEffect(() => setHour(getReminderHour()), []);
  return (
    <Dropdown
      ariaLabel="Reminder time"
      value={String(hour)}
      options={REMINDER_HOURS.map((h) => ({ value: String(h), label: fmtHour(h) }))}
      onChange={(v) => {
        const h = Number(v);
        setHour(h);
        void setReminderHour(h);
      }}
      menuWidth={130}
    />
  );
}

function Stepper({
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
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
      <span className="min-w-[2.5rem] text-center font-display text-[17px] font-extrabold tabular-nums">
        {value}
        {suffix && <span className="ml-0.5 text-[12px] font-bold" style={{ color: "var(--muted)" }}>{suffix}</span>}
      </span>
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

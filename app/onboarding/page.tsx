"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Icon } from "@/components/Icon";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { type LearningFocus, updateSettings } from "@/lib/settings";

const GOALS = [
  { min: 5, cards: 10, label: "Casual", desc: "5 min a day" },
  { min: 10, cards: 20, label: "Regular", desc: "10 min a day" },
  { min: 15, cards: 30, label: "Serious", desc: "15 min a day" },
  { min: 30, cards: 60, label: "Intense", desc: "30 min a day" },
];

const FOCI: { value: LearningFocus; label: string; desc: string; icon: string }[] = [
  { value: "balanced", label: "Balanced", desc: "A bit of everything", icon: "🎯" },
  { value: "conversation", label: "Conversation", desc: "Listening & speaking", icon: "💬" },
  { value: "reading", label: "Reading", desc: "Recognition & vocab", icon: "📖" },
  { value: "grammar", label: "Grammar", desc: "Sentence structure", icon: "🧩" },
];

const STEPS = ["Language", "Daily goal", "Focus", "Ready"];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 130 130" className="h-9 w-9" aria-hidden>
        <path
          d="M26 24 h66 a18 18 0 0 1 18 18 v36 a18 18 0 0 1 -18 18 h-30 l-16 18 v-18 h-20 a18 18 0 0 1 -18 -18 v-36 a18 18 0 0 1 18 -18 z"
          fill="var(--lilt-yellow)"
          stroke="var(--edge)"
          strokeWidth="7"
        />
      </svg>
      <span className="font-display text-[24px] font-extrabold tracking-tight">Lilt</span>
    </span>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const presetLang = params.get("lang");
  const initialLang =
    presetLang && (LANG_IDS as string[]).includes(presetLang) ? (presetLang as LangId) : null;

  const [step, setStep] = useState(initialLang ? 1 : 0);
  const [lang, setLang] = useState<LangId | null>(initialLang);
  const [goal, setGoal] = useState(1); // default: Regular (10 min)
  const [focus, setFocus] = useState<LearningFocus>("balanced");

  const finish = () => {
    updateSettings({
      ...(lang ? { studyLanguage: lang } : {}),
      dailyGoal: GOALS[goal].cards,
      dailyGoalMinutes: GOALS[goal].min,
      learningFocus: focus,
    });
    router.push("/today");
  };

  const canNext = step !== 0 || lang !== null;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[540px] flex-col px-5 py-7">
      {/* Header + progress */}
      <div className="mb-7 flex items-center justify-between">
        <Logo />
        <Link href="/today" className="text-[12.5px] font-extrabold" style={{ color: "var(--muted)" }}>
          Skip →
        </Link>
      </div>
      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className="h-2 flex-1 rounded-full transition-colors"
            style={{
              background: i <= step ? "var(--accent)" : "var(--track)",
              border: "1.5px solid var(--edge)",
            }}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <Step title="What do you want to learn?" sub="Pick your first language — you can switch any time.">
            <div className="grid gap-3">
              {LANG_IDS.map((id) => {
                const c = getLanguage(id);
                const active = lang === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLang(id)}
                    className="flex items-center gap-4 rounded-[16px] p-4 text-left transition active:translate-x-[1px] active:translate-y-[1px]"
                    style={{
                      background: active ? "var(--tint-violet)" : "var(--surface)",
                      border: "2px solid var(--edge)",
                      boxShadow: active ? "4px 4px 0 0 var(--lilt-violet)" : "3px 3px 0 0 var(--edge)",
                    }}
                  >
                    <span className="text-[30px]" aria-hidden>{c.flag}</span>
                    <span className="flex-1">
                      <span className="block font-display text-[18px] font-extrabold">{c.name}</span>
                      <span className="block text-[13px] font-bold" style={{ color: "var(--muted)" }}>
                        {c.nativeName}
                      </span>
                    </span>
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full"
                      style={{
                        border: "2px solid var(--edge)",
                        background: active ? "var(--accent)" : "transparent",
                        color: "#fff",
                      }}
                    >
                      {active && <Icon name="check" size={14} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="Pick a daily goal" sub="A little every day beats a lot once in a while.">
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((g, i) => {
                const active = goal === i;
                return (
                  <button
                    key={g.min}
                    onClick={() => setGoal(i)}
                    className="rounded-[16px] p-4 text-left transition active:translate-x-[1px] active:translate-y-[1px]"
                    style={{
                      background: active ? "var(--tint-violet)" : "var(--surface)",
                      border: "2px solid var(--edge)",
                      boxShadow: active ? "4px 4px 0 0 var(--lilt-violet)" : "3px 3px 0 0 var(--edge)",
                    }}
                  >
                    <div className="font-display text-[22px] font-extrabold">{g.min}<span className="text-[13px] font-bold" style={{ color: "var(--muted)" }}> min</span></div>
                    <div className="mt-0.5 font-display text-[15px] font-extrabold">{g.label}</div>
                    <div className="text-[12px] font-bold" style={{ color: "var(--muted)" }}>{g.desc}</div>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="How do you want to focus?" sub="We'll weight your daily mix toward this. Change it any time in Settings.">
            <div className="grid grid-cols-2 gap-3">
              {FOCI.map((f) => {
                const active = focus === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFocus(f.value)}
                    className="rounded-[16px] p-4 text-left transition active:translate-x-[1px] active:translate-y-[1px]"
                    style={{
                      background: active ? "var(--tint-violet)" : "var(--surface)",
                      border: "2px solid var(--edge)",
                      boxShadow: active ? "4px 4px 0 0 var(--lilt-violet)" : "3px 3px 0 0 var(--edge)",
                    }}
                  >
                    <div className="text-[24px]" aria-hidden>{f.icon}</div>
                    <div className="mt-1 font-display text-[15px] font-extrabold">{f.label}</div>
                    <div className="text-[12px] font-bold" style={{ color: "var(--muted)" }}>{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="You’re all set!" sub="Your first smart-mix session is ready whenever you are.">
            <div
              className="rounded-[18px] p-5"
              style={{ background: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)", color: "#fff" }}
            >
              <Summary label="Language" value={lang ? `${getLanguage(lang).flag} ${getLanguage(lang).name}` : "Not set"} />
              <div className="my-3 h-0.5" style={{ background: "#332b52" }} />
              <Summary label="Daily goal" value={`${GOALS[goal].min} min · ~${GOALS[goal].cards} cards`} />
              <div className="my-3 h-0.5" style={{ background: "#332b52" }} />
              <Summary label="Focus" value={FOCI.find((f) => f.value === focus)?.label ?? "Balanced"} />
            </div>
          </Step>
        )}
      </div>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full px-5 py-3 text-[14px] font-extrabold transition"
            style={{ background: "var(--surface)", color: "var(--ink)", border: "2px solid var(--edge)" }}
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            onClick={() => canNext && setStep((s) => s + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5 disabled:opacity-40"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
          >
            Continue <Icon name="arrow" size={16} strokeWidth={2.4} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5"
            style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
          >
            Start learning <Icon name="arrow" size={16} strokeWidth={2.4} />
          </button>
        )}
      </div>
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-[26px] leading-tight">{title}</h1>
      <p className="mb-6 mt-1.5 text-[14px] font-bold" style={{ color: "var(--muted)" }}>{sub}</p>
      {children}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.04em]" style={{ color: "#b8b0da" }}>{label}</span>
      <span className="font-display text-[15px] font-extrabold text-white">{value}</span>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  );
}

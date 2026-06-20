"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { LANGUAGES, type LangId } from "@/lib/languages";
import { updateSettings } from "@/lib/settings";

const FEATURES: { icon: IconName; title: string; body: string; tint: string; shadow: string }[] = [
  { icon: "kana", title: "Kana & kanji", body: "Drill hiragana, katakana and the core N5 kanji until they stick.", tint: "var(--tint-violet)", shadow: "var(--lilt-violet)" },
  { icon: "refresh", title: "Spaced repetition", body: "An FSRS scheduler resurfaces each card right before you forget it.", tint: "var(--tint-lime)", shadow: "var(--lilt-lime)" },
  { icon: "headphones", title: "Listen & speak", body: "Native-style audio on every word, plus listening and speaking drills.", tint: "var(--tint-yellow)", shadow: "var(--lilt-yellow)" },
  { icon: "people", title: "Yours, synced", body: "Your streak and mastery follow you to any device — and you can study in a Circle.", tint: "var(--tint-coral)", shadow: "var(--lilt-coral)" },
];

const STEPS = [
  { n: "01", title: "Create your account", body: "Free, takes about 20 seconds." },
  { n: "02", title: "Pick a language", body: "Japanese or Indonesian — switch any time." },
  { n: "03", title: "Study in short bursts", body: "A one-tap daily mix of due, tricky and new." },
];


export default function Landing() {
  const router = useRouter();
  const { user } = useAuth();
  const start = (l: LangId) => {
    updateSettings({ studyLanguage: l });
    router.push(user ? "/today" : "/signin");
  };

  return (
    <div className="min-h-[100dvh]">
      {/* Public header — no app chrome on the marketing page */}
      <header
        className="sticky top-0 z-20 backdrop-blur-xl"
        style={{ borderBottom: "2px solid var(--edge)", background: "color-mix(in srgb, var(--paper) 82%, transparent)" }}
      >
        <div className="mx-auto flex max-w-[980px] items-center justify-between gap-2 px-5 py-3">
          <Link href="/" aria-label="Lilt"><Logo /></Link>
          <Link href={user ? "/today" : "/signin"} className="btn btn-primary px-4 py-2 text-sm">
            {user ? "Continue" : "Sign in"}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[980px] px-5 pb-16 pt-7">
        {/* Hero */}
        <section
          className="relative overflow-hidden rounded-[22px] p-6 sm:p-9"
          style={{ background: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)", color: "#fff" }}
        >
          <div className="relative z-10 max-w-xl">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
              style={{ background: "var(--lilt-violet)", color: "#fff" }}
            >
              Indonesian · 日本語
            </span>
            <h1 className="mt-4 font-display text-[44px] leading-[0.98] text-white sm:text-[60px]">
              Study smarter,
              <br />
              <span style={{ color: "var(--lilt-lime)" }}>not longer.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] font-medium" style={{ color: "var(--on-ink)" }}>
              A bold little app for beginner Japanese and Indonesian — kana, kanji and the words you
              actually use, on a memory schedule that does the remembering for you.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => start("ja")}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5"
                style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--lilt-lime)" }}
              >
                {LANGUAGES.ja.flag} Start Japanese
              </button>
              <button
                onClick={() => start("id")}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5"
                style={{ background: "transparent", color: "#fff", border: "2px solid #fff" }}
              >
                {LANGUAGES.id.flag} Start Indonesian
              </button>
            </div>
            <p className="mt-3.5 text-[12.5px] font-bold" style={{ color: "var(--on-ink-muted)" }}>
              Free account · syncs across your devices
            </p>
          </div>

          {/* fanned card-deck motif */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden h-[190px] w-[200px] -translate-y-1/2 lg:block">
            <span className="absolute left-10 top-9 h-[150px] w-[120px] rounded-2xl" style={{ background: "var(--ink-surface)", border: "2px solid var(--lilt-lime)", transform: "rotate(-14deg)" }} />
            <span className="absolute left-12 top-6 h-[150px] w-[120px] rounded-2xl" style={{ background: "var(--ink-surface-2)", border: "2px solid #fff", transform: "rotate(-3deg)" }} />
            <span
              className="absolute left-14 top-3 flex h-[150px] w-[120px] flex-col items-center justify-center gap-2 rounded-2xl"
              style={{ background: "var(--lilt-violet)", border: "2px solid #fff", transform: "rotate(8deg)" }}
            >
              <span className="text-[11px] font-extrabold tracking-[0.06em]" style={{ color: "var(--lilt-lime)" }}>LILT</span>
              <span className="px-2 text-center font-display text-[22px] font-extrabold text-white">こんにちは</span>
              <span className="px-2 text-center text-[12px] font-bold" style={{ color: "var(--on-ink-bright)" }}>hello</span>
            </span>
          </div>
        </section>

        {/* Stat strip */}
        <section className="mt-7 grid grid-cols-3 gap-3">
          {[
            { big: "1,200+", small: "words & characters", shadow: "var(--lilt-violet)" },
            { big: "2", small: "languages", shadow: "var(--lilt-lime)" },
            { big: "9", small: "ways to practise", shadow: "var(--lilt-yellow)" },
          ].map((s) => (
            <div
              key={s.small}
              className="rounded-[16px] p-4 text-center"
              style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${s.shadow}` }}
            >
              <div className="font-display text-[26px] font-extrabold" style={{ color: "var(--accent)" }}>
                {s.big}
              </div>
              <div className="mt-0.5 text-[12px] font-bold" style={{ color: "var(--muted)" }}>
                {s.small}
              </div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="mt-12">
          <h2 className="section-label">What&apos;s inside</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((ft) => (
              <div
                key={ft.title}
                className="rounded-[18px] p-5 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${ft.shadow}` }}
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-[12px]"
                  style={{ border: "2px solid var(--edge)", background: ft.tint, color: "var(--ink)" }}
                >
                  <Icon name={ft.icon} size={22} strokeWidth={1.9} />
                </span>
                <h3 className="mt-3.5 font-display text-[17px] font-extrabold">{ft.title}</h3>
                <p className="mt-1 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>
                  {ft.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="section-label">How it works</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-[18px] p-5"
                style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
              >
                <div className="font-display text-[34px] font-extrabold" style={{ color: "var(--lilt-lime)", WebkitTextStroke: "1.5px var(--edge)" }}>
                  {s.n}
                </div>
                <h3 className="mt-2 font-display text-[16px] font-extrabold">{s.title}</h3>
                <p className="mt-1 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-12 overflow-hidden rounded-[22px] p-8 text-center"
          style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--edge)" }}
        >
          <h2 className="font-display text-[28px] font-extrabold" style={{ color: "var(--lilt-ink)" }}>
            Ready in 60 seconds.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[14px] font-bold" style={{ color: "var(--on-lime)" }}>
            Create your free account, pick a language, and do your first session.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={user ? "/today" : "/signin"}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5"
              style={{ background: "var(--lilt-ink)", color: "#fff", border: "2px solid var(--edge)" }}
            >
              {user ? "Open the app" : "Get started"}
              <Icon name="arrow" size={16} strokeWidth={2.4} />
            </Link>
          </div>
        </section>

        <footer
          className="mt-10 flex flex-wrap items-center justify-between gap-2 pt-6 text-[12.5px] font-bold"
          style={{ borderTop: "2px solid var(--edge)", color: "var(--muted)" }}
        >
          <span>
            <b className="font-display" style={{ color: "var(--ink)" }}>Lilt</b> · a personal language-learning app.
          </span>
          <span>Indonesian · 日本語</span>
        </footer>
      </div>
    </div>
  );
}

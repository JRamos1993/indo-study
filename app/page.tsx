"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { LANGUAGES, type LangId } from "@/lib/languages";
import { updateSettings } from "@/lib/settings";

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: "kana", title: "Kana & kanji", body: "Drill hiragana, katakana and the core N5 kanji until they stick." },
  { icon: "refresh", title: "Spaced repetition", body: "An FSRS scheduler resurfaces each card right before you forget it." },
  { icon: "headphones", title: "Listen & speak", body: "Native-style audio on every word, plus listening and speaking drills." },
  { icon: "bolt", title: "Works offline", body: "Installable as an app. Your progress lives on your device — no account." },
];

const STEPS = [
  { n: "01", title: "Pick a language", body: "Japanese or Indonesian — switch any time." },
  { n: "02", title: "Study in short bursts", body: "A one-tap daily mix of due, tricky and new." },
  { n: "03", title: "Review what slips", body: "Forgotten words come back automatically." },
];

export default function Landing() {
  const router = useRouter();
  const start = (l: LangId) => {
    updateSettings({ studyLanguage: l });
    router.push("/learn");
  };

  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="pt-6">
        <p className="eyebrow">Indonesian · 日本語</p>
        <h1 className="mt-3 text-[44px] leading-[0.98] sm:text-[56px]">
          Study smarter,
          <br />
          <span style={{ color: "var(--accent)" }}>not longer.</span>
        </h1>
        <p className="mt-4 max-w-md text-base" style={{ color: "var(--muted)" }}>
          A bold little app for beginner Japanese and Indonesian — kana, kanji and the words you
          actually use, on a memory schedule that does the remembering for you.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => start("ja")} className="btn btn-primary px-5 py-3 text-base">
            {LANGUAGES.ja.flag} Start Japanese
          </button>
          <button onClick={() => start("id")} className="btn btn-secondary px-5 py-3 text-base">
            {LANGUAGES.id.flag} Start Indonesian
          </button>
        </div>
        <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
          Free · no sign-up · works offline
        </p>
      </section>

      {/* Stat strip */}
      <section className="mt-10 grid grid-cols-3 gap-3">
        {[
          { big: "1,200+", small: "words & characters" },
          { big: "2", small: "languages" },
          { big: "9", small: "ways to practise" },
        ].map((s) => (
          <div key={s.small} className="card p-4 text-center">
            <div className="font-display text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {s.big}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
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
            <div key={ft.title} className="card p-5">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ border: "2px solid var(--edge)", background: "var(--pop)", color: "#14151a" }}
              >
                <Icon name={ft.icon} size={22} />
              </span>
              <h3 className="mt-3 text-lg">{ft.title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {ft.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Organised by level + topic */}
      <section className="mt-12">
        <h2 className="section-label">Organised so you always know what&apos;s next</h2>
        <div className="card p-5">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Browse your course by <b style={{ color: "var(--ink)" }}>level</b> (Starter → Building →
            Elementary) or by <b style={{ color: "var(--ink)" }}>topic</b> — writing system,
            everyday vocabulary, kanji, grammar and more.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Starter", "Building", "Elementary", "Writing system", "Everyday", "Kanji", "Grammar"].map(
              (t, i) => (
                <span
                  key={t}
                  className="chip"
                  style={
                    i < 3
                      ? { background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)" }
                      : { border: "2px solid var(--edge)", color: "var(--ink)" }
                  }
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="section-label">How it works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-5">
              <div className="font-display text-3xl font-bold" style={{ color: "var(--pop)", WebkitTextStroke: "1px var(--edge)" }}>
                {s.n}
              </div>
              <h3 className="mt-2 text-base">{s.title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mt-12 rounded-2xl p-7 text-center"
        style={{ background: "var(--ink)", color: "var(--paper)", border: "2px solid var(--edge)", boxShadow: "6px 6px 0 0 var(--accent)" }}
      >
        <h2 className="text-2xl" style={{ color: "var(--paper)" }}>
          Ready in 60 seconds.
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm" style={{ opacity: 0.8 }}>
          Open the app, pick a language, do your first session. No account, nothing to install.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/learn" className="btn px-6 py-3 text-base" style={{ background: "var(--pop)", color: "#14151a", borderColor: "var(--paper)" }}>
            Open the app
          </Link>
        </div>
      </section>

      <footer className="mt-10 pt-6 text-xs" style={{ borderTop: "2px solid var(--edge)", color: "var(--muted)" }}>
        Lingo Study · a personal language-learning app.
      </footer>
    </div>
  );
}

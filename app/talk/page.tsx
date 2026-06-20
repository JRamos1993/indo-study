"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/analytics";
import { type ChatMsg, type Scenario, SCENARIOS, aiChat, parseReply } from "@/lib/ai";
import { getLanguage } from "@/lib/languages";
import { useSettings } from "@/lib/settings";

function speak(text: string, speechLang: string) {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang;
    u.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export default function TalkPage() {
  const lang = useSettings().studyLanguage;
  const cfg = getLanguage(lang);
  const scenarios = SCENARIOS[lang] ?? SCENARIOS.id;
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const run = async (s: Scenario, history: ChatMsg[]) => {
    setMsgs(history);
    setBusy(true);
    setError(null);
    const res = await aiChat(lang, s.prompt, history);
    setBusy(false);
    if (res.ok && res.reply) {
      setMsgs([...history, { role: "assistant", content: res.reply }]);
    } else {
      setError(
        res.error === "rate_limited"
          ? "You've practised a lot today — take a break and come back soon."
          : res.error === "ai_unavailable"
            ? "The tutor is having a moment. Try again shortly."
            : "Couldn't reach the tutor — check your connection.",
      );
    }
  };

  const start = (s: Scenario) => {
    track("ai_chat_start", { scenario: s.id });
    setScenario(s);
    run(s, [{ role: "user", content: s.opener }]);
  };

  const onSend = () => {
    const text = input.trim();
    if (!text || busy || !scenario) return;
    setInput("");
    run(scenario, [...msgs, { role: "user", content: text }]);
  };

  // ── scenario picker ──
  if (!scenario) {
    return (
      <div>
        <header className="mb-6">
          <span className="eyebrow">{cfg.name} · conversation</span>
          <h1 className="mt-1.5 text-[30px] leading-none">Talk</h1>
          <p className="mt-2 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
            Have a real chat at your level. Pick a situation — your tutor stays in character, keeps it
            simple, and nudges you when you slip.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => start(s)}
              className="flex flex-col items-start rounded-[16px] p-4 text-left transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${["var(--lilt-violet)", "var(--lilt-lime)", "var(--lilt-yellow)", "var(--lilt-coral)"][i % 4]}` }}
            >
              <span className="text-[26px]" aria-hidden>{s.emoji}</span>
              <span className="mt-2 font-display text-[15px] font-extrabold leading-tight">{s.label}</span>
              <span className="mt-0.5 text-[12px] font-bold" style={{ color: "var(--muted)" }}>{s.blurb}</span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-[11.5px] font-bold" style={{ color: "var(--text-disabled)" }}>
          Practice conversations are AI-generated to help you rehearse — they can occasionally slip,
          so trust your lessons for the final word.
        </p>
      </div>
    );
  }

  // ── chat ──
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[640px] flex-col">
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[22px]" aria-hidden>{scenario.emoji}</span>
          <div>
            <div className="font-display text-[17px] font-extrabold leading-none">{scenario.label}</div>
            <div className="text-[12px] font-bold" style={{ color: "var(--muted)" }}>{cfg.name}</div>
          </div>
        </div>
        <button
          onClick={() => {
            setScenario(null);
            setMsgs([]);
            setError(null);
          }}
          className="rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
        >
          New chat
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto py-2">
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[80%] rounded-[16px] rounded-br-[4px] px-4 py-2.5 text-[14px] font-semibold"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)" }}
              >
                {m.content}
              </div>
            </div>
          ) : (
            <AssistantBubble key={i} text={m.content} speechLang={cfg.speechLang} />
          ),
        )}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-[16px] rounded-bl-[4px] px-4 py-2.5 text-[14px] font-bold" style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--muted)" }}>
              …
            </div>
          </div>
        )}
        {error && (
          <p className="text-center text-[13px] font-bold" style={{ color: "var(--lilt-coral)" }}>{error}</p>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 mt-2 flex items-center gap-2 py-2" style={{ background: "var(--paper)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={`Reply in ${cfg.name}…`}
          className="field flex-1"
          autoComplete="off"
          autoCapitalize="off"
        />
        <button
          onClick={onSend}
          disabled={busy || !input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition active:translate-y-0.5 disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)" }}
          aria-label="Send"
        >
          <Icon name="arrow" size={18} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

function AssistantBubble({ text, speechLang }: { text: string; speechLang: string }) {
  const [showEn, setShowEn] = useState(false);
  const { reply, en, tip } = parseReply(text);
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[85%] rounded-[16px] rounded-bl-[4px] px-4 py-3"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}
      >
        <div className="flex items-start gap-2">
          <p className="text-[15px] font-bold leading-snug" style={{ color: "var(--ink)" }}>{reply}</p>
          <button
            onClick={() => speak(reply, speechLang)}
            className="mt-0.5 shrink-0 opacity-60 transition hover:opacity-100"
            aria-label="Hear it"
          >
            <Icon name="headphones" size={15} strokeWidth={2} />
          </button>
        </div>
        {en && (
          <button
            onClick={() => setShowEn((v) => !v)}
            className="mt-1.5 text-[12px] font-bold underline"
            style={{ color: "var(--muted)" }}
          >
            {showEn ? en : "Show translation"}
          </button>
        )}
        {tip && (
          <p className="mt-2 rounded-[10px] px-2.5 py-1.5 text-[12.5px] font-bold" style={{ background: "var(--tint-yellow)", color: "var(--on-yellow)", border: "1.5px solid var(--border-soft)" }}>
            💡 {tip}
          </p>
        )}
      </div>
    </div>
  );
}

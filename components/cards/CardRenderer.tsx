"use client";

import { useEffect, useMemo, useState } from "react";
import { confusableFor } from "@/lib/confusables";
import { getVocabWordSet } from "@/lib/data";
import { getLanguage } from "@/lib/languages";
import type { Card } from "@/lib/practice-types";
import {
  type KindedText,
  acceptedAnswers,
  answerText,
  buildChoices,
  checkAnswer,
  makeCloze,
  normalize,
  promptText,
  shuffle,
  wordTokens,
} from "@/lib/quiz";
import { useProgress } from "@/lib/progress";
import { useSettings } from "@/lib/settings";
import { type Grade, previewIntervals } from "@/lib/srs";
import { playCorrect } from "@/lib/sfx";
import { playPhrase } from "@/lib/speech";
import type { ItemContext } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { SpeakButton } from "../SpeakButton";

const PRIMARY = "btn btn-primary w-full";

// Result palettes — lime tint for correct, coral tint for wrong,
// both fenced by the 2px ink edge so they read in light and dark alike.
const RESULT_OK: React.CSSProperties = {
  border: "2px solid var(--edge)",
  background: "var(--tint-lime)",
  color: "var(--ink)",
};
const RESULT_NO: React.CSSProperties = {
  border: "2px solid var(--edge)",
  background: "var(--tint-coral)",
  color: "var(--ink)",
};

/** Selected-state styling for an answer option button. */
function optStyle(selected: string | null, choice: string, answer: string): React.CSSProperties {
  if (!selected) return {};
  if (choice === answer)
    return { border: "2px solid var(--edge)", background: "var(--tint-lime)", color: "var(--ink)" };
  if (choice === selected)
    return { border: "2px solid var(--edge)", background: "var(--tint-coral)", color: "var(--ink)" };
  return { opacity: 0.5 };
}

interface SubProps {
  ctx: ItemContext;
  card: Card;
  englishPool: KindedText[];
  targetPool: KindedText[];
  onGrade: (g: Grade) => void;
}

export function CardRenderer(props: {
  card: Card;
  englishPool: KindedText[];
  targetPool: KindedText[];
  onGrade: (g: Grade) => void;
}) {
  const { card } = props;
  const sub: SubProps = { ...props, ctx: card.ctx };
  switch (card.sub) {
    case "flashcards":
      return <FlashcardCard {...sub} />;
    case "mc":
      return <McCard {...sub} />;
    case "listening":
      return <ListeningCard {...sub} />;
    case "speaking":
      return <SpeakingCard {...sub} />;
    case "cloze":
      return <ClozeCard {...sub} />;
    case "order":
      return <OrderCard {...sub} />;
    case "confusables":
      return <ConfusablesCard {...sub} />;
    case "wordbuilding":
      return <WordBuildingCard {...sub} />;
    default:
      return <TypeCard {...sub} />;
  }
}

// ── shared bits ──────────────────────────────────────────────────────────────

/** Active study language presentation details. */
function useLangMeta() {
  const lang = getLanguage(useSettings().studyLanguage);
  return { name: lang.name, targetPlaceholder: lang.targetPlaceholder, hasReading: lang.hasReading };
}

function dirLabel(promptIsTarget: boolean, name: string): string {
  return promptIsTarget ? `${name} → English` : `English → ${name}`;
}

function Tag({ left, right }: { left: string; right: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
        style={{ background: "var(--lilt-ink)", color: "#fff", border: "2px solid var(--edge)" }}
      >
        {left}
      </span>
      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
        {right}
      </span>
    </div>
  );
}

function Reading({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-sm font-normal" style={{ color: "var(--muted)" }}>{text}</p>;
}

function SourceLine({ ctx }: { ctx: ItemContext }) {
  return (
    <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
      {ctx.lessonTitle} · {ctx.sectionTitle}
    </p>
  );
}

function NoteLine({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-3 text-center text-sm" style={{ color: "var(--muted)" }}>{text}</p>;
}

function kindLabel(ctx: ItemContext) {
  switch (ctx.item.kind) {
    case "sentence":
      return "Sentence";
    case "kana":
      return "Kana";
    case "kanji":
      return "Kanji";
    case "radical":
      return "Radical";
    default:
      return "Vocabulary";
  }
}

function GradeRow({
  onGrade,
  intervals,
}: {
  onGrade: (g: Grade) => void;
  intervals?: Record<Grade, string>;
}) {
  const cells: { g: Grade; key: string; label: string; bg: string; fg: string }[] = [
    { g: "again", key: "1", label: "Again", bg: "var(--lilt-coral)", fg: "#fff" },
    { g: "hard", key: "2", label: "Hard", bg: "var(--lilt-yellow)", fg: "#1A1430" },
    { g: "good", key: "3", label: "Good", bg: "var(--lilt-lime)", fg: "#1A1430" },
    { g: "easy", key: "4", label: "Easy", bg: "var(--lilt-violet)", fg: "#fff" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(({ g, key, label, bg, fg }) => (
        <button
          key={g}
          onClick={() => onGrade(g)}
          className="grade-btn"
          style={{ background: bg, color: fg }}
        >
          <span>
            {label}
            <span className="ml-1 opacity-60">{key}</span>
          </span>
          {intervals && (
            <span className="text-[10px] font-bold opacity-80">{intervals[g]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function ResultBar({
  correct,
  fuzzy,
  answer,
  reading,
  speakText,
  note,
  onNext,
}: {
  correct: boolean;
  fuzzy?: boolean;
  answer: string;
  reading?: string;
  speakText: string | null;
  note?: string;
  onNext: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="rounded-[16px] px-4 py-3 text-center text-sm font-bold" style={correct ? RESULT_OK : RESULT_NO}>
        {correct ? (fuzzy ? "Close enough — correct!" : "Correct!") : "Not quite."}
        <div className="mt-1 flex items-center justify-center gap-2 text-base font-display">
          {answer}
          {speakText && <SpeakButton text={speakText} size="sm" />}
        </div>
        {reading && <span className="text-xs font-normal opacity-80">{reading}</span>}
      </div>
      <NoteLine text={note} />
      <button autoFocus onClick={onNext} className={`mt-3 ${PRIMARY}`}>
        Next
      </button>
    </div>
  );
}

/** Big prompt text, with the reading underneath when the prompt is the target
 *  language and the language uses readings (romaji). */
function PromptText({
  text,
  showSpeaker,
  speakText,
  reading,
}: {
  text: string;
  showSpeaker: boolean;
  speakText: string;
  reading?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <div className="flex items-center justify-center gap-2">
        <span className="font-display text-2xl sm:text-3xl">{text}</span>
        {showSpeaker && <SpeakButton text={speakText} size="md" />}
      </div>
      <Reading text={reading} />
    </div>
  );
}

// ── flashcards ───────────────────────────────────────────────────────────────

function FlashcardCard({ ctx, card, onGrade }: SubProps) {
  const dir = card.dir;
  const promptIsTarget = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
  const { name, hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const [revealed, setRevealed] = useState(false);
  const store = useProgress();
  const intervals = previewIntervals(store[ctx.item.id], Date.now(), useSettings().targetRetention);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed) {
        if (e.key === "1") onGrade("again");
        if (e.key === "2") onGrade("hard");
        if (e.key === "3") onGrade("good");
        if (e.key === "4") onGrade("easy");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, onGrade]);

  return (
    <div className="card p-7">
      <Tag left={kindLabel(ctx)} right={dirLabel(promptIsTarget, name)} />
      <div className="grid min-h-44 place-items-center py-6">
        <PromptText
          text={prompt}
          showSpeaker={promptIsTarget}
          speakText={ctx.item.target}
          reading={promptIsTarget ? reading : undefined}
        />
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={PRIMARY}>
          Show answer <span className="opacity-70">(Space)</span>
        </button>
      ) : (
        <>
          <div className="mb-5 flex flex-col items-center gap-1 pt-5 text-center" style={{ borderTop: "2px solid var(--edge)" }}>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-xl" style={{ color: "var(--accent)" }}>
                {answer}
              </span>
              {!promptIsTarget && <SpeakButton text={ctx.item.target} size="md" />}
            </div>
            {!promptIsTarget && <Reading text={reading} />}
          </div>
          <NoteLine text={ctx.item.note} />
          <div className="mt-4">
            <GradeRow onGrade={onGrade} intervals={intervals} />
          </div>
        </>
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── multiple choice ──────────────────────────────────────────────────────────

function McCard({ ctx, card, englishPool, targetPool, onGrade }: SubProps) {
  const dir = card.dir;
  const promptIsTarget = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
  const { name, hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const [selected, setSelected] = useState<string | null>(null);

  const choices = useMemo(
    () => buildChoices(answer, promptIsTarget ? englishPool : targetPool, ctx.item.kind),
    [answer, promptIsTarget, englishPool, targetPool, ctx.item.kind],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) setSelected(choices[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, choices]);

  useEffect(() => {
    if (selected && selected === answer) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [selected, answer, ctx.item.target]);

  return (
    <div className="card p-7">
      <Tag left={kindLabel(ctx)} right={dirLabel(promptIsTarget, name)} />
      <div className="grid min-h-28 place-items-center py-4">
        <PromptText
          text={prompt}
          showSpeaker={promptIsTarget}
          speakText={ctx.item.target}
          reading={promptIsTarget ? reading : undefined}
        />
      </div>
      <div className="grid gap-2">
        {choices.map((c, i) => (
          <button
            key={c + i}
            disabled={!!selected}
            onClick={() => setSelected(c)}
            className="opt"
            style={optStyle(selected, c, answer)}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold" style={{ border: "2px solid var(--edge)", background: "var(--paper)", color: "var(--muted)" }}>
              {i + 1}
            </span>
            <span className="flex-1">{c}</span>
            {selected && c === answer && (
              <Icon name="check" size={18} strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
      {selected && (
        <ResultBar
          correct={selected === answer}
          answer={answer}
          reading={!promptIsTarget ? reading : undefined}
          speakText={!promptIsTarget ? ctx.item.target : null}
          note={ctx.item.note}
          onNext={() => onGrade(selected === answer ? "good" : "again")}
        />
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── type the answer ──────────────────────────────────────────────────────────

function TypeCard({ ctx, card, onGrade }: SubProps) {
  const dir = card.dir;
  const promptIsTarget = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
  const { name, targetPlaceholder, hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [checked, ctx.item.target]);

  return (
    <div className="card p-7">
      <Tag left={kindLabel(ctx)} right={dirLabel(promptIsTarget, name)} />
      <div className="grid min-h-28 place-items-center py-4">
        <PromptText
          text={prompt}
          showSpeaker={promptIsTarget}
          speakText={ctx.item.target}
          reading={promptIsTarget ? reading : undefined}
        />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) setChecked(checkAnswer(input, acceptedAnswers(ctx, dir)));
        }}
      >
        <input
          autoFocus
          value={input}
          disabled={!!checked}
          onChange={(e) => setInput(e.target.value)}
          placeholder={promptIsTarget ? "Type the English…" : targetPlaceholder}
          className="field"
        />
        {!checked && (
          <button type="submit" disabled={!input.trim()} className={`mt-3 ${PRIMARY}`}>
            Check <span className="opacity-70">(Enter)</span>
          </button>
        )}
      </form>
      {checked && (
        <ResultBar
          correct={checked.correct}
          fuzzy={checked.fuzzy}
          answer={answer}
          reading={!promptIsTarget ? reading : undefined}
          speakText={!promptIsTarget ? ctx.item.target : null}
          note={ctx.item.note}
          onNext={() => onGrade(checked.correct ? (checked.fuzzy ? "hard" : "good") : "again")}
        />
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── listening ────────────────────────────────────────────────────────────────

function ListeningCard({ ctx, englishPool, onGrade }: SubProps) {
  const answer = ctx.item.english;
  const { hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useMemo(
    () => buildChoices(answer, englishPool, ctx.item.kind),
    [answer, englishPool, ctx.item.kind],
  );

  useEffect(() => {
    playPhrase(ctx.item.target);
  }, [ctx.item.target]);

  useEffect(() => {
    if (selected && selected === answer) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [selected, answer, ctx.item.target]);

  return (
    <div className="card p-7">
      <Tag left="Listening" right="Choose the meaning" />
      <div className="grid min-h-28 place-items-center py-4">
        <button
          onClick={() => playPhrase(ctx.item.target)}
          className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition active:translate-x-[1px] active:translate-y-[1px]"
          style={{ border: "2px solid var(--edge)", background: "var(--lilt-yellow)", color: "#1A1430", boxShadow: "3px 3px 0 0 var(--edge)" }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11 5 6 9H3v6h3l5 4V5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Play again
        </button>
      </div>
      <div className="grid gap-2">
        {choices.map((c, i) => (
          <button
            key={c + i}
            disabled={!!selected}
            onClick={() => setSelected(c)}
            className="opt"
            style={optStyle(selected, c, answer)}
          >
            <span className="flex-1">{c}</span>
            {selected && c === answer && (
              <Icon name="check" size={18} strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4">
          <div className="rounded-[16px] px-4 py-3 text-center" style={{ border: "2px solid var(--edge)", background: "var(--tint-violet)" }}>
            <div className="flex items-center justify-center gap-2 font-display text-lg">
              {ctx.item.target}
              <SpeakButton text={ctx.item.target} size="sm" />
            </div>
            {reading && <span className="text-xs" style={{ color: "var(--muted)" }}>{reading}</span>}
          </div>
          <ResultBar
            correct={selected === answer}
            answer={answer}
            speakText={null}
            note={ctx.item.note}
            onNext={() => onGrade(selected === answer ? "good" : "again")}
          />
        </div>
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── speaking (self-graded) ───────────────────────────────────────────────────

function SpeakingCard({ ctx, onGrade }: SubProps) {
  const { name, hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const [revealed, setRevealed] = useState(false);
  const store = useProgress();
  const intervals = previewIntervals(store[ctx.item.id], Date.now(), useSettings().targetRetention);

  useEffect(() => {
    if (!revealed) return;
    playPhrase(ctx.item.target);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") onGrade("again");
      if (e.key === "2") onGrade("hard");
      if (e.key === "3") onGrade("good");
      if (e.key === "4") onGrade("easy");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, ctx.item.target, onGrade]);

  return (
    <div className="card p-7">
      <Tag left="Speaking" right={`Say it in ${name}`} />
      <div className="grid min-h-44 place-items-center py-6 text-center">
        <div>
          <p className="font-display text-2xl sm:text-3xl">{ctx.item.english}</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Say it aloud in {name}, then check.
          </p>
        </div>
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={PRIMARY}>
          Reveal &amp; hear
        </button>
      ) : (
        <>
          <div className="mb-5 flex flex-col items-center gap-1 pt-5 text-center" style={{ borderTop: "2px solid var(--edge)" }}>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-xl" style={{ color: "var(--accent)" }}>
                {ctx.item.target}
              </span>
              <SpeakButton text={ctx.item.target} size="md" />
            </div>
            <Reading text={reading} />
          </div>
          <NoteLine text={ctx.item.note} />
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>How did you do?</p>
          <GradeRow onGrade={onGrade} intervals={intervals} />
        </>
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── cloze (fill in the blank) ────────────────────────────────────────────────

function ClozeCard({ ctx, card, onGrade }: SubProps) {
  const cloze = useMemo(
    () => makeCloze(ctx.item.target, getVocabWordSet()),
    [ctx.item.target],
  );
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [checked, ctx.item.target]);

  // Fallback (no maskable word): translate-to-target typing instead.
  if (!cloze) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: card.requeues }}
        englishPool={[]}
        targetPool={[]}
        onGrade={onGrade}
      />
    );
  }

  const sentenceWithBlank = cloze.tokens
    .map((t, i) => (i === cloze.blankIndex ? "_____" : t))
    .join(" ");

  return (
    <div className="card p-7">
      <Tag left="Fill the blank" right="Sentence" />
      <div className="grid min-h-28 place-items-center py-4 text-center">
        <div>
          <p className="font-display text-xl sm:text-2xl">{sentenceWithBlank}</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{ctx.item.english}</p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) setChecked(checkAnswer(input, cloze.answer));
        }}
      >
        <input
          autoFocus
          value={input}
          disabled={!!checked}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the missing word…"
          className="field"
        />
        {!checked && (
          <button type="submit" disabled={!input.trim()} className={`mt-3 ${PRIMARY}`}>
            Check <span className="opacity-70">(Enter)</span>
          </button>
        )}
      </form>
      {checked && (
        <div className="mt-4">
          <div className="rounded-[16px] px-4 py-3 text-center text-sm font-bold" style={checked.correct ? RESULT_OK : RESULT_NO}>
            {checked.correct ? (checked.fuzzy ? "Close enough — correct!" : "Correct!") : "Not quite."}
            <div className="mt-1 flex items-center justify-center gap-2 font-display text-base">
              {ctx.item.target}
              <SpeakButton text={ctx.item.target} size="sm" />
            </div>
          </div>
          <NoteLine text={ctx.item.note} />
          <button
            autoFocus
            onClick={() => onGrade(checked.correct ? (checked.fuzzy ? "hard" : "good") : "again")}
            className={`mt-3 ${PRIMARY}`}
          >
            Next
          </button>
        </div>
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── word-order builder ───────────────────────────────────────────────────────

function OrderCard({ ctx, onGrade }: SubProps) {
  const tokens = useMemo(() => wordTokens(ctx.item.target), [ctx.item.target]);
  const order = useMemo(() => shuffle(tokens.map((_, i) => i)), [tokens]);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);

  useEffect(() => {
    if (result === true) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [result, ctx.item.target]);

  const pickedSet = new Set(picked);
  const allPlaced = picked.length === tokens.length;

  const check = (seq: number[]) => {
    const ok = normalize(seq.map((i) => tokens[i]).join(" ")) === normalize(ctx.item.target);
    setResult(ok);
  };

  return (
    <div className="card p-7">
      <Tag left="Word order" right="Sentence" />
      <p className="mb-4 text-center text-sm" style={{ color: "var(--muted)" }}>
        Build: <span className="font-display font-bold" style={{ color: "var(--ink)" }}>{ctx.item.english}</span>
      </p>

      <div className="mb-4 flex min-h-14 flex-wrap content-start gap-2 rounded-[16px] p-3" style={{ border: "2px dashed var(--edge)", background: "var(--tint-violet)" }}>
        {picked.length === 0 && (
          <span className="text-sm" style={{ color: "var(--muted)" }}>Tap words below…</span>
        )}
        {picked.map((idx, pos) => (
          <button
            key={`${idx}-${pos}`}
            disabled={result !== null}
            onClick={() => setPicked((p) => p.filter((_, k) => k !== pos))}
            className="rounded-lg px-3 py-1.5 text-sm font-extrabold transition active:translate-x-[1px] active:translate-y-[1px]"
            style={{ border: "2px solid var(--edge)", background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {tokens[idx]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {order
          .filter((idx) => !pickedSet.has(idx))
          .map((idx) => (
            <button
              key={idx}
              disabled={result !== null}
              onClick={() => {
                const next = [...picked, idx];
                setPicked(next);
                if (next.length === tokens.length) check(next);
              }}
              className="word-chip"
            >
              {tokens[idx]}
            </button>
          ))}
      </div>

      {result === null ? (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            disabled={picked.length === 0}
            onClick={() => setPicked([])}
            className="btn btn-secondary"
          >
            Reset
          </button>
          <button disabled={!allPlaced} onClick={() => check(picked)} className="btn btn-primary">
            Check
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-[16px] px-4 py-3 text-center text-sm font-bold" style={result ? RESULT_OK : RESULT_NO}>
            {result ? "Correct!" : "Not quite."}
            <div className="mt-1 flex items-center justify-center gap-2 font-display text-base">
              {ctx.item.target}
              <SpeakButton text={ctx.item.target} size="sm" />
            </div>
          </div>
          <NoteLine text={ctx.item.note} />
          <button
            autoFocus
            onClick={() => onGrade(result ? "good" : "again")}
            className={`mt-3 ${PRIMARY}`}
          >
            Next
          </button>
        </div>
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── confusables (pick the right form for a meaning) ──────────────────────────

function ConfusablesCard({ ctx, onGrade }: SubProps) {
  const conf = useMemo(() => confusableFor(ctx.item.id), [ctx.item.id]);
  const answer = ctx.item.target;
  const { hasReading } = useLangMeta();
  const reading = hasReading ? ctx.item.reading : undefined;
  const choices = useMemo(
    () => (conf ? shuffle([...new Set(conf.options)]) : []),
    [conf],
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (selected && selected === answer) {
      playCorrect();
      playPhrase(ctx.item.target);
    }
  }, [selected, answer, ctx.item.target]);

  if (!conf || choices.length < 2) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: 0 }}
        englishPool={[]}
        targetPool={[]}
        onGrade={onGrade}
      />
    );
  }

  return (
    <div className="card p-7">
      <Tag left="Which form?" right="Confusable" />
      <div className="grid min-h-28 place-items-center py-4 text-center">
        <div>
          <p className="font-display text-2xl sm:text-3xl">{ctx.item.english}</p>
          {conf.note && (
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{conf.note}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        {choices.map((c, i) => (
          <button
            key={c + i}
            disabled={!!selected}
            onClick={() => setSelected(c)}
            className="opt"
            style={optStyle(selected, c, answer)}
          >
            <span className="flex-1">{c}</span>
            {selected && c === answer && (
              <Icon name="check" size={18} strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
      {selected && (
        <ResultBar
          correct={selected === answer}
          answer={answer}
          reading={reading}
          speakText={ctx.item.target}
          note={ctx.item.note}
          onNext={() => onGrade(selected === answer ? "good" : "again")}
        />
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── word building (root ↔ affixed form) ──────────────────────────────────────

function WordBuildingCard({ ctx, onGrade }: SubProps) {
  const root = ctx.item.root ?? "";
  const derived = ctx.item.target;
  // One stable random direction per card (the card remounts per item).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const forward = useMemo(() => Math.random() < 0.5, []);
  const answer = forward ? derived : root;
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) {
      playCorrect();
      playPhrase(derived);
    }
  }, [checked, derived]);

  if (!root) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: 0 }}
        englishPool={[]}
        targetPool={[]}
        onGrade={onGrade}
      />
    );
  }

  return (
    <div className="card p-7">
      <Tag left="Word building" right={forward ? "Root → form" : "Form → root"} />
      <div className="grid min-h-28 place-items-center py-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-display text-2xl sm:text-3xl">
              {forward ? root : derived}
            </span>
            <SpeakButton text={forward ? root : derived} size="md" />
          </div>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {forward ? `Build the form for: ${ctx.item.english}` : "Type the root word"}
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) setChecked(checkAnswer(input, answer));
        }}
      >
        <input
          autoFocus
          value={input}
          disabled={!!checked}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik dalam Bahasa Indonesia…"
          className="field"
        />
        {!checked && (
          <button type="submit" disabled={!input.trim()} className={`mt-3 ${PRIMARY}`}>
            Check <span className="opacity-70">(Enter)</span>
          </button>
        )}
      </form>
      {checked && (
        <ResultBar
          correct={checked.correct}
          fuzzy={checked.fuzzy}
          answer={answer}
          speakText={derived}
          note={ctx.item.note}
          onNext={() => onGrade(checked.correct ? (checked.fuzzy ? "hard" : "good") : "again")}
        />
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { confusableFor } from "@/lib/confusables";
import { getVocabWordSet } from "@/lib/data";
import type { Card } from "@/lib/practice-types";
import {
  type KindedText,
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
import { playPhrase } from "@/lib/speech";
import type { ItemContext } from "@/lib/types";
import { SpeakButton } from "../SpeakButton";

const PRIMARY =
  "w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700";

interface SubProps {
  ctx: ItemContext;
  card: Card;
  englishPool: KindedText[];
  indonesianPool: KindedText[];
  onGrade: (g: Grade) => void;
}

export function CardRenderer(props: {
  card: Card;
  englishPool: KindedText[];
  indonesianPool: KindedText[];
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

function Tag({ left, right }: { left: string; right: string }) {
  return (
    <div className="mb-3 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
      <span>{left}</span>
      <span aria-hidden>·</span>
      <span>{right}</span>
    </div>
  );
}

function SourceLine({ ctx }: { ctx: ItemContext }) {
  return (
    <p className="mt-5 text-center text-xs text-slate-400">
      {ctx.lessonTitle} · {ctx.sectionTitle}
    </p>
  );
}

function NoteLine({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">{text}</p>
  );
}

function kindLabel(ctx: ItemContext) {
  return ctx.item.kind === "sentence" ? "Sentence" : "Vocabulary";
}

function GradeRow({
  onGrade,
  intervals,
}: {
  onGrade: (g: Grade) => void;
  intervals?: Record<Grade, string>;
}) {
  const base =
    "flex flex-col items-center gap-0.5 rounded-xl border py-2.5 text-xs font-semibold transition";
  const cells: { g: Grade; key: string; label: string; cls: string }[] = [
    { g: "again", key: "1", label: "Again", cls: "border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40" },
    { g: "hard", key: "2", label: "Hard", cls: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40" },
    { g: "good", key: "3", label: "Good", cls: "border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40" },
    { g: "easy", key: "4", label: "Easy", cls: "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(({ g, key, label, cls }) => (
        <button key={g} onClick={() => onGrade(g)} className={`${base} ${cls}`}>
          <span>
            {label}
            <span className="ml-1 opacity-50">{key}</span>
          </span>
          {intervals && (
            <span className="text-[10px] font-normal opacity-70">{intervals[g]}</span>
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
  speakText,
  note,
  onNext,
}: {
  correct: boolean;
  fuzzy?: boolean;
  answer: string;
  speakText: string | null;
  note?: string;
  onNext: () => void;
}) {
  return (
    <div className="mt-4">
      <div
        className={`rounded-xl px-4 py-3 text-center text-sm ${
          correct
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        }`}
      >
        {correct ? (fuzzy ? "Close enough — correct!" : "Correct!") : "Not quite."}
        <div className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          {answer}
          {speakText && <SpeakButton text={speakText} size="sm" />}
        </div>
      </div>
      <NoteLine text={note} />
      <button autoFocus onClick={onNext} className={`mt-3 ${PRIMARY}`}>
        Next
      </button>
    </div>
  );
}

// ── flashcards ───────────────────────────────────────────────────────────────

function FlashcardCard({ ctx, card, onGrade }: SubProps) {
  const dir = card.dir;
  const promptIsId = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
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
      <Tag left={kindLabel(ctx)} right={promptIsId ? "Indonesian → English" : "English → Indonesian"} />
      <div className="grid min-h-44 place-items-center py-6">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-2xl font-semibold sm:text-3xl">{prompt}</span>
          {promptIsId && <SpeakButton text={ctx.item.indonesian} size="md" />}
        </div>
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={PRIMARY}>
          Show answer <span className="opacity-70">(Space)</span>
        </button>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-center dark:border-slate-800">
            <span className="text-xl font-medium text-indigo-700 dark:text-indigo-300">{answer}</span>
            {!promptIsId && <SpeakButton text={ctx.item.indonesian} size="md" />}
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

function McCard({ ctx, card, englishPool, indonesianPool, onGrade }: SubProps) {
  const dir = card.dir;
  const promptIsId = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
  const [selected, setSelected] = useState<string | null>(null);

  const choices = useMemo(
    () => buildChoices(answer, promptIsId ? englishPool : indonesianPool, ctx.item.kind),
    [answer, promptIsId, englishPool, indonesianPool, ctx.item.kind],
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
    if (selected && selected === answer) playPhrase(ctx.item.indonesian);
  }, [selected, answer, ctx.item.indonesian]);

  return (
    <div className="card p-7">
      <Tag left={kindLabel(ctx)} right={promptIsId ? "Indonesian → English" : "English → Indonesian"} />
      <div className="grid min-h-28 place-items-center py-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-2xl font-semibold sm:text-3xl">{prompt}</span>
          {promptIsId && <SpeakButton text={ctx.item.indonesian} size="md" />}
        </div>
      </div>
      <div className="grid gap-2">
        {choices.map((c, i) => {
          const isCorrect = c === answer;
          const isPicked = c === selected;
          let cls =
            "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800";
          if (selected) {
            if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            else if (isPicked) cls = "border-rose-500 bg-rose-50 dark:bg-rose-950/40";
            else cls = "border-slate-200 opacity-60 dark:border-slate-800";
          }
          return (
            <button
              key={c + i}
              disabled={!!selected}
              onClick={() => setSelected(c)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800">
                {i + 1}
              </span>
              <span className="font-medium">{c}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <ResultBar
          correct={selected === answer}
          answer={answer}
          speakText={!promptIsId ? ctx.item.indonesian : null}
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
  const promptIsId = dir === "id2en";
  const prompt = promptText(ctx, dir);
  const answer = answerText(ctx, dir);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) playPhrase(ctx.item.indonesian);
  }, [checked, ctx.item.indonesian]);

  return (
    <div className="card p-7">
      <Tag left={kindLabel(ctx)} right={promptIsId ? "Indonesian → English" : "English → Indonesian"} />
      <div className="grid min-h-28 place-items-center py-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-2xl font-semibold sm:text-3xl">{prompt}</span>
          {promptIsId && <SpeakButton text={ctx.item.indonesian} size="md" />}
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
          placeholder={promptIsId ? "Type the English…" : "Ketik dalam Bahasa Indonesia…"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        />
        {!checked && (
          <button type="submit" className={`mt-3 ${PRIMARY}`}>
            Check <span className="opacity-70">(Enter)</span>
          </button>
        )}
      </form>
      {checked && (
        <ResultBar
          correct={checked.correct}
          fuzzy={checked.fuzzy}
          answer={answer}
          speakText={!promptIsId ? ctx.item.indonesian : null}
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
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useMemo(
    () => buildChoices(answer, englishPool, ctx.item.kind),
    [answer, englishPool, ctx.item.kind],
  );

  useEffect(() => {
    playPhrase(ctx.item.indonesian);
  }, [ctx.item.indonesian]);

  useEffect(() => {
    if (selected && selected === answer) playPhrase(ctx.item.indonesian);
  }, [selected, answer, ctx.item.indonesian]);

  return (
    <div className="card p-7">
      <Tag left="Listening" right="Choose the meaning" />
      <div className="grid min-h-28 place-items-center py-4">
        <button
          onClick={() => playPhrase(ctx.item.indonesian)}
          className="flex items-center gap-2 rounded-full border border-indigo-300 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
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
        {choices.map((c, i) => {
          const isCorrect = c === answer;
          const isPicked = c === selected;
          let cls =
            "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800";
          if (selected) {
            if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            else if (isPicked) cls = "border-rose-500 bg-rose-50 dark:bg-rose-950/40";
            else cls = "border-slate-200 opacity-60 dark:border-slate-800";
          }
          return (
            <button
              key={c + i}
              disabled={!!selected}
              onClick={() => setSelected(c)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}
            >
              {c}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-4">
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800/60">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              {ctx.item.indonesian}
              <SpeakButton text={ctx.item.indonesian} size="sm" />
            </div>
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
  const [revealed, setRevealed] = useState(false);
  const store = useProgress();
  const intervals = previewIntervals(store[ctx.item.id], Date.now(), useSettings().targetRetention);

  useEffect(() => {
    if (!revealed) return;
    playPhrase(ctx.item.indonesian);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") onGrade("again");
      if (e.key === "2") onGrade("hard");
      if (e.key === "3") onGrade("good");
      if (e.key === "4") onGrade("easy");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, ctx.item.indonesian, onGrade]);

  return (
    <div className="card p-7">
      <Tag left="Speaking" right="Say it in Indonesian" />
      <div className="grid min-h-44 place-items-center py-6 text-center">
        <div>
          <p className="text-2xl font-semibold sm:text-3xl">{ctx.item.english}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Say it aloud in Indonesian, then check.
          </p>
        </div>
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={PRIMARY}>
          Reveal &amp; hear
        </button>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-center dark:border-slate-800">
            <span className="text-xl font-medium text-indigo-700 dark:text-indigo-300">
              {ctx.item.indonesian}
            </span>
            <SpeakButton text={ctx.item.indonesian} size="md" />
          </div>
          <NoteLine text={ctx.item.note} />
          <p className="mb-2 text-center text-xs text-slate-400">How did you do?</p>
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
    () => makeCloze(ctx.item.indonesian, getVocabWordSet()),
    [ctx.item.indonesian],
  );
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) playPhrase(ctx.item.indonesian);
  }, [checked, ctx.item.indonesian]);

  // Fallback (no maskable word): translate-to-Indonesian typing instead.
  if (!cloze) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: card.requeues }}
        englishPool={[]}
        indonesianPool={[]}
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
          <p className="text-xl font-semibold sm:text-2xl">{sentenceWithBlank}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{ctx.item.english}</p>
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
          placeholder="Isi kata yang hilang…"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"
        />
        {!checked && (
          <button type="submit" className={`mt-3 ${PRIMARY}`}>
            Check <span className="opacity-70">(Enter)</span>
          </button>
        )}
      </form>
      {checked && (
        <div className="mt-4">
          <div
            className={`rounded-xl px-4 py-3 text-center text-sm ${
              checked.correct
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {checked.correct ? (checked.fuzzy ? "Close enough — correct!" : "Correct!") : "Not quite."}
            <div className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
              {ctx.item.indonesian}
              <SpeakButton text={ctx.item.indonesian} size="sm" />
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
  const tokens = useMemo(() => wordTokens(ctx.item.indonesian), [ctx.item.indonesian]);
  const order = useMemo(() => shuffle(tokens.map((_, i) => i)), [tokens]);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);

  useEffect(() => {
    if (result === true) playPhrase(ctx.item.indonesian);
  }, [result, ctx.item.indonesian]);

  const pickedSet = new Set(picked);
  const assembled = picked.map((i) => tokens[i]).join(" ");
  const allPlaced = picked.length === tokens.length;

  const check = (seq: number[]) => {
    const ok = normalize(seq.map((i) => tokens[i]).join(" ")) === normalize(ctx.item.indonesian);
    setResult(ok);
  };

  return (
    <div className="card p-7">
      <Tag left="Word order" right="Sentence" />
      <p className="mb-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Build: <span className="font-medium text-slate-700 dark:text-slate-200">{ctx.item.english}</span>
      </p>

      <div className="mb-4 flex min-h-14 flex-wrap content-start gap-2 rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
        {picked.length === 0 && (
          <span className="text-sm text-slate-400">Tap words below…</span>
        )}
        {picked.map((idx, pos) => (
          <button
            key={`${idx}-${pos}`}
            disabled={result !== null}
            onClick={() => setPicked((p) => p.filter((_, k) => k !== pos))}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
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
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800"
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
            className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold disabled:opacity-50 dark:border-slate-700"
          >
            Reset
          </button>
          <button
            disabled={!allPlaced}
            onClick={() => check(picked)}
            className="rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Check
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div
            className={`rounded-xl px-4 py-3 text-center text-sm ${
              result
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {result ? "Correct!" : "Not quite."}
            <div className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
              {ctx.item.indonesian}
              <SpeakButton text={ctx.item.indonesian} size="sm" />
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
  const answer = ctx.item.indonesian;
  const choices = useMemo(
    () => (conf ? shuffle([...new Set(conf.options)]) : []),
    [conf],
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (selected && selected === answer) playPhrase(ctx.item.indonesian);
  }, [selected, answer, ctx.item.indonesian]);

  if (!conf || choices.length < 2) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: 0 }}
        englishPool={[]}
        indonesianPool={[]}
        onGrade={onGrade}
      />
    );
  }

  return (
    <div className="card p-7">
      <Tag left="Which form?" right="Confusable" />
      <div className="grid min-h-28 place-items-center py-4 text-center">
        <div>
          <p className="text-2xl font-semibold sm:text-3xl">{ctx.item.english}</p>
          {conf.note && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{conf.note}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        {choices.map((c, i) => {
          const isCorrect = c === answer;
          const isPicked = c === selected;
          let cls =
            "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-800";
          if (selected) {
            if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            else if (isPicked) cls = "border-rose-500 bg-rose-50 dark:bg-rose-950/40";
            else cls = "border-slate-200 opacity-60 dark:border-slate-800";
          }
          return (
            <button
              key={c + i}
              disabled={!!selected}
              onClick={() => setSelected(c)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
            >
              <span className="font-medium">{c}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <ResultBar
          correct={selected === answer}
          answer={answer}
          speakText={ctx.item.indonesian}
          note={ctx.item.note}
          onNext={() => onGrade(selected === answer ? "good" : "again")}
        />
      )}
      <SourceLine ctx={ctx} />
    </div>
  );
}

// ── word building (root ↔ affixed form) ──────────────────────────────────────

const WB_INPUT =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900";

function WordBuildingCard({ ctx, onGrade }: SubProps) {
  const root = ctx.item.root ?? "";
  const derived = ctx.item.indonesian;
  const forward = useMemo(() => Math.random() < 0.5, [ctx.item.id]);
  const answer = forward ? derived : root;
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | { correct: boolean; fuzzy: boolean }>(null);

  useEffect(() => {
    if (checked?.correct) playPhrase(derived);
  }, [checked, derived]);

  if (!root) {
    return (
      <TypeCard
        ctx={ctx}
        card={{ ctx, dir: "en2id", sub: "type", requeues: 0 }}
        englishPool={[]}
        indonesianPool={[]}
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
            <span className="text-2xl font-semibold sm:text-3xl">
              {forward ? root : derived}
            </span>
            <SpeakButton text={forward ? root : derived} size="md" />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
          className={WB_INPUT}
        />
        {!checked && (
          <button type="submit" className={`mt-3 ${PRIMARY}`}>
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

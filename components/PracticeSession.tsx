"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAffixPairs } from "@/lib/affixes";
import { getConfusableItems } from "@/lib/confusables";
import { getAllItems, getScopedItems, scopeLabel } from "@/lib/data";
import type { Card, Mode, SubMode } from "@/lib/practice-types";
import { type GradeUndo, gradeItem, troubleItemIds, undoGrade, useProgress } from "@/lib/progress";
import { type Direction, type KindedText, shuffle, wordTokens } from "@/lib/quiz";
import { useSettings } from "@/lib/settings";
import { speechSupported } from "@/lib/speech";
import { type Grade, isDue, isNew } from "@/lib/srs";
import { currentStreak, getNewIntroducedToday, todayCount, useStats } from "@/lib/stats";
import type { ItemContext } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";
import { CardRenderer } from "./cards/CardRenderer";

export type { Mode };

const SESSION_CAP = 20;
const MAX_REQUEUE = 2;

const MODE_LABEL: Record<Mode, string> = {
  flashcards: "Flashcards",
  mc: "Multiple choice",
  type: "Type the answer",
  mixed: "Spaced review",
  daily: "Today's study",
  listening: "Listening",
  speaking: "Speaking practice",
  cloze: "Fill in the blank",
  order: "Word order",
  confusables: "Which form?",
  wordbuilding: "Word building",
  kana: "Alphabet (kana)",
  kanji: "Kanji",
};

function pickDirection(ctx: ItemContext): Direction {
  if (ctx.item.kind === "sentence") return Math.random() < 0.7 ? "id2en" : "en2id";
  return Math.random() < 0.5 ? "id2en" : "en2id";
}

function pickSub(mode: Mode): SubMode {
  // Character drills present items as flashcards / multiple-choice / typing.
  if (mode === "kana" || mode === "kanji") {
    const r = Math.random();
    return r < 0.45 ? "mc" : r < 0.8 ? "type" : "flashcards";
  }
  if (mode !== "mixed" && mode !== "daily") return mode as SubMode;
  const r = Math.random();
  if (r < 0.2) return "mc";
  if (r < 0.36) return "type";
  if (r < 0.5) return "cloze";
  if (r < 0.64) return "listening";
  if (r < 0.76) return "order";
  if (r < 0.86) return "speaking";
  return "flashcards";
}

/** Downgrade a sub-mode when the item can't support it, so dedicated-mode
 *  routes and mixed review never get stuck on an impossible card. */
function resolveSub(desired: SubMode, ctx: ItemContext, speechOK: boolean): SubMode {
  const isSentence = ctx.item.kind === "sentence";
  const enoughWords = wordTokens(ctx.item.target).length >= 3;
  if ((desired === "cloze" || desired === "order") && !(isSentence && enoughWords)) return "type";
  if (desired === "listening" && !speechOK) return "mc";
  if (desired === "speaking" && !speechOK) return "flashcards";
  return desired;
}

export function PracticeSession({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const mounted = useMounted();
  const store = useProgress();
  const settings = useSettings();
  const statsData = useStats();

  const lessonId = params.get("lesson");
  const sectionId = params.get("section");
  const trouble = params.get("trouble") === "1";
  const daily = mode === "daily";
  const dueOnly = mode === "mixed" || params.get("due") === "1";
  const lang = settings.studyLanguage;

  const { englishPool, targetPool } = useMemo(() => {
    const all = getAllItems();
    return {
      englishPool: all.map<KindedText>((c) => ({ text: c.item.english, kind: c.item.kind })),
      targetPool: all.map<KindedText>((c) => ({ text: c.item.target, kind: c.item.kind })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const orderedPool = useMemo<ItemContext[]>(() => {
    if (!mounted) return [];
    let base: ItemContext[];
    if (mode === "confusables" || mode === "wordbuilding") {
      const src = mode === "confusables" ? getConfusableItems() : getAffixPairs();
      base = lessonId
        ? src.filter((c) => c.lessonId === lessonId)
        : sectionId
          ? src.filter((c) => c.sectionId === sectionId)
          : src;
    } else if (daily) {
      // Today's mix: everything due (new items capped) + trouble words.
      const allItems = getAllItems();
      const troubleSet = new Set(troubleItemIds(store, allItems.map((c) => c.item.id)));
      const allowedNew = Math.max(0, settings.newPerDay - getNewIntroducedToday());
      let usedNew = 0;
      base = allItems.filter((c) => {
        const st = store[c.item.id];
        if (isDue(st)) {
          if (isNew(st)) {
            if (usedNew >= allowedNew) return false;
            usedNew += 1;
          }
          return true;
        }
        return troubleSet.has(c.item.id);
      });
    } else if (trouble) {
      const allItems = getAllItems();
      const ids = new Set(troubleItemIds(store, allItems.map((c) => c.item.id)));
      base = allItems.filter((c) => ids.has(c.item.id));
    } else if (dueOnly) {
      base = getAllItems().filter((c) => isDue(store[c.item.id]));
      // Soft daily cap on brand-new items so review isn't overwhelming.
      const allowedNew = Math.max(0, settings.newPerDay - getNewIntroducedToday());
      let usedNew = 0;
      base = base.filter((c) => {
        if (isNew(store[c.item.id])) {
          if (usedNew >= allowedNew) return false;
          usedNew += 1;
        }
        return true;
      });
    } else if (mode === "kana" || mode === "kanji") {
      const k = mode === "kana" ? "kana" : "kanji";
      base = getScopedItems({ lessonId, sectionId }).filter((c) => c.item.kind === k);
    } else {
      base = getScopedItems({ lessonId, sectionId });
      // Cloze and word-order only work on multi-word sentences — keep the
      // dedicated routes on-label instead of downgrading most cards to typing.
      if (mode === "cloze" || mode === "order") {
        base = base.filter(
          (c) => c.item.kind === "sentence" && wordTokens(c.item.target).length >= 3,
        );
      }
    }
    const fresh: ItemContext[] = [];
    const seen: ItemContext[] = [];
    for (const c of shuffle(base)) (isDue(store[c.item.id]) ? fresh : seen).push(c);
    return [...fresh, ...seen];
    // store is intentionally read once at session start (stable queue).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, mode, daily, dueOnly, trouble, lessonId, sectionId, lang]);

  const [batchStart, setBatchStart] = useState(0);
  const [queue, setQueue] = useState<Card[]>([]);
  const [stats, setStats] = useState({ answered: 0, correct: 0 });
  const [wrong, setWrong] = useState<ItemContext[]>([]);
  const [practiceWrong, setPracticeWrong] = useState<ItemContext[] | null>(null);
  const [lastUndo, setLastUndo] = useState<{ u: GradeUndo; card: Card; grade: Grade } | null>(
    null,
  );

  const makeCard = useCallback(
    (ctx: ItemContext): Card => {
      const speechOK = speechSupported();
      const sub = resolveSub(pickSub(mode), ctx, speechOK);
      const dir: Direction =
        sub === "listening"
          ? "id2en"
          : sub === "speaking"
            ? "en2id"
            : settings.defaultDirection !== "auto"
              ? settings.defaultDirection
              : pickDirection(ctx);
      return { ctx, dir, sub, requeues: 0 };
    },
    [mode, settings.defaultDirection],
  );

  useEffect(() => {
    const source = practiceWrong ?? orderedPool.slice(batchStart, batchStart + SESSION_CAP);
    setQueue(source.map(makeCard));
    setStats({ answered: 0, correct: 0 });
    setWrong([]);
    setLastUndo(null);
  }, [orderedPool, batchStart, practiceWrong, makeCard]);

  const current = queue[0];
  const remainingInCorpus = orderedPool.length - batchStart - SESSION_CAP;
  const subtitle = daily
    ? "Due reviews, trouble words & new"
    : trouble
      ? "Trouble words"
      : scopeLabel({ lessonId, sectionId });

  if (!mounted) {
    return (
      <SessionShell title={MODE_LABEL[mode]}>
        <Loading />
      </SessionShell>
    );
  }

  if (orderedPool.length === 0) {
    return (
      <SessionShell title={MODE_LABEL[mode]}>
        <EmptyState reason={daily ? "daily" : trouble ? "trouble" : dueOnly ? "due" : "scope"} />
      </SessionShell>
    );
  }

  if (!current) {
    const total = stats.answered;
    const acc = total ? Math.round((stats.correct / total) * 100) : 0;
    return (
      <SessionShell title={MODE_LABEL[mode]} subtitle={subtitle}>
        <div className="card p-6 text-center">
          <div className="text-5xl">{acc >= 80 ? "🎉" : acc >= 50 ? "👍" : "💪"}</div>
          <h2 className="mt-3 text-xl font-semibold">Session complete</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {stats.correct} / {total} correct · {acc}% accuracy
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {currentStreak(statsData)}🔥 streak · {todayCount(statsData)}/{settings.dailyGoal}{" "}
            today
          </p>
          {wrong.length > 0 && (
            <div className="mx-auto mt-5 max-w-sm rounded-xl bg-rose-50 px-4 py-3 text-left text-sm dark:bg-rose-950/30">
              <p className="mb-1 font-semibold text-rose-700 dark:text-rose-300">
                Focus next time
              </p>
              <ul className="space-y-0.5 text-slate-700 dark:text-slate-300">
                {wrong.slice(0, 6).map((w) => (
                  <li key={w.item.id}>
                    <span className="font-medium">{w.item.target}</span> —{" "}
                    {w.item.english}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {wrong.length > 0 && (
              <button
                onClick={() => setPracticeWrong(wrong)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Practice {wrong.length} missed
              </button>
            )}
            {!practiceWrong && remainingInCorpus > 0 && (
              <button
                onClick={() => setBatchStart((s) => s + SESSION_CAP)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Next {Math.min(SESSION_CAP, remainingInCorpus)}
              </button>
            )}
            <button
              onClick={() => {
                setPracticeWrong(null);
                setBatchStart(0);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Restart
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Done
            </Link>
          </div>
        </div>
      </SessionShell>
    );
  }

  const advance = (grade: Grade) => {
    const u = gradeItem(current.ctx.item.id, grade);
    setLastUndo({ u, card: current, grade });
    setStats((s) => ({ answered: s.answered + 1, correct: s.correct + (grade === "again" ? 0 : 1) }));
    if (grade === "again") {
      setWrong((w) =>
        w.some((x) => x.item.id === current.ctx.item.id) ? w : [...w, current.ctx],
      );
    }
    setQueue((q) => {
      const [head, ...rest] = q;
      if (grade === "again" && head.requeues < MAX_REQUEUE) {
        return [...rest, { ...head, requeues: head.requeues + 1 }];
      }
      return rest;
    });
  };

  const undoLast = () => {
    if (!lastUndo) return;
    undoGrade(lastUndo.u);
    setStats((s) => ({
      answered: Math.max(0, s.answered - 1),
      correct: Math.max(0, s.correct - (lastUndo.grade === "again" ? 0 : 1)),
    }));
    setWrong((w) => w.filter((x) => x.item.id !== lastUndo.card.ctx.item.id));
    setQueue((q) => [{ ...lastUndo.card, requeues: 0 }, ...q]);
    setLastUndo(null);
  };

  const totalThisBatch = (practiceWrong ?? orderedPool.slice(batchStart, batchStart + SESSION_CAP))
    .length;
  const progressN = Math.min(stats.answered, totalThisBatch);

  return (
    <SessionShell title={MODE_LABEL[mode]} subtitle={subtitle}>
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>
            {progressN} / {totalThisBatch}
            {queue.length > 1 ? ` · ${queue.length} in queue` : ""}
          </span>
          <span>
            {stats.answered ? `${Math.round((stats.correct / stats.answered) * 100)}%` : ""}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${totalThisBatch ? (progressN / totalThisBatch) * 100 : 0}%` }}
          />
        </div>
      </div>

      {lastUndo && (
        <div className="mb-2 text-right">
          <button
            onClick={undoLast}
            className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-indigo-600 hover:underline"
          >
            ↩ Undo last grade
          </button>
        </div>
      )}

      <CardRenderer
        key={`${current.ctx.item.id}-${current.sub}-${current.requeues}-${stats.answered}`}
        card={current}
        englishPool={englishPool}
        targetPool={targetPool}
        onGrade={advance}
      />
    </SessionShell>
  );
}

function SessionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Loading() {
  return <div className="card grid h-56 place-items-center text-slate-400">Loading…</div>;
}

function EmptyState({ reason }: { reason: "due" | "trouble" | "scope" | "daily" }) {
  const copy = {
    daily: {
      icon: "🎉",
      title: "Daily goal reached",
      body: "Nothing left for today — no reviews due, no trouble words. Great work!",
    },
    due: {
      icon: "✅",
      title: "Nothing due right now",
      body: "You are all caught up. Come back later, or study a lesson to learn new words.",
    },
    trouble: {
      icon: "🌱",
      title: "No trouble words",
      body: "Nothing has tripped you up enough to land here yet. Keep practicing!",
    },
    scope: {
      icon: "📭",
      title: "No items here",
      body: "Pick a lesson from the home page to start practicing.",
    },
  }[reason];
  return (
    <div className="card p-8 text-center">
      <div className="text-4xl">{copy.icon}</div>
      <h2 className="mt-3 text-lg font-semibold">{copy.title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{copy.body}</p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Go home
      </Link>
    </div>
  );
}

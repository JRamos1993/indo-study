"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { getAffixPairs } from "@/lib/affixes";
import { getConfusableItems } from "@/lib/confusables";
import { getAllItems, getScopedItems, scopeLabel } from "@/lib/data";
import type { Card, Mode, SubMode } from "@/lib/practice-types";
import { type GradeUndo, gradeItem, troubleItemIds, undoGrade, useProgress } from "@/lib/progress";
import { type Direction, type KindedText, shuffle, wordTokens } from "@/lib/quiz";
import { type LearningFocus, useSettings } from "@/lib/settings";
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
  unit: "Study unit",
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

// Relative likelihood of each mixed/daily exercise type per learning focus.
// "conversation" leans on listening+speaking, "reading" on recognition/typing,
// "grammar" on cloze+word-order. resolveSub() still downgrades anything an item
// can't support, so these are soft preferences, not guarantees.
const FOCUS_WEIGHTS: Record<LearningFocus, Partial<Record<SubMode, number>>> = {
  balanced: { mc: 2.0, type: 1.6, cloze: 1.4, listening: 1.4, order: 1.2, speaking: 1.0, flashcards: 1.4 },
  conversation: { mc: 1.4, type: 0.9, cloze: 0.6, listening: 3.0, order: 0.6, speaking: 3.0, flashcards: 1.0 },
  reading: { mc: 2.6, type: 2.0, cloze: 1.2, listening: 0.5, order: 0.6, speaking: 0.3, flashcards: 2.4 },
  grammar: { mc: 1.2, type: 1.6, cloze: 3.0, listening: 0.6, order: 3.0, speaking: 0.5, flashcards: 1.0 },
};

function pickSub(mode: Mode, focus: LearningFocus): SubMode {
  // Character drills present items as flashcards / multiple-choice / typing.
  if (mode === "kana" || mode === "kanji") {
    const r = Math.random();
    return r < 0.45 ? "mc" : r < 0.8 ? "type" : "flashcards";
  }
  if (mode !== "mixed" && mode !== "daily") return mode as SubMode;
  const weights = FOCUS_WEIGHTS[focus] ?? FOCUS_WEIGHTS.balanced;
  const entries = Object.entries(weights) as [SubMode, number][];
  const total = entries.reduce((s, [, v]) => s + v, 0);
  let r = Math.random() * total;
  for (const [sub, v] of entries) {
    r -= v;
    if (r <= 0) return sub;
  }
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
  const storeRef = useRef(store);
  storeRef.current = store;
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
      base = getScopedItems({ lessonId, sectionId }).filter((c) => isDue(store[c.item.id]));
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
      // Guided unit study: introduce never-seen words as flashcards, quiz the rest.
      const sub =
        mode === "unit" && isNew(storeRef.current[ctx.item.id])
          ? "flashcards"
          : resolveSub(pickSub(mode === "unit" ? "mixed" : mode, settings.learningFocus), ctx, speechOK);
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
    [mode, settings.defaultDirection, settings.learningFocus],
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
    const streak = currentStreak(statsData);
    return (
      <SessionShell title={MODE_LABEL[mode]} subtitle={subtitle}>
        <div
          className="overflow-hidden rounded-[18px]"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-lime)" }}
        >
          {/* Lime accent banner */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-4"
            style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", borderBottom: "2px solid var(--edge)" }}
          >
            <div>
              <div className="text-[11.5px] font-extrabold uppercase tracking-[0.06em]" style={{ color: "var(--on-lime)" }}>
                Session complete
              </div>
              <h2 className="mt-0.5 font-display text-[22px] font-extrabold leading-none" style={{ color: "var(--lilt-ink)" }}>
                {acc >= 80 ? "Crushed it" : acc >= 50 ? "Nice work" : "Keep at it"}
              </h2>
            </div>
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
              style={{ background: "var(--lilt-ink)", color: "var(--lilt-lime)", border: "2px solid var(--edge)" }}
            >
              <Icon name="check" size={24} strokeWidth={3} />
            </span>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 divide-x-2" style={{ borderColor: "var(--edge)" }}>
            <RecapStat value={`${acc}%`} label="accuracy" accent />
            <RecapStat value={`${stats.correct}/${total}`} label="correct" />
            <RecapStat value={`${streak}`} label="day streak" />
          </div>

          <div className="p-6">
            <p className="text-center text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>
              {todayCount(statsData)}/{settings.dailyGoal} reviews today
            </p>

            {wrong.length > 0 && (
              <div
                className="mx-auto mt-5 max-w-sm rounded-[14px] p-4 text-left"
                style={{ border: "2px solid var(--edge)", background: "var(--tint-coral)" }}
              >
                <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.06em]" style={{ color: "var(--on-coral)" }}>
                  <Icon name="target" size={14} strokeWidth={2.2} /> Hardest items
                </p>
                <ul className="space-y-1.5">
                  {wrong.slice(0, 6).map((w) => (
                    <li key={w.item.id} className="flex gap-2 text-sm">
                      <span className="font-display font-extrabold" style={{ color: "var(--ink)" }}>{w.item.target}</span>
                      <span style={{ color: "var(--text-body)" }}>— {w.item.english}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {wrong.length > 0 && (
                <button onClick={() => setPracticeWrong(wrong)} className="btn btn-primary rounded-full">
                  Practice {wrong.length} missed
                </button>
              )}
              {!practiceWrong && remainingInCorpus > 0 && (
                <button
                  onClick={() => setBatchStart((s) => s + SESSION_CAP)}
                  className="btn btn-secondary rounded-full"
                >
                  Next {Math.min(SESSION_CAP, remainingInCorpus)}
                </button>
              )}
              <button
                onClick={() => {
                  setPracticeWrong(null);
                  setBatchStart(0);
                }}
                className="btn btn-secondary rounded-full"
              >
                Restart
              </button>
              <Link href="/learn" className="btn btn-secondary rounded-full">
                Done
              </Link>
            </div>
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
        <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-extrabold uppercase tracking-[0.05em]" style={{ color: "var(--muted)" }}>
          <span>
            {progressN} / {totalThisBatch}
            {queue.length > 1 ? ` · ${queue.length} in queue` : ""}
          </span>
          {stats.answered > 0 && (
            <span style={{ color: "var(--accent)" }}>
              {Math.round((stats.correct / stats.answered) * 100)}%
            </span>
          )}
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: "var(--track)", border: "2px solid var(--edge)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${totalThisBatch ? (progressN / totalThisBatch) * 100 : 0}%`, background: "var(--accent)" }}
          />
        </div>
      </div>

      {lastUndo && (
        <div className="mb-3 flex justify-end">
          <button
            onClick={undoLast}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-extrabold transition active:translate-x-[1px] active:translate-y-[1px] hover:-translate-y-0.5"
            style={{ background: "var(--panel)", color: "var(--muted)", border: "2px solid var(--border-soft)" }}
          >
            <Icon name="refresh" size={13} strokeWidth={2.4} /> Undo last grade
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
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-5">
        <h1 className="text-[26px] leading-none">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-[13px] font-bold" style={{ color: "var(--muted)" }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function RecapStat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="px-2 py-4 text-center">
      <div
        className="font-display text-[26px] font-extrabold leading-none"
        style={{ color: accent ? "var(--accent)" : "var(--ink)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.05em]" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div
      className="grid h-56 place-items-center rounded-[18px] text-[13px] font-bold"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)", color: "var(--muted)" }}
    >
      Loading…
    </div>
  );
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
    <div
      className="p-8 text-center rounded-[18px]"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)" }}
    >
      <div className="text-4xl">{copy.icon}</div>
      <h2 className="mt-3 font-display text-[19px] font-extrabold">{copy.title}</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] font-bold" style={{ color: "var(--muted)" }}>{copy.body}</p>
      <Link href="/learn" className="btn btn-primary rounded-full mt-5">
        Go home
      </Link>
    </div>
  );
}

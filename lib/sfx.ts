"use client";

// Tiny synthesized UI sounds (no audio assets, works offline). The browser
// only lets us create/resume an AudioContext after a user gesture — answering
// a card is one, so the first call lazily spins it up.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(ac: AudioContext, freq: number, at: number, dur: number, peak: number): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const t = ac.currentTime + at;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** A bright, pleasant two-note "ding" for a correct answer. */
export function playCorrect(): void {
  const ac = getCtx();
  if (!ac) return;
  // E5 → B5: a clean rising fifth.
  blip(ac, 659.25, 0, 0.16, 0.16);
  blip(ac, 987.77, 0.085, 0.26, 0.16);
}

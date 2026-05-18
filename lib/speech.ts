// Pronunciation: prefer bundled pre-generated audio (reliable on every device);
// fall back to the Web Speech API; degrade to a no-op if neither is available.

import { audioFileFor, hasBundledAudio } from "@/lib/audioManifest";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** True if we can pronounce anything at all (bundled audio or a voice). */
export function pronunciationAvailable(): boolean {
  return hasBundledAudio() || speechSupported();
}

let currentAudio: HTMLAudioElement | null = null;

/** Play a phrase: bundled mp3 if we generated one, else Web Speech. */
export function playPhrase(text: string): void {
  if (!text.trim()) return;
  const file = audioFileFor(text);
  if (file && typeof Audio !== "undefined") {
    if (speechSupported()) window.speechSynthesis.cancel();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const a = new Audio(`/audio/${file}`);
    currentAudio = a;
    a.play().catch(() => speak(text)); // autoplay blocked / missing file
    return;
  }
  speak(text);
}

function indonesianVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^id([-_]|$)/i.test(v.lang)) ??
    voices.find((v) => /indonesia/i.test(v.name)) ??
    null
  );
}

let warmed = false;
/** Voices can load asynchronously; trigger a load early. */
export function warmUpVoices(): void {
  if (warmed || !speechSupported()) return;
  warmed = true;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    /* voices now cached by the engine */
  });
}

export function hasIndonesianVoice(): boolean {
  return indonesianVoice() !== null;
}

export function speak(text: string): void {
  if (!speechSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything in progress
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  const v = indonesianVoice();
  if (v) u.voice = v;
  u.rate = 0.92;
  u.pitch = 1;
  synth.speak(u);
}

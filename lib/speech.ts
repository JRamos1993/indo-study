// Pronunciation: prefer bundled pre-generated audio (reliable on every device);
// fall back to the Web Speech API; degrade to a no-op if neither is available.
// Speech is language-aware: the voice/lang follow the active study language.

import { audioFileFor, hasBundledAudio } from "@/lib/audioManifest";
import { getLanguage } from "@/lib/languages";
import { getStudyLanguage } from "@/lib/settings";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** True if we can pronounce anything at all (bundled audio or a voice). */
export function pronunciationAvailable(): boolean {
  return hasBundledAudio() || speechSupported();
}

function activeSpeechLang(): string {
  return getLanguage(getStudyLanguage()).speechLang;
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

/** Pick a voice matching the BCP-47 language prefix (e.g. "ja", "id"). */
function voiceFor(speechLang: string): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const prefix = speechLang.split("-")[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === speechLang.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
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

export function speak(text: string, speechLang: string = activeSpeechLang()): void {
  if (!speechSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything in progress
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang;
  const v = voiceFor(speechLang);
  if (v) u.voice = v;
  u.rate = 0.92;
  u.pitch = 1;
  synth.speak(u);
}

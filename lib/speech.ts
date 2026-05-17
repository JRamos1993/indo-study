// Thin wrapper around the Web Speech API for Indonesian pronunciation.
// Degrades to a no-op if speech synthesis or an Indonesian voice is missing.

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
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

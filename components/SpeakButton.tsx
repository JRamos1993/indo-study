"use client";

import { useEffect } from "react";
import { getLanguage } from "@/lib/languages";
import { useSettings } from "@/lib/settings";
import { playPhrase, pronunciationAvailable, warmUpVoices } from "@/lib/speech";

export function SpeakButton({
  text,
  size = "md",
  className = "",
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const langName = getLanguage(useSettings().studyLanguage).name;

  useEffect(() => {
    warmUpVoices();
  }, []);

  if (!pronunciationAvailable()) return null;

  const dim = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "lg" ? 22 : size === "sm" ? 14 : 18;

  return (
    <button
      type="button"
      aria-label={`Hear "${text}" in ${langName}`}
      title="Hear pronunciation"
      onClick={(e) => {
        e.stopPropagation();
        playPhrase(text);
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-indigo-600 transition hover:bg-indigo-50 active:scale-95 dark:text-indigo-300 dark:hover:bg-indigo-950/60 ${dim} ${className}`}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    </button>
  );
}

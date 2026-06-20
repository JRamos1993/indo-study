"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    track("error", {
      message: String(error?.message || "render error").slice(0, 300),
      source: `boundary:${error?.digest || ""}`,
    });
  }, [error]);

  return (
    <div className="grid min-h-[60dvh] place-items-center px-5 text-center">
      <div>
        <h1 className="text-[26px]">Something went sideways</h1>
        <p className="mt-2 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
          A glitch on our end — your progress is safe and synced.
        </p>
        <button onClick={reset} className="btn btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}

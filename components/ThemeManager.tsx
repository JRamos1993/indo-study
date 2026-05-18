"use client";

import { useEffect } from "react";
import { applyTheme, useSettings } from "@/lib/settings";

export function ThemeManager() {
  const { theme } = useSettings();

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [theme]);

  return null;
}

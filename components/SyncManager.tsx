"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { syncNow } from "@/lib/sync";

// Drives cross-device sync for signed-in users: once on sign-in, every 60s,
// and when the tab is hidden. Renders nothing.
export function SyncManager() {
  const signedIn = !!useAuth().user;

  useEffect(() => {
    if (!signedIn) return;
    void syncNow();
    const iv = setInterval(() => void syncNow(), 60_000);
    const onHide = () => {
      if (document.visibilityState === "hidden") void syncNow();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [signedIn]);

  return null;
}

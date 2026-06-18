"use client";

import { exportProgress, replaceProgress } from "@/lib/progress";
import { type Settings, applyRemoteSettings, getSettings, getSettingsUpdatedAt } from "@/lib/settings";
import { type StatsData, exportStats, replaceStats } from "@/lib/stats";
import type { CardState } from "@/lib/srs";

let inFlight = false;

function maxMerge(a: Record<string, number> = {}, b: Record<string, number> = {}): Record<string, number> {
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

/**
 * Push local progress + stats to the server, then adopt the authoritative
 * merged result — re-merging anything that changed locally during the
 * round-trip so an in-flight grade is never lost. No-op (returns "fail")
 * when signed out or offline; the app keeps working from localStorage.
 */
export async function syncNow(): Promise<"ok" | "skip" | "fail"> {
  if (inFlight) return "skip";
  inFlight = true;
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress: exportProgress(),
        stats: exportStats(),
        settings: getSettings(),
        settingsUpdatedAt: getSettingsUpdatedAt(),
      }),
    });
    if (!res.ok) return "fail";
    const data = (await res.json()) as {
      progress?: Record<string, CardState>;
      stats?: StatsData;
      settings?: Partial<Settings>;
      settingsUpdatedAt?: number;
    };
    if (data.settings && typeof data.settingsUpdatedAt === "number") {
      applyRemoteSettings(data.settings, data.settingsUpdatedAt);
    }

    const cur = exportProgress();
    const mergedProgress: Record<string, CardState> = { ...(data.progress ?? {}) };
    for (const [id, st] of Object.entries(cur)) {
      const srv = mergedProgress[id];
      if (!srv || (st.lastReviewed ?? 0) >= (srv.lastReviewed ?? 0)) mergedProgress[id] = st;
    }
    replaceProgress(mergedProgress);

    const srvStats = data.stats ?? { reviewsByDay: {}, newByDay: {} };
    const curStats = exportStats();
    replaceStats({
      reviewsByDay: maxMerge(srvStats.reviewsByDay, curStats.reviewsByDay),
      newByDay: maxMerge(srvStats.newByDay, curStats.newByDay),
    });
    return "ok";
  } catch {
    return "fail";
  } finally {
    inFlight = false;
  }
}

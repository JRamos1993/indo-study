"use client";

import { type ProgressStore, exportProgress, replaceProgress } from "@/lib/progress";
import { type StatsData, exportStats, replaceStats } from "@/lib/stats";

export interface Backup {
  v: 1;
  exportedAt: string;
  progress: ProgressStore;
  stats: StatsData;
}

export function buildBackup(): Backup {
  return {
    v: 1,
    exportedAt: new Date().toISOString(),
    progress: exportProgress(),
    stats: exportStats(),
  };
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

export function restoreBackup(raw: string): { ok: true } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (!isRecord(data) || data.v !== 1 || !isRecord(data.progress) || !isRecord(data.stats)) {
    return { ok: false, error: "Unrecognized backup file." };
  }
  replaceProgress(data.progress as unknown as ProgressStore);
  replaceStats(data.stats as unknown as StatsData);
  return { ok: true };
}

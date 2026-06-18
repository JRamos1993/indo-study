"use client";

export interface CircleMember {
  name: string;
  handle: string | null;
  role: string;
  isYou: boolean;
  weekReviews: number;
  studiedToday: boolean;
}
export interface CircleFeedItem {
  name: string;
  day: string;
  reviews: number;
  isYou: boolean;
  isToday: boolean;
}
export interface CircleDetail {
  id: string;
  name: string;
  joinCode: string;
  isOwner: boolean;
  members: CircleMember[];
  weekTotal: number;
  goal: number | null;
  weekStart: string;
  feed: CircleFeedItem[];
}
export interface CircleData {
  circles: { id: string; name: string }[];
  current: CircleDetail | null;
}

async function api(path: string, opts?: RequestInit): Promise<any> {
  try {
    const res = await fetch(`/api/circle${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, ...(data ?? {}) };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

// NB: the mounted root is "/api/circle" (no trailing slash) — Hono won't match
// "/api/circle/", so call the base directly with an empty path.
export const getCircle = () => api("");
export const createCircle = (name: string) => api("", { method: "POST", body: JSON.stringify({ name }) });
export const joinCircle = (code: string) => api("/join", { method: "POST", body: JSON.stringify({ code }) });
export const leaveCircle = (circleId: string) => api("/leave", { method: "POST", body: JSON.stringify({ circleId }) });
export const setCircleGoal = (circleId: string, targetWords: number) =>
  api("/goal", { method: "PUT", body: JSON.stringify({ circleId, targetWords }) });

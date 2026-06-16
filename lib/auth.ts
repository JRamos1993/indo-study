"use client";

import { useSyncExternalStore } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  handle: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  status: "loading" | "ready";
}

let state: AuthState = { user: null, status: "loading" };
const SERVER: AuthState = { user: null, status: "loading" };
const listeners = new Set<() => void>();
let started = false;

function emit() {
  listeners.forEach((l) => l());
}
function set(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  emit();
}

async function api(path: string, opts?: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(`/api/auth${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON */
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    // Network/Worker unavailable (e.g. `next dev` has no /api) — stay local.
    return { ok: false, status: 0, data: null };
  }
}

export async function refreshAuth(): Promise<void> {
  const { data } = await api("/me");
  set({ user: data?.user ?? null, status: "ready" });
}

export async function signup(email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> {
  const { ok, data } = await api("/signup", { method: "POST", body: JSON.stringify({ email, password, name }) });
  if (ok && data?.user) {
    set({ user: data.user, status: "ready" });
    return { ok: true };
  }
  return { ok: false, error: data?.error ?? "network" };
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const { ok, data } = await api("/login", { method: "POST", body: JSON.stringify({ email, password }) });
  if (ok && data?.user) {
    set({ user: data.user, status: "ready" });
    return { ok: true };
  }
  return { ok: false, error: data?.error ?? "network" };
}

export async function logout(): Promise<void> {
  await api("/logout", { method: "POST" });
  set({ user: null, status: "ready" });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (!started) {
    started = true;
    void refreshAuth();
  }
  return () => listeners.delete(cb);
}

export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER,
  );
}

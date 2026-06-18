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

// Cache the signed-in user so a returning/offline PWA visit doesn't bounce the
// learner to the marketing page while /api/auth/me is unreachable.
const CACHE = "lilt:auth:v1";
function readCache(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const r = window.localStorage.getItem(CACHE);
    return r ? (JSON.parse(r) as AuthUser) : null;
  } catch {
    return null;
  }
}
function writeCache(u: AuthUser | null) {
  try {
    if (u) window.localStorage.setItem(CACHE, JSON.stringify(u));
    else window.localStorage.removeItem(CACHE);
  } catch {
    /* ignore */
  }
}

let state: AuthState = { user: typeof window !== "undefined" ? readCache() : null, status: "loading" };
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
function setUser(u: AuthUser | null) {
  writeCache(u);
  set({ user: u });
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
    return { ok: false, status: 0, data: null };
  }
}

export async function refreshAuth(): Promise<void> {
  const r = await api("/me");
  // Network/Worker unreachable: keep the cached user (offline-tolerant).
  if (r.status === 0) {
    set({ status: "ready" });
    return;
  }
  setUser(r.data?.user ?? null);
  set({ status: "ready" });
}

export async function signup(email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> {
  const { ok, data } = await api("/signup", { method: "POST", body: JSON.stringify({ email, password, name }) });
  if (ok && data?.user) {
    setUser(data.user);
    set({ status: "ready" });
    return { ok: true };
  }
  return { ok: false, error: data?.error ?? "network" };
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const { ok, data } = await api("/login", { method: "POST", body: JSON.stringify({ email, password }) });
  if (ok && data?.user) {
    setUser(data.user);
    set({ status: "ready" });
    return { ok: true };
  }
  return { ok: false, error: data?.error ?? "network" };
}

export async function logout(): Promise<void> {
  await api("/logout", { method: "POST" });
  setUser(null);
  set({ status: "ready" });
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

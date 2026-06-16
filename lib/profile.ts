"use client";

import { useSyncExternalStore } from "react";

// A lightweight, local profile (name + handle) stored on-device. When real
// accounts land (D1 backend), this becomes the cache for the signed-in user.
const KEY = "lilt:profile:v1";

export interface Profile {
  name: string;
  handle: string;
}

export const DEFAULT_PROFILE: Profile = { name: "Learner", handle: "learner" };

let cache: Profile | null = null;
const listeners = new Set<() => void>();

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const p = JSON.parse(raw) as Partial<Profile>;
    return {
      name: typeof p.name === "string" && p.name.trim() ? p.name : DEFAULT_PROFILE.name,
      handle: typeof p.handle === "string" && p.handle.trim() ? p.handle : DEFAULT_PROFILE.handle,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function ensure(): Profile {
  if (cache === null) cache = read();
  return cache;
}

export function getProfile(): Profile {
  return ensure();
}

export function updateProfile(patch: Partial<Profile>): void {
  const next = { ...ensure(), ...patch };
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, ensure, () => DEFAULT_PROFILE);
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/Icon";
import { getAllItems } from "@/lib/data";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { dueItemIds, useProgress } from "@/lib/progress";
import { updateSettings, useSettings } from "@/lib/settings";
import { useMounted } from "@/lib/useMounted";

export function Nav() {
  const pathname = usePathname();
  const store = useProgress();
  const mounted = useMounted();
  const lang = useSettings().studyLanguage;
  const langCfg = getLanguage(lang);

  const allIds = useMemo(() => getAllItems(lang).map((c) => c.item.id), [lang]);
  const due = mounted ? dueItemIds(store, allIds).length : 0;

  const tab = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
          active
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Link href="/" aria-label="Home" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Icon name="book" size={17} />
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight sm:block">Lingo</span>
          </Link>

          {/* Language switcher */}
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm" aria-hidden>
              {langCfg.flag}
            </span>
            <select
              aria-label="Study language"
              value={lang}
              onChange={(e) => updateSettings({ studyLanguage: e.target.value as LangId })}
              className="cursor-pointer rounded-full border border-slate-200 bg-white/80 py-1.5 pl-8 pr-7 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {LANG_IDS.map((id) => {
                const c = getLanguage(id);
                return (
                  <option key={id} value={id}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tab("/stats", "Stats")}
          <Link
            href="/today"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
              pathname === "/today"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            Study
            {mounted && due > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                {due}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className={`grid h-8 w-8 place-items-center rounded-lg transition ${
              pathname === "/settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.62.76 1.05 1.41 1.09H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}

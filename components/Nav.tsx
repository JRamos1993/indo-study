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

function LangSwitcher({ lang }: { lang: LangId }) {
  const cfg = getLanguage(lang);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm" aria-hidden>
        {cfg.flag}
      </span>
      <select
        aria-label="Study language"
        value={lang}
        onChange={(e) => updateSettings({ studyLanguage: e.target.value as LangId })}
        className="cursor-pointer rounded-lg py-1.5 pl-8 pr-6 text-sm font-bold"
        style={{ border: "2px solid var(--edge)", background: "var(--surface)", color: "var(--ink)" }}
      >
        {LANG_IDS.map((id) => (
          <option key={id} value={id}>
            {getLanguage(id).name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/learn" aria-label="Home" className="flex items-center gap-2">
      <span
        className="grid h-8 w-8 place-items-center rounded-lg text-white"
        style={{ background: "var(--accent)", border: "2px solid var(--edge)" }}
      >
        <Icon name="book" size={16} />
      </span>
      <span className="hidden font-display text-[16px] font-bold tracking-tight sm:block">Lingo</span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const store = useProgress();
  const mounted = useMounted();
  const lang = useSettings().studyLanguage;

  const allIds = useMemo(() => getAllItems(lang).map((c) => c.item.id), [lang]);
  const due = mounted ? dueItemIds(store, allIds).length : 0;

  const isLanding = pathname === "/";

  const header = (
    <header
      className="sticky top-0 z-20 backdrop-blur-xl"
      style={{ borderBottom: "2px solid var(--edge)", background: "color-mix(in srgb, var(--paper) 80%, transparent)" }}
    >
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
        {isLanding ? (
          <>
            <Link href="/" aria-label="Home" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: "var(--accent)", border: "2px solid var(--edge)" }}>
                <Icon name="book" size={16} />
              </span>
              <span className="font-display text-[16px] font-bold tracking-tight">Lingo</span>
            </Link>
            <div className="flex items-center gap-2">
              <LangSwitcher lang={lang} />
              <Link href="/learn" className="btn btn-primary px-3.5 py-1.5 text-sm">
                Open app
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Brand />
              <LangSwitcher lang={lang} />
            </div>
            <div className="flex items-center gap-1">
              <Tab href="/stats" label="Stats" pathname={pathname} />
              <Link
                href="/today"
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold transition"
                style={
                  pathname === "/today"
                    ? { background: "var(--accent)", color: "var(--accent-ink)" }
                    : { color: "var(--ink)" }
                }
              >
                Study
                {mounted && due > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-md px-1 text-xs font-bold text-white" style={{ background: "#e11d48" }}>
                    {due}
                  </span>
                )}
              </Link>
              <Link
                href="/settings"
                aria-label="Settings"
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={pathname === "/settings" ? { background: "var(--accent)", color: "var(--accent-ink)" } : { color: "var(--muted)" }}
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
          </>
        )}
      </nav>
    </header>
  );

  return header;
}

function Tab({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className="rounded-lg px-2.5 py-1.5 text-sm font-bold transition"
      style={active ? { background: "var(--accent)", color: "var(--accent-ink)" } : { color: "var(--ink)" }}
    >
      {label}
    </Link>
  );
}

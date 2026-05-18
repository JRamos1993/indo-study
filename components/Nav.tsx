"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getAllItems } from "@/lib/data";
import { dueItemIds, useProgress } from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";

export function Nav() {
  const pathname = usePathname();
  const store = useProgress();
  const mounted = useMounted();

  const allIds = useMemo(() => getAllItems().map((c) => c.item.id), []);
  const due = mounted ? dueItemIds(store, allIds).length : 0;

  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          active
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
            id
          </span>
          <span>Indo Study</span>
        </Link>
        <div className="flex items-center gap-1">
          {link("/", "Home")}
          {link("/stats", "Stats")}
          <Link
            href="/today"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              pathname === "/today"
                ? "bg-indigo-600 text-white"
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
        </div>
      </nav>
    </header>
  );
}

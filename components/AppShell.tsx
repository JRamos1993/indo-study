"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import { getAllItems } from "@/lib/data";
import { LANG_IDS, type LangId, getLanguage } from "@/lib/languages";
import { dueItemIds, useProgress } from "@/lib/progress";
import { useProfile } from "@/lib/profile";
import { updateSettings, useSettings } from "@/lib/settings";
import { isNew } from "@/lib/srs";
import { useMounted } from "@/lib/useMounted";

type NavDef = { href: string; label: string; icon: IconName; match: (p: string) => boolean };

// Note: Course→/learn and Progress→/stats are the current routes; they get
// renamed to /course and /progress in a later milestone (the match() globs
// already accept both so highlighting won't break when they move).
const NAV: NavDef[] = [
  { href: "/today", label: "Today", icon: "sun", match: (p) => p === "/today" || p.startsWith("/today/") },
  { href: "/learn", label: "Course", icon: "course", match: (p) => p.startsWith("/learn") || p.startsWith("/lessons") || p.startsWith("/course") },
  { href: "/practice", label: "Practice", icon: "target", match: (p) => p.startsWith("/practice") || p.startsWith("/study") || p.startsWith("/quiz") || p.startsWith("/review") },
  { href: "/glossary", label: "Glossary", icon: "doc", match: (p) => p.startsWith("/glossary") },
  { href: "/stats", label: "Progress", icon: "bars", match: (p) => p.startsWith("/stats") || p.startsWith("/progress") },
  { href: "/circle", label: "Circle", icon: "people", match: (p) => p.startsWith("/circle") },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Public, chrome-less pages: the marketing homepage and the sign-in flow.
  if (pathname === "/" || pathname === "/signin" || pathname.startsWith("/signin/")) {
    return <>{children}</>;
  }
  // Everything else requires an account. Onboarding stays chrome-less; the rest
  // gets the sidebar/framed-panel shell.
  const bare = pathname.startsWith("/onboarding");
  return (
    <RequireAuth>
      {bare ? <>{children}</> : <AppFrame pathname={pathname}>{children}</AppFrame>}
    </RequireAuth>
  );
}

// Gate: signed-out visitors are sent to the marketing homepage. The cached
// user (lib/auth) keeps this from bouncing a logged-in learner while offline.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === "ready" && !user) router.replace("/");
  }, [status, user, router]);

  if (status !== "ready" || !user) {
    return (
      <div className="grid min-h-[100dvh] place-items-center" style={{ background: "var(--paper)" }}>
        <span
          className="h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent"
          style={{ color: "var(--lilt-violet)" }}
          aria-label="Loading"
        />
      </div>
    );
  }
  return <>{children}</>;
}

// ── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center" aria-hidden>
        <svg viewBox="0 0 130 130" className="h-8 w-8">
          <path
            d="M26 24 h66 a18 18 0 0 1 18 18 v36 a18 18 0 0 1 -18 18 h-30 l-16 18 v-18 h-20 a18 18 0 0 1 -18 -18 v-36 a18 18 0 0 1 18 -18 z"
            fill="var(--lilt-yellow)"
            stroke="var(--edge)"
            strokeWidth="7"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-display text-[22px] font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
          Lilt
        </span>
      )}
    </span>
  );
}

// ── Language switcher (sidebar pill) ─────────────────────────────────────────

function LangSwitcher({ lang }: { lang: LangId }) {
  const cfg = getLanguage(lang);
  return (
    <div
      className="relative flex items-center gap-2.5 rounded-[13px] p-2.5"
      style={{ background: "var(--tint-violet-2)", border: "2px solid var(--edge)" }}
    >
      <span
        className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[7px] text-[15px]"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}
        aria-hidden
      >
        {cfg.flag}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[13.5px] font-extrabold" style={{ color: "var(--ink)" }}>
          {cfg.name}
        </span>
        <span className="block text-[11px] font-semibold" style={{ color: "var(--muted)" }}>
          {cfg.nativeName}
        </span>
      </span>
      <span className="ml-auto text-xs" style={{ color: "var(--muted)" }} aria-hidden>▾</span>
      <select
        aria-label="Study language"
        value={lang}
        onChange={(e) => updateSettings({ studyLanguage: e.target.value as LangId })}
        className="absolute inset-0 cursor-pointer opacity-0"
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

// ── App frame (sidebar + content + mobile bars) ──────────────────────────────

function AppFrame({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  const store = useProgress();
  const mounted = useMounted();
  const lang = useSettings().studyLanguage;
  const profile = useProfile();
  const initial = (profile.name.trim()[0] || "L").toUpperCase();
  const allIds = useMemo(() => getAllItems(lang).map((c) => c.item.id), [lang]);
  // "Reviews due" = scheduled items past due, excluding never-seen ones
  // (isDue(undefined) is true, so new items must be filtered out here).
  const due = mounted ? dueItemIds(store, allIds).filter((id) => !isNew(store[id])).length : 0;

  return (
    <div className="min-h-[100dvh]">
      {/* Mobile top bar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-2.5 backdrop-blur-xl lg:hidden"
        style={{ borderBottom: "2px solid var(--edge)", background: "color-mix(in srgb, var(--paper) 82%, transparent)" }}
      >
        <Link href="/" aria-label="Lilt — home"><Logo /></Link>
        <Link
          href="/profile"
          aria-label="Profile"
          className="grid h-9 w-9 place-items-center rounded-full font-display text-[15px] font-extrabold"
          style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}
        >
          {initial}
        </Link>
      </header>

      {/* Framed app panel on desktop; plain full-width stack on mobile */}
      <div className="mx-auto w-full max-w-[1240px] lg:px-8 lg:py-8">
        <div className="lg:grid lg:grid-cols-[236px_1fr] lg:overflow-hidden lg:rounded-[26px] lg:border-2 lg:[border-color:var(--edge)] lg:[background:var(--panel)] lg:[box-shadow:8px_8px_0_0_var(--edge)]">
          {/* Desktop sidebar */}
          <aside
            className="hidden flex-col gap-1 p-4 lg:flex"
            style={{ background: "var(--surface)", borderRight: "2px solid var(--edge)" }}
          >
            <Link href="/" aria-label="Lilt — home" className="mb-3 px-2 py-1">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <SidebarLink key={n.href} n={n} active={n.match(pathname)} badge={n.href === "/today" ? due : 0} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-[13px] p-2 transition"
            style={{ background: "var(--tint-violet-2)", border: "2px solid var(--edge)" }}
          >
            <span
              className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] font-display text-[14px] font-extrabold"
              style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}
            >
              {initial}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13.5px] font-extrabold" style={{ color: "var(--ink)" }}>{profile.name}</span>
              <span className="block text-[11px] font-bold" style={{ color: "var(--muted)" }}>View profile</span>
            </span>
            <Icon name="arrow" size={15} strokeWidth={2.2} />
          </Link>
          <LangSwitcher lang={lang} />
        </div>
          </aside>

          {/* Content — the dashboard uses the full column (it has a right
              rail); every other page is capped + centered for a comfortable,
              consistent width so nothing sprawls edge-to-edge. */}
          <main className="w-full px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
            {pathname === "/today" || pathname === "/today/" ? (
              children
            ) : (
              <div className="mx-auto w-full max-w-[860px]">{children}</div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch lg:hidden"
        style={{ background: "var(--surface)", borderTop: "2px solid var(--edge)" }}
      >
        {NAV.map((n) => {
          const active = n.match(pathname);
          return (
            <Link
              key={n.href}
              href={n.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold"
              style={{ color: active ? "var(--accent)" : "var(--muted)" }}
            >
              <Icon name={n.icon} size={21} strokeWidth={active ? 2.2 : 1.8} />
              {n.label}
              {n.href === "/today" && mounted && due > 0 && (
                <span
                  className="absolute right-[18%] top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-extrabold"
                  style={{ background: "var(--lilt-coral)", color: "#fff", border: "1.5px solid var(--edge)" }}
                >
                  {due}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarLink({ n, active, badge }: { n: NavDef; active: boolean; badge: number }) {
  const mounted = useMounted();
  return (
    <Link
      href={n.href}
      className="flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[14.5px] font-bold transition"
      style={
        active
          ? { background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }
          : { color: "var(--text-body)" }
      }
    >
      <Icon name={n.icon} size={20} strokeWidth={active ? 2.1 : 1.8} />
      <span>{n.label}</span>
      {badge > 0 && mounted && (
        <span
          className="ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-extrabold"
          style={
            active
              ? { background: "var(--accent-ink)", color: "var(--accent)" }
              : { background: "var(--lilt-coral)", color: "#fff", border: "1.5px solid var(--edge)" }
          }
        >
          {badge}
        </span>
      )}
    </Link>
  );
}


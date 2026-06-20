"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

/** Chrome for public, logged-out-readable pages (legal, guides): own header +
 *  footer instead of the app sidebar. The CTA adapts to auth so signed-in
 *  learners get back into the app and visitors get prompted to sign in. */
export function PublicPage({ children, maxWidth = 760 }: { children: React.ReactNode; maxWidth?: number }) {
  const { user } = useAuth();
  return (
    <div className="min-h-[100dvh]">
      <header
        className="sticky top-0 z-20 backdrop-blur-xl"
        style={{ borderBottom: "2px solid var(--edge)", background: "color-mix(in srgb, var(--paper) 82%, transparent)" }}
      >
        <div className="mx-auto flex items-center justify-between gap-2 px-5 py-3" style={{ maxWidth }}>
          <Link href="/" aria-label="Lilt — home">
            <Logo size={30} />
          </Link>
          <Link href={user ? "/today" : "/signin"} className="btn btn-primary px-4 py-2 text-sm">
            {user ? "Open app" : "Sign in"}
          </Link>
        </div>
      </header>
      <main className="mx-auto px-5 py-10" style={{ maxWidth }}>
        {children}
      </main>
      <footer className="mx-auto px-5 pb-12 pt-4" style={{ maxWidth }}>
        <div
          className="flex flex-wrap gap-x-5 gap-y-2 border-t-2 pt-5 text-[12.5px] font-bold"
          style={{ borderColor: "var(--edge)", color: "var(--muted)" }}
        >
          <Link href="/">Home</Link>
          <Link href="/guide/grammar">Grammar</Link>
          <Link href="/guide/pronunciation">Pronunciation</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

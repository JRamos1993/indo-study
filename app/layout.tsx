import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { RegisterSW } from "@/components/RegisterSW";
import { ThemeManager } from "@/components/ThemeManager";

// Applied before paint to avoid a light/dark flash on load.
const THEME_INIT = `(function(){try{var t=(JSON.parse(localStorage.getItem('indo-study:settings:v1')||'{}').theme)||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',!!d);}catch(e){}})();`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lingo Study — learn Indonesian & Japanese",
  description:
    "Study and test beginner Indonesian and Japanese with flashcards, quizzes, kana/kanji drills, and spaced repetition.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lingo Study", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <ThemeManager />
        <RegisterSW />
        <Nav />
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">{children}</main>
      </body>
    </html>
  );
}

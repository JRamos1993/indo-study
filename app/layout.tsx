import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { RegisterSW } from "@/components/RegisterSW";
import { ThemeManager } from "@/components/ThemeManager";

// Plus Jakarta Sans = body/UI; Bricolage Grotesque = display/headings/numbers.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Applied before paint to avoid a light/dark flash on load.
const THEME_INIT = `(function(){try{var t=(JSON.parse(localStorage.getItem('indo-study:settings:v1')||'{}').theme)||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',!!d);}catch(e){}})();`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lilt — learn Indonesian & Japanese",
  description:
    "A practice studio for Indonesian and Japanese — spaced review, a real exercise engine, and your whole word bank, offline.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lilt", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#6c4cf0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <ThemeManager />
        <RegisterSW />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

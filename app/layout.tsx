import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { RegisterSW } from "@/components/RegisterSW";
import { SyncManager } from "@/components/SyncManager";
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
const THEME_INIT = `(function(){try{var t=(JSON.parse(localStorage.getItem('indo-study:settings:v1')||'{}').theme)||'light';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',!!d);}catch(e){}})();`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const tagline =
  "Learn Indonesian & Japanese that actually sticks — FSRS spaced repetition, ten ways to practise, and a calm daily session. No leagues, no guilt.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lilt — learn Indonesian & Japanese",
    template: "%s · Lilt",
  },
  description: tagline,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lilt", statusBarStyle: "default" },
  applicationName: "Lilt",
  openGraph: {
    type: "website",
    siteName: "Lilt",
    url: siteUrl,
    title: "Lilt — learn Indonesian & Japanese",
    description: tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: "Lilt — learn Indonesian & Japanese",
    description: tagline,
  },
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
        <SyncManager />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

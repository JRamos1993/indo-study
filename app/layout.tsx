import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Indo Study — learn & test your Indonesian",
  description: "Study and memorize your Indonesian class materials with flashcards, quizzes, and spaced repetition.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">{children}</main>
      </body>
    </html>
  );
}

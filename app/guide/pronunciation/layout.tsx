import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pronunciation guide",
  description:
    "How Indonesian and Japanese sounds work — vowels, consonants, digraphs and stress — with examples you can hear.",
};

export default function PronunciationGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}

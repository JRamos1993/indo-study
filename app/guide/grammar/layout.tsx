import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grammar guide",
  description:
    "Core Indonesian and Japanese grammar explained simply, with worked examples — word order, tenses, particles, affixes, questions and more.",
};

export default function GrammarGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}

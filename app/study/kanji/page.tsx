import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function KanjiPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="kanji" />
    </Suspense>
  );
}

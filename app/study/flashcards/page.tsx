import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function FlashcardsPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="flashcards" />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function TypeAnswerPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="type" />
    </Suspense>
  );
}

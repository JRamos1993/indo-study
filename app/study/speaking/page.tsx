import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function SpeakingPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="speaking" />
    </Suspense>
  );
}

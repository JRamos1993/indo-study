import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function ClozePage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="cloze" />
    </Suspense>
  );
}

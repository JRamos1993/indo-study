import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="mixed" />
    </Suspense>
  );
}

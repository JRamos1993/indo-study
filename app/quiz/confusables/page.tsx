import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function ConfusablesPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="confusables" />
    </Suspense>
  );
}

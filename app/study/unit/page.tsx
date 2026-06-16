import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function UnitStudyPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="unit" />
    </Suspense>
  );
}

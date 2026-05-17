import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function MultipleChoicePage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="mc" />
    </Suspense>
  );
}

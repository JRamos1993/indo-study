import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function WordBuildingPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="wordbuilding" />
    </Suspense>
  );
}

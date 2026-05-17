import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function ListeningPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="listening" />
    </Suspense>
  );
}

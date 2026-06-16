import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

// The live "smart mix" daily session, launched from the Today dashboard.
export default function TodaySessionPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="daily" />
    </Suspense>
  );
}

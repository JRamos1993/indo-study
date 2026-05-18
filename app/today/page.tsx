import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function TodayPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="daily" />
    </Suspense>
  );
}

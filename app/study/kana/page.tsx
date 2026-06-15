import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function KanaPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="kana" />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PracticeSession } from "@/components/PracticeSession";

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <PracticeSession mode="order" />
    </Suspense>
  );
}

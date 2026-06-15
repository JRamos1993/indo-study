import { notFound } from "next/navigation";
import { LessonBrowser } from "@/components/LessonBrowser";
import { getAllLessons, getLesson } from "@/lib/data";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ lessonId: l.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  return <LessonBrowser lesson={lesson} />;
}

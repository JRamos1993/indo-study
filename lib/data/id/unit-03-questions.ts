import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u03-questions",
  date: "unit-03",
  title: "Asking Questions",
  sections: [
    {
      titleEn: "Question Words",
      titleId: "Kata Tanya",
      notes: [
        "mana combines with di / ke / dari: di mana (where at), ke mana (where to), dari mana (where from). kenapa is the casual form of mengapa (why).",
      ],
      items: [
        { target: "apa", en: "what", kind: "vocab" },
        { target: "siapa", en: "who", kind: "vocab" },
        { target: "mana", en: "which / where", kind: "vocab" },
        { target: "di mana", en: "where (at)", kind: "vocab" },
        { target: "ke mana", en: "where (to)", kind: "vocab" },
        { target: "dari mana", en: "where (from)", kind: "vocab" },
        { target: "kapan", en: "when", kind: "vocab" },
        { target: "mengapa", en: "why", kind: "vocab" },
        { target: "kenapa", en: "why (casual)", kind: "vocab" },
        { target: "bagaimana", en: "how", kind: "vocab" },
        { target: "berapa", en: "how much / how many", kind: "vocab" },
        { target: "yang mana", en: "which one", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Questions",
      titleId: "Contoh Pertanyaan",
      items: [
        { target: "Apa ini?", en: "What is this?", kind: "sentence" },
        { target: "Siapa itu?", en: "Who is that?", kind: "sentence" },
        { target: "Di mana kamu tinggal?", en: "Where do you live?", kind: "sentence" },
        { target: "Ke mana kamu pergi?", en: "Where are you going?", kind: "sentence" },
        { target: "Kapan kamu datang?", en: "When are you coming?", kind: "sentence" },
        { target: "Berapa harganya?", en: "How much is it?", kind: "sentence" },
        { target: "Mengapa kamu sedih?", en: "Why are you sad?", kind: "sentence" },
        { target: "Bagaimana kabarmu?", en: "How are you?", kind: "sentence" },
      ],
    },
  ],
};

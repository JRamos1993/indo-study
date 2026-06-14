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
        { idn: "apa", en: "what", kind: "vocab" },
        { idn: "siapa", en: "who", kind: "vocab" },
        { idn: "mana", en: "which / where", kind: "vocab" },
        { idn: "di mana", en: "where (at)", kind: "vocab" },
        { idn: "ke mana", en: "where (to)", kind: "vocab" },
        { idn: "dari mana", en: "where (from)", kind: "vocab" },
        { idn: "kapan", en: "when", kind: "vocab" },
        { idn: "mengapa", en: "why", kind: "vocab" },
        { idn: "kenapa", en: "why (casual)", kind: "vocab" },
        { idn: "bagaimana", en: "how", kind: "vocab" },
        { idn: "berapa", en: "how much / how many", kind: "vocab" },
        { idn: "yang mana", en: "which one", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Questions",
      titleId: "Contoh Pertanyaan",
      items: [
        { idn: "Apa ini?", en: "What is this?", kind: "sentence" },
        { idn: "Siapa itu?", en: "Who is that?", kind: "sentence" },
        { idn: "Di mana kamu tinggal?", en: "Where do you live?", kind: "sentence" },
        { idn: "Ke mana kamu pergi?", en: "Where are you going?", kind: "sentence" },
        { idn: "Kapan kamu datang?", en: "When did you come?", kind: "sentence" },
        { idn: "Berapa harganya?", en: "How much is it?", kind: "sentence" },
        { idn: "Mengapa kamu sedih?", en: "Why are you sad?", kind: "sentence" },
        { idn: "Bagaimana kabarmu?", en: "How are you?", kind: "sentence" },
      ],
    },
  ],
};

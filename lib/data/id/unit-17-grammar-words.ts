import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u17-grammar-words",
  date: "unit-17",
  title: "Grammar & Connector Words",
  sections: [
    {
      titleEn: "Connectors",
      titleId: "Kata Penghubung",
      notes: ["tapi is the casual form of tetapi (but). kalau and jika both mean 'if'; kalau is more casual."],
      items: [
        { target: "dan", en: "and", kind: "vocab" },
        { target: "atau", en: "or", kind: "vocab" },
        { target: "tetapi", en: "but", kind: "vocab" },
        { target: "tapi", en: "but (casual)", kind: "vocab" },
        { target: "karena", en: "because", kind: "vocab" },
        { target: "jadi", en: "so / therefore", kind: "vocab" },
        { target: "kalau", en: "if (casual)", kind: "vocab" },
        { target: "jika", en: "if", kind: "vocab" },
        { target: "untuk", en: "for / to", kind: "vocab" },
        { target: "dengan", en: "with", kind: "vocab" },
        { target: "tanpa", en: "without", kind: "vocab" },
        { target: "juga", en: "also / too", kind: "vocab" },
      ],
    },
    {
      titleEn: "Time & Aspect Markers",
      titleId: "Penanda Waktu",
      notes: [
        "Indonesian has no verb tenses — these little words carry the timing: sudah (already / done), belum (not yet), sedang (in the middle of), akan (will), masih (still).",
      ],
      items: [
        { target: "sudah", en: "already / done", kind: "vocab" },
        { target: "belum", en: "not yet", kind: "vocab" },
        { target: "sedang", en: "in the middle of (-ing)", kind: "vocab" },
        { target: "akan", en: "will / going to", kind: "vocab" },
        { target: "masih", en: "still", kind: "vocab" },
        { target: "pernah", en: "ever / have done", kind: "vocab" },
        { target: "lagi", en: "again / more", kind: "vocab" },
        { target: "saja", en: "only / just", kind: "vocab" },
      ],
    },
    {
      titleEn: "Helpers & Intensifiers",
      titleId: "Kata Bantu",
      notes: [
        "sangat goes before the word (sangat besar), sekali goes after (besar sekali); both mean 'very'. terlalu means 'too' (excessive). jangan = don't (negative command).",
      ],
      items: [
        { target: "harus", en: "must / have to", kind: "vocab" },
        { target: "boleh", en: "may / allowed", kind: "vocab" },
        { target: "jangan", en: "don't (command)", kind: "vocab" },
        { target: "sangat", en: "very", kind: "vocab" },
        { target: "sekali", en: "very (after the word)", kind: "vocab" },
        { target: "terlalu", en: "too (excessive)", kind: "vocab" },
        { target: "ini", en: "this", kind: "vocab" },
        { target: "itu", en: "that", kind: "vocab" },
        { target: "yang", en: "that / which (relativizer)", kind: "vocab" },
        { target: "ada", en: "there is / to have", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Saya mau kopi dan roti.", en: "I want coffee and bread.", kind: "sentence" },
        { target: "Saya lapar karena belum makan.", en: "I'm hungry because I haven't eaten.", kind: "sentence" },
        { target: "Dia sudah pergi.", en: "He / she has already left.", kind: "sentence" },
        { target: "Kalau hujan, saya di rumah.", en: "If it rains, I am at home.", kind: "sentence" },
        { target: "Saya masih belajar.", en: "I am still studying.", kind: "sentence" },
      ],
    },
  ],
};

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
        { idn: "dan", en: "and", kind: "vocab" },
        { idn: "atau", en: "or", kind: "vocab" },
        { idn: "tetapi", en: "but", kind: "vocab" },
        { idn: "tapi", en: "but (casual)", kind: "vocab" },
        { idn: "karena", en: "because", kind: "vocab" },
        { idn: "jadi", en: "so / therefore", kind: "vocab" },
        { idn: "kalau", en: "if (casual)", kind: "vocab" },
        { idn: "jika", en: "if", kind: "vocab" },
        { idn: "untuk", en: "for / to", kind: "vocab" },
        { idn: "dengan", en: "with", kind: "vocab" },
        { idn: "tanpa", en: "without", kind: "vocab" },
        { idn: "juga", en: "also / too", kind: "vocab" },
      ],
    },
    {
      titleEn: "Time & Aspect Markers",
      titleId: "Penanda Waktu",
      notes: [
        "Indonesian has no verb tenses — these little words carry the timing: sudah (already / done), belum (not yet), sedang (in the middle of), akan (will), masih (still).",
      ],
      items: [
        { idn: "sudah", en: "already / done", kind: "vocab" },
        { idn: "belum", en: "not yet", kind: "vocab" },
        { idn: "sedang", en: "in the middle of (-ing)", kind: "vocab" },
        { idn: "akan", en: "will / going to", kind: "vocab" },
        { idn: "masih", en: "still", kind: "vocab" },
        { idn: "pernah", en: "ever / have done", kind: "vocab" },
        { idn: "lagi", en: "again / more", kind: "vocab" },
        { idn: "saja", en: "only / just", kind: "vocab" },
      ],
    },
    {
      titleEn: "Helpers & Intensifiers",
      titleId: "Kata Bantu",
      notes: [
        "sangat goes before the word (sangat besar), sekali goes after (besar sekali); both mean 'very'. terlalu means 'too' (excessive). jangan = don't (negative command).",
      ],
      items: [
        { idn: "harus", en: "must / have to", kind: "vocab" },
        { idn: "boleh", en: "may / allowed", kind: "vocab" },
        { idn: "jangan", en: "don't (command)", kind: "vocab" },
        { idn: "sangat", en: "very", kind: "vocab" },
        { idn: "sekali", en: "very (after the word)", kind: "vocab" },
        { idn: "terlalu", en: "too (excessive)", kind: "vocab" },
        { idn: "ini", en: "this", kind: "vocab" },
        { idn: "itu", en: "that", kind: "vocab" },
        { idn: "yang", en: "that / which (relativizer)", kind: "vocab" },
        { idn: "ada", en: "there is / to have", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Saya mau kopi dan roti.", en: "I want coffee and bread.", kind: "sentence" },
        { idn: "Saya lapar karena belum makan.", en: "I'm hungry because I haven't eaten.", kind: "sentence" },
        { idn: "Dia sudah pergi.", en: "He / she has already left.", kind: "sentence" },
        { idn: "Kalau hujan, saya di rumah.", en: "If it rains, I stay home.", kind: "sentence" },
        { idn: "Saya masih belajar.", en: "I am still studying.", kind: "sentence" },
      ],
    },
  ],
};

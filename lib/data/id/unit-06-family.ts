import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u06-family",
  date: "unit-06",
  title: "Family",
  sections: [
    {
      titleEn: "Family Members",
      titleId: "Anggota Keluarga",
      notes: [
        "kakak = older sibling, adik = younger sibling (either gender). Add laki-laki or perempuan to specify: kakak laki-laki = older brother.",
      ],
      items: [
        { target: "keluarga", en: "family", kind: "vocab" },
        { target: "orang tua", en: "parents", kind: "vocab" },
        { target: "ayah", en: "father", kind: "vocab" },
        { target: "bapak", en: "father / sir", kind: "vocab" },
        { target: "ibu", en: "mother / ma'am", kind: "vocab" },
        { target: "anak", en: "child", kind: "vocab" },
        { target: "anak laki-laki", en: "son", kind: "vocab" },
        { target: "anak perempuan", en: "daughter", kind: "vocab" },
        { target: "kakak", en: "older sibling", kind: "vocab" },
        { target: "adik", en: "younger sibling", kind: "vocab" },
        { target: "abang", en: "older brother (regional)", kind: "vocab" },
        { target: "suami", en: "husband", kind: "vocab" },
        { target: "istri", en: "wife", kind: "vocab" },
      ],
    },
    {
      titleEn: "Extended Family",
      titleId: "Keluarga Besar",
      items: [
        { target: "kakek", en: "grandfather", kind: "vocab" },
        { target: "nenek", en: "grandmother", kind: "vocab" },
        { target: "paman", en: "uncle", kind: "vocab" },
        { target: "bibi", en: "aunt", kind: "vocab" },
        { target: "sepupu", en: "cousin", kind: "vocab" },
        { target: "cucu", en: "grandchild", kind: "vocab" },
        { target: "saudara", en: "sibling / relative", kind: "vocab" },
        { target: "menikah", en: "to marry / married", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Ini keluarga saya.", en: "This is my family.", kind: "sentence" },
        { target: "Saya punya dua adik.", en: "I have two younger siblings.", kind: "sentence" },
        { target: "Ayah saya seorang guru.", en: "My father is a teacher.", kind: "sentence" },
        { target: "Kakak saya tinggal di Bali.", en: "My older sibling lives in Bali.", kind: "sentence" },
        { target: "Berapa orang di keluargamu?", en: "How many people are in your family?", kind: "sentence" },
      ],
    },
  ],
};

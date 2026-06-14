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
        { idn: "keluarga", en: "family", kind: "vocab" },
        { idn: "orang tua", en: "parents", kind: "vocab" },
        { idn: "ayah", en: "father", kind: "vocab" },
        { idn: "bapak", en: "father / sir", kind: "vocab" },
        { idn: "ibu", en: "mother / ma'am", kind: "vocab" },
        { idn: "anak", en: "child", kind: "vocab" },
        { idn: "anak laki-laki", en: "son", kind: "vocab" },
        { idn: "anak perempuan", en: "daughter", kind: "vocab" },
        { idn: "kakak", en: "older sibling", kind: "vocab" },
        { idn: "adik", en: "younger sibling", kind: "vocab" },
        { idn: "abang", en: "older brother (regional)", kind: "vocab" },
        { idn: "suami", en: "husband", kind: "vocab" },
        { idn: "istri", en: "wife", kind: "vocab" },
      ],
    },
    {
      titleEn: "Extended Family",
      titleId: "Keluarga Besar",
      items: [
        { idn: "kakek", en: "grandfather", kind: "vocab" },
        { idn: "nenek", en: "grandmother", kind: "vocab" },
        { idn: "paman", en: "uncle", kind: "vocab" },
        { idn: "bibi", en: "aunt", kind: "vocab" },
        { idn: "sepupu", en: "cousin", kind: "vocab" },
        { idn: "cucu", en: "grandchild", kind: "vocab" },
        { idn: "saudara", en: "sibling / relative", kind: "vocab" },
        { idn: "menikah", en: "to marry / married", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Ini keluarga saya.", en: "This is my family.", kind: "sentence" },
        { idn: "Saya punya dua adik.", en: "I have two younger siblings.", kind: "sentence" },
        { idn: "Ayah saya seorang guru.", en: "My father is a teacher.", kind: "sentence" },
        { idn: "Kakak saya tinggal di Bali.", en: "My older sibling lives in Bali.", kind: "sentence" },
        { idn: "Berapa orang di keluargamu?", en: "How many people are in your family?", kind: "sentence" },
      ],
    },
  ],
};

import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u04-numbers",
  date: "unit-04",
  title: "Numbers & Counting",
  sections: [
    {
      titleEn: "Zero to Ten",
      titleId: "Nol sampai Sepuluh",
      items: [
        { idn: "nol", en: "zero", kind: "vocab" },
        { idn: "satu", en: "one", kind: "vocab" },
        { idn: "dua", en: "two", kind: "vocab" },
        { idn: "tiga", en: "three", kind: "vocab" },
        { idn: "empat", en: "four", kind: "vocab" },
        { idn: "lima", en: "five", kind: "vocab" },
        { idn: "enam", en: "six", kind: "vocab" },
        { idn: "tujuh", en: "seven", kind: "vocab" },
        { idn: "delapan", en: "eight", kind: "vocab" },
        { idn: "sembilan", en: "nine", kind: "vocab" },
        { idn: "sepuluh", en: "ten", kind: "vocab" },
      ],
    },
    {
      titleEn: "Bigger Numbers",
      titleId: "Angka Lebih Besar",
      notes: [
        "Teens use belas (sebelas = 11, dua belas = 12). Tens use puluh (dua puluh = 20). Then ratus (hundred), ribu (thousand), juta (million). 'se-' means 'one': seratus = 100, seribu = 1000.",
      ],
      items: [
        { idn: "sebelas", en: "eleven", kind: "vocab" },
        { idn: "dua belas", en: "twelve", kind: "vocab" },
        { idn: "lima belas", en: "fifteen", kind: "vocab" },
        { idn: "dua puluh", en: "twenty", kind: "vocab" },
        { idn: "dua puluh lima", en: "twenty-five", kind: "vocab" },
        { idn: "tiga puluh", en: "thirty", kind: "vocab" },
        { idn: "lima puluh", en: "fifty", kind: "vocab" },
        { idn: "seratus", en: "one hundred", kind: "vocab" },
        { idn: "seribu", en: "one thousand", kind: "vocab" },
        { idn: "sejuta", en: "one million", kind: "vocab" },
      ],
    },
    {
      titleEn: "Counting & Quantity",
      titleId: "Menghitung dan Jumlah",
      notes: [
        "With a number you usually do NOT make the noun plural: 'tiga buku' (three books), not 'tiga buku-buku'. Classifiers: orang (people), ekor (animals), buah (objects).",
      ],
      items: [
        { idn: "banyak", en: "many / a lot", kind: "vocab" },
        { idn: "sedikit", en: "a little / few", kind: "vocab" },
        { idn: "setengah", en: "half", kind: "vocab" },
        { idn: "semua", en: "all", kind: "vocab" },
        { idn: "beberapa", en: "some / several", kind: "vocab" },
        { idn: "pertama", en: "first", kind: "vocab" },
        { idn: "kedua", en: "second", kind: "vocab" },
        { idn: "terakhir", en: "last", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Saya punya dua anak.", en: "I have two children.", kind: "sentence" },
        { idn: "Ada lima orang di sini.", en: "There are five people here.", kind: "sentence" },
        { idn: "Harganya sepuluh ribu rupiah.", en: "The price is ten thousand rupiah.", kind: "sentence" },
        { idn: "Saya mau dua, tolong.", en: "I want two, please.", kind: "sentence" },
      ],
    },
  ],
};

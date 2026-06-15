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
        { target: "nol", en: "zero", kind: "vocab" },
        { target: "satu", en: "one", kind: "vocab" },
        { target: "dua", en: "two", kind: "vocab" },
        { target: "tiga", en: "three", kind: "vocab" },
        { target: "empat", en: "four", kind: "vocab" },
        { target: "lima", en: "five", kind: "vocab" },
        { target: "enam", en: "six", kind: "vocab" },
        { target: "tujuh", en: "seven", kind: "vocab" },
        { target: "delapan", en: "eight", kind: "vocab" },
        { target: "sembilan", en: "nine", kind: "vocab" },
        { target: "sepuluh", en: "ten", kind: "vocab" },
      ],
    },
    {
      titleEn: "Bigger Numbers",
      titleId: "Angka Lebih Besar",
      notes: [
        "Teens use belas (sebelas = 11, dua belas = 12). Tens use puluh (dua puluh = 20). Then ratus (hundred), ribu (thousand), juta (million). 'se-' means 'one': seratus = 100, seribu = 1000.",
      ],
      items: [
        { target: "sebelas", en: "eleven", kind: "vocab" },
        { target: "dua belas", en: "twelve", kind: "vocab" },
        { target: "lima belas", en: "fifteen", kind: "vocab" },
        { target: "dua puluh", en: "twenty", kind: "vocab" },
        { target: "dua puluh lima", en: "twenty-five", kind: "vocab" },
        { target: "tiga puluh", en: "thirty", kind: "vocab" },
        { target: "lima puluh", en: "fifty", kind: "vocab" },
        { target: "seratus", en: "one hundred", kind: "vocab" },
        { target: "seribu", en: "one thousand", kind: "vocab" },
        { target: "sejuta", en: "one million", kind: "vocab" },
      ],
    },
    {
      titleEn: "Counting & Quantity",
      titleId: "Menghitung dan Jumlah",
      notes: [
        "With a number you usually do NOT make the noun plural: 'tiga buku' (three books), not 'tiga buku-buku'. Classifiers: orang (people), ekor (animals), buah (objects).",
      ],
      items: [
        { target: "banyak", en: "many / a lot", kind: "vocab" },
        { target: "sedikit", en: "a little / few", kind: "vocab" },
        { target: "setengah", en: "half", kind: "vocab" },
        { target: "semua", en: "all", kind: "vocab" },
        { target: "beberapa", en: "some / several", kind: "vocab" },
        { target: "pertama", en: "first", kind: "vocab" },
        { target: "kedua", en: "second", kind: "vocab" },
        { target: "terakhir", en: "last", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Saya punya dua anak.", en: "I have two children.", kind: "sentence" },
        { target: "Ada lima orang di sini.", en: "There are five people here.", kind: "sentence" },
        { target: "Harganya sepuluh ribu rupiah.", en: "The price is ten thousand rupiah.", kind: "sentence" },
        { target: "Saya mau dua, tolong.", en: "I want two, please.", kind: "sentence" },
      ],
    },
  ],
};

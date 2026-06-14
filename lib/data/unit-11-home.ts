import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u11-home",
  date: "unit-11",
  title: "Home & Everyday Objects",
  sections: [
    {
      titleEn: "Rooms",
      titleId: "Ruangan",
      items: [
        { idn: "kamar", en: "room", kind: "vocab" },
        { idn: "kamar tidur", en: "bedroom", kind: "vocab" },
        { idn: "kamar mandi", en: "bathroom", kind: "vocab" },
        { idn: "dapur", en: "kitchen", kind: "vocab" },
        { idn: "ruang tamu", en: "living room", kind: "vocab" },
        { idn: "pintu", en: "door", kind: "vocab" },
        { idn: "jendela", en: "window", kind: "vocab" },
        { idn: "lantai", en: "floor", kind: "vocab" },
      ],
    },
    {
      titleEn: "Everyday Objects",
      titleId: "Benda Sehari-hari",
      items: [
        { idn: "meja", en: "table", kind: "vocab" },
        { idn: "kursi", en: "chair", kind: "vocab" },
        { idn: "tempat tidur", en: "bed", kind: "vocab" },
        { idn: "lampu", en: "lamp / light", kind: "vocab" },
        { idn: "buku", en: "book", kind: "vocab" },
        { idn: "pena", en: "pen", kind: "vocab" },
        { idn: "kertas", en: "paper", kind: "vocab" },
        { idn: "tas", en: "bag", kind: "vocab" },
        { idn: "kunci", en: "key", kind: "vocab" },
        { idn: "jam", en: "clock / watch", kind: "vocab" },
        { idn: "telepon", en: "telephone", kind: "vocab" },
        { idn: "hape", en: "mobile phone", kind: "vocab" },
        { idn: "uang", en: "money", kind: "vocab" },
        { idn: "mobil", en: "car", kind: "vocab" },
        { idn: "motor", en: "motorbike", kind: "vocab" },
        { idn: "sepeda", en: "bicycle", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Buku itu ada di atas meja.", en: "The book is on the table.", kind: "sentence" },
        { idn: "Di mana kunci saya?", en: "Where is my key?", kind: "sentence" },
        { idn: "Saya punya mobil baru.", en: "I have a new car.", kind: "sentence" },
        { idn: "Tolong tutup pintu.", en: "Please close the door.", kind: "sentence" },
      ],
    },
  ],
};

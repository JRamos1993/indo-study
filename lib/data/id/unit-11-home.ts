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
        { target: "kamar", en: "room", kind: "vocab" },
        { target: "kamar tidur", en: "bedroom", kind: "vocab" },
        { target: "kamar mandi", en: "bathroom", kind: "vocab" },
        { target: "dapur", en: "kitchen", kind: "vocab" },
        { target: "ruang tamu", en: "living room", kind: "vocab" },
        { target: "pintu", en: "door", kind: "vocab" },
        { target: "jendela", en: "window", kind: "vocab" },
        { target: "lantai", en: "floor", kind: "vocab" },
      ],
    },
    {
      titleEn: "Everyday Objects",
      titleId: "Benda Sehari-hari",
      items: [
        { target: "meja", en: "table", kind: "vocab" },
        { target: "kursi", en: "chair", kind: "vocab" },
        { target: "tempat tidur", en: "bed", kind: "vocab" },
        { target: "lampu", en: "lamp / light", kind: "vocab" },
        { target: "buku", en: "book", kind: "vocab" },
        { target: "pena", en: "pen", kind: "vocab" },
        { target: "kertas", en: "paper", kind: "vocab" },
        { target: "tas", en: "bag", kind: "vocab" },
        { target: "kunci", en: "key", kind: "vocab" },
        { target: "jam", en: "clock / watch", kind: "vocab" },
        { target: "telepon", en: "telephone", kind: "vocab" },
        { target: "hape", en: "mobile phone", kind: "vocab", note: "Informal; in formal contexts write HP or telepon genggam." },
        { target: "uang", en: "money", kind: "vocab" },
        { target: "mobil", en: "car", kind: "vocab" },
        { target: "motor", en: "motorbike", kind: "vocab" },
        { target: "sepeda", en: "bicycle", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Buku itu ada di atas meja.", en: "The book is on the table.", kind: "sentence" },
        { target: "Di mana kunci saya?", en: "Where is my key?", kind: "sentence" },
        { target: "Saya punya mobil baru.", en: "I have a new car.", kind: "sentence" },
        { target: "Tolong tutup pintu.", en: "Please close the door.", kind: "sentence" },
      ],
    },
  ],
};

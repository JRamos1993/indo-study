import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u13-colors-clothes",
  date: "unit-13",
  title: "Colors & Clothing",
  sections: [
    {
      titleEn: "Colors",
      titleId: "Warna",
      notes: ["'warna' means colour. The colour comes after the noun: 'baju merah' = red shirt."],
      items: [
        { idn: "warna", en: "color", kind: "vocab" },
        { idn: "merah", en: "red", kind: "vocab" },
        { idn: "biru", en: "blue", kind: "vocab" },
        { idn: "kuning", en: "yellow", kind: "vocab" },
        { idn: "hijau", en: "green", kind: "vocab" },
        { idn: "hitam", en: "black", kind: "vocab" },
        { idn: "putih", en: "white", kind: "vocab" },
        { idn: "cokelat", en: "brown", kind: "vocab" },
        { idn: "abu-abu", en: "gray", kind: "vocab" },
        { idn: "merah muda", en: "pink", kind: "vocab" },
        { idn: "oranye", en: "orange", kind: "vocab" },
        { idn: "ungu", en: "purple", kind: "vocab" },
      ],
    },
    {
      titleEn: "Clothing",
      titleId: "Pakaian",
      items: [
        { idn: "pakaian", en: "clothing", kind: "vocab" },
        { idn: "baju", en: "shirt / clothes", kind: "vocab" },
        { idn: "kaus", en: "t-shirt", kind: "vocab" },
        { idn: "celana", en: "trousers / pants", kind: "vocab" },
        { idn: "rok", en: "skirt", kind: "vocab" },
        { idn: "sepatu", en: "shoes", kind: "vocab" },
        { idn: "kaus kaki", en: "socks", kind: "vocab" },
        { idn: "topi", en: "hat", kind: "vocab" },
        { idn: "jaket", en: "jacket", kind: "vocab" },
        { idn: "tas", en: "bag", kind: "vocab" },
        { idn: "kacamata", en: "glasses", kind: "vocab" },
        { idn: "memakai", en: "to wear / use", kind: "vocab", root: "pakai" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Saya suka baju biru ini.", en: "I like this blue shirt.", kind: "sentence" },
        { idn: "Dia memakai topi merah.", en: "He / she is wearing a red hat.", kind: "sentence" },
        { idn: "Sepatu ini terlalu mahal.", en: "These shoes are too expensive.", kind: "sentence" },
        { idn: "Apa warna favoritmu?", en: "What is your favorite color?", kind: "sentence" },
      ],
    },
  ],
};

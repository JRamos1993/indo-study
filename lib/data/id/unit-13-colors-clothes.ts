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
        { target: "warna", en: "color", kind: "vocab" },
        { target: "merah", en: "red", kind: "vocab" },
        { target: "biru", en: "blue", kind: "vocab" },
        { target: "kuning", en: "yellow", kind: "vocab" },
        { target: "hijau", en: "green", kind: "vocab" },
        { target: "hitam", en: "black", kind: "vocab" },
        { target: "putih", en: "white", kind: "vocab" },
        { target: "cokelat", en: "brown", kind: "vocab" },
        { target: "abu-abu", en: "gray", kind: "vocab" },
        { target: "merah muda", en: "pink", kind: "vocab" },
        { target: "oranye", en: "orange", kind: "vocab" },
        { target: "ungu", en: "purple", kind: "vocab" },
      ],
    },
    {
      titleEn: "Clothing",
      titleId: "Pakaian",
      items: [
        { target: "pakaian", en: "clothing", kind: "vocab" },
        { target: "baju", en: "shirt / clothes", kind: "vocab" },
        { target: "kaus", en: "t-shirt", kind: "vocab" },
        { target: "celana", en: "trousers / pants", kind: "vocab" },
        { target: "rok", en: "skirt", kind: "vocab" },
        { target: "sepatu", en: "shoes", kind: "vocab" },
        { target: "kaus kaki", en: "socks", kind: "vocab" },
        { target: "topi", en: "hat", kind: "vocab" },
        { target: "jaket", en: "jacket", kind: "vocab" },
        { target: "tas", en: "bag", kind: "vocab" },
        { target: "kacamata", en: "glasses", kind: "vocab" },
        { target: "memakai", en: "to wear / use", kind: "vocab", root: "pakai" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Saya suka baju biru ini.", en: "I like this blue shirt.", kind: "sentence" },
        { target: "Dia memakai topi merah.", en: "He / she is wearing a red hat.", kind: "sentence" },
        { target: "Sepatu ini terlalu mahal.", en: "These shoes are too expensive.", kind: "sentence" },
        { target: "Apa warna favoritmu?", en: "What is your favorite color?", kind: "sentence" },
      ],
    },
  ],
};

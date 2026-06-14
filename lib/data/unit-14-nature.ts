import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u14-nature",
  date: "unit-14",
  title: "Nature, Weather & Animals",
  sections: [
    {
      titleEn: "Weather",
      titleId: "Cuaca",
      items: [
        { idn: "cuaca", en: "weather", kind: "vocab" },
        { idn: "cerah", en: "sunny / clear", kind: "vocab" },
        { idn: "hujan", en: "rain / rainy", kind: "vocab" },
        { idn: "panas", en: "hot", kind: "vocab" },
        { idn: "dingin", en: "cold", kind: "vocab" },
        { idn: "angin", en: "wind", kind: "vocab" },
        { idn: "awan", en: "cloud", kind: "vocab" },
        { idn: "musim", en: "season", kind: "vocab" },
        { idn: "musim hujan", en: "rainy season", kind: "vocab" },
        { idn: "musim kemarau", en: "dry season", kind: "vocab" },
      ],
    },
    {
      titleEn: "Nature",
      titleId: "Alam",
      items: [
        { idn: "matahari", en: "sun", kind: "vocab" },
        { idn: "bulan", en: "moon / month", kind: "vocab" },
        { idn: "bintang", en: "star", kind: "vocab" },
        { idn: "langit", en: "sky", kind: "vocab" },
        { idn: "laut", en: "sea", kind: "vocab" },
        { idn: "gunung", en: "mountain", kind: "vocab" },
        { idn: "sungai", en: "river", kind: "vocab" },
        { idn: "pohon", en: "tree", kind: "vocab" },
        { idn: "bunga", en: "flower", kind: "vocab" },
        { idn: "pantai", en: "beach", kind: "vocab" },
      ],
    },
    {
      titleEn: "Animals",
      titleId: "Hewan",
      items: [
        { idn: "hewan", en: "animal", kind: "vocab" },
        { idn: "kucing", en: "cat", kind: "vocab" },
        { idn: "anjing", en: "dog", kind: "vocab" },
        { idn: "burung", en: "bird", kind: "vocab" },
        { idn: "ikan", en: "fish", kind: "vocab" },
        { idn: "ayam", en: "chicken", kind: "vocab" },
        { idn: "sapi", en: "cow", kind: "vocab" },
        { idn: "kuda", en: "horse", kind: "vocab" },
        { idn: "monyet", en: "monkey", kind: "vocab" },
        { idn: "ular", en: "snake", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Hari ini cuacanya cerah.", en: "Today the weather is sunny.", kind: "sentence" },
        { idn: "Saya suka pergi ke pantai.", en: "I like going to the beach.", kind: "sentence" },
        { idn: "Saya punya dua kucing.", en: "I have two cats.", kind: "sentence" },
        { idn: "Sekarang musim hujan.", en: "It is the rainy season now.", kind: "sentence" },
      ],
    },
  ],
};

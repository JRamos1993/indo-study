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
        { target: "cuaca", en: "weather", kind: "vocab" },
        { target: "cerah", en: "sunny / clear", kind: "vocab" },
        { target: "hujan", en: "rain / rainy", kind: "vocab" },
        { target: "panas", en: "hot", kind: "vocab" },
        { target: "dingin", en: "cold", kind: "vocab" },
        { target: "angin", en: "wind", kind: "vocab" },
        { target: "awan", en: "cloud", kind: "vocab" },
        { target: "musim", en: "season", kind: "vocab" },
        { target: "musim hujan", en: "rainy season", kind: "vocab" },
        { target: "musim kemarau", en: "dry season", kind: "vocab" },
      ],
    },
    {
      titleEn: "Nature",
      titleId: "Alam",
      items: [
        { target: "matahari", en: "sun", kind: "vocab" },
        { target: "bulan", en: "moon / month", kind: "vocab" },
        { target: "bintang", en: "star", kind: "vocab" },
        { target: "langit", en: "sky", kind: "vocab" },
        { target: "laut", en: "sea", kind: "vocab" },
        { target: "gunung", en: "mountain", kind: "vocab" },
        { target: "sungai", en: "river", kind: "vocab" },
        { target: "pohon", en: "tree", kind: "vocab" },
        { target: "bunga", en: "flower", kind: "vocab" },
        { target: "pantai", en: "beach", kind: "vocab" },
      ],
    },
    {
      titleEn: "Animals",
      titleId: "Hewan",
      items: [
        { target: "hewan", en: "animal", kind: "vocab" },
        { target: "kucing", en: "cat", kind: "vocab" },
        { target: "anjing", en: "dog", kind: "vocab" },
        { target: "burung", en: "bird", kind: "vocab" },
        { target: "ikan", en: "fish", kind: "vocab" },
        { target: "ayam", en: "chicken", kind: "vocab" },
        { target: "sapi", en: "cow", kind: "vocab" },
        { target: "kuda", en: "horse", kind: "vocab" },
        { target: "monyet", en: "monkey", kind: "vocab" },
        { target: "ular", en: "snake", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Hari ini cuacanya cerah.", en: "Today the weather is sunny.", kind: "sentence" },
        { target: "Saya suka pergi ke pantai.", en: "I like going to the beach.", kind: "sentence" },
        { target: "Saya punya dua kucing.", en: "I have two cats.", kind: "sentence" },
        { target: "Sekarang musim hujan.", en: "It is the rainy season now.", kind: "sentence" },
      ],
    },
  ],
};

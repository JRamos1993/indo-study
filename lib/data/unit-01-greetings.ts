import type { RawLesson } from "@/lib/types";

// Beginner Indonesian curriculum — curated high-frequency content (A1).
export const lesson: RawLesson = {
  id: "u01-greetings",
  date: "unit-01",
  title: "Greetings & Politeness",
  sections: [
    {
      titleEn: "Greetings",
      titleId: "Salam",
      notes: [
        "Indonesian greetings change with the time of day: pagi (morning), siang (midday), sore (late afternoon), malam (night).",
      ],
      items: [
        { idn: "halo", en: "hello", kind: "vocab" },
        { idn: "hai", en: "hi", kind: "vocab" },
        { idn: "selamat pagi", en: "good morning", kind: "vocab" },
        { idn: "selamat siang", en: "good afternoon (midday)", kind: "vocab" },
        { idn: "selamat sore", en: "good afternoon (late)", kind: "vocab" },
        { idn: "selamat malam", en: "good evening / good night", kind: "vocab" },
        { idn: "selamat datang", en: "welcome", kind: "vocab" },
        { idn: "apa kabar?", en: "how are you?", kind: "vocab" },
        { idn: "kabar baik", en: "I'm fine", kind: "vocab" },
        { idn: "baik-baik saja", en: "just fine", kind: "vocab" },
        { idn: "senang bertemu denganmu", en: "nice to meet you", kind: "vocab" },
      ],
    },
    {
      titleEn: "Goodbyes",
      titleId: "Perpisahan",
      notes: [
        "Selamat tinggal is said by the person leaving; selamat jalan is said to the person who is leaving.",
      ],
      items: [
        { idn: "selamat tinggal", en: "goodbye (said by the one leaving)", kind: "vocab" },
        { idn: "selamat jalan", en: "goodbye (said to the one leaving)", kind: "vocab" },
        { idn: "sampai jumpa", en: "see you", kind: "vocab" },
        { idn: "sampai nanti", en: "see you later", kind: "vocab" },
        { idn: "sampai besok", en: "see you tomorrow", kind: "vocab" },
        { idn: "hati-hati", en: "take care / be careful", kind: "vocab" },
      ],
    },
    {
      titleEn: "Politeness",
      titleId: "Kesopanan",
      notes: [
        "tidak negates verbs and adjectives; bukan negates nouns. tolong = please (asking for help); silakan = please (offering / go ahead).",
      ],
      items: [
        { idn: "terima kasih", en: "thank you", kind: "vocab" },
        { idn: "terima kasih banyak", en: "thank you very much", kind: "vocab" },
        { idn: "sama-sama", en: "you're welcome", kind: "vocab" },
        { idn: "maaf", en: "sorry / excuse me", kind: "vocab" },
        { idn: "permisi", en: "excuse me (passing by)", kind: "vocab" },
        { idn: "tolong", en: "please / help", kind: "vocab" },
        { idn: "silakan", en: "please (go ahead)", kind: "vocab" },
        { idn: "ya", en: "yes", kind: "vocab" },
        { idn: "tidak", en: "no / not", kind: "vocab" },
        { idn: "bukan", en: "no / not (with nouns)", kind: "vocab" },
        { idn: "mungkin", en: "maybe", kind: "vocab" },
        { idn: "tentu saja", en: "of course", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Selamat pagi, apa kabar?", en: "Good morning, how are you?", kind: "sentence" },
        { idn: "Kabar baik, terima kasih.", en: "I'm fine, thank you.", kind: "sentence" },
        { idn: "Senang bertemu dengan Anda.", en: "Nice to meet you.", kind: "sentence" },
        { idn: "Sampai jumpa besok!", en: "See you tomorrow!", kind: "sentence" },
        { idn: "Maaf, saya terlambat.", en: "Sorry, I am late.", kind: "sentence" },
      ],
    },
  ],
};

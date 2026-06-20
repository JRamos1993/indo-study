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
        { target: "halo", en: "hello", kind: "vocab" },
        { target: "hai", en: "hi", kind: "vocab" },
        { target: "selamat pagi", en: "good morning", kind: "vocab" },
        { target: "selamat siang", en: "good afternoon (midday)", kind: "vocab" },
        { target: "selamat sore", en: "good afternoon (late)", kind: "vocab" },
        { target: "selamat malam", en: "good evening / good night", kind: "vocab" },
        { target: "selamat datang", en: "welcome", kind: "vocab" },
        { target: "apa kabar?", en: "how are you?", kind: "vocab" },
        { target: "kabar baik", en: "I'm fine", kind: "vocab" },
        { target: "baik-baik saja", en: "just fine", kind: "vocab" },
        { target: "senang bertemu denganmu", en: "nice to meet you", kind: "vocab" },
      ],
    },
    {
      titleEn: "Goodbyes",
      titleId: "Perpisahan",
      notes: [
        "Selamat tinggal is said by the person leaving; selamat jalan is said to the person who is leaving.",
      ],
      items: [
        { target: "selamat tinggal", en: "goodbye (said by the one leaving)", kind: "vocab" },
        { target: "selamat jalan", en: "goodbye (said to the one leaving)", kind: "vocab" },
        { target: "sampai jumpa", en: "see you", kind: "vocab" },
        { target: "sampai nanti", en: "see you later", kind: "vocab" },
        { target: "sampai besok", en: "see you tomorrow", kind: "vocab" },
        { target: "hati-hati", en: "take care / be careful", kind: "vocab" },
      ],
    },
    {
      titleEn: "Politeness",
      titleId: "Kesopanan",
      notes: [
        "tidak negates verbs and adjectives; bukan negates nouns. tolong = please (asking for help); silakan = please (offering / go ahead).",
      ],
      items: [
        { target: "terima kasih", en: "thank you", kind: "vocab" },
        { target: "terima kasih banyak", en: "thank you very much", kind: "vocab" },
        { target: "sama-sama", en: "you're welcome", kind: "vocab" },
        { target: "maaf", en: "sorry / excuse me", kind: "vocab" },
        { target: "permisi", en: "excuse me (passing by)", kind: "vocab" },
        { target: "tolong", en: "please / help", kind: "vocab", note: "Use tolong when asking someone to DO something for you: “tolong bantu saya”. To invite someone, use silakan." },
        { target: "silakan", en: "please (go ahead)", kind: "vocab", note: "silakan invites someone to go ahead: “silakan duduk” (please sit). To ask for help, use tolong." },
        { target: "ya", en: "yes", kind: "vocab" },
        { target: "tidak", en: "no / not", kind: "vocab", note: "tidak negates verbs and adjectives: “saya tidak tahu” (I don't know). To negate a noun, use bukan." },
        { target: "bukan", en: "no / not (with nouns)", kind: "vocab", note: "bukan negates nouns: “itu bukan kucing saya” (that's not my cat). For verbs/adjectives, use tidak." },
        { target: "mungkin", en: "maybe", kind: "vocab" },
        { target: "tentu saja", en: "of course", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Selamat pagi, apa kabar?", en: "Good morning, how are you?", kind: "sentence" },
        { target: "Kabar baik, terima kasih.", en: "I'm fine, thank you.", kind: "sentence" },
        { target: "Senang bertemu dengan Anda.", en: "Nice to meet you.", kind: "sentence" },
        { target: "Sampai jumpa besok!", en: "See you tomorrow!", kind: "sentence" },
        { target: "Maaf, saya terlambat.", en: "Sorry, I am late.", kind: "sentence" },
      ],
    },
  ],
};

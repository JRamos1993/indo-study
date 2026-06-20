import type { RawLesson } from "@/lib/types";

// A2 — talking about routines and making plans.
export const lesson: RawLesson = {
  id: "u19-plans-routines",
  date: "unit-19",
  title: "Plans & Routines",
  sections: [
    {
      titleEn: "Routines & frequency",
      titleId: "Rutinitas & frekuensi",
      notes: [
        "Frequency words sit before the verb: selalu (always), sering (often), kadang-kadang (sometimes), jarang (rarely). Sequence a story with pertama → lalu → akhirnya.",
      ],
      items: [
        { target: "biasanya", en: "usually", kind: "vocab" },
        { target: "selalu", en: "always", kind: "vocab" },
        { target: "sering", en: "often", kind: "vocab" },
        { target: "kadang-kadang", en: "sometimes", kind: "vocab" },
        { target: "jarang", en: "rarely", kind: "vocab" },
        { target: "setiap hari", en: "every day", kind: "vocab" },
        { target: "pertama", en: "first", kind: "vocab" },
        { target: "kemudian", en: "then / next", kind: "vocab", note: "kemudian and lalu both mean “then/next” — interchangeable." },
        { target: "akhirnya", en: "finally", kind: "vocab" },
        { target: "Saya selalu bangun pagi.", en: "I always wake up early.", kind: "sentence" },
        { target: "Biasanya saya minum kopi.", en: "I usually drink coffee.", kind: "sentence" },
      ],
    },
    {
      titleEn: "Making plans",
      titleId: "Membuat rencana",
      notes: [
        "Suggest something with ayo (come on, let's) or the softer mari, or ask bagaimana kalau … ? (how about …?). bebas = free/available, sibuk = busy.",
      ],
      items: [
        { target: "ayo", en: "come on / let's", kind: "vocab", note: "ayo = casual “let's / come on”: “Ayo makan!” mari is the politer form." },
        { target: "mari", en: "let's (polite)", kind: "vocab" },
        { target: "bagaimana kalau", en: "how about …?", kind: "vocab" },
        { target: "rencana", en: "a plan", kind: "vocab" },
        { target: "sibuk", en: "busy", kind: "vocab" },
        { target: "bebas", en: "free / available", kind: "vocab" },
        { target: "janji", en: "promise / appointment", kind: "vocab" },
        { target: "Ayo makan siang bersama!", en: "Let's have lunch together!", kind: "sentence" },
        { target: "Bagaimana kalau besok?", en: "How about tomorrow?", kind: "sentence" },
        { target: "Maaf, saya sibuk hari ini.", en: "Sorry, I'm busy today.", kind: "sentence" },
      ],
    },
  ],
};

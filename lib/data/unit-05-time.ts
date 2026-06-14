import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u05-time",
  date: "unit-05",
  title: "Days, Months & Time",
  sections: [
    {
      titleEn: "Days of the Week",
      titleId: "Hari dalam Seminggu",
      notes: ["minggu means both 'week' and 'Sunday'. Days are usually written with 'hari' in front: hari Senin."],
      items: [
        { idn: "hari Senin", en: "Monday", kind: "vocab" },
        { idn: "hari Selasa", en: "Tuesday", kind: "vocab" },
        { idn: "hari Rabu", en: "Wednesday", kind: "vocab" },
        { idn: "hari Kamis", en: "Thursday", kind: "vocab" },
        { idn: "hari Jumat", en: "Friday", kind: "vocab" },
        { idn: "hari Sabtu", en: "Saturday", kind: "vocab" },
        { idn: "hari Minggu", en: "Sunday", kind: "vocab" },
        { idn: "akhir pekan", en: "weekend", kind: "vocab" },
      ],
    },
    {
      titleEn: "When",
      titleId: "Waktu",
      notes: [
        "Indonesian verbs don't change for tense — a time marker shows when: kemarin (past), sekarang (present), besok (future).",
      ],
      items: [
        { idn: "hari", en: "day", kind: "vocab" },
        { idn: "minggu", en: "week / Sunday", kind: "vocab" },
        { idn: "bulan", en: "month / moon", kind: "vocab" },
        { idn: "tahun", en: "year", kind: "vocab" },
        { idn: "hari ini", en: "today", kind: "vocab" },
        { idn: "kemarin", en: "yesterday", kind: "vocab" },
        { idn: "besok", en: "tomorrow", kind: "vocab" },
        { idn: "sekarang", en: "now", kind: "vocab" },
        { idn: "nanti", en: "later", kind: "vocab" },
        { idn: "tadi", en: "earlier (today)", kind: "vocab" },
        { idn: "setiap hari", en: "every day", kind: "vocab" },
        { idn: "minggu lalu", en: "last week", kind: "vocab" },
        { idn: "minggu depan", en: "next week", kind: "vocab" },
      ],
    },
    {
      titleEn: "Time of Day & Clock",
      titleId: "Waktu dan Jam",
      notes: ["jam means both 'hour' and 'o'clock'. 'jam berapa?' = what time?"],
      items: [
        { idn: "pagi", en: "morning", kind: "vocab" },
        { idn: "siang", en: "midday / noon", kind: "vocab" },
        { idn: "sore", en: "late afternoon", kind: "vocab" },
        { idn: "malam", en: "night / evening", kind: "vocab" },
        { idn: "jam", en: "hour / o'clock", kind: "vocab" },
        { idn: "menit", en: "minute", kind: "vocab" },
        { idn: "jam berapa?", en: "what time is it?", kind: "vocab" },
        { idn: "jam tujuh", en: "seven o'clock", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Hari ini hari Senin.", en: "Today is Monday.", kind: "sentence" },
        { idn: "Sekarang jam berapa?", en: "What time is it now?", kind: "sentence" },
        { idn: "Saya bangun jam enam pagi.", en: "I wake up at six in the morning.", kind: "sentence" },
        { idn: "Besok saya pergi ke pasar.", en: "Tomorrow I will go to the market.", kind: "sentence" },
        { idn: "Kemarin saya di rumah.", en: "Yesterday I was at home.", kind: "sentence" },
      ],
    },
  ],
};

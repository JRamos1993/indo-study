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
        { target: "hari Senin", en: "Monday", kind: "vocab" },
        { target: "hari Selasa", en: "Tuesday", kind: "vocab" },
        { target: "hari Rabu", en: "Wednesday", kind: "vocab" },
        { target: "hari Kamis", en: "Thursday", kind: "vocab" },
        { target: "hari Jumat", en: "Friday", kind: "vocab" },
        { target: "hari Sabtu", en: "Saturday", kind: "vocab" },
        { target: "hari Minggu", en: "Sunday", kind: "vocab" },
        { target: "akhir pekan", en: "weekend", kind: "vocab" },
      ],
    },
    {
      titleEn: "When",
      titleId: "Waktu",
      notes: [
        "Indonesian verbs don't change for tense — a time marker shows when: kemarin (past), sekarang (present), besok (future).",
      ],
      items: [
        { target: "hari", en: "day", kind: "vocab" },
        { target: "minggu", en: "week / Sunday", kind: "vocab" },
        { target: "bulan", en: "month / moon", kind: "vocab" },
        { target: "tahun", en: "year", kind: "vocab" },
        { target: "hari ini", en: "today", kind: "vocab" },
        { target: "kemarin", en: "yesterday", kind: "vocab" },
        { target: "besok", en: "tomorrow", kind: "vocab" },
        { target: "sekarang", en: "now", kind: "vocab" },
        { target: "nanti", en: "later", kind: "vocab" },
        { target: "tadi", en: "earlier (today)", kind: "vocab" },
        { target: "setiap hari", en: "every day", kind: "vocab" },
        { target: "minggu lalu", en: "last week", kind: "vocab" },
        { target: "minggu depan", en: "next week", kind: "vocab" },
      ],
    },
    {
      titleEn: "Time of Day & Clock",
      titleId: "Waktu dan Jam",
      notes: ["jam means both 'hour' and 'o'clock'. 'jam berapa?' = what time?"],
      items: [
        { target: "pagi", en: "morning", kind: "vocab" },
        { target: "siang", en: "midday / early afternoon", kind: "vocab" },
        { target: "sore", en: "late afternoon", kind: "vocab" },
        { target: "malam", en: "night / evening", kind: "vocab" },
        { target: "jam", en: "hour / o'clock", kind: "vocab" },
        { target: "menit", en: "minute", kind: "vocab" },
        { target: "jam berapa?", en: "what time is it?", kind: "vocab" },
        { target: "jam tujuh", en: "seven o'clock", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Hari ini hari Senin.", en: "Today is Monday.", kind: "sentence" },
        { target: "Sekarang jam berapa?", en: "What time is it now?", kind: "sentence" },
        { target: "Saya bangun jam enam pagi.", en: "I wake up at six in the morning.", kind: "sentence" },
        { target: "Besok saya pergi ke pasar.", en: "Tomorrow I will go to the market.", kind: "sentence" },
        { target: "Kemarin saya di rumah.", en: "Yesterday I was at home.", kind: "sentence" },
      ],
    },
  ],
};

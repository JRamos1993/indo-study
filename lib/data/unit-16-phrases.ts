import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u16-phrases",
  date: "unit-16",
  title: "Useful Everyday Phrases",
  sections: [
    {
      titleEn: "Getting By",
      titleId: "Bertahan Sehari-hari",
      items: [
        { idn: "Saya tidak mengerti.", en: "I don't understand.", kind: "sentence" },
        { idn: "Tolong ulangi.", en: "Please repeat.", kind: "sentence" },
        { idn: "Bisa bicara pelan-pelan?", en: "Can you speak slowly?", kind: "sentence" },
        { idn: "Saya sedang belajar bahasa Indonesia.", en: "I am learning Indonesian.", kind: "sentence" },
        { idn: "Apa ini dalam bahasa Indonesia?", en: "What is this in Indonesian?", kind: "sentence" },
        { idn: "Tolong bantu saya.", en: "Please help me.", kind: "sentence" },
        { idn: "Boleh saya lihat?", en: "May I see?", kind: "sentence" },
        { idn: "Di mana toilet?", en: "Where is the toilet?", kind: "sentence" },
        { idn: "Saya tersesat.", en: "I am lost.", kind: "sentence" },
      ],
    },
    {
      titleEn: "Common Expressions",
      titleId: "Ungkapan Umum",
      notes: ["'tidak apa-apa' literally means 'nothing's the matter' and is used like 'it's okay' or 'no problem'."],
      items: [
        { idn: "tidak apa-apa", en: "it's okay / no problem", kind: "vocab" },
        { idn: "tidak masalah", en: "no problem", kind: "vocab" },
        { idn: "saya setuju", en: "I agree", kind: "vocab" },
        { idn: "saya rasa begitu", en: "I think so", kind: "vocab" },
        { idn: "tentu saja", en: "of course", kind: "vocab" },
        { idn: "selamat makan", en: "enjoy your meal", kind: "vocab" },
        { idn: "selamat ulang tahun", en: "happy birthday", kind: "vocab" },
        { idn: "semoga berhasil", en: "good luck", kind: "vocab" },
      ],
    },
    {
      titleEn: "More Sentences",
      titleId: "Kalimat Lainnya",
      items: [
        { idn: "Berapa harganya?", en: "How much is it?", kind: "sentence" },
        { idn: "Saya mau ini, tolong.", en: "I want this one, please.", kind: "sentence" },
        { idn: "Apa yang kamu mau?", en: "What do you want?", kind: "sentence" },
        { idn: "Hati-hati di jalan.", en: "Take care on the way.", kind: "sentence" },
        { idn: "Jangan lupa!", en: "Don't forget!", kind: "sentence" },
      ],
    },
  ],
};

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
        { target: "Saya tidak mengerti.", en: "I don't understand.", kind: "sentence" },
        { target: "Tolong ulangi.", en: "Please repeat.", kind: "sentence" },
        { target: "Bisa bicara pelan-pelan?", en: "Can you speak slowly?", kind: "sentence" },
        { target: "Saya sedang belajar bahasa Indonesia.", en: "I am learning Indonesian.", kind: "sentence" },
        { target: "Apa ini dalam bahasa Indonesia?", en: "What is this in Indonesian?", kind: "sentence" },
        { target: "Tolong bantu saya.", en: "Please help me.", kind: "sentence" },
        { target: "Boleh saya lihat?", en: "May I see?", kind: "sentence" },
        { target: "Di mana toilet?", en: "Where is the toilet?", kind: "sentence" },
        { target: "Saya tersesat.", en: "I am lost.", kind: "sentence" },
      ],
    },
    {
      titleEn: "Common Expressions",
      titleId: "Ungkapan Umum",
      notes: ["'tidak apa-apa' literally means 'nothing's the matter' and is used like 'it's okay' or 'no problem'."],
      items: [
        { target: "tidak apa-apa", en: "it's okay / no problem", kind: "vocab" },
        { target: "tidak masalah", en: "no problem", kind: "vocab" },
        { target: "saya setuju", en: "I agree", kind: "vocab" },
        { target: "saya rasa begitu", en: "I think so", kind: "vocab" },
        { target: "tentu saja", en: "of course", kind: "vocab" },
        { target: "selamat makan", en: "enjoy your meal", kind: "vocab" },
        { target: "selamat ulang tahun", en: "happy birthday", kind: "vocab" },
        { target: "semoga berhasil", en: "good luck", kind: "vocab" },
      ],
    },
    {
      titleEn: "More Sentences",
      titleId: "Kalimat Lainnya",
      items: [
        { target: "Berapa harganya?", en: "How much is it?", kind: "sentence" },
        { target: "Saya mau ini, tolong.", en: "I want this one, please.", kind: "sentence" },
        { target: "Apa yang kamu mau?", en: "What do you want?", kind: "sentence" },
        { target: "Hati-hati di jalan.", en: "Take care on the way.", kind: "sentence" },
        { target: "Jangan lupa!", en: "Don't forget!", kind: "sentence" },
      ],
    },
  ],
};

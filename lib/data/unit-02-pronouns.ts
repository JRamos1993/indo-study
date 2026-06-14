import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u02-pronouns",
  date: "unit-02",
  title: "Pronouns & People",
  sections: [
    {
      titleEn: "Personal Pronouns",
      titleId: "Kata Ganti Orang",
      notes: [
        "saya is polite/neutral; aku is casual. Anda is formal 'you'; kamu is casual. kita includes the listener; kami excludes them.",
      ],
      items: [
        { idn: "saya", en: "I / me (polite)", kind: "vocab" },
        { idn: "aku", en: "I / me (casual)", kind: "vocab" },
        { idn: "kamu", en: "you (casual)", kind: "vocab" },
        { idn: "Anda", en: "you (formal)", kind: "vocab" },
        { idn: "kalian", en: "you all", kind: "vocab" },
        { idn: "dia", en: "he / she", kind: "vocab" },
        { idn: "beliau", en: "he / she (respectful)", kind: "vocab" },
        { idn: "kita", en: "we (including you)", kind: "vocab" },
        { idn: "kami", en: "we (not including you)", kind: "vocab" },
        { idn: "mereka", en: "they", kind: "vocab" },
      ],
    },
    {
      titleEn: "Possessives",
      titleId: "Kepemilikan",
      notes: ["-ku = my, -mu = your, -nya = his/her/its. They attach to the end of the noun."],
      items: [
        { idn: "-ku", en: "my", kind: "vocab" },
        { idn: "-mu", en: "your", kind: "vocab" },
        { idn: "-nya", en: "his / her / its", kind: "vocab" },
        { idn: "namaku", en: "my name", kind: "vocab", root: "nama" },
        { idn: "namamu", en: "your name", kind: "vocab", root: "nama" },
        { idn: "namanya", en: "his / her name", kind: "vocab", root: "nama" },
        { idn: "rumahku", en: "my house", kind: "vocab", root: "rumah" },
        { idn: "temanku", en: "my friend", kind: "vocab", root: "teman" },
      ],
    },
    {
      titleEn: "People",
      titleId: "Orang",
      notes: ["laki-laki and perempuan describe gender; pria and wanita are slightly more formal."],
      items: [
        { idn: "orang", en: "person / people", kind: "vocab" },
        { idn: "laki-laki", en: "man / male / boy", kind: "vocab" },
        { idn: "perempuan", en: "woman / female / girl", kind: "vocab" },
        { idn: "pria", en: "man", kind: "vocab" },
        { idn: "wanita", en: "woman", kind: "vocab" },
        { idn: "anak", en: "child", kind: "vocab" },
        { idn: "bayi", en: "baby", kind: "vocab" },
        { idn: "teman", en: "friend", kind: "vocab" },
        { idn: "sahabat", en: "close friend", kind: "vocab" },
        { idn: "pacar", en: "boyfriend / girlfriend", kind: "vocab" },
        { idn: "tetangga", en: "neighbor", kind: "vocab" },
        { idn: "tamu", en: "guest", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Nama saya Budi.", en: "My name is Budi.", kind: "sentence" },
        { idn: "Siapa nama kamu?", en: "What is your name?", kind: "sentence" },
        { idn: "Dia teman saya.", en: "He / she is my friend.", kind: "sentence" },
        { idn: "Kami tinggal di Jakarta.", en: "We live in Jakarta.", kind: "sentence" },
        { idn: "Mereka belajar bahasa Indonesia.", en: "They study Indonesian.", kind: "sentence" },
      ],
    },
  ],
};

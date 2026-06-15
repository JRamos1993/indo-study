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
        { target: "saya", en: "I / me (polite)", kind: "vocab" },
        { target: "aku", en: "I / me (casual)", kind: "vocab" },
        { target: "kamu", en: "you (casual)", kind: "vocab" },
        { target: "Anda", en: "you (formal)", kind: "vocab" },
        { target: "kalian", en: "you all", kind: "vocab" },
        { target: "dia", en: "he / she", kind: "vocab" },
        { target: "beliau", en: "he / she (respectful)", kind: "vocab" },
        { target: "kita", en: "we (including you)", kind: "vocab" },
        { target: "kami", en: "we (not including you)", kind: "vocab" },
        { target: "mereka", en: "they", kind: "vocab" },
      ],
    },
    {
      titleEn: "Possessives",
      titleId: "Kepemilikan",
      notes: ["-ku = my, -mu = your, -nya = his/her/its. They attach to the end of the noun."],
      items: [
        { target: "-ku", en: "my", kind: "vocab" },
        { target: "-mu", en: "your", kind: "vocab" },
        { target: "-nya", en: "his / her / its", kind: "vocab" },
        { target: "namaku", en: "my name", kind: "vocab", root: "nama" },
        { target: "namamu", en: "your name", kind: "vocab", root: "nama" },
        { target: "namanya", en: "his / her name", kind: "vocab", root: "nama" },
        { target: "rumahku", en: "my house", kind: "vocab", root: "rumah" },
        { target: "temanku", en: "my friend", kind: "vocab", root: "teman" },
      ],
    },
    {
      titleEn: "People",
      titleId: "Orang",
      notes: ["laki-laki and perempuan describe gender; pria and wanita are slightly more formal."],
      items: [
        { target: "orang", en: "person / people", kind: "vocab" },
        { target: "laki-laki", en: "man / male / boy", kind: "vocab" },
        { target: "perempuan", en: "woman / female / girl", kind: "vocab" },
        { target: "pria", en: "man", kind: "vocab" },
        { target: "wanita", en: "woman", kind: "vocab" },
        { target: "anak", en: "child", kind: "vocab" },
        { target: "bayi", en: "baby", kind: "vocab" },
        { target: "teman", en: "friend", kind: "vocab" },
        { target: "sahabat", en: "close friend", kind: "vocab" },
        { target: "pacar", en: "boyfriend / girlfriend", kind: "vocab" },
        { target: "tetangga", en: "neighbor", kind: "vocab" },
        { target: "tamu", en: "guest", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Nama saya Budi.", en: "My name is Budi.", kind: "sentence" },
        { target: "Siapa nama kamu?", en: "What is your name?", kind: "sentence" },
        { target: "Dia teman saya.", en: "He / she is my friend.", kind: "sentence" },
        { target: "Kami tinggal di Jakarta.", en: "We live in Jakarta.", kind: "sentence" },
        { target: "Mereka belajar bahasa Indonesia.", en: "They study Indonesian.", kind: "sentence" },
      ],
    },
  ],
};

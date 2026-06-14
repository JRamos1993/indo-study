import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u15-work-school",
  date: "unit-15",
  title: "Work, School & Hobbies",
  sections: [
    {
      titleEn: "Jobs",
      titleId: "Pekerjaan",
      items: [
        { idn: "pekerjaan", en: "job / work", kind: "vocab", root: "kerja" },
        { idn: "guru", en: "teacher", kind: "vocab" },
        { idn: "murid", en: "student (school)", kind: "vocab" },
        { idn: "mahasiswa", en: "university student", kind: "vocab" },
        { idn: "dokter", en: "doctor", kind: "vocab" },
        { idn: "polisi", en: "police officer", kind: "vocab" },
        { idn: "petani", en: "farmer", kind: "vocab" },
        { idn: "pegawai", en: "employee", kind: "vocab" },
        { idn: "pelayan", en: "waiter / server", kind: "vocab" },
        { idn: "koki", en: "cook / chef", kind: "vocab" },
      ],
    },
    {
      titleEn: "School",
      titleId: "Sekolah",
      items: [
        { idn: "sekolah", en: "school", kind: "vocab" },
        { idn: "universitas", en: "university", kind: "vocab" },
        { idn: "kelas", en: "class / classroom", kind: "vocab" },
        { idn: "pelajaran", en: "lesson", kind: "vocab", root: "ajar" },
        { idn: "buku", en: "book", kind: "vocab" },
        { idn: "ujian", en: "exam", kind: "vocab" },
        { idn: "bahasa", en: "language", kind: "vocab" },
        { idn: "belajar", en: "to study", kind: "vocab", root: "ajar" },
        { idn: "mengajar", en: "to teach", kind: "vocab", root: "ajar" },
      ],
    },
    {
      titleEn: "Hobbies & Sports",
      titleId: "Hobi dan Olahraga",
      items: [
        { idn: "hobi", en: "hobby", kind: "vocab" },
        { idn: "olahraga", en: "sport / exercise", kind: "vocab" },
        { idn: "sepak bola", en: "football / soccer", kind: "vocab" },
        { idn: "renang", en: "swimming", kind: "vocab" },
        { idn: "musik", en: "music", kind: "vocab" },
        { idn: "film", en: "film / movie", kind: "vocab" },
        { idn: "lagu", en: "song", kind: "vocab" },
        { idn: "membaca", en: "reading", kind: "vocab", root: "baca" },
        { idn: "memasak", en: "cooking", kind: "vocab", root: "masak" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Apa pekerjaanmu?", en: "What is your job?", kind: "sentence" },
        { idn: "Saya seorang guru.", en: "I am a teacher.", kind: "sentence" },
        { idn: "Hobi saya membaca buku.", en: "My hobby is reading books.", kind: "sentence" },
        { idn: "Dia belajar di universitas.", en: "He / she studies at university.", kind: "sentence" },
        { idn: "Saya suka bermain sepak bola.", en: "I like playing football.", kind: "sentence" },
      ],
    },
  ],
};

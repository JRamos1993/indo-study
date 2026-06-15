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
        { target: "pekerjaan", en: "job / work", kind: "vocab", root: "kerja" },
        { target: "guru", en: "teacher", kind: "vocab" },
        { target: "murid", en: "student (school)", kind: "vocab" },
        { target: "mahasiswa", en: "university student", kind: "vocab" },
        { target: "dokter", en: "doctor", kind: "vocab" },
        { target: "polisi", en: "police officer", kind: "vocab" },
        { target: "petani", en: "farmer", kind: "vocab" },
        { target: "pegawai", en: "employee", kind: "vocab" },
        { target: "pelayan", en: "waiter / server", kind: "vocab" },
        { target: "koki", en: "cook / chef", kind: "vocab" },
      ],
    },
    {
      titleEn: "School",
      titleId: "Sekolah",
      items: [
        { target: "sekolah", en: "school", kind: "vocab" },
        { target: "universitas", en: "university", kind: "vocab" },
        { target: "kelas", en: "class / classroom", kind: "vocab" },
        { target: "pelajaran", en: "lesson", kind: "vocab", root: "ajar" },
        { target: "buku", en: "book", kind: "vocab" },
        { target: "ujian", en: "exam", kind: "vocab" },
        { target: "bahasa", en: "language", kind: "vocab" },
        { target: "belajar", en: "to study", kind: "vocab", root: "ajar" },
        { target: "mengajar", en: "to teach", kind: "vocab", root: "ajar" },
      ],
    },
    {
      titleEn: "Hobbies & Sports",
      titleId: "Hobi dan Olahraga",
      items: [
        { target: "hobi", en: "hobby", kind: "vocab" },
        { target: "olahraga", en: "sport / exercise", kind: "vocab" },
        { target: "sepak bola", en: "football / soccer", kind: "vocab" },
        { target: "renang", en: "swimming", kind: "vocab" },
        { target: "musik", en: "music", kind: "vocab" },
        { target: "film", en: "film / movie", kind: "vocab" },
        { target: "lagu", en: "song", kind: "vocab" },
        { target: "membaca", en: "reading", kind: "vocab", root: "baca" },
        { target: "memasak", en: "cooking", kind: "vocab", root: "masak" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Apa pekerjaanmu?", en: "What is your job?", kind: "sentence" },
        { target: "Saya seorang guru.", en: "I am a teacher.", kind: "sentence" },
        { target: "Hobi saya membaca buku.", en: "My hobby is reading books.", kind: "sentence" },
        { target: "Dia belajar di universitas.", en: "He / she studies at university.", kind: "sentence" },
        { target: "Saya suka bermain sepak bola.", en: "I like playing football.", kind: "sentence" },
      ],
    },
  ],
};

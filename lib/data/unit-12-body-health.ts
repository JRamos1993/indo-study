import type { RawLesson } from "@/lib/types";

export const lesson: RawLesson = {
  id: "u12-body-health",
  date: "unit-12",
  title: "Body & Health",
  sections: [
    {
      titleEn: "The Body",
      titleId: "Tubuh",
      items: [
        { idn: "kepala", en: "head", kind: "vocab" },
        { idn: "rambut", en: "hair", kind: "vocab" },
        { idn: "mata", en: "eye", kind: "vocab" },
        { idn: "hidung", en: "nose", kind: "vocab" },
        { idn: "mulut", en: "mouth", kind: "vocab" },
        { idn: "telinga", en: "ear", kind: "vocab" },
        { idn: "gigi", en: "tooth", kind: "vocab" },
        { idn: "tangan", en: "hand / arm", kind: "vocab" },
        { idn: "kaki", en: "foot / leg", kind: "vocab" },
        { idn: "perut", en: "stomach", kind: "vocab" },
        { idn: "hati", en: "liver / heart (feelings)", kind: "vocab" },
        { idn: "jantung", en: "heart (organ)", kind: "vocab" },
      ],
    },
    {
      titleEn: "Health",
      titleId: "Kesehatan",
      notes: ["sakit means both 'sick' and 'to hurt': 'kepala saya sakit' = my head hurts."],
      items: [
        { idn: "sakit", en: "sick / to hurt", kind: "vocab" },
        { idn: "sehat", en: "healthy", kind: "vocab" },
        { idn: "demam", en: "fever", kind: "vocab" },
        { idn: "batuk", en: "cough", kind: "vocab" },
        { idn: "flu", en: "flu / cold", kind: "vocab" },
        { idn: "obat", en: "medicine", kind: "vocab" },
        { idn: "dokter", en: "doctor", kind: "vocab" },
        { idn: "rumah sakit", en: "hospital", kind: "vocab" },
        { idn: "apotek", en: "pharmacy", kind: "vocab" },
        { idn: "istirahat", en: "to rest", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { idn: "Kepala saya sakit.", en: "My head hurts.", kind: "sentence" },
        { idn: "Saya butuh obat.", en: "I need medicine.", kind: "sentence" },
        { idn: "Dia sedang sakit hari ini.", en: "He / she is sick today.", kind: "sentence" },
        { idn: "Saya harus pergi ke dokter.", en: "I have to go to the doctor.", kind: "sentence" },
      ],
    },
  ],
};

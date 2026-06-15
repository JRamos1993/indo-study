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
        { target: "kepala", en: "head", kind: "vocab" },
        { target: "rambut", en: "hair", kind: "vocab" },
        { target: "mata", en: "eye", kind: "vocab" },
        { target: "hidung", en: "nose", kind: "vocab" },
        { target: "mulut", en: "mouth", kind: "vocab" },
        { target: "telinga", en: "ear", kind: "vocab" },
        { target: "gigi", en: "tooth", kind: "vocab" },
        { target: "tangan", en: "hand / arm", kind: "vocab" },
        { target: "kaki", en: "foot / leg", kind: "vocab" },
        { target: "perut", en: "stomach", kind: "vocab" },
        { target: "hati", en: "liver / heart (feelings)", kind: "vocab" },
        { target: "jantung", en: "heart (organ)", kind: "vocab" },
      ],
    },
    {
      titleEn: "Health",
      titleId: "Kesehatan",
      notes: ["sakit means both 'sick' and 'to hurt': 'kepala saya sakit' = my head hurts."],
      items: [
        { target: "sakit", en: "sick / to hurt", kind: "vocab" },
        { target: "sehat", en: "healthy", kind: "vocab" },
        { target: "demam", en: "fever", kind: "vocab" },
        { target: "batuk", en: "cough", kind: "vocab" },
        { target: "flu", en: "flu / cold", kind: "vocab" },
        { target: "obat", en: "medicine", kind: "vocab" },
        { target: "dokter", en: "doctor", kind: "vocab" },
        { target: "rumah sakit", en: "hospital", kind: "vocab" },
        { target: "apotek", en: "pharmacy", kind: "vocab" },
        { target: "istirahat", en: "to rest", kind: "vocab" },
      ],
    },
    {
      titleEn: "Example Sentences",
      titleId: "Contoh Kalimat",
      items: [
        { target: "Kepala saya sakit.", en: "My head hurts.", kind: "sentence" },
        { target: "Saya butuh obat.", en: "I need medicine.", kind: "sentence" },
        { target: "Dia sedang sakit hari ini.", en: "He / she is sick today.", kind: "sentence" },
        { target: "Saya harus pergi ke dokter.", en: "I have to go to the doctor.", kind: "sentence" },
      ],
    },
  ],
};

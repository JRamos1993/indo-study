import type { RawLesson } from "@/lib/types";

// A2 — expressing comparison and opinion.
export const lesson: RawLesson = {
  id: "u18-comparisons",
  date: "unit-18",
  title: "Comparisons & Opinions",
  sections: [
    {
      titleEn: "Comparing things",
      titleId: "Membandingkan",
      notes: [
        "Comparisons use lebih (more) … daripada (than): “lebih besar daripada” = bigger than. paling = the most/-est. kurang = less.",
      ],
      items: [
        { target: "lebih", en: "more", kind: "vocab", note: "lebih + adjective = more …: “lebih besar” (bigger). Pair with daripada for “than”." },
        { target: "kurang", en: "less", kind: "vocab" },
        { target: "paling", en: "most / -est", kind: "vocab", note: "paling + adjective = the most …: “paling enak” (the tastiest)." },
        { target: "daripada", en: "than", kind: "vocab", note: "Used in comparisons: “lebih tinggi daripada saya” (taller than me)." },
        { target: "sama", en: "same", kind: "vocab" },
        { target: "lebih baik", en: "better", kind: "vocab" },
        { target: "lebih suka", en: "to prefer", kind: "vocab", note: "lebih suka = like more / prefer: “Saya lebih suka teh.” (I prefer tea.)" },
        { target: "Ini lebih besar daripada itu.", en: "This is bigger than that.", kind: "sentence" },
        { target: "Dia paling pintar di kelas.", en: "She is the smartest in the class.", kind: "sentence" },
        { target: "Kopi ini lebih enak.", en: "This coffee is tastier.", kind: "sentence" },
      ],
    },
    {
      titleEn: "Giving an opinion",
      titleId: "Memberi pendapat",
      notes: [
        "Open an opinion with menurut saya (in my opinion) or saya rasa / saya pikir (I think). setuju = agree.",
      ],
      items: [
        { target: "menurut saya", en: "in my opinion", kind: "vocab" },
        { target: "saya pikir", en: "I think", kind: "vocab" },
        { target: "saya rasa", en: "I feel / I think", kind: "vocab" },
        { target: "setuju", en: "to agree", kind: "vocab", note: "setuju dengan = agree with: “Saya setuju dengan kamu.”" },
        { target: "tidak setuju", en: "to disagree", kind: "vocab" },
        { target: "benar", en: "correct / true", kind: "vocab", note: "benar = true/correct (a fact). salah = wrong. (bukan negates nouns.)" },
        { target: "salah", en: "wrong", kind: "vocab" },
        { target: "Menurut saya, ini bagus.", en: "In my opinion, this is good.", kind: "sentence" },
        { target: "Saya setuju dengan kamu.", en: "I agree with you.", kind: "sentence" },
        { target: "Saya lebih suka teh daripada kopi.", en: "I prefer tea to coffee.", kind: "sentence" },
      ],
    },
  ],
};

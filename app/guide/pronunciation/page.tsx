"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings";

type Row = [string, string, string];

const id = {
  title: "Indonesian pronunciation",
  intro:
    "Indonesian spelling is highly phonetic — letters are pronounced consistently. A few rules cover almost everything.",
  sections: [
    {
      title: "Vowels",
      rows: [
        ["a", "like a in father", "apa, nama"],
        ["i", "like ee in see", "ini, tidur"],
        ["u", "like oo in moon", "umur, buku"],
        ["o", "like o in more", "orang, kantor"],
        ["e (taling)", "like e in bed", "enak, sore"],
        ["e (pepet)", "soft uh, often unstressed", "empat, kemarin"],
      ] as Row[],
    },
    {
      title: "Consonants & digraphs",
      rows: [
        ["c", 'always "ch" as in church', "cuaca, kucing"],
        ["j", "like j in jam", "jalan, saja"],
        ["g", "always hard, as in go", "gamer, pergi"],
        ["r", "tapped/rolled, like Spanish r", "rumah, kabar"],
        ["ng", "single sound, like sing", "bangun, uang"],
        ["ny", "like ny in canyon", "nyamuk, banyak"],
        ["sy", "like sh in ship", "syukur"],
        ["h", "lightly pronounced; clearer between vowels", "hari, tahu"],
        ["k (final)", "a soft stop, almost swallowed", "tidak, baik"],
      ] as Row[],
    },
  ],
  tips: [
    ["Stress", "is light and usually falls on the second-to-last syllable (be-LA-jar). Far less pronounced than in English."],
    ["Each letter is pronounced", "— no silent letters. Double vowels are said separately: saat = sa-at."],
    ["Reduplication", "(hati-hati, kucing-kucing) just repeats the word; say both halves clearly."],
  ] as [string, string][],
};

const ja = {
  title: "Japanese pronunciation",
  intro:
    "Japanese is built from simple, even syllables (mora). Every kana is one short beat. Master the five vowels and the rest follows.",
  sections: [
    {
      title: "The five vowels",
      rows: [
        ["a あ / ア", "like a in father", "あか aka (red)"],
        ["i い / イ", "like ee in see", "いし ishi (stone)"],
        ["u う / ウ", "like oo in moon, lips relaxed", "うみ umi (sea)"],
        ["e え / エ", "like e in bed", "えき eki (station)"],
        ["o お / オ", "like o in more", "おと oto (sound)"],
      ] as Row[],
    },
    {
      title: "Sounds to watch",
      rows: [
        ["し shi", "not 'si' — like 'she'", "すし sushi"],
        ["ち chi", "not 'ti' — like 'cheese'", "ちかい chikai"],
        ["つ tsu", "not 'tu' — ts + u", "つき tsuki (moon)"],
        ["ふ fu", "soft, between f and h", "ふゆ fuyu (winter)"],
        ["ら り る れ ろ", "a light tapped r, between r and l", "りんご ringo (apple)"],
        ["ん n", "its own beat; never starts a word", "ほん hon (book)"],
      ] as Row[],
    },
  ],
  tips: [
    ["Long vowels matter", "おばさん obasan (aunt) vs おばあさん obāsan (grandmother). Hold the long vowel for two beats."],
    ["Double consonants (っ)", "a small tsu doubles the next consonant with a tiny pause: きって kitte (stamp)."],
    ["Particles change sound", "は as a particle = wa, を = o, へ = e."],
    ["Pitch, not stress", "Japanese uses pitch accent rather than English-style stress; keep syllables even."],
  ] as [string, string][],
};

export default function PronunciationGuide() {
  const lang = useSettings().studyLanguage;
  const g = lang === "ja" ? ja : id;

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{g.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.intro}</p>
      </div>

      {g.sections.map((s) => (
        <Section key={s.title} title={s.title} rows={s.rows} />
      ))}

      <div className="card mt-6 space-y-3 p-5 text-sm leading-relaxed">
        <h2 className="font-semibold">A few more tips</h2>
        {g.tips.map(([head, body]) => (
          <p key={head}>
            <b>{head}</b> {body}
          </p>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Use the speaker icons anywhere in the app to hear words aloud.
      </p>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="card mb-5 overflow-hidden">
      <h2 className="border-b border-slate-200 px-5 py-3 font-semibold dark:border-slate-800">
        {title}
      </h2>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
        {rows.map(([letter, how, ex]) => (
          <li key={letter} className="flex flex-wrap items-baseline gap-x-3 px-5 py-2.5 text-sm">
            <span className="w-24 shrink-0 font-bold text-indigo-700 dark:text-indigo-300">
              {letter}
            </span>
            <span className="flex-1">{how}</span>
            <span className="text-slate-500 dark:text-slate-400">{ex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

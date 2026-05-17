import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pronunciation guide — Indo Study",
};

const vowels: [string, string, string][] = [
  ["a", "like a in father", "apa, nama"],
  ["i", "like ee in see", "ini, tidur"],
  ["u", "like oo in moon", "umur, buku"],
  ["o", "like o in more", "orang, kantor"],
  ["e (taling)", "like e in bed", "enak, sore"],
  ["e (pepet)", "soft uh, often unstressed", "empat, kemarin"],
];

const consonants: [string, string, string][] = [
  ["c", 'always "ch" as in church', "cuaca, kucing"],
  ["j", 'like j in jam', "jalan, saja"],
  ["g", "always hard, as in go", "gamer, pergi"],
  ["r", "tapped/rolled, like Spanish r", "rumah, kabar"],
  ["ng", "single sound, like sing", "bangun, uang"],
  ["ny", "like ny in canyon", "nyamuk, banyak"],
  ["sy", 'like sh in ship', "syukur"],
  ["h", "lightly pronounced; clearer between vowels", "hari, tahu"],
  ["k (final)", "a soft stop, almost swallowed", "tidak, baik"],
];

export default function PronunciationGuide() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Indonesian pronunciation</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Indonesian spelling is highly phonetic — letters are pronounced consistently. A
          few rules cover almost everything.
        </p>
      </div>

      <Section title="Vowels" rows={vowels} />
      <Section title="Consonants & digraphs" rows={consonants} />

      <div className="card mt-6 space-y-3 p-5 text-sm leading-relaxed">
        <h2 className="font-semibold">A few more tips</h2>
        <p>
          <b>Stress</b> is light and usually falls on the second-to-last syllable
          (<i>be-LA-jar</i>, <i>ma-KA-nan</i>). It is far less pronounced than in English.
        </p>
        <p>
          <b>Each letter is pronounced</b> — there are no silent letters. Double vowels are
          said separately: <i>saat</i> = sa-at.
        </p>
        <p>
          <b>Reduplication</b> (<i>hati-hati</i>, <i>kucing-kucing</i>) just repeats the
          word; say both halves clearly.
        </p>
        <p>
          <b>Affixes don&apos;t change the root&apos;s sound</b>: <i>beli</i> →{" "}
          <i>mem-beli</i>, the <i>beli</i> part stays the same.
        </p>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Reference material to support the class notes — it does not change any of your
        teacher&apos;s content. Use the speaker icons anywhere in the app to hear words.
      </p>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: [string, string, string][] }) {
  return (
    <div className="card mb-5 overflow-hidden">
      <h2 className="border-b border-slate-200 px-5 py-3 font-semibold dark:border-slate-800">
        {title}
      </h2>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
        {rows.map(([letter, how, ex]) => (
          <li key={letter} className="flex flex-wrap items-baseline gap-x-3 px-5 py-2.5 text-sm">
            <span className="w-20 shrink-0 font-bold text-indigo-700 dark:text-indigo-300">
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

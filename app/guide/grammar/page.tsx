"use client";

import { PublicPage } from "@/components/PublicPage";
import { useSettings } from "@/lib/settings";

type Ex = [string, string]; // [target, english]
type Topic = { title: string; body: string; examples?: Ex[] };

const id: { title: string; intro: string; topics: Topic[] } = {
  title: "Indonesian grammar",
  intro:
    "Indonesian is one of the most beginner-friendly languages: no verb conjugation, no tenses, no grammatical gender, no plurals to memorise. Master a handful of patterns and you can say a lot.",
  topics: [
    {
      title: "Word order: Subject – Verb – Object",
      body: "Basic sentences follow the same order as English. Adjectives, though, come AFTER the noun they describe — the opposite of English.",
      examples: [
        ["Saya makan nasi.", "I eat rice."],
        ["Dia membaca buku.", "She reads a book."],
        ["rumah besar", "a big house (lit. house big)"],
        ["kucing hitam", "a black cat (lit. cat black)"],
      ],
    },
    {
      title: "No tenses — time comes from context",
      body: "Verbs never change. Instead, small time words mark when something happens: sudah (already), sedang (-ing, now), akan (will), belum (not yet), tadi (earlier), nanti (later).",
      examples: [
        ["Saya sudah makan.", "I have already eaten."],
        ["Dia sedang tidur.", "He is sleeping (right now)."],
        ["Kami akan pergi.", "We will go."],
        ["Saya belum mandi.", "I haven't showered yet."],
      ],
    },
    {
      title: "Pronouns & possession",
      body: "Common pronouns: saya / aku (I), kamu / Anda (you, polite), dia (he/she), kita (we, incl. you), kami (we, excl. you), mereka (they). To show possession, just put the owner after the thing — or use the short endings -ku, -mu, -nya.",
      examples: [
        ["buku saya", "my book (lit. book I)"],
        ["nama kamu", "your name"],
        ["rumahku", "my house (rumah + -ku)"],
        ["mobilnya", "his/her car (mobil + -nya)"],
      ],
    },
    {
      title: "Asking questions",
      body: "Question words: apa (what), siapa (who), di mana (where), kapan (when), mengapa / kenapa (why), bagaimana (how), berapa (how much/many). For yes/no questions, just raise your intonation, or add apakah at the front.",
      examples: [
        ["Ini apa?", "What is this?"],
        ["Kamu tinggal di mana?", "Where do you live?"],
        ["Berapa harganya?", "How much is it?"],
        ["Apakah kamu lapar?", "Are you hungry?"],
      ],
    },
    {
      title: "Negation: tidak vs bukan",
      body: "Use tidak to negate verbs and adjectives. Use bukan to negate nouns. (And belum = not yet.)",
      examples: [
        ["Saya tidak tahu.", "I don't know."],
        ["Dia tidak lapar.", "She isn't hungry."],
        ["Itu bukan kucing saya.", "That isn't my cat."],
      ],
    },
    {
      title: "Plurals & reduplication",
      body: "Nouns don't change for plural — number is usually clear from context or a number word. To stress 'many/various', you can repeat the noun (reduplication).",
      examples: [
        ["dua buku", "two books"],
        ["buku-buku", "books (various)"],
        ["anak-anak", "children"],
      ],
    },
    {
      title: "Affixes: how words are built",
      body: "Roots grow into new words with prefixes and suffixes. me-/ber- make active verbs, di- makes passive, ter- = accidental/most, pe-…-an & ke-…-an form nouns. (The Word-building drill trains these.)",
      examples: [
        ["beli → membeli", "buy → to buy (active)"],
        ["main → bermain", "play → to play"],
        ["makan → dimakan", "eat → be eaten (passive)"],
        ["ajar → pelajaran", "teach → a lesson"],
      ],
    },
    {
      title: "Counting things: classifiers",
      body: "When counting, a classifier often sits between the number and the noun: orang (people), ekor (animals), buah (objects). Common but not always required in casual speech.",
      examples: [
        ["tiga orang guru", "three teachers"],
        ["dua ekor kucing", "two cats"],
        ["lima buah apel", "five apples"],
      ],
    },
  ],
};

const ja: { title: string; intro: string; topics: Topic[] } = {
  title: "Japanese grammar",
  intro:
    "Japanese feels different from English but is very regular. Word order is Subject–Object–Verb (the verb comes last), and small 'particles' after each word tell you its role in the sentence.",
  topics: [
    {
      title: "Word order: the verb comes last",
      body: "Sentences end with the verb. Everything else (who, what, where) comes before it, each marked by a particle.",
      examples: [
        ["わたしは すしを たべます。", "I eat sushi. (I-topic sushi-object eat)"],
        ["かれは とうきょうに いきます。", "He goes to Tokyo."],
      ],
    },
    {
      title: "Particles: the grammar glue",
      body: "Particles follow the word they mark: は (wa) topic, が (ga) subject, を (o) object, に (ni) to/at, で (de) by/at, へ (e) toward, と (to) and/with, も (mo) also, の (no) possessive.",
      examples: [
        ["ねこが います。", "There is a cat. (ga marks the subject)"],
        ["パンを たべます。", "I eat bread. (o marks the object)"],
        ["わたしの ほん", "my book (no = possessive)"],
        ["がっこうに いきます。", "I go to school. (ni = destination)"],
      ],
    },
    {
      title: "Politeness: です / ます",
      body: "The polite, all-purpose register ends statements in です (after nouns/adjectives) or the ます-form of verbs. Safe for almost any situation as a learner.",
      examples: [
        ["がくせいです。", "I am a student."],
        ["たべます。", "I eat / will eat (polite)."],
        ["たべません。", "I don't eat (polite negative)."],
      ],
    },
    {
      title: "No articles, no plurals",
      body: "There's no 'a' or 'the', and nouns don't change for plural — ねこ can mean cat or cats. Number comes from context or counters.",
      examples: [
        ["ほん", "book / books"],
        ["ねこが すきです。", "I like cats."],
      ],
    },
  ],
};

export default function GrammarGuide() {
  const lang = useSettings().studyLanguage;
  const g = lang === "ja" ? ja : id;

  return (
    <PublicPage>
      <div className="mb-6">
        <h1 className="text-2xl">{g.title}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {g.intro}
        </p>
      </div>

      <div className="space-y-4">
        {g.topics.map((t) => (
          <section key={t.title} className="card overflow-hidden">
            <h2 className="px-5 py-3 text-base" style={{ borderBottom: "2px solid var(--edge)" }}>
              {t.title}
            </h2>
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed">{t.body}</p>
              {t.examples && (
                <ul className="mt-3.5 space-y-2">
                  {t.examples.map(([tgt, en], i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                      <span className="font-display font-bold" style={{ color: "var(--accent)" }}>
                        {tgt}
                      </span>
                      <span style={{ color: "var(--muted)" }}>{en}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        Grammar is best learned in context — drill the units, and these patterns will click.
      </p>
    </PublicPage>
  );
}

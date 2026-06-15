import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja06-family",
  "date": "ja-06",
  "title": "Family",
  "sections": [
    {
      "titleEn": "The word for family",
      "titleId": "「家族」という言葉",
      "items": [
        {
          "target": "家族",
          "en": "family",
          "kind": "vocab",
          "reading": "kazoku",
          "note": "General word for family. Use 私の家族 (watashi no kazoku) for 'my family.'"
        },
        {
          "target": "ご家族",
          "en": "(your/someone's) family (polite)",
          "kind": "vocab",
          "reading": "go-kazoku",
          "note": "Add the honorific prefix ご when talking about another person's family."
        },
        {
          "target": "両親",
          "en": "(one's own) parents",
          "kind": "vocab",
          "reading": "ryōshin",
          "note": "Humble/plain form for your own parents. Others' parents: ご両親 (go-ryōshin)."
        },
        {
          "target": "兄弟",
          "en": "siblings; brothers",
          "kind": "vocab",
          "reading": "kyōdai",
          "note": "Literally 'older + younger brother,' but commonly means 'siblings' in general."
        }
      ]
    },
    {
      "titleEn": "My own family (humble forms)",
      "titleId": "自分の家族（謙譲）",
      "items": [
        {
          "target": "父",
          "en": "(my) father",
          "kind": "vocab",
          "reading": "chichi",
          "note": "Humble form for your own father, used when speaking to others."
        },
        {
          "target": "母",
          "en": "(my) mother",
          "kind": "vocab",
          "reading": "haha",
          "note": "Humble form for your own mother."
        },
        {
          "target": "兄",
          "en": "(my) older brother",
          "kind": "vocab",
          "reading": "ani",
          "note": "Your own older brother."
        },
        {
          "target": "姉",
          "en": "(my) older sister",
          "kind": "vocab",
          "reading": "ane",
          "note": "Your own older sister."
        },
        {
          "target": "弟",
          "en": "(my) younger brother",
          "kind": "vocab",
          "reading": "otōto",
          "note": "Younger brother; same form for own and others' at N5. Long ō: oto-o-to."
        },
        {
          "target": "妹",
          "en": "(my) younger sister",
          "kind": "vocab",
          "reading": "imōto",
          "note": "Younger sister. Long ō: imo-o-to."
        },
        {
          "target": "祖父",
          "en": "(my) grandfather",
          "kind": "vocab",
          "reading": "sofu",
          "note": "Humble form for your own grandfather."
        },
        {
          "target": "祖母",
          "en": "(my) grandmother",
          "kind": "vocab",
          "reading": "sobo",
          "note": "Humble form for your own grandmother."
        }
      ]
    },
    {
      "titleEn": "Others' family (polite forms)",
      "titleId": "相手の家族（尊敬）",
      "items": [
        {
          "target": "お父さん",
          "en": "father (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "otōsan",
          "note": "Polite form. Also how you address/refer to your own father at home. Long ō: oto-o-san."
        },
        {
          "target": "お母さん",
          "en": "mother (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "okāsan",
          "note": "Polite form. Long ā: oka-a-san."
        },
        {
          "target": "お兄さん",
          "en": "older brother (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "onīsan",
          "note": "Polite form. Long ī: oni-i-san."
        },
        {
          "target": "お姉さん",
          "en": "older sister (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "onēsan",
          "note": "Polite form. Long ē: one-e-san."
        },
        {
          "target": "弟さん",
          "en": "(someone's) younger brother",
          "kind": "vocab",
          "reading": "otōto-san",
          "note": "Add さん to politely refer to another person's younger brother."
        },
        {
          "target": "妹さん",
          "en": "(someone's) younger sister",
          "kind": "vocab",
          "reading": "imōto-san",
          "note": "Add さん for another person's younger sister."
        },
        {
          "target": "おじいさん",
          "en": "grandfather (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "ojīsan",
          "note": "Polite form. Long ī. Distinct from おじさん (ojisan = uncle/middle-aged man)."
        },
        {
          "target": "おばあさん",
          "en": "grandmother (someone else's; or to address own)",
          "kind": "vocab",
          "reading": "obāsan",
          "note": "Polite form. Long ā. Distinct from おばさん (obasan = aunt/middle-aged woman)."
        }
      ]
    },
    {
      "titleEn": "Example sentences",
      "titleId": "例文",
      "items": [
        {
          "target": "私の家族は四人です。",
          "en": "My family has four people.",
          "kind": "sentence",
          "reading": "watashi no kazoku wa yonin desu.",
          "note": "は is the topic particle, read 'wa.' 四人 (yonin) = four people."
        },
        {
          "target": "父は会社員です。",
          "en": "My father is a company employee.",
          "kind": "sentence",
          "reading": "chichi wa kaishain desu.",
          "note": "Use the humble 父 when telling someone else about your own dad."
        },
        {
          "target": "お母さんはやさしいです。",
          "en": "Your mother is kind.",
          "kind": "sentence",
          "reading": "okāsan wa yasashii desu.",
          "note": "お母さん here refers to the listener's mother."
        },
        {
          "target": "兄が一人います。",
          "en": "I have one older brother.",
          "kind": "sentence",
          "reading": "ani ga hitori imasu.",
          "note": "います (imasu) is used for people/animals; 一人 (hitori) = one person."
        },
        {
          "target": "ご家族はお元気ですか。",
          "en": "Is your family doing well?",
          "kind": "sentence",
          "reading": "go-kazoku wa o-genki desu ka.",
          "note": "ご家族 politely refers to the listener's family; か marks a question."
        }
      ]
    }
  ]
};

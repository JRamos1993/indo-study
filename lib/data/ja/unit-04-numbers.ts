import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja04-numbers",
  "date": "ja-04",
  "title": "Numbers & Counting",
  "sections": [
    {
      "titleEn": "Numbers 0-10",
      "titleId": "0から10までの数",
      "notes": [
        "Four, seven, and nine each have two readings. The native-style よん/なな/きゅう are the safe defaults when counting aloud or saying a number alone.",
        "し (4), しち (7), and く (9) survive in fixed time/date expressions you will meet later."
      ],
      "items": [
        {
          "target": "ゼロ",
          "en": "zero",
          "kind": "vocab",
          "reading": "zero",
          "note": "Loanword, most common in everyday speech."
        },
        {
          "target": "零",
          "en": "zero",
          "kind": "vocab",
          "reading": "rei",
          "note": "Native reading; formal/written, e.g. temperatures. 〇 (まる maru) is also used for '0' in phone numbers."
        },
        {
          "target": "一",
          "en": "one",
          "kind": "vocab",
          "reading": "ichi",
          "note": "On-reading used for counting."
        },
        {
          "target": "二",
          "en": "two",
          "kind": "vocab",
          "reading": "ni"
        },
        {
          "target": "三",
          "en": "three",
          "kind": "vocab",
          "reading": "san"
        },
        {
          "target": "四",
          "en": "four",
          "kind": "vocab",
          "reading": "yon",
          "note": "Irregular: 四 reads both よん (yon) and し (shi). よん is preferred to avoid し sounding like 死 (death)."
        },
        {
          "target": "五",
          "en": "five",
          "kind": "vocab",
          "reading": "go"
        },
        {
          "target": "六",
          "en": "six",
          "kind": "vocab",
          "reading": "roku"
        },
        {
          "target": "七",
          "en": "seven",
          "kind": "vocab",
          "reading": "nana",
          "note": "Irregular: 七 reads both なな (nana) and しち (shichi). なな is clearer; しち appears in 七時 (shichi-ji, 7 o'clock)."
        },
        {
          "target": "八",
          "en": "eight",
          "kind": "vocab",
          "reading": "hachi"
        },
        {
          "target": "九",
          "en": "nine",
          "kind": "vocab",
          "reading": "kyū",
          "note": "Irregular: 九 reads both きゅう (kyū) and く (ku). きゅう is the default; く appears in 九時 (ku-ji, 9 o'clock)."
        },
        {
          "target": "十",
          "en": "ten",
          "kind": "vocab",
          "reading": "jū"
        }
      ]
    },
    {
      "titleEn": "Tens, Hundreds & Thousands",
      "titleId": "十・百・千",
      "notes": [
        "Large numbers stack high-to-low with no 'and': 365 = 三百六十五 (sanbyaku rokujū go).",
        "Watch the sound changes around 百 and 千 — they are tested at N5."
      ],
      "items": [
        {
          "target": "十一",
          "en": "eleven",
          "kind": "vocab",
          "reading": "jūichi",
          "note": "11-19 = 十 + ones: 十一, 十二, … 十九."
        },
        {
          "target": "十二",
          "en": "twelve",
          "kind": "vocab",
          "reading": "jūni"
        },
        {
          "target": "十五",
          "en": "fifteen",
          "kind": "vocab",
          "reading": "jūgo"
        },
        {
          "target": "十九",
          "en": "nineteen",
          "kind": "vocab",
          "reading": "jūkyū",
          "note": "Also read じゅうく (jūku)."
        },
        {
          "target": "二十",
          "en": "twenty",
          "kind": "vocab",
          "reading": "nijū",
          "note": "Tens = ones + 十: 二十, 三十, 四十(よんじゅう), 五十…"
        },
        {
          "target": "三十",
          "en": "thirty",
          "kind": "vocab",
          "reading": "sanjū"
        },
        {
          "target": "四十",
          "en": "forty",
          "kind": "vocab",
          "reading": "yonjū",
          "note": "よんじゅう, never しじゅう in counting."
        },
        {
          "target": "五十",
          "en": "fifty",
          "kind": "vocab",
          "reading": "gojū"
        },
        {
          "target": "七十",
          "en": "seventy",
          "kind": "vocab",
          "reading": "nanajū",
          "note": "ななじゅう preferred over しちじゅう."
        },
        {
          "target": "九十",
          "en": "ninety",
          "kind": "vocab",
          "reading": "kyūjū"
        },
        {
          "target": "百",
          "en": "hundred (100)",
          "kind": "vocab",
          "reading": "hyaku",
          "note": "Sound changes: 三百 さんびゃく (sanbyaku), 六百 ろっぴゃく (roppyaku), 八百 はっぴゃく (happyaku)."
        },
        {
          "target": "千",
          "en": "thousand (1,000)",
          "kind": "vocab",
          "reading": "sen",
          "note": "Sound changes: 三千 さんぜん (sanzen), 八千 はっせん (hassen). 1,000 is plain 千 (not いっせん)."
        },
        {
          "target": "三百",
          "en": "three hundred (300)",
          "kind": "vocab",
          "reading": "sanbyaku",
          "note": "Irregular sound change: ひゃく → びゃく."
        },
        {
          "target": "六百",
          "en": "six hundred (600)",
          "kind": "vocab",
          "reading": "roppyaku",
          "note": "Double consonant + ぴゃく."
        },
        {
          "target": "三千",
          "en": "three thousand (3,000)",
          "kind": "vocab",
          "reading": "sanzen",
          "note": "Irregular sound change: せん → ぜん."
        }
      ]
    },
    {
      "titleEn": "Counting People & Objects",
      "titleId": "人や物の数え方",
      "notes": [
        "The つ-series only runs 1-10; for 11+ switch to a specific counter like 〜個.",
        "人 (people), つ (general things) — memorize the irregular 一人/二人 and 三つ/四つ first."
      ],
      "items": [
        {
          "target": "一人",
          "en": "one person",
          "kind": "vocab",
          "reading": "hitori",
          "note": "Irregular native reading (ひと + り). Also means 'alone'."
        },
        {
          "target": "二人",
          "en": "two people",
          "kind": "vocab",
          "reading": "futari",
          "note": "Irregular native reading. 一人/二人 are exceptions; from three on it is regular."
        },
        {
          "target": "三人",
          "en": "three people",
          "kind": "vocab",
          "reading": "sannin",
          "note": "From 3 up: number + 人 (にん). 四人 = よにん (yonin), 七人 = しちにん/ななにん."
        },
        {
          "target": "四人",
          "en": "four people",
          "kind": "vocab",
          "reading": "yonin",
          "note": "Read よにん, not よんにん."
        },
        {
          "target": "何人",
          "en": "how many people",
          "kind": "vocab",
          "reading": "nannin",
          "note": "何 (なん) = 'how many' before counters."
        },
        {
          "target": "一つ",
          "en": "one (thing)",
          "kind": "vocab",
          "reading": "hitotsu",
          "note": "Native つ-counter for general objects (1-10). No counter needed; great for beginners."
        },
        {
          "target": "二つ",
          "en": "two (things)",
          "kind": "vocab",
          "reading": "futatsu"
        },
        {
          "target": "三つ",
          "en": "three (things)",
          "kind": "vocab",
          "reading": "mittsu",
          "note": "Small tsu: みっつ."
        },
        {
          "target": "四つ",
          "en": "four (things)",
          "kind": "vocab",
          "reading": "yottsu",
          "note": "よっつ, with small tsu."
        },
        {
          "target": "五つ",
          "en": "five (things)",
          "kind": "vocab",
          "reading": "itsutsu"
        },
        {
          "target": "六つ",
          "en": "six (things)",
          "kind": "vocab",
          "reading": "muttsu"
        },
        {
          "target": "七つ",
          "en": "seven (things)",
          "kind": "vocab",
          "reading": "nanatsu"
        },
        {
          "target": "八つ",
          "en": "eight (things)",
          "kind": "vocab",
          "reading": "yattsu"
        },
        {
          "target": "九つ",
          "en": "nine (things)",
          "kind": "vocab",
          "reading": "kokonotsu"
        },
        {
          "target": "十",
          "en": "ten (things)",
          "kind": "vocab",
          "reading": "tō",
          "note": "Exception: 'ten things' is とお (tō), with no つ."
        },
        {
          "target": "いくつ",
          "en": "how many (things)",
          "kind": "vocab",
          "reading": "ikutsu",
          "note": "Question word for the つ-counter; also asks someone's age politely."
        }
      ]
    },
    {
      "titleEn": "Counters: 〜個 and 〜枚",
      "titleId": "助数詞「〜個」「〜枚」",
      "notes": [
        "個 is the easy 'default' counter for objects that have no special counter; 枚 is for flat things.",
        "枚 takes no sound changes, which makes it the friendliest counter to start with."
      ],
      "items": [
        {
          "target": "一個",
          "en": "one piece (small object)",
          "kind": "vocab",
          "reading": "ikko",
          "note": "〜個 (こ) counts small, roundish things (apples, eggs). Sound change: 一個 いっこ."
        },
        {
          "target": "二個",
          "en": "two pieces",
          "kind": "vocab",
          "reading": "niko"
        },
        {
          "target": "三個",
          "en": "three pieces",
          "kind": "vocab",
          "reading": "sanko"
        },
        {
          "target": "六個",
          "en": "six pieces",
          "kind": "vocab",
          "reading": "rokko",
          "note": "Sound change: ろっこ."
        },
        {
          "target": "八個",
          "en": "eight pieces",
          "kind": "vocab",
          "reading": "hakko",
          "note": "Sound change: はっこ."
        },
        {
          "target": "十個",
          "en": "ten pieces",
          "kind": "vocab",
          "reading": "jukko",
          "note": "じゅっこ (also じっこ in formal speech)."
        },
        {
          "target": "何個",
          "en": "how many pieces",
          "kind": "vocab",
          "reading": "nanko"
        },
        {
          "target": "一枚",
          "en": "one sheet (flat object)",
          "kind": "vocab",
          "reading": "ichimai",
          "note": "〜枚 (まい) counts thin, flat things: paper, plates, shirts, tickets, stamps. No sound changes — fully regular."
        },
        {
          "target": "二枚",
          "en": "two sheets",
          "kind": "vocab",
          "reading": "nimai"
        },
        {
          "target": "三枚",
          "en": "three sheets",
          "kind": "vocab",
          "reading": "sanmai"
        },
        {
          "target": "四枚",
          "en": "four sheets",
          "kind": "vocab",
          "reading": "yonmai",
          "note": "よんまい."
        },
        {
          "target": "何枚",
          "en": "how many sheets",
          "kind": "vocab",
          "reading": "nanmai"
        }
      ]
    },
    {
      "titleEn": "Example Sentences",
      "titleId": "例文",
      "notes": [
        "Typical order: [object] を [number+counter] + verb (ください / お願いします / あります).",
        "When the noun is clear, the counter can stand alone as the answer: 「いくつですか?」「三つです。」"
      ],
      "items": [
        {
          "target": "りんごを三つください。",
          "en": "Three apples, please.",
          "kind": "sentence",
          "reading": "ringo o mittsu kudasai.",
          "note": "Counter comes after the object + を; を is pronounced 'o'."
        },
        {
          "target": "学生は二十人います。",
          "en": "There are twenty students.",
          "kind": "sentence",
          "reading": "gakusei wa nijūnin imasu.",
          "note": "は as a particle is pronounced 'wa'. Counter 〜人 for people."
        },
        {
          "target": "切手を五枚買いました。",
          "en": "I bought five stamps.",
          "kind": "sentence",
          "reading": "kitte o gomai kaimashita.",
          "note": "枚 counts flat objects like stamps."
        },
        {
          "target": "卵が六個あります。",
          "en": "There are six eggs.",
          "kind": "sentence",
          "reading": "tamago ga rokko arimasu.",
          "note": "個 for small roundish objects; note the sound change ろっこ."
        },
        {
          "target": "家族は四人です。",
          "en": "There are four people in my family.",
          "kind": "sentence",
          "reading": "kazoku wa yonin desu.",
          "note": "四人 is read よにん, not よんにん."
        },
        {
          "target": "コーヒーを一つお願いします。",
          "en": "One coffee, please.",
          "kind": "sentence",
          "reading": "kōhī o hitotsu onegai shimasu.",
          "note": "ひとつ works as a polite all-purpose 'one' when ordering."
        }
      ]
    }
  ]
};

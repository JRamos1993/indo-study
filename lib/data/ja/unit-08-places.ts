import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja08-places",
  "date": "ja-08",
  "title": "Places & Directions",
  "sections": [
    {
      "titleEn": "Demonstrative Place Words (ko-so-a-do)",
      "titleId": "指示語（こそあど）",
      "items": [
        {
          "target": "ここ",
          "en": "here (near speaker)",
          "kind": "vocab",
          "reading": "koko",
          "note": "The こ-series = close to the speaker."
        },
        {
          "target": "そこ",
          "en": "there (near listener)",
          "kind": "vocab",
          "reading": "soko",
          "note": "The そ-series = close to the listener."
        },
        {
          "target": "あそこ",
          "en": "over there (far from both)",
          "kind": "vocab",
          "reading": "asoko",
          "note": "Irregular form (not あこ); あ-series = far from both speakers."
        },
        {
          "target": "どこ",
          "en": "where",
          "kind": "vocab",
          "reading": "doko",
          "note": "The ど-series = question word."
        },
        {
          "target": "こちら",
          "en": "this way / over here (polite)",
          "kind": "vocab",
          "reading": "kochira",
          "note": "More polite than ここ; also means 'this one' or refers to a person."
        },
        {
          "target": "そちら",
          "en": "that way / over there (polite)",
          "kind": "vocab",
          "reading": "sochira",
          "note": "Polite counterpart of そこ."
        },
        {
          "target": "あちら",
          "en": "that way over there (polite)",
          "kind": "vocab",
          "reading": "achira",
          "note": "Polite counterpart of あそこ."
        },
        {
          "target": "どちら",
          "en": "which way / where (polite)",
          "kind": "vocab",
          "reading": "dochira",
          "note": "Polite question word; also 'which (of two)'."
        },
        {
          "target": "トイレはどこですか。",
          "en": "Where is the toilet?",
          "kind": "sentence",
          "reading": "Toire wa doko desu ka.",
          "note": "は marks the topic; the most useful 'where is...?' pattern."
        },
        {
          "target": "駅はあそこです。",
          "en": "The station is over there.",
          "kind": "sentence",
          "reading": "Eki wa asoko desu."
        }
      ]
    },
    {
      "titleEn": "Position & Direction Words",
      "titleId": "位置と方向の言葉",
      "items": [
        {
          "target": "上",
          "en": "on / above / top",
          "kind": "vocab",
          "reading": "ue",
          "note": "On (X) = X の上に. Kun: うえ; on: ジョウ (as in 上手 jōzu)."
        },
        {
          "target": "下",
          "en": "under / below / bottom",
          "kind": "vocab",
          "reading": "shita",
          "note": "Under (X) = X の下に. Kun: した; on: カ/ゲ."
        },
        {
          "target": "中",
          "en": "inside / middle",
          "kind": "vocab",
          "reading": "naka",
          "note": "Inside (X) = X の中に. Kun: なか; on: チュウ (as in 中国 Chūgoku)."
        },
        {
          "target": "前",
          "en": "front / before",
          "kind": "vocab",
          "reading": "mae",
          "note": "In front of (X) = X の前に. Also 'before' in time (3時前 = before 3)."
        },
        {
          "target": "後ろ",
          "en": "behind / back",
          "kind": "vocab",
          "reading": "ushiro",
          "note": "Behind (X) = X の後ろに. Note okurigana ろ; don't confuse 後 (ato/go = 'after in time')."
        },
        {
          "target": "右",
          "en": "right (direction)",
          "kind": "vocab",
          "reading": "migi",
          "note": "On the right of (X) = X の右に."
        },
        {
          "target": "左",
          "en": "left (direction)",
          "kind": "vocab",
          "reading": "hidari",
          "note": "On the left of (X) = X の左に."
        },
        {
          "target": "外",
          "en": "outside",
          "kind": "vocab",
          "reading": "soto",
          "note": "Outside (X) = X の外に. Opposite of 中."
        },
        {
          "target": "隣",
          "en": "next to / neighbor",
          "kind": "vocab",
          "reading": "tonari",
          "note": "Next to (X) = X の隣に. Implies things of the same kind side by side."
        },
        {
          "target": "近く",
          "en": "near / nearby",
          "kind": "vocab",
          "reading": "chikaku",
          "note": "Near (X) = X の近く. From the adjective 近い (chikai)."
        },
        {
          "target": "猫はテーブルの上にいます。",
          "en": "The cat is on the table.",
          "kind": "sentence",
          "reading": "Neko wa tēburu no ue ni imasu.",
          "note": "X の上に + います for animate things; に marks location of existence."
        },
        {
          "target": "銀行は駅の前にあります。",
          "en": "The bank is in front of the station.",
          "kind": "sentence",
          "reading": "Ginkō wa eki no mae ni arimasu.",
          "note": "あります for inanimate things/places; います for living things."
        }
      ]
    },
    {
      "titleEn": "Common Places",
      "titleId": "よく使う場所",
      "items": [
        {
          "target": "家",
          "en": "house / home",
          "kind": "vocab",
          "reading": "ie",
          "note": "Also read うち (uchi) when meaning 'my/our home'. On: カ/ケ."
        },
        {
          "target": "学校",
          "en": "school",
          "kind": "vocab",
          "reading": "gakkō",
          "note": "Note the small っ (double k) and long ō. 学 (gaku) + 校 (kō)."
        },
        {
          "target": "駅",
          "en": "(train) station",
          "kind": "vocab",
          "reading": "eki",
          "note": "Single-kanji place word; very common with 行く/前/中."
        },
        {
          "target": "店",
          "en": "shop / store",
          "kind": "vocab",
          "reading": "mise",
          "note": "Kun: みせ; on: テン (as in 店員 ten'in = shop clerk)."
        },
        {
          "target": "病院",
          "en": "hospital / clinic",
          "kind": "vocab",
          "reading": "byōin",
          "note": "Both vowels are long: byō-in. Don't confuse with 美容院 (biyōin = hair salon)."
        },
        {
          "target": "銀行",
          "en": "bank",
          "kind": "vocab",
          "reading": "ginkō",
          "note": "行 read こう here. Long ō at the end."
        },
        {
          "target": "図書館",
          "en": "library",
          "kind": "vocab",
          "reading": "toshokan",
          "note": "図 (to) + 書 (sho) + 館 (kan); a building for books."
        },
        {
          "target": "会社",
          "en": "company / office",
          "kind": "vocab",
          "reading": "kaisha",
          "note": "Where one works; 会社員 (kaishain) = company employee."
        },
        {
          "target": "公園",
          "en": "park",
          "kind": "vocab",
          "reading": "kōen",
          "note": "Long ō. Don't confuse with 講演 (kōen = lecture)."
        },
        {
          "target": "郵便局",
          "en": "post office",
          "kind": "vocab",
          "reading": "yūbinkyoku",
          "note": "郵便 (yūbin = mail) + 局 (kyoku = bureau). Long ū."
        },
        {
          "target": "コンビニ",
          "en": "convenience store",
          "kind": "vocab",
          "reading": "konbini",
          "note": "Katakana loanword, shortened from コンビニエンスストア."
        }
      ]
    },
    {
      "titleEn": "Motion Verbs: Go, Come, Return",
      "titleId": "移動の動詞：行く・来る・帰る",
      "items": [
        {
          "target": "行く",
          "en": "to go",
          "kind": "vocab",
          "reading": "iku",
          "note": "Group I verb. Polite: 行きます (ikimasu). Irregular te-form: 行って (itte), not いいて."
        },
        {
          "target": "来る",
          "en": "to come",
          "kind": "vocab",
          "reading": "kuru",
          "note": "Irregular verb. Polite: 来ます (kimasu); negative: 来ない (konai). Reading changes by form."
        },
        {
          "target": "帰る",
          "en": "to return / go home",
          "kind": "vocab",
          "reading": "kaeru",
          "note": "Group I verb (looks Group II but isn't). Polite: 帰ります (kaerimasu). Implies returning to a home base."
        },
        {
          "target": "歩く",
          "en": "to walk",
          "kind": "vocab",
          "reading": "aruku",
          "note": "Group I. Polite: 歩きます (arukimasu)."
        },
        {
          "target": "入る",
          "en": "to enter / go in",
          "kind": "vocab",
          "reading": "hairu",
          "note": "Group I (another exception). 〜に入る = enter (a place)."
        },
        {
          "target": "出る",
          "en": "to leave / go out / exit",
          "kind": "vocab",
          "reading": "deru",
          "note": "Group II. 〜を出る = leave (a place); を marks the place exited."
        },
        {
          "target": "曲がる",
          "en": "to turn (a corner)",
          "kind": "vocab",
          "reading": "magaru",
          "note": "右に曲がる = turn right. に marks the direction turned."
        },
        {
          "target": "学校へ行きます。",
          "en": "I go to school.",
          "kind": "sentence",
          "reading": "Gakkō e ikimasu.",
          "note": "へ marks direction/destination and is pronounced 'e', not 'he'."
        },
        {
          "target": "明日、病院に行きます。",
          "en": "I'm going to the hospital tomorrow.",
          "kind": "sentence",
          "reading": "Ashita, byōin ni ikimasu.",
          "note": "に can also mark the destination with motion verbs (interchangeable with へ here)."
        },
        {
          "target": "友達がうちに来ます。",
          "en": "A friend is coming to my house.",
          "kind": "sentence",
          "reading": "Tomodachi ga uchi ni kimasu.",
          "note": "が marks the new-information subject; 来ます is the polite form of 来る."
        },
        {
          "target": "六時に家へ帰ります。",
          "en": "I return home at six o'clock.",
          "kind": "sentence",
          "reading": "Roku-ji ni ie e kaerimasu.",
          "note": "Time + に (六時に) marks a specific clock time."
        },
        {
          "target": "次の角を右に曲がってください。",
          "en": "Please turn right at the next corner.",
          "kind": "sentence",
          "reading": "Tsugi no kado o migi ni magatte kudasai.",
          "note": "を marks the corner passed through; 〜てください = please do (request)."
        }
      ]
    }
  ]
};

import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja13-radicals",
  "date": "ja-13",
  "title": "Common Kanji Radicals",
  "sections": [
    {
      "titleEn": "People, Body & Mind",
      "titleId": "人・体・心の部首",
      "notes": [
        "A radical (部首, bushu) is the building block that often hints at a kanji's meaning. The 'side' forms — 亻, 扌, 氵, 忄 — are squeezed versions written on the left of a kanji.",
        "へん (hen) = a radical on the LEFT side. So 亻 is にんべん, 扌 is てへん, 氵 is さんずい, 忄 is りっしんべん."
      ],
      "items": [
        {
          "target": "亻",
          "en": "person (left-side form of 人)",
          "kind": "radical",
          "reading": "ninben",
          "note": "appears in 休, 体"
        },
        {
          "target": "口",
          "en": "mouth",
          "kind": "radical",
          "reading": "kuchi",
          "note": "appears in 名, 同"
        },
        {
          "target": "手",
          "en": "hand",
          "kind": "radical",
          "reading": "te",
          "note": "appears in 手, 拳; side form 扌 in 持, 押"
        },
        {
          "target": "扌",
          "en": "hand (left-side form of 手)",
          "kind": "radical",
          "reading": "tehen",
          "note": "appears in 持, 打"
        },
        {
          "target": "心",
          "en": "heart / mind",
          "kind": "radical",
          "reading": "kokoro",
          "note": "appears in 思, 心; side form 忄 in 忙, 快"
        },
        {
          "target": "忄",
          "en": "heart (left-side form of 心)",
          "kind": "radical",
          "reading": "risshinben",
          "note": "appears in 忙, 性"
        },
        {
          "target": "女",
          "en": "woman",
          "kind": "radical",
          "reading": "onna",
          "note": "appears in 好, 姉"
        },
        {
          "target": "子",
          "en": "child",
          "kind": "radical",
          "reading": "ko",
          "note": "appears in 字, 学"
        }
      ]
    },
    {
      "titleEn": "Nature & The Elements",
      "titleId": "自然・元素の部首",
      "notes": [
        "Many element radicals double as everyday kanji: 木 (tree), 日 (sun), 火 (fire), 水 (water), 山 (mountain), 田 (rice field), 雨 (rain).",
        "氵 (さんずい) is the side form of 水 (water) and 灬 (れっか / れんが) is the bottom form of 火 (fire)."
      ],
      "items": [
        {
          "target": "氵",
          "en": "water (left-side form of 水)",
          "kind": "radical",
          "reading": "sanzui",
          "note": "appears in 海, 池"
        },
        {
          "target": "木",
          "en": "tree / wood",
          "kind": "radical",
          "reading": "ki",
          "note": "appears in 林, 校"
        },
        {
          "target": "日",
          "en": "sun / day",
          "kind": "radical",
          "reading": "hi / nichi",
          "note": "appears in 時, 明"
        },
        {
          "target": "月",
          "en": "moon / month (also 'flesh' in body kanji)",
          "kind": "radical",
          "reading": "tsuki",
          "note": "appears in 朝, 服"
        },
        {
          "target": "火",
          "en": "fire",
          "kind": "radical",
          "reading": "hi",
          "note": "appears in 火, 灯; bottom form 灬 in 点, 無"
        },
        {
          "target": "灬",
          "en": "fire (bottom form of 火)",
          "kind": "radical",
          "reading": "rekka / renga",
          "note": "appears in 点, 然"
        },
        {
          "target": "山",
          "en": "mountain",
          "kind": "radical",
          "reading": "yama",
          "note": "appears in 岩, 出"
        },
        {
          "target": "田",
          "en": "rice field",
          "kind": "radical",
          "reading": "ta",
          "note": "appears in 町, 男"
        },
        {
          "target": "雨",
          "en": "rain",
          "kind": "radical",
          "reading": "ame",
          "note": "appears in 電, 雪"
        }
      ]
    },
    {
      "titleEn": "Things, Materials & Structures",
      "titleId": "もの・材料・構造の部首",
      "notes": [
        "言 (げん / ことば) signals speech or language; 糸 (いと) signals thread or string; 金 (かね) signals metal.",
        "艹 (くさかんむり) sits on TOP (かんむり = crown) and means grass/plant. 宀 (うかんむり) is the roof radical, used for buildings and rooms."
      ],
      "items": [
        {
          "target": "言",
          "en": "speech / words",
          "kind": "radical",
          "reading": "gen / kotoba",
          "note": "appears in 話, 語"
        },
        {
          "target": "糸",
          "en": "thread",
          "kind": "radical",
          "reading": "ito",
          "note": "appears in 紙, 細"
        },
        {
          "target": "金",
          "en": "metal / gold / money",
          "kind": "radical",
          "reading": "kane / kin",
          "note": "appears in 金, 鉄"
        },
        {
          "target": "食",
          "en": "eat / food",
          "kind": "radical",
          "reading": "shoku / taberu",
          "note": "appears in 飲, 飯"
        },
        {
          "target": "車",
          "en": "vehicle / wheel",
          "kind": "radical",
          "reading": "kuruma",
          "note": "appears in 車, 転"
        },
        {
          "target": "門",
          "en": "gate",
          "kind": "radical",
          "reading": "mon",
          "note": "appears in 間, 聞"
        },
        {
          "target": "艹",
          "en": "grass / plant (top crown form of 草)",
          "kind": "radical",
          "reading": "kusakanmuri",
          "note": "appears in 花, 茶"
        },
        {
          "target": "宀",
          "en": "roof (top form, used for buildings/rooms)",
          "kind": "radical",
          "reading": "ukanmuri",
          "note": "appears in 家, 安"
        }
      ]
    },
    {
      "titleEn": "Example Sentences",
      "titleId": "例文（れいぶん）",
      "notes": [
        "These sentences use kanji built from the radicals above. Notice how the radical's meaning peeks through: 休む has 亻 (person) + 木 (tree) — a person resting by a tree."
      ],
      "items": [
        {
          "target": "「休」は人（亻）と木でできています。",
          "en": "The kanji 休 is made from 'person' and 'tree'.",
          "kind": "sentence",
          "reading": "「kyū」 wa hito (ninben) to ki de dekite imasu.",
          "note": "亻 = にんべん, 木 = き"
        },
        {
          "target": "「海」にはさんずいがあります。",
          "en": "The kanji 海 (sea) has the water radical (さんずい).",
          "kind": "sentence",
          "reading": "「umi」 ni wa sanzui ga arimasu.",
          "note": "は as a particle = wa"
        },
        {
          "target": "「花」のかんむりはくさかんむりです。",
          "en": "The top of 花 (flower) is the grass radical (くさかんむり).",
          "kind": "sentence",
          "reading": "「hana」 no kanmuri wa kusakanmuri desu."
        },
        {
          "target": "「話」は言（ことば）の部首を使います。",
          "en": "The kanji 話 (talk) uses the speech radical.",
          "kind": "sentence",
          "reading": "「hanashi」 wa gen (kotoba) no bushu o tsukaimasu.",
          "note": "を as object particle = o"
        }
      ]
    }
  ]
};

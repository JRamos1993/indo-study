import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja05-time",
  "date": "ja-05",
  "title": "Days, Months & Time",
  "sections": [
    {
      "titleEn": "Days of the Week",
      "titleId": "曜日（ようび）",
      "items": [
        {
          "target": "曜日",
          "en": "day of the week",
          "kind": "vocab",
          "reading": "yōbi",
          "note": "Suffix attached to each day. 曜 = day-of-week marker."
        },
        {
          "target": "月曜日",
          "en": "Monday",
          "kind": "vocab",
          "reading": "getsuyōbi",
          "note": "月 = moon. Here 月 is read getsu."
        },
        {
          "target": "火曜日",
          "en": "Tuesday",
          "kind": "vocab",
          "reading": "kayōbi",
          "note": "火 = fire."
        },
        {
          "target": "水曜日",
          "en": "Wednesday",
          "kind": "vocab",
          "reading": "suiyōbi",
          "note": "水 = water."
        },
        {
          "target": "木曜日",
          "en": "Thursday",
          "kind": "vocab",
          "reading": "mokuyōbi",
          "note": "木 = tree/wood."
        },
        {
          "target": "金曜日",
          "en": "Friday",
          "kind": "vocab",
          "reading": "kin'yōbi",
          "note": "金 = metal/gold. Note the n'y boundary: kin-yōbi, not ki-nyōbi."
        },
        {
          "target": "土曜日",
          "en": "Saturday",
          "kind": "vocab",
          "reading": "doyōbi",
          "note": "土 = earth/soil."
        },
        {
          "target": "日曜日",
          "en": "Sunday",
          "kind": "vocab",
          "reading": "nichiyōbi",
          "note": "Here the first 日 is read nichi; the final 日 (bi) is the 曜日 suffix."
        },
        {
          "target": "何曜日",
          "en": "what day of the week?",
          "kind": "vocab",
          "reading": "nan'yōbi",
          "note": "何 = what. Used to ask the day."
        },
        {
          "target": "今日は月曜日です。",
          "en": "Today is Monday.",
          "kind": "sentence",
          "reading": "Kyō wa getsuyōbi desu.",
          "note": "は is the topic particle, read wa."
        },
        {
          "target": "テストは何曜日ですか。",
          "en": "What day is the test?",
          "kind": "sentence",
          "reading": "Tesuto wa nan'yōbi desu ka.",
          "note": "か turns a statement into a question."
        }
      ]
    },
    {
      "titleEn": "Today, Yesterday & Tomorrow",
      "titleId": "今日・昨日・明日（きょう・きのう・あした）",
      "items": [
        {
          "target": "今日",
          "en": "today",
          "kind": "vocab",
          "reading": "kyō",
          "note": "Irregular reading (jukujikun): the kanji are not read character-by-character."
        },
        {
          "target": "昨日",
          "en": "yesterday",
          "kind": "vocab",
          "reading": "kinō",
          "note": "Irregular reading. A formal alternative is sakujitsu."
        },
        {
          "target": "明日",
          "en": "tomorrow",
          "kind": "vocab",
          "reading": "ashita",
          "note": "Commonly ashita; asu is more formal, myōnichi is very formal."
        },
        {
          "target": "毎日",
          "en": "every day",
          "kind": "vocab",
          "reading": "mainichi",
          "note": "毎 = every."
        },
        {
          "target": "今週",
          "en": "this week",
          "kind": "vocab",
          "reading": "konshū",
          "note": "週 = week."
        },
        {
          "target": "週末",
          "en": "weekend",
          "kind": "vocab",
          "reading": "shūmatsu",
          "note": "末 = end."
        },
        {
          "target": "明日は火曜日です。",
          "en": "Tomorrow is Tuesday.",
          "kind": "sentence",
          "reading": "Ashita wa kayōbi desu."
        },
        {
          "target": "昨日は休みでした。",
          "en": "Yesterday was a day off.",
          "kind": "sentence",
          "reading": "Kinō wa yasumi deshita.",
          "note": "でした is the past tense of です (was). 休み = rest/holiday."
        }
      ]
    },
    {
      "titleEn": "Parts of the Day",
      "titleId": "一日の時間帯（いちにちのじかんたい）",
      "items": [
        {
          "target": "朝",
          "en": "morning",
          "kind": "vocab",
          "reading": "asa"
        },
        {
          "target": "昼",
          "en": "noon / daytime",
          "kind": "vocab",
          "reading": "hiru",
          "note": "Also means lunchtime; 昼ご飯 (hirugohan) = lunch."
        },
        {
          "target": "夜",
          "en": "night",
          "kind": "vocab",
          "reading": "yoru"
        },
        {
          "target": "晩",
          "en": "evening / night",
          "kind": "vocab",
          "reading": "ban",
          "note": "Used in 今晩 (konban, tonight) and 晩ご飯 (bangohan, dinner)."
        },
        {
          "target": "午前",
          "en": "a.m. / morning",
          "kind": "vocab",
          "reading": "gozen",
          "note": "Precedes the time: 午前7時 = 7 a.m."
        },
        {
          "target": "午後",
          "en": "p.m. / afternoon",
          "kind": "vocab",
          "reading": "gogo",
          "note": "午後3時 = 3 p.m."
        },
        {
          "target": "今朝",
          "en": "this morning",
          "kind": "vocab",
          "reading": "kesa",
          "note": "Irregular reading."
        },
        {
          "target": "今晩",
          "en": "tonight / this evening",
          "kind": "vocab",
          "reading": "konban"
        },
        {
          "target": "毎朝",
          "en": "every morning",
          "kind": "vocab",
          "reading": "maiasa"
        },
        {
          "target": "朝、コーヒーを飲みます。",
          "en": "I drink coffee in the morning.",
          "kind": "sentence",
          "reading": "Asa, kōhī o nomimasu.",
          "note": "を is the object particle, read o. 飲みます = drink (polite)."
        }
      ]
    },
    {
      "titleEn": "Telling Time",
      "titleId": "時間（じかん）",
      "items": [
        {
          "target": "今",
          "en": "now",
          "kind": "vocab",
          "reading": "ima"
        },
        {
          "target": "時間",
          "en": "time / hour",
          "kind": "vocab",
          "reading": "jikan",
          "note": "As a counter, 〜時間 means a span of hours (e.g. 2時間 = two hours)."
        },
        {
          "target": "時",
          "en": "o'clock (hour)",
          "kind": "vocab",
          "reading": "ji",
          "note": "Counter for the hour: 3時 = sanji (3 o'clock)."
        },
        {
          "target": "分",
          "en": "minute",
          "kind": "vocab",
          "reading": "fun",
          "note": "Read fun or pun depending on the number: 3分 sanpun, 4分 yonpun, 5分 gofun."
        },
        {
          "target": "半",
          "en": "half (past)",
          "kind": "vocab",
          "reading": "han",
          "note": "7時半 = 7:30 (half past seven)."
        },
        {
          "target": "一時",
          "en": "one o'clock",
          "kind": "vocab",
          "reading": "ichiji"
        },
        {
          "target": "四時",
          "en": "four o'clock",
          "kind": "vocab",
          "reading": "yoji",
          "note": "Irregular: 4 is read yo, not yon or shi, before 時."
        },
        {
          "target": "七時",
          "en": "seven o'clock",
          "kind": "vocab",
          "reading": "shichiji",
          "note": "7 is read shichi here, not nana."
        },
        {
          "target": "九時",
          "en": "nine o'clock",
          "kind": "vocab",
          "reading": "kuji",
          "note": "Irregular: 9 is read ku, not kyū, before 時."
        },
        {
          "target": "何時",
          "en": "what time?",
          "kind": "vocab",
          "reading": "nanji",
          "note": "何 = what."
        },
        {
          "target": "今、何時ですか。",
          "en": "What time is it now?",
          "kind": "sentence",
          "reading": "Ima, nanji desu ka."
        },
        {
          "target": "午前九時半です。",
          "en": "It is 9:30 a.m.",
          "kind": "sentence",
          "reading": "Gozen kuji han desu."
        },
        {
          "target": "授業は午後四時からです。",
          "en": "The class starts at 4 p.m.",
          "kind": "sentence",
          "reading": "Jugyō wa gogo yoji kara desu.",
          "note": "から = from/starting at. 授業 = class/lesson."
        }
      ]
    }
  ]
};

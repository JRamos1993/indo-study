import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja09-verbs",
  "date": "ja-09",
  "title": "Common Verbs (N5)",
  "sections": [
    {
      "titleEn": "Everyday Action Verbs (Dictionary Form)",
      "titleId": "毎日の動作の動詞（辞書形）",
      "items": [
        {
          "target": "食べる",
          "en": "to eat",
          "kind": "vocab",
          "reading": "taberu",
          "note": "Ru-verb. Polite: 食べます (tabemasu). 食 kun: た(べる) ta(beru); on: ショク shoku."
        },
        {
          "target": "飲む",
          "en": "to drink",
          "kind": "vocab",
          "reading": "nomu",
          "note": "U-verb. Polite: 飲みます (nomimasu). Also 'to take' medicine: 薬を飲む (kusuri o nomu)."
        },
        {
          "target": "見る",
          "en": "to see; to watch; to look at",
          "kind": "vocab",
          "reading": "miru",
          "note": "Ru-verb. Polite: 見ます (mimasu). テレビを見る = watch TV."
        },
        {
          "target": "聞く",
          "en": "to listen; to hear; to ask",
          "kind": "vocab",
          "reading": "kiku",
          "note": "U-verb. Polite: 聞きます (kikimasu). 'Ask': 先生に聞く = ask the teacher."
        },
        {
          "target": "読む",
          "en": "to read",
          "kind": "vocab",
          "reading": "yomu",
          "note": "U-verb. Polite: 読みます (yomimasu). 本を読む = read a book."
        },
        {
          "target": "書く",
          "en": "to write",
          "kind": "vocab",
          "reading": "kaku",
          "note": "U-verb. Polite: 書きます (kakimasu). Irregular te-form: 書いて (kaite)."
        },
        {
          "target": "話す",
          "en": "to speak; to talk",
          "kind": "vocab",
          "reading": "hanasu",
          "note": "U-verb (-su). Polite: 話します (hanashimasu). Noun 話 = hanashi (a talk/story)."
        },
        {
          "target": "買う",
          "en": "to buy",
          "kind": "vocab",
          "reading": "kau",
          "note": "U-verb. Polite: 買います (kaimasu). を marks the thing bought."
        },
        {
          "target": "待つ",
          "en": "to wait",
          "kind": "vocab",
          "reading": "matsu",
          "note": "U-verb (-tsu). Polite: 待ちます (machimasu). ちょっと待って = wait a sec."
        }
      ]
    },
    {
      "titleEn": "Movement & Irregular Verbs",
      "titleId": "移動の動詞・不規則動詞",
      "items": [
        {
          "target": "行く",
          "en": "to go",
          "kind": "vocab",
          "reading": "iku",
          "note": "U-verb. Polite: 行きます (ikimasu). Irregular te-form: 行って (itte). へ/に marks destination."
        },
        {
          "target": "来る",
          "en": "to come",
          "kind": "vocab",
          "reading": "kuru",
          "note": "Irregular verb. Polite: 来ます (kimasu). Negative: 来ない (konai). Note the reading changes."
        },
        {
          "target": "帰る",
          "en": "to return; to go home",
          "kind": "vocab",
          "reading": "kaeru",
          "note": "Looks like a ru-verb but is a u-verb. Polite: 帰ります (kaerimasu)."
        },
        {
          "target": "する",
          "en": "to do",
          "kind": "vocab",
          "reading": "suru",
          "note": "Irregular verb. Polite: します (shimasu). Makes verbs from nouns: 勉強する = to study."
        },
        {
          "target": "起きる",
          "en": "to get up; to wake up",
          "kind": "vocab",
          "reading": "okiru",
          "note": "Ru-verb. Polite: 起きます (okimasu). 七時に起きる = get up at 7."
        },
        {
          "target": "寝る",
          "en": "to sleep; to go to bed",
          "kind": "vocab",
          "reading": "neru",
          "note": "Ru-verb. Polite: 寝ます (nemasu)."
        },
        {
          "target": "勉強する",
          "en": "to study",
          "kind": "vocab",
          "reading": "benkyō suru",
          "note": "Noun 勉強 + する. Polite: 勉強します (benkyō shimasu). Long ō in benkyō."
        }
      ]
    },
    {
      "titleEn": "Example Sentences",
      "titleId": "例文",
      "items": [
        {
          "target": "毎朝、パンを食べます。",
          "en": "I eat bread every morning.",
          "kind": "sentence",
          "reading": "maiasa, pan o tabemasu.",
          "note": "を marks the direct object and is pronounced 'o' (not 'wo'). 毎朝 = maiasa (every morning)."
        },
        {
          "target": "水を飲みたいです。",
          "en": "I want to drink water.",
          "kind": "sentence",
          "reading": "mizu o nomitai desu.",
          "note": "Stem + たい = 'want to'. 飲む → 飲み + たい."
        },
        {
          "target": "明日、学校へ行きます。",
          "en": "I'm going to school tomorrow.",
          "kind": "sentence",
          "reading": "ashita, gakkō e ikimasu.",
          "note": "Particle へ marks direction and is read 'e', not 'he'."
        },
        {
          "target": "友達が日本から来ます。",
          "en": "My friend is coming from Japan.",
          "kind": "sentence",
          "reading": "tomodachi ga nihon kara kimasu.",
          "note": "来ます reads 'kimasu'. から = from."
        },
        {
          "target": "毎晩、本を読みます。",
          "en": "I read a book every evening.",
          "kind": "sentence",
          "reading": "maiban, hon o yomimasu.",
          "note": "毎晩 = every night/evening."
        },
        {
          "target": "日本語を話しますか。",
          "en": "Do you speak Japanese?",
          "kind": "sentence",
          "reading": "nihongo o hanashimasu ka.",
          "note": "か turns a statement into a yes/no question."
        },
        {
          "target": "今、何をしていますか。",
          "en": "What are you doing now?",
          "kind": "sentence",
          "reading": "ima, nani o shite imasu ka.",
          "note": "して います = present continuous (te-form of する + いる)."
        }
      ]
    }
  ]
};

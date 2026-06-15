import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja03-greetings",
  "date": "ja-03",
  "title": "Greetings & Politeness",
  "sections": [
    {
      "titleEn": "Daily Greetings",
      "titleId": "まいにちの あいさつ",
      "items": [
        {
          "target": "おはようございます",
          "en": "Good morning (polite)",
          "kind": "vocab",
          "reading": "ohayō gozaimasu",
          "note": "Polite form. Drop ございます for casual おはよう with friends/family."
        },
        {
          "target": "こんにちは",
          "en": "Hello / Good afternoon",
          "kind": "vocab",
          "reading": "konnichiwa",
          "note": "Written は (the topic particle), but pronounced 'wa'. Used roughly midday to evening."
        },
        {
          "target": "こんばんは",
          "en": "Good evening",
          "kind": "vocab",
          "reading": "konbanwa",
          "note": "Also ends in は, pronounced 'wa'. Used after dark."
        },
        {
          "target": "おやすみなさい",
          "en": "Good night",
          "kind": "vocab",
          "reading": "oyasuminasai",
          "note": "Said before sleeping. Casual short form: おやすみ."
        },
        {
          "target": "さようなら",
          "en": "Goodbye",
          "kind": "vocab",
          "reading": "sayōnara",
          "note": "Somewhat formal/final. Often じゃあね or バイバイ among friends."
        },
        {
          "target": "また あした",
          "en": "See you tomorrow",
          "kind": "vocab",
          "reading": "mata ashita",
          "note": "また = again, あした = tomorrow. Casual and friendly."
        },
        {
          "target": "おはようございます。",
          "en": "Good morning.",
          "kind": "sentence",
          "reading": "ohayō gozaimasu.",
          "note": "A complete polite greeting on its own."
        },
        {
          "target": "せんせい、こんにちは。",
          "en": "Hello, teacher.",
          "kind": "sentence",
          "reading": "sensei, konnichiwa.",
          "note": "せんせい = teacher; common way to greet someone by title."
        }
      ]
    },
    {
      "titleEn": "Thanks & Apologies",
      "titleId": "おれいと おわび",
      "items": [
        {
          "target": "ありがとうございます",
          "en": "Thank you (polite)",
          "kind": "vocab",
          "reading": "arigatō gozaimasu",
          "note": "Polite present. For something already done, ありがとうございました. Casual: ありがとう."
        },
        {
          "target": "どういたしまして",
          "en": "You're welcome",
          "kind": "vocab",
          "reading": "dō itashimashite",
          "note": "Standard reply to thanks."
        },
        {
          "target": "すみません",
          "en": "Excuse me / I'm sorry / Thank you",
          "kind": "vocab",
          "reading": "sumimasen",
          "note": "Very versatile: apology, getting attention, or grateful 'sorry to trouble you'."
        },
        {
          "target": "ごめんなさい",
          "en": "I'm sorry (apology)",
          "kind": "vocab",
          "reading": "gomennasai",
          "note": "A sincere apology. Casual short form: ごめん."
        },
        {
          "target": "だいじょうぶです",
          "en": "It's okay / I'm fine",
          "kind": "vocab",
          "reading": "daijōbu desu",
          "note": "Reassurance, or a soft 'no thank you'. Casual: だいじょうぶ."
        },
        {
          "target": "ありがとうございました。",
          "en": "Thank you (for what you did).",
          "kind": "sentence",
          "reading": "arigatō gozaimashita.",
          "note": "Past polite ました — used when the action is complete."
        },
        {
          "target": "おそく なって すみません。",
          "en": "Sorry for being late.",
          "kind": "sentence",
          "reading": "osoku natte sumimasen.",
          "note": "おそく なって = became late; すみません here = apology."
        },
        {
          "target": "たすけて くれて ありがとう。",
          "en": "Thanks for helping me.",
          "kind": "sentence",
          "reading": "tasukete kurete arigatō.",
          "note": "～て くれて = (someone) did for me; casual ありがとう."
        }
      ]
    },
    {
      "titleEn": "Meeting People",
      "titleId": "しょたいめんの あいさつ",
      "items": [
        {
          "target": "はじめまして",
          "en": "Nice to meet you (first meeting)",
          "kind": "vocab",
          "reading": "hajimemashite",
          "note": "Literally 'for the first time'. Said at the start of a first meeting."
        },
        {
          "target": "どうぞ よろしく おねがいします",
          "en": "Pleased to meet you / Please be kind to me",
          "kind": "vocab",
          "reading": "dōzo yoroshiku onegaishimasu",
          "note": "Set closing phrase of a self-introduction. Shorter: よろしく おねがいします."
        },
        {
          "target": "おなまえは？",
          "en": "What's your name?",
          "kind": "vocab",
          "reading": "onamae wa?",
          "note": "お = polite prefix; は (topic particle) pronounced 'wa'. Rising intonation makes it a question."
        },
        {
          "target": "おげんきですか",
          "en": "How are you?",
          "kind": "vocab",
          "reading": "ogenki desu ka",
          "note": "げんき = well/healthy; か marks a question. Reply: はい、げんきです."
        },
        {
          "target": "はじめまして。たなかです。",
          "en": "Nice to meet you. I'm Tanaka.",
          "kind": "sentence",
          "reading": "hajimemashite. tanaka desu.",
          "note": "～です = 'I am ～'; the topic わたしは is usually omitted."
        },
        {
          "target": "どうぞ よろしく おねがいします。",
          "en": "Pleased to meet you.",
          "kind": "sentence",
          "reading": "dōzo yoroshiku onegaishimasu.",
          "note": "Standard polite closer to a self-introduction."
        },
        {
          "target": "おげんきですか。",
          "en": "How are you?",
          "kind": "sentence",
          "reading": "ogenki desu ka.",
          "note": "Common opener when meeting someone you already know."
        }
      ]
    },
    {
      "titleEn": "Everyday Polite Phrases",
      "titleId": "まいにち つかう ていねいな ことば",
      "items": [
        {
          "target": "いただきます",
          "en": "Said before eating (thanks for the meal)",
          "kind": "vocab",
          "reading": "itadakimasu",
          "note": "Humble form; said before a meal. No exact English equivalent."
        },
        {
          "target": "ごちそうさまでした",
          "en": "Thank you for the meal (after eating)",
          "kind": "vocab",
          "reading": "gochisōsama deshita",
          "note": "Said after finishing a meal."
        },
        {
          "target": "いってきます",
          "en": "I'm leaving (and will be back)",
          "kind": "vocab",
          "reading": "ittekimasu",
          "note": "Said when leaving home. Reply from those staying: いってらっしゃい."
        },
        {
          "target": "ただいま",
          "en": "I'm home / I'm back",
          "kind": "vocab",
          "reading": "tadaima",
          "note": "Said on returning home. Reply: おかえりなさい (welcome back)."
        },
        {
          "target": "しつれいします",
          "en": "Excuse me (entering/leaving)",
          "kind": "vocab",
          "reading": "shitsurei shimasu",
          "note": "Polite phrase when entering a room or excusing yourself. しつれい = rudeness."
        },
        {
          "target": "おねがいします",
          "en": "Please (I request)",
          "kind": "vocab",
          "reading": "onegaishimasu",
          "note": "Used when asking for something or a service. ねがう = to wish/request."
        },
        {
          "target": "おさきに しつれいします。",
          "en": "Excuse me for leaving before you.",
          "kind": "sentence",
          "reading": "osaki ni shitsurei shimasu.",
          "note": "Said when leaving work/an event before others. おさきに = ahead/before (you)."
        },
        {
          "target": "コーヒーを おねがいします。",
          "en": "Coffee, please.",
          "kind": "sentence",
          "reading": "kōhī o onegaishimasu.",
          "note": "Object particle を pronounced 'o'. Common when ordering."
        }
      ]
    }
  ]
};

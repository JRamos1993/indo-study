import type { RawLesson } from "@/lib/types";

// Japanese (JLPT N5) — authored and verified by independent agents.
export const lesson: RawLesson = {
  "id": "ja11-phrases",
  "date": "ja-11",
  "title": "Useful Everyday Phrases",
  "sections": [
    {
      "titleEn": "When You Don't Understand",
      "titleId": "わからないとき",
      "notes": [
        "わかりません is the polite negative of わかる (to understand). Note it is わかりません, not しりません (= I don't know a fact).",
        "ください after the て-form makes a polite request: 話してください = please speak.",
        "もう一度 = 'one more time'; お願いします adds polite request softening."
      ],
      "items": [
        {
          "target": "わかりません。",
          "en": "I don't understand.",
          "kind": "sentence",
          "reading": "wakarimasen.",
          "note": "Dictionary form is わかる. Polite present negative."
        },
        {
          "target": "もう一度お願いします。",
          "en": "One more time, please.",
          "kind": "sentence",
          "reading": "mō ichido onegaishimasu.",
          "note": "もう一度 = once more; お願いします = please."
        },
        {
          "target": "ゆっくり話してください。",
          "en": "Please speak slowly.",
          "kind": "sentence",
          "reading": "yukkuri hanashite kudasai.",
          "note": "話す → て-form 話して + ください."
        },
        {
          "target": "もう少しゆっくりお願いします。",
          "en": "A little more slowly, please.",
          "kind": "sentence",
          "reading": "mō sukoshi yukkuri onegaishimasu.",
          "note": "もう少し = a little more."
        },
        {
          "target": "すみません、よくわかりませんでした。",
          "en": "Sorry, I didn't quite understand.",
          "kind": "sentence",
          "reading": "sumimasen, yoku wakarimasen deshita.",
          "note": "よく = well; past negative わかりませんでした."
        },
        {
          "target": "もう一度言ってください。",
          "en": "Please say it once more.",
          "kind": "sentence",
          "reading": "mō ichido itte kudasai.",
          "note": "言う → て-form 言って (itte)."
        },
        {
          "target": "ちょっと待ってください。",
          "en": "Please wait a moment.",
          "kind": "sentence",
          "reading": "chotto matte kudasai.",
          "note": "待つ → て-form 待って (matte)."
        }
      ]
    },
    {
      "titleEn": "Asking About Words & Meaning",
      "titleId": "ことばと意味をたずねる",
      "notes": [
        "〜は日本語で何ですか asks 'what is X in Japanese?'. で here marks the means/language.",
        "どういう意味ですか is the standard way to ask 'what does it mean?'.",
        "Particle は is read 'wa' when used as the topic marker, even though it is written with the kana は."
      ],
      "items": [
        {
          "target": "これは日本語で何ですか。",
          "en": "What is this in Japanese?",
          "kind": "sentence",
          "reading": "kore wa nihongo de nan desu ka.",
          "note": "何 is read なに alone, but なん before です. で = in/by means of."
        },
        {
          "target": "それは英語で何と言いますか。",
          "en": "How do you say that in English?",
          "kind": "sentence",
          "reading": "sore wa eigo de nan to iimasu ka.",
          "note": "〜と言う = to say/call; と marks the quote."
        },
        {
          "target": "どういう意味ですか。",
          "en": "What does it mean?",
          "kind": "sentence",
          "reading": "dō iu imi desu ka.",
          "note": "どういう = what kind of; 意味 = meaning."
        },
        {
          "target": "これは何と読みますか。",
          "en": "How do you read this?",
          "kind": "sentence",
          "reading": "kore wa nan to yomimasu ka.",
          "note": "読む = to read; useful for kanji."
        },
        {
          "target": "もっとやさしい言葉でお願いします。",
          "en": "In simpler words, please.",
          "kind": "sentence",
          "reading": "motto yasashii kotoba de onegaishimasu.",
          "note": "やさしい = easy/kind; 言葉 = words."
        },
        {
          "target": "書いてもらえますか。",
          "en": "Could you write it down for me?",
          "kind": "sentence",
          "reading": "kaite moraemasu ka.",
          "note": "書く → 書いて + もらえますか (could I receive…)."
        }
      ]
    },
    {
      "titleEn": "Out and About: Places, Prices, Help",
      "titleId": "外出先で：場所・値段・お願い",
      "notes": [
        "〜はどこですか = 'where is ~?'. どこ = where; this is the core N5 location question.",
        "いくらですか = 'how much is it?'. いくら specifically asks a price.",
        "お願いします and ください both make polite requests; ください attaches to nouns (with を) or the て-form."
      ],
      "items": [
        {
          "target": "トイレはどこですか。",
          "en": "Where is the toilet?",
          "kind": "sentence",
          "reading": "toire wa doko desu ka.",
          "note": "どこ = where; very high-frequency phrase."
        },
        {
          "target": "駅はどこですか。",
          "en": "Where is the station?",
          "kind": "sentence",
          "reading": "eki wa doko desu ka.",
          "note": "駅 (eki) = train station."
        },
        {
          "target": "いくらですか。",
          "en": "How much is it?",
          "kind": "sentence",
          "reading": "ikura desu ka.",
          "note": "いくら asks a price."
        },
        {
          "target": "これをください。",
          "en": "I'll have this one, please.",
          "kind": "sentence",
          "reading": "kore o kudasai.",
          "note": "Particle を is written を but read 'o'. Noun + を + ください = please give me ~."
        },
        {
          "target": "助けてください。",
          "en": "Please help me.",
          "kind": "sentence",
          "reading": "tasukete kudasai.",
          "note": "助ける → て-form 助けて. Use in emergencies."
        },
        {
          "target": "手伝ってください。",
          "en": "Please help me (with a task).",
          "kind": "sentence",
          "reading": "tetsudatte kudasai.",
          "note": "手伝う → て-form 手伝って (tetsudatte)."
        },
        {
          "target": "英語が話せますか。",
          "en": "Can you speak English?",
          "kind": "sentence",
          "reading": "eigo ga hanasemasu ka.",
          "note": "話せる = potential form 'can speak'."
        },
        {
          "target": "道に迷いました。",
          "en": "I'm lost.",
          "kind": "sentence",
          "reading": "michi ni mayoimashita.",
          "note": "道に迷う = to lose one's way; past polite."
        },
        {
          "target": "写真を撮ってもいいですか。",
          "en": "May I take a photo?",
          "kind": "sentence",
          "reading": "shashin o totte mo ii desu ka.",
          "note": "〜てもいいですか = is it okay to…? 撮る → 撮って."
        }
      ]
    },
    {
      "titleEn": "Polite Reactions & Set Phrases",
      "titleId": "あいさつ・きまり文句",
      "notes": [
        "だいじょうぶ means 'okay / fine / no problem' and works as a reassurance or a gentle refusal.",
        "ありがとうございます (present) thanks for something now; ありがとうございました (past) thanks for a completed action.",
        "すみません does triple duty: 'excuse me', 'sorry', and 'thank you (for the trouble)'."
      ],
      "items": [
        {
          "target": "だいじょうぶです。",
          "en": "It's okay. / I'm fine.",
          "kind": "sentence",
          "reading": "daijōbu desu.",
          "note": "Also a soft 'no thanks'."
        },
        {
          "target": "もちろんです。",
          "en": "Of course.",
          "kind": "sentence",
          "reading": "mochiron desu.",
          "note": "もちろん = of course, certainly."
        },
        {
          "target": "そうですね。",
          "en": "That's right. / Let me see.",
          "kind": "sentence",
          "reading": "sō desu ne.",
          "note": "ね seeks agreement; also a thinking filler."
        },
        {
          "target": "わかりました。",
          "en": "I understand. / Got it.",
          "kind": "sentence",
          "reading": "wakarimashita.",
          "note": "Past polite of わかる; confirms you understood."
        },
        {
          "target": "すみません。",
          "en": "Excuse me. / Sorry.",
          "kind": "sentence",
          "reading": "sumimasen.",
          "note": "Also used to get attention or thank someone."
        },
        {
          "target": "ありがとうございます。",
          "en": "Thank you.",
          "kind": "sentence",
          "reading": "arigatō gozaimasu.",
          "note": "ございます keeps it polite; long ō in ありがとう."
        },
        {
          "target": "どういたしまして。",
          "en": "You're welcome.",
          "kind": "sentence",
          "reading": "dō itashimashite.",
          "note": "Standard reply to thanks."
        },
        {
          "target": "お願いします。",
          "en": "Please. / I'm counting on you.",
          "kind": "sentence",
          "reading": "onegaishimasu.",
          "note": "General-purpose polite request."
        }
      ]
    }
  ]
};

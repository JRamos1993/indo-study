"use client";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export interface Scenario {
  id: string;
  emoji: string;
  label: string;
  blurb: string;
  prompt: string; // scenario instruction for the tutor
  opener: string; // the learner's first line, to kick things off
}

// Situation-based practice: each scenario sets the tutor's role. Indonesian
// first (the primary language); Japanese mirrors a subset.
export const SCENARIOS: Record<string, Scenario[]> = {
  id: [
    { id: "warung", emoji: "☕", label: "At the warung", blurb: "Order food & drink", prompt: "You are the friendly seller at a small Indonesian warung. Take the learner's order.", opener: "Halo!" },
    { id: "intro", emoji: "👋", label: "Meet someone", blurb: "Introduce yourself", prompt: "You just met the learner at a language meetup. Get to know each other.", opener: "Halo, apa kabar?" },
    { id: "directions", emoji: "🗺️", label: "Ask directions", blurb: "Find your way", prompt: "You are a helpful local. The learner is lost and asks you for directions.", opener: "Permisi…" },
    { id: "market", emoji: "🛍️", label: "At the market", blurb: "Shop & ask prices", prompt: "You are a vendor at a traditional market (pasar). Help the learner buy something.", opener: "Selamat pagi!" },
    { id: "day", emoji: "🌤️", label: "Your day", blurb: "Small talk", prompt: "You are a friend catching up with the learner about their day.", opener: "Hai! Bagaimana harimu?" },
  ],
  ja: [
    { id: "cafe", emoji: "☕", label: "At a café", blurb: "Order a drink", prompt: "You are a barista at a Tokyo café. Take the learner's order politely.", opener: "いらっしゃいませ!" },
    { id: "intro", emoji: "👋", label: "Meet someone", blurb: "Introduce yourself", prompt: "You just met the learner at a meetup. Get to know each other.", opener: "こんにちは!" },
    { id: "directions", emoji: "🗺️", label: "Ask directions", blurb: "Find your way", prompt: "You are a helpful local. The learner is lost and asks for directions.", opener: "すみません…" },
    { id: "day", emoji: "🌤️", label: "Your day", blurb: "Small talk", prompt: "You are a friend catching up with the learner about their day.", opener: "やあ!元気?" },
  ],
};

export function parseReply(text: string): { reply: string; en?: string; tip?: string } {
  const lines = text.split("\n").map((l) => l.trim());
  let en: string | undefined;
  let tip: string | undefined;
  const reply: string[] = [];
  for (const l of lines) {
    if (/^EN[:：]/i.test(l)) en = l.replace(/^EN[:：]\s*/i, "");
    else if (/^TIP[:：]/i.test(l)) tip = l.replace(/^TIP[:：]\s*/i, "");
    else if (l) reply.push(l);
  }
  return { reply: reply.join(" "), en, tip };
}

export async function aiChat(
  lang: string,
  scenario: string,
  messages: ChatMsg[],
): Promise<{ ok: boolean; reply?: string; error?: string }> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, scenario, messages }),
    });
    const data = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null;
    if (res.ok && data?.reply) return { ok: true, reply: data.reply };
    return { ok: false, error: data?.error ?? "failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

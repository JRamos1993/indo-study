/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { currentUser, rateLimit } from "./auth";
import type { Env } from "./worker";

const ai = new Hono<{ Bindings: Env }>();

// Active, cheap, multilingual (protects the small AI budget). Swap to
// @cf/meta/llama-3.3-70b-instruct-fp8-fast for higher-quality replies.
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const LANG_NAME: Record<string, string> = { id: "Indonesian", ja: "Japanese" };

function systemPrompt(langName: string, scenario: string): string {
  return [
    `You are a warm, patient ${langName} conversation partner for a beginner learner (level A1-A2).`,
    "Rules:",
    `- Reply ONLY in simple, natural ${langName} — short sentences, common beginner words.`,
    "- Keep replies to 1-2 sentences, and usually end with a simple question to keep the chat going.",
    "- Stay in character for the scenario.",
    `- After your ${langName} reply, add a line that starts with "EN:" giving a short English translation.`,
    `- If the learner's last message had a clear ${langName} mistake, add a final line starting with "TIP:" with the corrected phrasing (one short line). Otherwise omit TIP.`,
    "- Never lecture or switch to English except the EN line.",
    `Scenario: ${scenario || "Friendly everyday small talk."}`,
  ].join("\n");
}

ai.post("/chat", async (c) => {
  const user = await currentUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  // Cost guards for the shared Workers AI budget: per-IP hourly + daily caps.
  if (!(await rateLimit(c, "ai_hr", 40, 3_600_000))) return c.json({ error: "rate_limited" }, 429);
  if (!(await rateLimit(c, "ai_day", 250, 86_400_000))) return c.json({ error: "rate_limited" }, 429);

  let body: { lang?: string; scenario?: string; messages?: { role?: string; content?: string }[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }
  const langName = LANG_NAME[body.lang ?? "id"] ?? "Indonesian";
  const scenario = String(body.scenario ?? "").slice(0, 200);
  const history = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-8)
    .map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.content ?? "").slice(0, 600),
    }))
    .filter((m) => m.content);
  if (!history.length) return c.json({ error: "bad_request" }, 400);
  if (!c.env.AI) return c.json({ error: "ai_unavailable" }, 503);

  // Free users get a small daily allowance; Pro is unlimited (Lilt Pro). This
  // also keeps the shared Workers AI spend bounded.
  const FREE_DAILY = 8;
  const freeKey = `aifree:${user.id}`;
  const now = Date.now();
  if (!user.isPro) {
    const row = await c.env.DB.prepare("SELECT count, window_start FROM rate_limits WHERE key = ?")
      .bind(freeKey)
      .first<{ count: number; window_start: number }>();
    const used = !row || now - row.window_start > 86_400_000 ? 0 : row.count;
    if (used >= FREE_DAILY) return c.json({ error: "upgrade_required", freeDaily: FREE_DAILY }, 402);
  }

  try {
    const out = (await c.env.AI.run(MODEL as keyof AiModels, {
      messages: [{ role: "system", content: systemPrompt(langName, scenario) }, ...history],
      max_tokens: 256,
      temperature: 0.6,
    })) as { response?: string };
    const reply = (out.response ?? "").trim();
    if (!reply) return c.json({ error: "ai_unavailable" }, 503);
    if (!user.isPro) {
      // Count only successful replies against the free allowance.
      await c.env.DB.prepare(
        "INSERT INTO rate_limits (key,count,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN ? - rate_limits.window_start > 86400000 THEN 1 ELSE rate_limits.count + 1 END, window_start = CASE WHEN ? - rate_limits.window_start > 86400000 THEN ? ELSE rate_limits.window_start END",
      )
        .bind(freeKey, now, now, now, now)
        .run();
    }
    return c.json({ reply });
  } catch {
    return c.json({ error: "ai_unavailable" }, 503);
  }
});

export default ai;

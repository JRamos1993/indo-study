// Pre-generate Indonesian pronunciation audio for every phrase in the lessons.
//
//   npm run gen:audio
//
// Writes public/audio/<sha1>.mp3 and public/audio/manifest.json
// (normalized phrase -> filename). Incremental: existing files are skipped, so
// re-run after adding a new lesson. Default TTS is the keyless Google Translate
// endpoint (unofficial, may rate-limit). Failures are skipped, not fatal — the
// app falls back to the Web Speech API for any missing phrase.

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "lib", "data");
const outDir = join(root, "public", "audio");

// MUST stay in sync with normalize() in lib/quiz.ts.
function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.,!?;:"'‘’()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Each language's units live under lib/data/<lang>/; the folder name is the TTS
// language code passed to Google Translate (id, ja, ...).
const LANG_DIRS = ["id", "ja"];

async function collectPhrases() {
  const seen = new Set();
  const out = [];
  for (const lang of LANG_DIRS) {
    const dir = join(dataDir, lang);
    let files;
    try {
      files = (await readdir(dir)).filter((f) => f.endsWith(".ts"));
    } catch {
      continue; // language folder not present
    }
    for (const f of files) {
      const src = await readFile(join(dir, f), "utf8");
      for (const m of src.matchAll(/target"?\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
        const text = m[1].replace(/\\"/g, '"');
        const key = `${lang}|${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ text, tl: lang });
      }
    }
  }
  return out;
}

async function ttsGoogle(text, tl) {
  const url =
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=` +
    encodeURIComponent(text);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://translate.google.com/" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(outDir, { recursive: true });
  const phrases = await collectPhrases();
  console.log(`Found ${phrases.length} unique phrases.`);

  const manifest = {};
  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (const { text, tl } of phrases) {
    // Hash by text only so existing clips stay valid; scripts don't collide.
    const id = createHash("sha1").update(text).digest("hex").slice(0, 16);
    const file = `${id}.mp3`;
    const path = join(outDir, file);
    manifest[normalize(text)] = file;

    if (existsSync(path)) {
      skipped += 1;
      continue;
    }
    try {
      const buf = await ttsGoogle(text, tl);
      await writeFile(path, buf);
      made += 1;
      process.stdout.write(`+ [${tl}] ${text}\n`);
      await sleep(350);
    } catch (e) {
      failed += 1;
      delete manifest[normalize(text)]; // no file -> Web Speech fallback
      process.stdout.write(`! skip "${text}" (${e.message})\n`);
    }
  }

  await writeFile(
    join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 0) + "\n",
  );
  console.log(`Done. new=${made} skipped=${skipped} failed=${failed}`);
  if (made === 0 && failed > 0) {
    console.log("No audio generated (network/endpoint blocked). App still works via Web Speech.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

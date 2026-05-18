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

async function collectPhrases() {
  const files = (await readdir(dataDir)).filter(
    (f) => f.startsWith("lesson-") && f.endsWith(".ts"),
  );
  const set = new Set();
  for (const f of files) {
    const src = await readFile(join(dataDir, f), "utf8");
    for (const m of src.matchAll(/idn:\s*"([^"]+)"/g)) set.add(m[1]);
  }
  return [...set];
}

async function ttsGoogle(text) {
  const url =
    "https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=" +
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

  for (const phrase of phrases) {
    const id = createHash("sha1").update(phrase).digest("hex").slice(0, 16);
    const file = `${id}.mp3`;
    const path = join(outDir, file);
    manifest[normalize(phrase)] = file;

    if (existsSync(path)) {
      skipped += 1;
      continue;
    }
    try {
      const buf = await ttsGoogle(phrase);
      await writeFile(path, buf);
      made += 1;
      process.stdout.write(`+ ${phrase}\n`);
      await sleep(350);
    } catch (e) {
      failed += 1;
      delete manifest[normalize(phrase)]; // no file -> Web Speech fallback
      process.stdout.write(`! skip "${phrase}" (${e.message})\n`);
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
